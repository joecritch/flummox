"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

module.exports = fluxMixin;
/**
 * fluxMixin
 *
 * Exports a function that creates a React component mixin. Implements methods
 * from reactComponentMethods.
 *
 * Any arguments passed to the mixin creator are passed to `connectToStores()`
 * and used as the return value of `getInitialState()`. This lets you handle
 * all of the state initialization and updates in a single place, while removing
 * the burden of manually adding and removing store listeners.
 *
 * @example
 * let Component = React.createClass({
 *   mixins: [fluxMixin({
 *     storeA: store => ({
 *       foo: store.state.a,
 *     }),
 *     storeB: store => ({
 *       bar: store.state.b,
 *     })
 *   }]
 * });
 */

var PropTypes = require("react").PropTypes;

var Flux = require("../Flux").Flux;

var _reactComponentMethods = require("./reactComponentMethods");

var instanceMethods = _reactComponentMethods.instanceMethods;
var staticProperties = _reactComponentMethods.staticProperties;

var assign = _interopRequire(require("object-assign"));

function fluxMixin() {
  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  function getInitialState() {
    var _ref;

    this.initialize();
    return (_ref = this).connectToStores.apply(_ref, args);
  }

  return assign({ getInitialState: getInitialState }, instanceMethods, staticProperties);
}