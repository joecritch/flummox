"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(object, property, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc && desc.writable) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

/**
 * Higher-order component form of connectToStores
 */

var React = _interopRequire(require("react"));

var _reactComponentMethods = require("./reactComponentMethods");

var instanceMethods = _reactComponentMethods.instanceMethods;
var staticProperties = _reactComponentMethods.staticProperties;

var assign = _interopRequire(require("object-assign"));

module.exports = function (BaseComponent, stores, stateGetter) {
  var ConnectedComponent = (function (_React$Component) {
    var _class = function ConnectedComponent(props, context) {
      _classCallCheck(this, _class);

      _get(Object.getPrototypeOf(_class.prototype), "constructor", this).call(this, props, context);

      this.initialize();

      this.state = this.connectToStores(stores, stateGetter);
    };

    _inherits(_class, _React$Component);

    _createClass(_class, {
      render: {
        value: function render() {
          return React.createElement(BaseComponent, this.state);
        }
      }
    });

    return _class;
  })(React.Component);

  assign(ConnectedComponent.prototype, instanceMethods);

  assign(ConnectedComponent, staticProperties);

  return ConnectedComponent;
};