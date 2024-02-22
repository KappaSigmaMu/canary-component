"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard").default;
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ThreeCanary = void 0;
require("core-js/modules/es.regexp.test.js");
var _drei = require("@react-three/drei");
var _fiber = require("@react-three/fiber");
var _postprocessing = require("@react-three/postprocessing");
var _react = _interopRequireWildcard(require("react"));
var _components = require("../components");
var _helpers = require("../helpers");
// https://github.com/jsx-eslint/eslint-plugin-react/issues/3423
/* eslint-disable react/no-unknown-property */
/* eslint-disable react/prop-types */

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
  }), /*#__PURE__*/_react.default.createElement(_components.Lights, {
    config: config
  }), /*#__PURE__*/_react.default.createElement("gridHelper", {
    position: config.gridPosition,
    color: _helpers.brandPalette.black,
    args: [40, 40]
  }), /*#__PURE__*/_react.default.createElement(_react.Suspense, {
    fallback: null
  }, /*#__PURE__*/_react.default.createElement(_components.Model, {
    scale: config.model.scale,
    objectUrl: props.objectUrl,
    meshColorIndex: config.meshColorIndex,
    meshScale: config.meshScale,
    model: config.model
  }), /*#__PURE__*/_react.default.createElement(_components.Points, {
    objectUrl: props.objectUrl,
    nodesData: props.nodes,
    onNodeClick: props.onNodeClick,
    config: config
  }), /*#__PURE__*/_react.default.createElement(_components.Particles, {
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
  }))), /*#__PURE__*/_react.default.createElement(_components.CameraControls, {
    config: config
  }));
};
exports.ThreeCanary = ThreeCanary;