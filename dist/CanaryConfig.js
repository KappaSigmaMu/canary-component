"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.canaryConfig = void 0;
const canaryConfig = exports.canaryConfig = {
  objectUrl: "/assets/canary.glb",
  nodeCoords: "canary.geometry.attributes.position",
  nodeSigns: [1, 1, -1],
  nodeScale: 0.12,
  nodeGroupScale: 0.4,
  meshColorIndex: "ciano",
  meshScale: 4,
  debug: false,
  model: {
    material: "Default OBJ",
    scale: 0.1,
    metalness: 0.2,
    roughness: 2,
    opacity: 1,
    color: "white"
  },
  gridPosition: [0, -0.12, 0.28],
  cameraPosition: [-1.45, 0.7, 1.85],
  targetPosition: [2.15, 0.2, 0.18],
  pointColorIndex: {
    primary: "ciano",
    hovered: "magenta",
    active: "magenta"
  },
  pointLight: {
    position: [0, 0, 0],
    intensity: [50, 50, 50],
    distance: 10,
    color: ["ciano", "magenta", "magenta"]
  },
  bloom: {
    kernelSize: 1,
    luminanceThreshold: 0.1,
    luminanceSmoothing: 0.05,
    intensity: 0.1
  },
  glitch: {
    delay: [20, 30],
    duration: [0.3, 0.5],
    strength: [0.1, 0.3]
  },
  lights: {
    front: {
      color: "ciano"
    },
    left: {
      color: "white"
    },
    right: {
      color: "magenta"
    }
  }
};