"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault").default;
var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard").default;
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.defaultConfig = exports.ThreeCanary = void 0;
var _taggedTemplateLiteral2 = _interopRequireDefault(require("@babel/runtime/helpers/esm/taggedTemplateLiteral"));
require("core-js/modules/es.array.reduce.js");
require("core-js/modules/es.object.assign.js");
require("core-js/modules/es.parse-int.js");
require("core-js/modules/es.regexp.exec.js");
require("core-js/modules/es.regexp.test.js");
require("core-js/modules/es.string.split.js");
require("core-js/modules/web.dom-collections.iterator.js");
var _drei = require("@react-three/drei");
var _fiber = require("@react-three/fiber");
var _postprocessing = require("@react-three/postprocessing");
var _react = _interopRequireWildcard(require("react"));
var _styledComponents = _interopRequireWildcard(require("styled-components"));
var THREE = _interopRequireWildcard(require("three"));
var _OrbitControls = require("three/examples/jsm/controls/OrbitControls");
var _CanaryConfig = require("./CanaryConfig");
var _GilConfig = require("./GilConfig");
var _templateObject, _templateObject2, _templateObject3; // https://github.com/jsx-eslint/eslint-plugin-react/issues/3423
/* eslint-disable react/no-unknown-property */
/* eslint-disable react/prop-types */
const defaultConfig = exports.defaultConfig = {
  canary: _CanaryConfig.canaryConfig,
  gil: _GilConfig.gilConfig
};
const color = new THREE.Color();
const brandPalette = {
  ciano: "#01ffff",
  magenta: "#e6007a",
  white: "#ffffff",
  black: "#000000"
};

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
};
const resolve = function resolve(path, obj) {
  let separator = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : ".";
  let properties = Array.isArray(path) ? path : path.split(separator);
  return properties.reduce((prev, curr) => prev && prev[curr], obj);
};
const Points = _ref => {
  let {
    objectUrl,
    nodesData,
    onNodeClick,
    config
  } = _ref;
  // Note: useGLTF caches it already
  const {
    nodes
  } = (0, _drei.useGLTF)(objectUrl ? objectUrl : config.objectUrl);
  const [selected, setSelected] = (0, _react.useState)(0);

  // Or nodes.Scene.children[0].geometry.attributes.position
  const positions = config.nodeCoords ? resolve(config.nodeCoords, nodes) : [];
  const numPositions = positions.count;
  const numNodes = nodesData.length;
  const randomIndexes = (0, _react.useMemo)(() => randomN(0, numPositions, numNodes), [numPositions, numNodes]);
  const selectedPositions = randomIndexes.map(i => [positions.getX(i), positions.getY(i), positions.getZ(i)]);
  const handleSelectedNode = nodeId => {
    setSelected(nodeId);
  };
  return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, selected ? /*#__PURE__*/_react.default.createElement("group", {
    scale: config.nodeGroupScale
  }, /*#__PURE__*/_react.default.createElement(PointDialog, {
    position: selectedPositions[selected],
    dialogData: nodesData[selected],
    onNodeClick: onNodeClick,
    config: config
  })) : null, /*#__PURE__*/_react.default.createElement(_drei.Instances, {
    range: selectedPositions.length,
    material: new THREE.MeshBasicMaterial(),
    geometry: new THREE.SphereGeometry(0.1)
  }, selectedPositions.map((position, i) => /*#__PURE__*/_react.default.createElement(Point, {
    key: i,
    nodeId: i,
    position: position,
    onNodeSelected: handleSelectedNode,
    dialogData: nodesData[selected],
    onNodeClick: onNodeClick,
    config: config,
    primaryColor: config.pointColorIndex.primary,
    hoveredColor: config.pointColorIndex.hovered,
    activeColor: config.pointColorIndex.active
  }))));
};
const Point = _ref2 => {
  let {
    nodeId,
    position,
    dialogData,
    onNodeSelected,
    onNodeClick,
    config,
    primaryColor,
    hoveredColor,
    activeColor
  } = _ref2;
  const ref = (0, _react.useRef)();
  const [hovered, setHover] = (0, _react.useState)(false);
  const [active] = (0, _react.useState)(false);
  (0, _fiber.useFrame)(state => {
    const t = state.clock.getElapsedTime();
    const defaultScale = config.nodeScale;
    ref.current.position.x = position[0] * config.nodeSigns[0];
    ref.current.position.z = position[1] * config.nodeSigns[1];
    ref.current.position.y = position[2] * config.nodeSigns[2];
    ref.current.scale.x = ref.current.scale.y = ref.current.scale.z = defaultScale;
    ref.current.scale.x = ref.current.scale.y = ref.current.scale.z = THREE.MathUtils.lerp(ref.current.scale.z, hovered ? 6 : 1, defaultScale);
    ref.current.scale.x = ref.current.scale.y = ref.current.scale.z = THREE.MathUtils.lerp(ref.current.scale.z, active ? 5 : 1, defaultScale);
    ref.current.color.lerp(color.set(hovered || active ? brandPalette[hoveredColor] : brandPalette[primaryColor]), hovered || active ? 1 : defaultScale);
    if (hovered) {
      ref.current.color.lerp(color.set(hovered ? brandPalette[hoveredColor] : brandPalette[primaryColor]), hovered ? 1 : defaultScale);
    }
    if (active) {
      ref.current.scale.x = ref.current.scale.y = ref.current.scale.z += Math.sin(t) / 4;
      ref.current.color.lerp(color.set(active ? brandPalette[activeColor] : brandPalette[primaryColor]), active ? 1 : defaultScale);
    }
  });
  return /*#__PURE__*/_react.default.createElement("group", {
    scale: config.nodeGroupScale
  }, /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement(_drei.Instance, {
    ref: ref,
    onPointerOver: e => (e.stopPropagation(), setHover(true), onNodeSelected(nodeId)),
    onPointerOut: () => setHover(false),
    onClick: () => onNodeClick(dialogData.hash)
  })));
};
const PointDialog = _ref3 => {
  let {
    position,
    dialogData,
    config
  } = _ref3;
  const ref = (0, _react.useRef)();
  const scale = 1.002;
  (0, _fiber.useFrame)(state => {
    const t = state.clock.getElapsedTime();
    ref.current.position.copy(new THREE.Vector3(position[0] * config.nodeSigns[0] * scale, position[2] * config.nodeSigns[2] * scale, position[1] * config.nodeSigns[1] * scale));
    ref.current.scale.x = ref.current.scale.y = ref.current.scale.z = 0.05;
    ref.current.position.y += Math.sin(t) / 16;
  });
  return /*#__PURE__*/_react.default.createElement("mesh", {
    ref: ref
  }, /*#__PURE__*/_react.default.createElement("meshStandardMaterial", {
    roughness: 0.75,
    metalness: 0.8,
    emissive: brandPalette.ciano
  }), /*#__PURE__*/_react.default.createElement(_drei.Html, {
    distanceFactor: 2
  }, /*#__PURE__*/_react.default.createElement(DialogContent, null, dialogData.hash ? /*#__PURE__*/_react.default.createElement(DialogHash, null, dialogData.hash) : null)));
};
const Model = props => {
  const {
    scene,
    nodes,
    materials
  } = (0, _drei.useGLTF)(props.objectUrl);
  (0, _react.useLayoutEffect)(() => {
    if (props.meshScale) {
      if (nodes.canary) {
        nodes.canary.scale.set(4, 4, 4);
      }
    }
    scene.traverse(obj => {
      obj.type === "Mesh" && (obj.receiveShadow = obj.castShadow = true);
    });
    // 0.8 0.2
    Object.assign(materials[props.model.material], {
      wireframe: true,
      metalness: props.model.metalness,
      roughness: props.model.moughness,
      opacity: props.model.opacity,
      color: new THREE.Color(brandPalette[props.model.color])
    });
  }, [scene, nodes, materials]);
  return /*#__PURE__*/_react.default.createElement("primitive", Object.assign({
    object: scene
  }, props));
};
const Lights = _ref4 => {
  let {
    config
  } = _ref4;
  const groupL = (0, _react.useRef)();
  const groupR = (0, _react.useRef)();
  const front = (0, _react.useRef)();
  const lightL = (0, _react.useRef)();
  const lightR = (0, _react.useRef)();
  const lightF = (0, _react.useRef)();
  (0, _fiber.useFrame)(state => {
    const t = state.clock.getElapsedTime();

    // storm effect
    let currentPosition = 15;
    if (parseInt(t) % 4 === 1) {
      currentPosition = Math.random() * 15 | 0;
    }
    groupL.current.position.x = Math.sin(t) / 4 * currentPosition;
    groupL.current.position.y = Math.cos(t) / 4 * currentPosition;
    groupL.current.position.z = Math.cos(t) / 4 * currentPosition;
    groupR.current.position.x = Math.cos(t) / 4 * 10;
    groupR.current.position.y = Math.sin(t) / 4 * 10;
    groupR.current.position.z = Math.sin(t) / 4 * 10;
    front.current.position.x = Math.sin(t) / 4 * 10;
    front.current.position.y = Math.cos(t) / 4 * 10;
    front.current.position.z = Math.sin(t) / 4 * 10;
  });
  if (config.debug === true) {
    (0, _drei.useHelper)(lightL, THREE.PointLightHelper);
    (0, _drei.useHelper)(lightR, THREE.PointLightHelper);
    (0, _drei.useHelper)(lightF, THREE.PointLightHelper);
  }
  return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement("group", {
    ref: groupL
  }, /*#__PURE__*/_react.default.createElement("pointLight", {
    ref: lightL,
    color: brandPalette[config.pointLight.color[0]],
    position: config.pointLight.position,
    distance: config.pointLight.distance,
    intensity: config.pointLight.intensity[0]
  })), /*#__PURE__*/_react.default.createElement("group", {
    ref: groupR
  }, /*#__PURE__*/_react.default.createElement("pointLight", {
    ref: lightR,
    color: brandPalette[config.pointLight.color[1]],
    position: config.pointLight.position,
    distance: config.pointLight.distance,
    intensity: config.pointLight.intensity[1]
  })), /*#__PURE__*/_react.default.createElement("group", {
    ref: front
  }, /*#__PURE__*/_react.default.createElement("pointLight", {
    ref: lightF,
    color: brandPalette[config.pointLight.color[2]],
    position: config.pointLight.position,
    distance: config.pointLight.distance,
    intensity: config.pointLight.intensity[2]
  })));
};
const Particles = _ref5 => {
  let {
    count
  } = _ref5;
  const mesh = (0, _react.useRef)();
  const dummy = (0, _react.useMemo)(() => new THREE.Object3D(), []);
  const particles = (0, _react.useMemo)(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      const t = Math.random() * 100;
      const factor = 20 + Math.random() * 10;
      const speed = 0.01 + Math.random() / 200;
      const xFactor = -5 + Math.random() * 10;
      const yFactor = -5 + Math.random() * 10;
      const zFactor = -5 + Math.random() * 10;
      temp.push({
        t,
        factor,
        speed,
        xFactor,
        yFactor,
        zFactor,
        mx: 0,
        my: 0
      });
    }
    return temp;
  }, [count]);
  (0, _fiber.useFrame)(() => {
    particles.forEach((particle, i) => {
      let {
        t,
        factor,
        speed,
        xFactor,
        yFactor,
        zFactor
      } = particle;
      t = particle.t += speed / 4;
      const a = Math.cos(t) + Math.sin(t * 1) / 10;
      const b = Math.sin(t) + Math.cos(t * 2) / 10;
      const s = Math.cos(t) / 6;
      dummy.position.set(particle.mx / 10 * a + xFactor + Math.cos(t / 10 * factor) + Math.sin(t * 1) * factor / 10, particle.my / 10 * b + yFactor + Math.sin(t / 10 * factor) + Math.cos(t * 2) * factor / 10, particle.my / 10 * b + zFactor + Math.cos(t / 10 * factor) + Math.sin(t * 3) * factor / 10);
      dummy.scale.set(s, s, s);
      dummy.rotation.set(s * 5, s * 5, s * 5);
      dummy.updateMatrix();
      mesh.current.setMatrixAt(i, dummy.matrix);
    });
    mesh.current.instanceMatrix.needsUpdate = true;
  });
  return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement("instancedMesh", {
    ref: mesh,
    args: [null, null, count]
  }, /*#__PURE__*/_react.default.createElement("boxGeometry", {
    args: [1]
  }), /*#__PURE__*/_react.default.createElement("pointsMaterial", {
    color: brandPalette.magenta,
    size: 0.02,
    transparent: true,
    sizeAttenuation: false,
    opacity: 0.3
  })));
};
(0, _fiber.extend)({
  OC: _OrbitControls.OrbitControls
});
const CameraControls = _ref6 => {
  let {
    config
  } = _ref6;
  const controlsRef = (0, _react.useRef)();
  const {
    camera,
    gl
  } = (0, _fiber.useThree)();
  (0, _react.useEffect)(() => {
    if (!config.debug) return;
    const controls = new _OrbitControls.OrbitControls(camera, gl.domElement);
    controls.addEventListener("change", () => {
      console.log(camera.position);
      console.log(controlsRef.current.target);
    });
    return () => controls.dispose();
  }, [controlsRef, camera, gl.domElement]);
  (0, _react.useEffect)(() => {
    if (controlsRef.current) {
      controlsRef.current.target.set(config.targetPosition[0], config.targetPosition[1], config.targetPosition[2]);
      controlsRef.current.update();
    }
  }, [controlsRef, camera, gl]);
  return /*#__PURE__*/_react.default.createElement(_drei.OrbitControls, {
    ref: controlsRef,
    args: [camera, gl.domElement],
    minPolarAngle: Math.PI / 2.8,
    maxPolarAngle: Math.PI / 2.1
  });
};
const ThreeCanary = props => {
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  const config = props.config ? props.config : defaultConfig["canary"];
  return /*#__PURE__*/_react.default.createElement(_fiber.Canvas, {
    shadows: true,
    dpr: [1, 2],
    performance: {
      min: 0.1
    }
  }, /*#__PURE__*/_react.default.createElement(_drei.PerspectiveCamera, {
    makeDefault: true,
    position: config.cameraPosition,
    near: 0.1,
    far: 1000,
    zoom: 1
  }), /*#__PURE__*/_react.default.createElement(Lights, {
    config: config
  }), /*#__PURE__*/_react.default.createElement("gridHelper", {
    position: config.gridPosition,
    color: brandPalette.black,
    args: [40, 40]
  }), /*#__PURE__*/_react.default.createElement(_react.Suspense, {
    fallback: null
  }, /*#__PURE__*/_react.default.createElement(Model, {
    scale: config.model.scale,
    objectUrl: props.objectUrl,
    meshColorIndex: config.meshColorIndex,
    meshScale: config.meshScale,
    model: config.model
  }), /*#__PURE__*/_react.default.createElement(Points, {
    objectUrl: props.objectUrl,
    nodesData: props.nodes,
    onNodeClick: props.onNodeClick,
    config: config
  }), /*#__PURE__*/_react.default.createElement(Particles, {
    count: isMobile ? 50 : 200
  }), /*#__PURE__*/_react.default.createElement(_postprocessing.EffectComposer, {
    multisampling: 16
  }, /*#__PURE__*/_react.default.createElement(_postprocessing.Bloom, {
    kernelSize: config.bloom.kernelSize,
    luminanceThreshold: config.bloom.luminanceThreshold,
    luminanceSmoothing: config.bloom.luminanceSmoothing,
    intensity: config.bloom.intensity
  }), /*#__PURE__*/_react.default.createElement(_postprocessing.Glitch, {
    delay: config.glitch.delay,
    strength: config.glitch.strength,
    duration: config.glitch.duration
  }))), /*#__PURE__*/_react.default.createElement(CameraControls, {
    config: config
  }));
};

// Styling
exports.ThreeCanary = ThreeCanary;
const fadeIn = (0, _styledComponents.keyframes)(_templateObject || (_templateObject = (0, _taggedTemplateLiteral2.default)(["\n  0% {\n    opacity: 0;\n  }\n  100% {\n    opacity: 0.9;\n  }\n"])));
const DialogContent = _styledComponents.default.div(_templateObject2 || (_templateObject2 = (0, _taggedTemplateLiteral2.default)(["\n  animation: ", " ease-in-out 0.5s;\n  animation-iteration-count: 1;\n  animation-fill-mode: forwards;\n\n  text-align: left;\n  background: ", ";\n\n  color: ", ";\n  padding: 10px 20px;\n  border-radius: 5px;\n  margin: 20px 0 0 20px;\n\n  font-family: monospace;\n"])), fadeIn, brandPalette.magenta, brandPalette.white);
const DialogHash = _styledComponents.default.div(_templateObject3 || (_templateObject3 = (0, _taggedTemplateLiteral2.default)(["\n  color: ", ";\n  padding-top: 5px;\n"])), brandPalette.white);