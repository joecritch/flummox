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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9hZGRvbnMvRmx1eENvbXBvbmVudC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7SUFpRE8sS0FBSywyQkFBTSxjQUFjOztxQ0FDa0IseUJBQXlCOztJQUFsRSxlQUFlLDBCQUFmLGVBQWU7SUFBRSxnQkFBZ0IsMEJBQWhCLGdCQUFnQjs7SUFDbkMsTUFBTSwyQkFBTSxlQUFlOztJQUU1QixhQUFhO0FBQ04sV0FEUCxhQUFhLENBQ0wsS0FBSyxFQUFFLE9BQU8sRUFBRTswQkFEeEIsYUFBYTs7QUFFZiwrQkFGRSxhQUFhLDZDQUVULEtBQUssRUFBRSxPQUFPLEVBQUU7O0FBRXRCLFFBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQzs7QUFFbEIsUUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsZUFBZSxDQUFDLEtBQUssQ0FBQyxlQUFlLEVBQUUsS0FBSyxDQUFDLFdBQVcsQ0FBQyxDQUFDOztBQUU1RSxRQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0dBQzVDOztZQVRHLGFBQWE7O2VBQWIsYUFBYTtBQVdqQixhQUFTO2FBQUEsbUJBQUMsS0FBSyxFQUFFO0FBQ2YsZUFBTyxLQUFLLENBQUMsTUFBTSxDQUFDLGNBQWMsQ0FDaEMsS0FBSyxFQUNMLElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FDckIsQ0FBQztPQUNIOztBQUVELGlCQUFhO2FBQUEseUJBQUc7cUJBT00sSUFBSSxDQUFDLEtBQUs7WUFMNUIsUUFBUSxVQUFSLFFBQVE7WUFDUixNQUFNLFVBQU4sTUFBTTtZQUNOLGVBQWUsVUFBZixlQUFlO1lBQ2YsV0FBVyxVQUFYLFdBQVc7WUFDWCxJQUFJLFVBQUosSUFBSTs7WUFDRCxVQUFVOztBQUVmLGVBQU8sTUFBTSxDQUNYLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxPQUFPLEVBQUUsRUFBRSxFQUN4QixJQUFJLENBQUMsS0FBSyxFQUNWLFVBQVUsQ0FDWCxDQUFDO09BQ0g7O0FBRUQsVUFBTTthQUFBLGtCQUFHO3FCQUNzQixJQUFJLENBQUMsS0FBSztZQUEvQixRQUFRLFVBQVIsUUFBUTtZQUFFLE1BQU0sVUFBTixNQUFNOztBQUV4QixZQUFJLE9BQU8sTUFBTSxLQUFLLFVBQVUsRUFBRTtBQUNoQyxpQkFBTyxNQUFNLENBQUMsSUFBSSxDQUFDLGFBQWEsRUFBRSxFQUFFLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDO1NBQ3JEOztBQUVELFlBQUksQ0FBQyxRQUFRO0FBQUUsaUJBQU8sSUFBSSxDQUFDO1NBQUEsQUFFM0IsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLEVBQUU7QUFDNUIsY0FBTSxLQUFLLEdBQUcsUUFBUSxDQUFDO0FBQ3ZCLGlCQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUM7U0FDOUIsTUFBTTtBQUNMLGlCQUFPOzs7WUFBTyxLQUFLLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQztXQUFRLENBQUM7U0FDcEU7T0FDRjs7OztTQWpERyxhQUFhO0dBQVMsS0FBSyxDQUFDLFNBQVM7O0FBb0QzQyxNQUFNLENBQ0osYUFBYSxDQUFDLFNBQVMsRUFDdkIsZUFBZSxDQUNoQixDQUFDOztBQUVGLE1BQU0sQ0FBQyxhQUFhLEVBQUUsZ0JBQWdCLENBQUMsQ0FBQzs7aUJBRXpCLGFBQWEiLCJmaWxlIjoic3JjL2FkZG9ucy9GbHV4Q29tcG9uZW50LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBGbHV4IENvbXBvbmVudFxuICpcbiAqIENvbXBvbmVudCBmb3JtIG9mIGZsdXhNaXhpbi4gVXNlcyBmbHV4TWl4aW4gYXMgcGFydCBvZiBpdHMgaW1wbGVtZW50YXRpb24sXG4gKiBzbyByZXF1aXJlcyBhIGZsdXggaW5zdGFuY2UgdG8gYmUgcHJvdmlkZWQgYXMgZWl0aGVyIGNvbnRleHQgb3IgYSBwcm9wLlxuICpcbiAqIExpa2UgZmx1eE1peGluLCBjaGlsZHJlbiBhcmUgZ2l2ZW4gYWNjZXNzIHRvIHRoZSBmbHV4IGluc3RhbmNlIHZpYVxuICogYGNvbnRleHQuZmx1eGAuIFVzZSB0aGlzIG5lYXIgdGhlIHRvcCBvZiB5b3VyIGFwcCBoaWVyYXJjaHkgYW5kIGFsbCBjaGlsZHJlblxuICogd2lsbCBoYXZlIGVhc3kgYWNjZXNzIHRvIHRoZSBmbHV4IGluc3RhbmNlIChpbmNsdWRpbmcsIG9mIGNvdXJzZSwgb3RoZXJcbiAqIEZsdXggY29tcG9uZW50cyEpOlxuICpcbiAqIDxGbHV4Q29tcG9uZW50IGZsdXg9e2ZsdXh9PlxuICogICAgLi4udGhlIHJlc3Qgb2YgeW91ciBhcHBcbiAqIDwvRmx1eENvbXBvbmVudD5cbiAqXG4gKiBOb3cgYW55IGNoaWxkIGNhbiBhY2Nlc3MgdGhlIGZsdXggaW5zdGFuY2UgYWdhaW4gbGlrZSB0aGlzOlxuICpcbiAqIDxGbHV4Q29tcG9uZW50PlxuICogICAgLi4uY2hpbGRyZW5cbiAqIDwvRmx1eENvbXBvbmVudD5cbiAqXG4gKiBXZSBkb24ndCBuZWVkIHRoZSBmbHV4IHByb3AgdGhpcyB0aW1lIGJlY2F1c2UgZmx1eCBpcyBhbHJlYWR5IHBhcnQgb2ZcbiAqIHRoZSBjb250ZXh0LlxuICpcbiAqIEFkZGl0aW9uYWxseSwgaW1tZWRpYXRlIGNoaWxkcmVuIGFyZSBnaXZlbiBhIGBmbHV4YCBwcm9wLlxuICpcbiAqIFRoZSBjb21wb25lbnQgaGFzIGFuIG9wdGlvbmFsIHByb3AgYGNvbm5lY3RUb1N0b3Jlc2AsIHdoaWNoIGlzIC0tIHlvdSBndWVzc2VkXG4gKiBpdCAtLSBwYXNzZWQgZGlyZWN0bHkgdG8gZmx1eE1peGluJ3MgYGNvbm5lY3RUb1N0b3JlcygpYCBmdW5jdGlvbiBhbmRcbiAqIHNldCBhcyB0aGUgaW5pdGlhbCBzdGF0ZS4gVGhlIGNvbXBvbmVudCdzIHN0YXRlIGlzIGluamVjdGVkIGFzIHByb3BzIHRvXG4gKiBjaGlsZCBjb21wb25lbnRzLlxuICpcbiAqIFRoZSBwcmFjdGljYWwgdXBzaG90IG9mIGFsbCB0aGlzIGlzIHRoYXQgZmx1eE1peGluLCBzdGF0ZSBjaGFuZ2VzLCBhbmRcbiAqIGNvbnRleHQgYXJlIG5vdyBzaW1wbHkgaW1wbGVtZW50YXRpb24gZGV0YWlscy4gQW1vbmcgb3RoZXIgdGhpbmdzLCB0aGlzIG1lYW5zXG4gKiB5b3UgY2FuIHdyaXRlIHlvdXIgY29tcG9uZW50cyBhcyBwbGFpbiBFUzYgY2xhc3Nlcy4gSGVyZSdzIGFuIGV4YW1wbGU6XG4gKlxuICogY2xhc3MgUGFyZW50Q29tcG9uZW50IGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAqXG4gKiAgIHJlbmRlcigpIHtcbiAqICAgICA8Rmx1eENvbXBvbmVudCBjb25uZWN0VG9TdG9yZXM9XCJmb29TdG9yZVwiPlxuICogICAgICAgPENoaWxkQ29tcG9uZW50IC8+XG4gKiAgICAgPC9GbHV4Q29tcG9uZW50PlxuICogICB9XG4gKlxuICogfVxuICpcbiAqIENoaWxkQ29tcG9uZW50IGluIHRoaXMgZXhhbXBsZSBoYXMgcHJvcCBgZmx1eGAgY29udGFpbmluZyB0aGUgZmx1eCBpbnN0YW5jZSxcbiAqIGFuZCBwcm9wcyB0aGF0IHN5bmMgd2l0aCBlYWNoIG9mIHRoZSBzdGF0ZSBrZXlzIG9mIGZvb1N0b3JlLlxuICovXG5cbmltcG9ydCBSZWFjdCBmcm9tICdyZWFjdC9hZGRvbnMnO1xuaW1wb3J0IHsgaW5zdGFuY2VNZXRob2RzLCBzdGF0aWNQcm9wZXJ0aWVzIH0gZnJvbSAnLi9yZWFjdENvbXBvbmVudE1ldGhvZHMnO1xuaW1wb3J0IGFzc2lnbiBmcm9tICdvYmplY3QtYXNzaWduJztcblxuY2xhc3MgRmx1eENvbXBvbmVudCBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIGNvbnN0cnVjdG9yKHByb3BzLCBjb250ZXh0KSB7XG4gICAgc3VwZXIocHJvcHMsIGNvbnRleHQpO1xuXG4gICAgdGhpcy5pbml0aWFsaXplKCk7XG5cbiAgICB0aGlzLnN0YXRlID0gdGhpcy5jb25uZWN0VG9TdG9yZXMocHJvcHMuY29ubmVjdFRvU3RvcmVzLCBwcm9wcy5zdGF0ZUdldHRlcik7XG5cbiAgICB0aGlzLndyYXBDaGlsZCA9IHRoaXMud3JhcENoaWxkLmJpbmQodGhpcyk7XG4gIH1cblxuICB3cmFwQ2hpbGQoY2hpbGQpIHtcbiAgICByZXR1cm4gUmVhY3QuYWRkb25zLmNsb25lV2l0aFByb3BzKFxuICAgICAgY2hpbGQsXG4gICAgICB0aGlzLmdldENoaWxkUHJvcHMoKVxuICAgICk7XG4gIH1cblxuICBnZXRDaGlsZFByb3BzKCkge1xuICAgIGNvbnN0IHtcbiAgICAgIGNoaWxkcmVuLFxuICAgICAgcmVuZGVyLFxuICAgICAgY29ubmVjdFRvU3RvcmVzLFxuICAgICAgc3RhdGVHZXR0ZXIsXG4gICAgICBmbHV4LFxuICAgICAgLi4uZXh0cmFQcm9wcyB9ID0gdGhpcy5wcm9wcztcblxuICAgIHJldHVybiBhc3NpZ24oXG4gICAgICB7IGZsdXg6IHRoaXMuZ2V0Rmx1eCgpIH0sXG4gICAgICB0aGlzLnN0YXRlLFxuICAgICAgZXh0cmFQcm9wc1xuICAgICk7XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgY29uc3QgeyBjaGlsZHJlbiwgcmVuZGVyIH0gPSB0aGlzLnByb3BzO1xuXG4gICAgaWYgKHR5cGVvZiByZW5kZXIgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIHJldHVybiByZW5kZXIodGhpcy5nZXRDaGlsZFByb3BzKCksIHRoaXMuZ2V0Rmx1eCgpKTtcbiAgICB9XG5cbiAgICBpZiAoIWNoaWxkcmVuKSByZXR1cm4gbnVsbDtcblxuICAgIGlmICghQXJyYXkuaXNBcnJheShjaGlsZHJlbikpIHtcbiAgICAgIGNvbnN0IGNoaWxkID0gY2hpbGRyZW47XG4gICAgICByZXR1cm4gdGhpcy53cmFwQ2hpbGQoY2hpbGQpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gPHNwYW4+e1JlYWN0LkNoaWxkcmVuLm1hcChjaGlsZHJlbiwgdGhpcy53cmFwQ2hpbGQpfTwvc3Bhbj47XG4gICAgfVxuICB9XG59XG5cbmFzc2lnbihcbiAgRmx1eENvbXBvbmVudC5wcm90b3R5cGUsXG4gIGluc3RhbmNlTWV0aG9kc1xuKTtcblxuYXNzaWduKEZsdXhDb21wb25lbnQsIHN0YXRpY1Byb3BlcnRpZXMpO1xuXG5leHBvcnQgZGVmYXVsdCBGbHV4Q29tcG9uZW50O1xuIl19