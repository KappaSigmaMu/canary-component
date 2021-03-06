import * as THREE from "three"
import React, { useMemo, useRef, useState, Suspense, useLayoutEffect } from 'react'
import styled, { keyframes } from 'styled-components'
import { Canvas, useFrame } from '@react-three/fiber'
import { useGLTF, useHelper, Instances, Instance, OrbitControls, Html } from '@react-three/drei'
import { EffectComposer, Bloom, Glitch } from '@react-three/postprocessing'

const defaultCanaryConfig = {
  "canary": {
    "objectUrl": "/assets/canary.glb",
    "nodeCoords": "canary.geometry.attributes.position",
    "nodeSigns": [1, 1, -1],
    "nodeScale": 0.1,
    "nodeGroupScale": 0.4,
    "meshColorIndex": 0,
    "meshScale": 4,
    "model": {
      "material": "Default OBJ",
      "scale": 0.1,
      "metalness": 0.2,
      "roughness": 2,
      "opacity": 1,
      "color": 0
    },
    "gridPosition": [0, -0.135, 0],
    "cameraPosition": [2.3, 1, 1],
    "pointColorIndex": {
      "primary": 3,
      "secondary": 1
    },
    "pointLight": {
      "position": [0, 0, 0],
      "intensity": [2, 2, 2],
      "distance": 15
    },
    "bloom": {
      "kernelSize": 1,
      "luminanceThreshold": 0.1,
      "luminanceSmoothing": 0.05,
      "intensity": 0.1
    }
  },
  "gil": {
    "objectUrl": "/assets/gil.glb",
    "nodeCoords": "Baked_GIL_BUSTO003_1.geometry.attributes.position",
    "nodeSigns": [-1, 1, -1],
    "nodeScale": 1.5,
    "nodeGroupScale": 0.1,
    "meshColorIndex": 3,
    "model": {
      "material": "MatWireframe",
      "scale": 0.2,
      "metalness": 0.1,
      "roughness": 0.1,
      "opacity": 0.1,
      "color": 3
    },
    "gridPosition": [0, -0, 4, 0],
    "cameraPosition": [-1, 2.5, 4],
    "pointColorIndex": {
      "primary": 2,
      "secondary": 0
    },
    "pointLight": {
      "position": [0, 5, 0],
      "intensity": [2, 15, 15],
      "distance": 15
    },
    "bloom": {
      "kernelSize": 1,
      "luminanceThreshold": 0.1,
      "luminanceSmoothing": 0.05,
      "intensity": 0.5
    }
  },
}

const color = new THREE.Color()

// ciano, magenta, white, black
const brandPalette = ["#01ffff", "#e6007a", "#ffffff", "#000000"];

// Generate a random integer between min and max
const random = (min, max) => Math.floor(Math.random() * (max - min)) + min;

// Generate N integer numbers (with no repetition) between mix and max
const randomN = (min, max, n) => {
  let numbers = [];
  while (numbers.length < n) {
    let num = random(min, max);
    if (!numbers.includes(num)) {
      numbers.push(num);
    }
  }
  return numbers;
}

const resolve = (path, obj, separator = '.') => {
  let properties = Array.isArray(path) ? path : path.split(separator)
  return properties.reduce((prev, curr) => prev && prev[curr], obj)
}

const Points = ({ objectUrl, nodesData, onNodeClick, config }) => {
  // Note: useGLTF caches it already
  const { nodes } = useGLTF(objectUrl ? objectUrl : config.objectUrl)
  const [selected, setSelected] = useState(0)

  // Or nodes.Scene.children[0].geometry.attributes.position
  const positions = config.nodeCoords ?
    resolve(config.nodeCoords, nodes) : []
  const numPositions = positions.count
  const numNodes = nodesData.length
  const randomIndexes = useMemo(() =>
    randomN(0, numPositions, numNodes), [numPositions, numNodes])

  const selectedPositions = randomIndexes.map((i) =>
    [positions.getX(i), positions.getY(i), positions.getZ(i)])

  const handleSelectedNode = (nodeId) => {
    setSelected(nodeId)
  }

  return (
    <>
      {selected ?
        <group scale={config.nodeGroupScale}>
          <PointDialog
            position={selectedPositions[selected]}
            dialogData={nodesData[selected]}
            onNodeClick={onNodeClick}
            config={config}
          />
        </group> : null
      }
      <Instances
        range={selectedPositions.length}
        material={new THREE.MeshBasicMaterial()}
        geometry={new THREE.SphereGeometry(0.1)}>
        {
          selectedPositions.map((position, i) => (
            <Point
              key={i}
              nodeId={i}
              position={position}
              onNodeSelected={handleSelectedNode}
              dialogData={nodesData[selected]}
              onNodeClick={onNodeClick}
              config={config}
            />
          ))
        }
      </Instances>
    </>
  )
}

const Point = ({ nodeId, position, dialogData, onNodeSelected, onNodeClick, config }) => {
  const ref = useRef()
  const [hovered, setHover] = useState(false)
  const [active] = useState(false)

  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    const defaultScale = config.nodeScale
    ref.current.position.x = position[0] * config.nodeSigns[0]
    ref.current.position.z = position[1] * config.nodeSigns[1]
    ref.current.position.y = position[2] * config.nodeSigns[2]
    ref.current.scale.x = ref.current.scale.y = ref.current.scale.z = defaultScale
    ref.current.scale.x = ref.current.scale.y = ref.current.scale.z =
      THREE.MathUtils.lerp(ref.current.scale.z, hovered ? 6 : 1, defaultScale)
    ref.current.scale.x = ref.current.scale.y = ref.current.scale.z =
      THREE.MathUtils.lerp(ref.current.scale.z, active ? 5 : 1, defaultScale)
    ref.current.color.lerp(
      color.set(hovered || active ? brandPalette[config.pointColorIndex.primary] : brandPalette[config.pointColorIndex.secondary]),
      hovered || active ? 1 : defaultScale)

    if (hovered) {
      ref.current.color.lerp(
        color.set(hovered ? brandPalette[0] : brandPalette[1]), hovered ? 1 : defaultScale)
    }

    if (active) {
      ref.current.scale.x = ref.current.scale.y = ref.current.scale.z += Math.sin(t) / 4
      ref.current.color.lerp(
        color.set(active ? brandPalette[2] : brandPalette[1]), active ? 1 : defaultScale)
    }
  })
  return (
    <group scale={config.nodeGroupScale} >
      <>
        <Instance
          ref={ref}
          /* eslint-disable-next-line */
          onPointerOver={(e) => (e.stopPropagation(), setHover(true), onNodeSelected(nodeId))}
          onPointerOut={() => setHover(false)}
          onClick={(e) => onNodeClick(dialogData.hash)}
        />
      </>
    </group>
  )
}

const PointDialog = ({ position, dialogData, onNodeClick, config }) => {
  const ref = useRef()

  const scale = 1.002

  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    ref.current.position.copy(
      new THREE.Vector3(
        position[0] * config.nodeSigns[0] * scale,
        position[2] * config.nodeSigns[2] * scale,
        position[1] * config.nodeSigns[1] * scale))
    ref.current.scale.x = ref.current.scale.y = ref.current.scale.z = 0.05
    ref.current.position.y += Math.sin(t) / 16
  })
  return (

    <mesh ref={ref}>
      <meshStandardMaterial roughness={0.75} metalness={0.8} emissive={brandPalette[0]} />
      <Html distanceFactor={2}>
        <DialogContent>
          {dialogData.hash ?
            <DialogHash>
              {dialogData.hash}
            </DialogHash> : null}
        </DialogContent>
      </Html>
    </mesh>

  )
}

const Model = (props) => {
  const { scene, nodes, materials } = useGLTF(props.objectUrl)

  useLayoutEffect(() => {
    if (props.meshScale) {
      if (nodes.canary) {
        nodes.canary.scale.set(4, 4, 4)
      }
    }
    scene.traverse((obj) => {
      obj.type === 'Mesh' && (obj.receiveShadow = obj.castShadow = true)
    })
    // 0.8 0.2
    Object.assign(materials[props.model.material], {
      wireframe: true,
      metalness: props.model.metalness,
      roughness: props.model.moughness,
      opacity: props.model.opacity,
      color: new THREE.Color(brandPalette[props.model.color])
    })

  }, [scene, nodes, materials])

  return <primitive object={scene} {...props} />
}

const Lights = ({ config }) => {
  const groupL = useRef()
  const groupR = useRef()
  const front = useRef()
  const lightL = useRef()
  const lightR = useRef()
  const lightF = useRef()

  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    // 4 * 15, 4 * 10, 4 * 10
    groupL.current.position.x = Math.sin(t) / 4 * 15
    groupL.current.position.y = Math.cos(t) / 4 * 15
    groupL.current.position.z = Math.cos(t) / 4 * 15

    groupR.current.position.x = Math.cos(t) / 4 * 10
    groupR.current.position.y = Math.sin(t) / 4 * 10
    groupR.current.position.z = Math.sin(t) / 4 * 10

    front.current.position.x = Math.sin(t) / 4 * 10
    front.current.position.y = Math.cos(t) / 4 * 10
    front.current.position.z = Math.sin(t) / 4 * 10
  })

  if (config.debug === true) {
    useHelper(lightL, THREE.PointLightHelper)
    useHelper(lightR, THREE.PointLightHelper)
    useHelper(lightF, THREE.PointLightHelper)
  }

  return (
    <>
      <group ref={groupL}>
        <pointLight
          ref={lightL}
          color={brandPalette[0]}
          position={config.pointLight.position}
          distance={config.pointLight.distance}
          intensity={config.pointLight.intensity[0]}
        />
      </group>
      <group ref={groupR}>
        <pointLight
          ref={lightR}
          color={brandPalette[1]}
          position={config.pointLight.position}
          distance={config.pointLight.distance}
          intensity={config.pointLight.intensity[1]}
        />
      </group>
      <group ref={front}>
        <pointLight
          ref={lightF}
          color={brandPalette[2]}
          position={config.pointLight.position}
          distance={config.pointLight.distance}
          intensity={config.pointLight.intensity[2]}
        />
      </group>
    </>
  )
}

const Particles = ({ count }) => {
  const mesh = useRef()

  const dummy = useMemo(() => new THREE.Object3D(), [])

  const particles = useMemo(() => {
    const temp = []
    for (let i = 0; i < count; i++) {
      const t = Math.random() * 100
      const factor = 20 + Math.random() * 10
      const speed = 0.01 + Math.random() / 200
      const xFactor = -5 + Math.random() * 10
      const yFactor = -5 + Math.random() * 10
      const zFactor = -5 + Math.random() * 10
      temp.push({ t, factor, speed, xFactor, yFactor, zFactor, mx: 0, my: 0 })
    }
    return temp
  }, [count])

  useFrame((state) => {

    particles.forEach((particle, i) => {
      let { t, factor, speed, xFactor, yFactor, zFactor } = particle

      t = particle.t += speed / 4
      const a = Math.cos(t) + Math.sin(t * 1) / 10
      const b = Math.sin(t) + Math.cos(t * 2) / 10
      const s = Math.cos(t) / 6

      dummy.position.set(
        (particle.mx / 10) * a + xFactor + Math.cos((t / 10) * factor) + (Math.sin(t * 1) * factor) / 10,
        (particle.my / 10) * b + yFactor + Math.sin((t / 10) * factor) + (Math.cos(t * 2) * factor) / 10,
        (particle.my / 10) * b + zFactor + Math.cos((t / 10) * factor) + (Math.sin(t * 3) * factor) / 10
      )
      dummy.scale.set(s, s, s)
      dummy.rotation.set(s * 5, s * 5, s * 5)
      dummy.updateMatrix()

      mesh.current.setMatrixAt(i, dummy.matrix)
    })
    mesh.current.instanceMatrix.needsUpdate = true
  })
  return (
    <>
      <instancedMesh ref={mesh} args={[null, null, count]}>
        <boxGeometry args={[1]} />
        <pointsMaterial
          color={brandPalette[1]}
          size={0.02}
          transparent={true}
          sizeAttenuation={false}
          opacity={0.3}
        />
      </instancedMesh>
    </>
  )
}

const ThreeCanary = (props) => {
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)

  const config = props.config ? props.config : defaultCanaryConfig["canary"]

  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      camera={{ position: config.cameraPosition, fov: 50 }}
      performance={{ min: 0.1 }}>

      <Lights config={config} />
      {/* <fog attach="fog" args={[brandPalette[-1], 4.5, 20]} /> */}
      <gridHelper
        position={config.gridPosition}
        color={"#000"}
        args={[40, 40]}
      />

      <Suspense fallback={null}>
        <Model
          scale={config.model.scale}
          objectUrl={props.objectUrl}
          meshColorIndex={config.meshColorIndex}
          meshScale={config.meshScale}
          model={config.model}
        />
        <Points
          objectUrl={props.objectUrl}
          nodesData={props.nodes}
          onNodeClick={props.onNodeClick}
          config={config}
        />
        <Particles
          count={isMobile ? 50 : 200}
        />

        <EffectComposer multisampling={16}>
          <Bloom
            kernelSize={config.bloom.kernelSize}
            luminanceThreshold={config.bloom.luminanceThreshold}
            luminanceSmoothing={config.bloom.luminanceSmoothing}
            intensity={config.bloom.intensity}
          />
          <Glitch delay={[20, 30]} />
        </EffectComposer>
      </Suspense>

      <OrbitControls
        minPolarAngle={Math.PI / 2.8}
        maxPolarAngle={Math.PI / 1.8}
      />
    </Canvas>
  )
}

// Styling

const fadeIn = keyframes`
  0% {
    opacity: 0;
  }
  100% {
    opacity: 0.9;
  }
`

const DialogContent = styled.div`
  animation: ${fadeIn} ease-in-out 0.5s;
  animation-iteration-count: 1;
  animation-fill-mode: forwards;

  text-align: left;
  background: ${brandPalette[1]};

  color: white;
  padding: 10px 20px;
  border-radius: 5px;

  font-family: monospace;
`

const DialogHash = styled.div`
  color: ${brandPalette[2]};
  padding-top: 5px;
`

export { ThreeCanary, defaultCanaryConfig }
