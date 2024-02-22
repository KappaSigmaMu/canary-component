"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.resolve = exports.randomN = exports.random = exports.defaultConfig = exports.brandPalette = void 0;
require("core-js/modules/es.array.reduce.js");
require("core-js/modules/es.regexp.exec.js");
require("core-js/modules/es.string.split.js");
var _CanaryConfig = require("./config/CanaryConfig");
var _GilConfig = require("./config/GilConfig");
// Generate a random integer between min and max
const random = (min, max) => Math.floor(Math.random() * (max - min)) + min;

// Generate N integer numbers (with no repetition) between mix and max
exports.random = random;
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
exports.randomN = randomN;
const resolve = exports.resolve = function resolve(path, obj) {
  let separator = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : ".";
  let properties = Array.isArray(path) ? path : path.split(separator);
  return properties.reduce((prev, curr) => prev && prev[curr], obj);
};
const brandPalette = exports.brandPalette = {
  ciano: "#01ffff",
  magenta: "#e6007a",
  white: "#ffffff",
  black: "#000000"
};
const defaultConfig = exports.defaultConfig = {
  canary: _CanaryConfig.canaryConfig,
  gil: _GilConfig.gilConfig
};