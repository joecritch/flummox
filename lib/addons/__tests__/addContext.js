"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

module.exports = addContext;

var React = _interopRequire(require("react"));

function addContext(Component, context, contextTypes) {
  return React.createClass({
    childContextTypes: contextTypes,

    getChildContext: function getChildContext() {
      return context;
    },

    render: function render() {
      return React.createElement(Component, this.props);
    }
  });
}