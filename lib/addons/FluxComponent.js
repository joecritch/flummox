"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var _objectWithoutProperties = function (obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; };

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(object, property, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc && desc.writable) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

/**
 * Flux Component
 *
 * Component form of fluxMixin. Uses fluxMixin as part of its implementation,
 * so requires a flux instance to be provided as either context or a prop.
 *
 * Like fluxMixin, children are given access to the flux instance via
 * `context.flux`. Use this near the top of your app hierarchy and all children
 * will have easy access to the flux instance (including, of course, other
 * Flux components!):
 *
 * <FluxComponent flux={flux}>
 *    ...the rest of your app
 * </FluxComponent>
 *
 * Now any child can access the flux instance again like this:
 *
 * <FluxComponent>
 *    ...children
 * </FluxComponent>
 *
 * We don't need the flux prop this time because flux is already part of
 * the context.
 *
 * Additionally, immediate children are given a `flux` prop.
 *
 * The component has an optional prop `connectToStores`, which is -- you guessed
 * it -- passed directly to fluxMixin's `connectToStores()` function and
 * set as the initial state. The component's state is injected as props to
 * child components.
 *
 * The practical upshot of all this is that fluxMixin, state changes, and
 * context are now simply implementation details. Among other things, this means
 * you can write your components as plain ES6 classes. Here's an example:
 *
 * class ParentComponent extends React.Component {
 *
 *   render() {
 *     <FluxComponent connectToStores="fooStore">
 *       <ChildComponent />
 *     </FluxComponent>
 *   }
 *
 * }
 *
 * ChildComponent in this example has prop `flux` containing the flux instance,
 * and props that sync with each of the state keys of fooStore.
 */

var React = _interopRequire(require("react/addons"));

var _reactComponentMethods = require("./reactComponentMethods");

var instanceMethods = _reactComponentMethods.instanceMethods;
var staticProperties = _reactComponentMethods.staticProperties;

var assign = _interopRequire(require("object-assign"));

var FluxComponent = (function (_React$Component) {
  function FluxComponent(props, context) {
    _classCallCheck(this, FluxComponent);

    _get(Object.getPrototypeOf(FluxComponent.prototype), "constructor", this).call(this, props, context);

    this.initialize();

    this.state = this.connectToStores(props.connectToStores, props.stateGetter);

    this.wrapChild = this.wrapChild.bind(this);
  }

  _inherits(FluxComponent, _React$Component);

  _createClass(FluxComponent, {
    wrapChild: {
      value: function wrapChild(child) {
        return React.addons.cloneWithProps(child, this.getChildProps());
      }
    },
    getChildProps: {
      value: function getChildProps() {
        var _props = this.props;
        var children = _props.children;
        var render = _props.render;
        var connectToStores = _props.connectToStores;
        var stateGetter = _props.stateGetter;
        var flux = _props.flux;

        var extraProps = _objectWithoutProperties(_props, ["children", "render", "connectToStores", "stateGetter", "flux"]);

        return assign({ flux: this.getFlux() }, this.state, extraProps);
      }
    },
    render: {
      value: function render() {
        var _props = this.props;
        var children = _props.children;
        var render = _props.render;

        if (typeof render === "function") {
          return render(this.getChildProps(), this.getFlux());
        }

        if (!children) {
          return null;
        }if (!Array.isArray(children)) {
          var child = children;
          return this.wrapChild(child);
        } else {
          return React.createElement(
            "span",
            null,
            React.Children.map(children, this.wrapChild)
          );
        }
      }
    }
  });

  return FluxComponent;
})(React.Component);

assign(FluxComponent.prototype, instanceMethods);

assign(FluxComponent, staticProperties);

module.exports = FluxComponent;