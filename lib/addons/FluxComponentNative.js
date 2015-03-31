"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var _objectWithoutProperties = function (obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; };

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

var React = _interopRequire(require("react-native"));

var _reactNativeComponentMethods = require("./reactNativeComponentMethods");

var instanceMethods = _reactNativeComponentMethods.instanceMethods;
var staticProperties = _reactNativeComponentMethods.staticProperties;

var assign = _interopRequire(require("object-assign"));

var FluxComponent = React.createClass({
  displayName: "FluxComponent",

  getInitialState: function getInitialState() {
    return this.connectToStores(props.connectToStores, props.stateGetter);
  },

  wrapChild: function wrapChild(child) {
    return React.addons.cloneWithProps(child, this.getChildProps());
  },

  getChildProps: function getChildProps() {
    var _props = this.props;
    var children = _props.children;
    var render = _props.render;
    var connectToStores = _props.connectToStores;
    var stateGetter = _props.stateGetter;
    var flux = _props.flux;

    var extraProps = _objectWithoutProperties(_props, ["children", "render", "connectToStores", "stateGetter", "flux"]);

    return assign({ flux: this.getFlux() }, this.state, extraProps);
  },

  render: (function (_render) {
    var _renderWrapper = function render() {
      return _render.apply(this, arguments);
    };

    _renderWrapper.toString = function () {
      return _render.toString();
    };

    return _renderWrapper;
  })(function () {
    var _props = this.props;
    var children = _props.children;
    var render = _props.render;

    if (typeof render === "function") {
      return render(this.getChildProps(), this.getFlux());
    }

    if (!children) return null;

    if (!Array.isArray(children)) {
      var child = children;
      return this.wrapChild(child);
    } else {
      return React.createElement(
        React.View,
        null,
        React.Children.map(children, this.wrapChild)
      );
    }
  })
});

assign(FluxComponent.prototype, instanceMethods);

assign(FluxComponent, staticProperties);

module.exports = FluxComponent;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9hZGRvbnMvRmx1eENvbXBvbmVudE5hdGl2ZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBaURPLEtBQUssMkJBQU0sY0FBYzs7MkNBQ2tCLCtCQUErQjs7SUFBeEUsZUFBZSxnQ0FBZixlQUFlO0lBQUUsZ0JBQWdCLGdDQUFoQixnQkFBZ0I7O0lBQ25DLE1BQU0sMkJBQU0sZUFBZTs7QUFFbEMsSUFBTSxhQUFhLEdBQUcsS0FBSyxDQUFDLFdBQVcsQ0FBQzs7O0FBQ3RDLGlCQUFlLEVBQUEsMkJBQUc7QUFDaEIsV0FBTyxJQUFJLENBQUMsZUFBZSxDQUFDLEtBQUssQ0FBQyxlQUFlLEVBQUUsS0FBSyxDQUFDLFdBQVcsQ0FBQyxDQUFDO0dBQ3ZFOztBQUVELFdBQVMsRUFBQSxtQkFBQyxLQUFLLEVBQUU7QUFDZixXQUFPLEtBQUssQ0FBQyxNQUFNLENBQUMsY0FBYyxDQUNoQyxLQUFLLEVBQ0wsSUFBSSxDQUFDLGFBQWEsRUFBRSxDQUNyQixDQUFDO0dBQ0g7O0FBRUQsZUFBYSxFQUFBLHlCQUFHO2lCQU9NLElBQUksQ0FBQyxLQUFLO1FBTDVCLFFBQVEsVUFBUixRQUFRO1FBQ1IsTUFBTSxVQUFOLE1BQU07UUFDTixlQUFlLFVBQWYsZUFBZTtRQUNmLFdBQVcsVUFBWCxXQUFXO1FBQ1gsSUFBSSxVQUFKLElBQUk7O1FBQ0QsVUFBVTs7QUFFZixXQUFPLE1BQU0sQ0FDWCxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsT0FBTyxFQUFFLEVBQUUsRUFDeEIsSUFBSSxDQUFDLEtBQUssRUFDVixVQUFVLENBQ1gsQ0FBQztHQUNIOztBQUVELFFBQU07Ozs7Ozs7Ozs7S0FBQSxZQUFHO2lCQUNzQixJQUFJLENBQUMsS0FBSztRQUEvQixRQUFRLFVBQVIsUUFBUTtRQUFFLE1BQU0sVUFBTixNQUFNOztBQUV4QixRQUFJLE9BQU8sTUFBTSxLQUFLLFVBQVUsRUFBRTtBQUNoQyxhQUFPLE1BQU0sQ0FBQyxJQUFJLENBQUMsYUFBYSxFQUFFLEVBQUUsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUM7S0FDckQ7O0FBRUQsUUFBSSxDQUFDLFFBQVEsRUFBRSxPQUFPLElBQUksQ0FBQzs7QUFFM0IsUUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLEVBQUU7QUFDNUIsVUFBTSxLQUFLLEdBQUcsUUFBUSxDQUFDO0FBQ3ZCLGFBQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQztLQUM5QixNQUFNO0FBQ0wsYUFBTztBQUFDLGFBQUssQ0FBQyxJQUFJOztRQUFFLEtBQUssQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDO09BQWMsQ0FBQztLQUNoRjtHQUNGLENBQUE7Q0FDRixDQUFDLENBQUM7O0FBRUgsTUFBTSxDQUNKLGFBQWEsQ0FBQyxTQUFTLEVBQ3ZCLGVBQWUsQ0FDaEIsQ0FBQzs7QUFFRixNQUFNLENBQUMsYUFBYSxFQUFFLGdCQUFnQixDQUFDLENBQUM7O2lCQUV6QixhQUFhIiwiZmlsZSI6InNyYy9hZGRvbnMvRmx1eENvbXBvbmVudE5hdGl2ZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogRmx1eCBDb21wb25lbnRcbiAqXG4gKiBDb21wb25lbnQgZm9ybSBvZiBmbHV4TWl4aW4uIFVzZXMgZmx1eE1peGluIGFzIHBhcnQgb2YgaXRzIGltcGxlbWVudGF0aW9uLFxuICogc28gcmVxdWlyZXMgYSBmbHV4IGluc3RhbmNlIHRvIGJlIHByb3ZpZGVkIGFzIGVpdGhlciBjb250ZXh0IG9yIGEgcHJvcC5cbiAqXG4gKiBMaWtlIGZsdXhNaXhpbiwgY2hpbGRyZW4gYXJlIGdpdmVuIGFjY2VzcyB0byB0aGUgZmx1eCBpbnN0YW5jZSB2aWFcbiAqIGBjb250ZXh0LmZsdXhgLiBVc2UgdGhpcyBuZWFyIHRoZSB0b3Agb2YgeW91ciBhcHAgaGllcmFyY2h5IGFuZCBhbGwgY2hpbGRyZW5cbiAqIHdpbGwgaGF2ZSBlYXN5IGFjY2VzcyB0byB0aGUgZmx1eCBpbnN0YW5jZSAoaW5jbHVkaW5nLCBvZiBjb3Vyc2UsIG90aGVyXG4gKiBGbHV4IGNvbXBvbmVudHMhKTpcbiAqXG4gKiA8Rmx1eENvbXBvbmVudCBmbHV4PXtmbHV4fT5cbiAqICAgIC4uLnRoZSByZXN0IG9mIHlvdXIgYXBwXG4gKiA8L0ZsdXhDb21wb25lbnQ+XG4gKlxuICogTm93IGFueSBjaGlsZCBjYW4gYWNjZXNzIHRoZSBmbHV4IGluc3RhbmNlIGFnYWluIGxpa2UgdGhpczpcbiAqXG4gKiA8Rmx1eENvbXBvbmVudD5cbiAqICAgIC4uLmNoaWxkcmVuXG4gKiA8L0ZsdXhDb21wb25lbnQ+XG4gKlxuICogV2UgZG9uJ3QgbmVlZCB0aGUgZmx1eCBwcm9wIHRoaXMgdGltZSBiZWNhdXNlIGZsdXggaXMgYWxyZWFkeSBwYXJ0IG9mXG4gKiB0aGUgY29udGV4dC5cbiAqXG4gKiBBZGRpdGlvbmFsbHksIGltbWVkaWF0ZSBjaGlsZHJlbiBhcmUgZ2l2ZW4gYSBgZmx1eGAgcHJvcC5cbiAqXG4gKiBUaGUgY29tcG9uZW50IGhhcyBhbiBvcHRpb25hbCBwcm9wIGBjb25uZWN0VG9TdG9yZXNgLCB3aGljaCBpcyAtLSB5b3UgZ3Vlc3NlZFxuICogaXQgLS0gcGFzc2VkIGRpcmVjdGx5IHRvIGZsdXhNaXhpbidzIGBjb25uZWN0VG9TdG9yZXMoKWAgZnVuY3Rpb24gYW5kXG4gKiBzZXQgYXMgdGhlIGluaXRpYWwgc3RhdGUuIFRoZSBjb21wb25lbnQncyBzdGF0ZSBpcyBpbmplY3RlZCBhcyBwcm9wcyB0b1xuICogY2hpbGQgY29tcG9uZW50cy5cbiAqXG4gKiBUaGUgcHJhY3RpY2FsIHVwc2hvdCBvZiBhbGwgdGhpcyBpcyB0aGF0IGZsdXhNaXhpbiwgc3RhdGUgY2hhbmdlcywgYW5kXG4gKiBjb250ZXh0IGFyZSBub3cgc2ltcGx5IGltcGxlbWVudGF0aW9uIGRldGFpbHMuIEFtb25nIG90aGVyIHRoaW5ncywgdGhpcyBtZWFuc1xuICogeW91IGNhbiB3cml0ZSB5b3VyIGNvbXBvbmVudHMgYXMgcGxhaW4gRVM2IGNsYXNzZXMuIEhlcmUncyBhbiBleGFtcGxlOlxuICpcbiAqIGNsYXNzIFBhcmVudENvbXBvbmVudCBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gKlxuICogICByZW5kZXIoKSB7XG4gKiAgICAgPEZsdXhDb21wb25lbnQgY29ubmVjdFRvU3RvcmVzPVwiZm9vU3RvcmVcIj5cbiAqICAgICAgIDxDaGlsZENvbXBvbmVudCAvPlxuICogICAgIDwvRmx1eENvbXBvbmVudD5cbiAqICAgfVxuICpcbiAqIH1cbiAqXG4gKiBDaGlsZENvbXBvbmVudCBpbiB0aGlzIGV4YW1wbGUgaGFzIHByb3AgYGZsdXhgIGNvbnRhaW5pbmcgdGhlIGZsdXggaW5zdGFuY2UsXG4gKiBhbmQgcHJvcHMgdGhhdCBzeW5jIHdpdGggZWFjaCBvZiB0aGUgc3RhdGUga2V5cyBvZiBmb29TdG9yZS5cbiAqL1xuXG5pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QtbmF0aXZlJztcbmltcG9ydCB7IGluc3RhbmNlTWV0aG9kcywgc3RhdGljUHJvcGVydGllcyB9IGZyb20gJy4vcmVhY3ROYXRpdmVDb21wb25lbnRNZXRob2RzJztcbmltcG9ydCBhc3NpZ24gZnJvbSAnb2JqZWN0LWFzc2lnbic7XG5cbmNvbnN0IEZsdXhDb21wb25lbnQgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gIGdldEluaXRpYWxTdGF0ZSgpIHtcbiAgICByZXR1cm4gdGhpcy5jb25uZWN0VG9TdG9yZXMocHJvcHMuY29ubmVjdFRvU3RvcmVzLCBwcm9wcy5zdGF0ZUdldHRlcik7XG4gIH0sXG5cbiAgd3JhcENoaWxkKGNoaWxkKSB7XG4gICAgcmV0dXJuIFJlYWN0LmFkZG9ucy5jbG9uZVdpdGhQcm9wcyhcbiAgICAgIGNoaWxkLFxuICAgICAgdGhpcy5nZXRDaGlsZFByb3BzKClcbiAgICApO1xuICB9LFxuXG4gIGdldENoaWxkUHJvcHMoKSB7XG4gICAgY29uc3Qge1xuICAgICAgY2hpbGRyZW4sXG4gICAgICByZW5kZXIsXG4gICAgICBjb25uZWN0VG9TdG9yZXMsXG4gICAgICBzdGF0ZUdldHRlcixcbiAgICAgIGZsdXgsXG4gICAgICAuLi5leHRyYVByb3BzIH0gPSB0aGlzLnByb3BzO1xuXG4gICAgcmV0dXJuIGFzc2lnbihcbiAgICAgIHsgZmx1eDogdGhpcy5nZXRGbHV4KCkgfSxcbiAgICAgIHRoaXMuc3RhdGUsXG4gICAgICBleHRyYVByb3BzXG4gICAgKTtcbiAgfSxcblxuICByZW5kZXIoKSB7XG4gICAgY29uc3QgeyBjaGlsZHJlbiwgcmVuZGVyIH0gPSB0aGlzLnByb3BzO1xuXG4gICAgaWYgKHR5cGVvZiByZW5kZXIgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIHJldHVybiByZW5kZXIodGhpcy5nZXRDaGlsZFByb3BzKCksIHRoaXMuZ2V0Rmx1eCgpKTtcbiAgICB9XG5cbiAgICBpZiAoIWNoaWxkcmVuKSByZXR1cm4gbnVsbDtcblxuICAgIGlmICghQXJyYXkuaXNBcnJheShjaGlsZHJlbikpIHtcbiAgICAgIGNvbnN0IGNoaWxkID0gY2hpbGRyZW47XG4gICAgICByZXR1cm4gdGhpcy53cmFwQ2hpbGQoY2hpbGQpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gPFJlYWN0LlZpZXc+e1JlYWN0LkNoaWxkcmVuLm1hcChjaGlsZHJlbiwgdGhpcy53cmFwQ2hpbGQpfTwvUmVhY3QuVmlldz47XG4gICAgfVxuICB9XG59KTtcblxuYXNzaWduKFxuICBGbHV4Q29tcG9uZW50LnByb3RvdHlwZSxcbiAgaW5zdGFuY2VNZXRob2RzXG4pO1xuXG5hc3NpZ24oRmx1eENvbXBvbmVudCwgc3RhdGljUHJvcGVydGllcyk7XG5cbmV4cG9ydCBkZWZhdWx0IEZsdXhDb21wb25lbnQ7XG4iXX0=