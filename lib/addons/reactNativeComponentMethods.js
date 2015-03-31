"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * React Component methods. These are the primitives used to implement
 * fluxMixin and FluxComponent.
 *
 * Exposes a Flux instance as `this.flux`. This requires that flux be passed as
 * either context or as a prop (prop takes precedence). Children also are given
 * access to flux instance as `context.flux`.
 *
 * It also adds the method `connectToStores()`, which ensures that the component
 * state stays in sync with the specified Flux stores. See the inline docs
 * of `connectToStores` for details.
 */

var _reactNative = require("react-native");

var React = _interopRequire(_reactNative);

var PropTypes = _reactNative.PropTypes;

var Flux = require("../Flux").Flux;

var assign = _interopRequire(require("object-assign"));

var instanceMethods = {

  getChildContext: function getChildContext() {
    var flux = this.getFlux();

    if (!flux) {
      return {};
    }return { flux: flux };
  },

  getFlux: function getFlux() {
    return this.props.flux || this.context.flux;
  },

  initialize: function initialize() {
    this._fluxStateGetters = [];
    this._fluxListeners = {};
    this.flux = this.getFlux();

    if (!(this.flux instanceof Flux)) {
      // TODO: print the actual class name here
      throw new Error("fluxMixin: Could not find Flux instance. Ensure that your component " + "has either `this.context.flux` or `this.props.flux`.");
    }
  },

  componentWillUnmount: function componentWillUnmount() {
    var flux = this.getFlux();

    for (var key in this._fluxListeners) {
      if (!this._fluxListeners.hasOwnProperty(key)) continue;

      var store = flux.getStore(key);
      if (typeof store === "undefined") continue;

      var listener = this._fluxListeners[key];

      store.removeListener("change", listener);
    }
  },

  componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
    this.updateStores(nextProps);
  },

  updateStores: function updateStores() {
    var props = arguments[0] === undefined ? this.props : arguments[0];

    var state = this.getStoreState(props);
    this.setState(state);
  },

  getStoreState: function getStoreState() {
    var props = arguments[0] === undefined ? this.props : arguments[0];

    return this._fluxStateGetters.reduce(function (result, stateGetter) {
      var getter = stateGetter.getter;
      var stores = stateGetter.stores;

      var stateFromStores = getter(stores, props);
      return assign(result, stateFromStores);
    }, {});
  },

  /**
   * Connect component to stores, get the combined initial state, and
   * subscribe to future changes. There are three ways to call it. The
   * simplest is to pass a single store key and, optionally, a state getter.
   * The state getter is a function that takes the store as a parameter and
   * returns the state that should be passed to the component's `setState()`.
   * If no state getter is specified, the default getter is used, which simply
   * returns the entire store state.
   *
   * The second form accepts an array of store keys. With this form, the state
   * getter is called once with an array of store instances (in the same order
   * as the store keys). the default getter performance a reduce on the entire
   * state for each store.
   *
   * The last form accepts an object of store keys mapped to state getters. As
   * a shortcut, you can pass `null` as a state getter to use the default
   * state getter.
   *
   * Returns the combined initial state of all specified stores.
   *
   * This way you can write all the initialization and update logic in a single
   * location, without having to mess with adding/removing listeners.
   *
   * @type {string|array|object} stateGetterMap - map of keys to getters
   * @returns {object} Combined initial state of stores
   */
  connectToStores: function connectToStores() {
    var _this = this;

    var stateGetterMap = arguments[0] === undefined ? {} : arguments[0];
    var stateGetter = arguments[1] === undefined ? null : arguments[1];

    var flux = this.getFlux();

    var getStore = function (key) {
      var store = flux.getStore(key);

      if (typeof store === "undefined") {
        throw new Error("connectToStores(): Store with key '" + key + "' does not exist.");
      }

      return store;
    };

    if (typeof stateGetterMap === "string") {
      var key = stateGetterMap;
      var store = getStore(key);
      var getter = stateGetter || defaultStateGetter;

      this._fluxStateGetters.push({ stores: store, getter: getter });
      var listener = createStoreListener(this, store, getter);

      store.addListener("change", listener);
      this._fluxListeners[key] = listener;
    } else if (Array.isArray(stateGetterMap)) {
      (function () {
        var stores = stateGetterMap.map(getStore);
        var getter = stateGetter || defaultReduceStateGetter;

        _this._fluxStateGetters.push({ stores: stores, getter: getter });
        var listener = createStoreListener(_this, stores, getter);

        stateGetterMap.forEach(function (key, index) {
          var store = stores[index];
          store.addListener("change", listener);
          _this._fluxListeners[key] = listener;
        });
      })();
    } else {
      for (var key in stateGetterMap) {
        var store = getStore(key);
        var getter = stateGetterMap[key] || defaultStateGetter;

        this._fluxStateGetters.push({ stores: store, getter: getter });
        var listener = createStoreListener(this, store, getter);

        store.addListener("change", listener);
        this._fluxListeners[key] = listener;
      }
    }

    return this.getStoreState();
  }

};

var staticProperties = {
  contextTypes: {
    flux: PropTypes.instanceOf(Flux) },

  childContextTypes: {
    flux: PropTypes.instanceOf(Flux) },

  propTypes: {
    connectToStores: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string), PropTypes.object]),
    flux: PropTypes.instanceOf(Flux),
    render: React.PropTypes.func,
    stateGetter: React.PropTypes.func } };

exports.instanceMethods = instanceMethods;
exports.staticProperties = staticProperties;

function createStoreListener(component, store, storeStateGetter) {
  return (function () {
    var state = storeStateGetter(store, this.props);
    this.setState(state);
  }).bind(component);
}

function defaultStateGetter(store) {
  return store.getStateAsObject();
}

function defaultReduceStateGetter(stores) {
  return stores.reduce(function (result, store) {
    return assign(result, store.getStateAsObject());
  }, {});
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9hZGRvbnMvcmVhY3ROYXRpdmVDb21wb25lbnRNZXRob2RzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OzJCQWE0QyxjQUFjOztJQUF0QyxLQUFLOztJQUFFLFNBQVMsZ0JBQVQsU0FBUzs7SUFDM0IsSUFBSSxXQUFRLFNBQVMsRUFBckIsSUFBSTs7SUFDTixNQUFNLDJCQUFNLGVBQWU7O0FBRWxDLElBQU0sZUFBZSxHQUFHOztBQUV0QixpQkFBZSxFQUFBLDJCQUFHO0FBQ2hCLFFBQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQzs7QUFFNUIsUUFBSSxDQUFDLElBQUk7QUFBRSxhQUFPLEVBQUUsQ0FBQztLQUFBLEFBRXJCLE9BQU8sRUFBRSxJQUFJLEVBQUosSUFBSSxFQUFFLENBQUM7R0FDakI7O0FBRUQsU0FBTyxFQUFBLG1CQUFHO0FBQ1IsV0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQztHQUM3Qzs7QUFFRCxZQUFVLEVBQUEsc0JBQUc7QUFDWCxRQUFJLENBQUMsaUJBQWlCLEdBQUcsRUFBRSxDQUFDO0FBQzVCLFFBQUksQ0FBQyxjQUFjLEdBQUcsRUFBRSxDQUFDO0FBQ3pCLFFBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDOztBQUUzQixRQUFJLEVBQUUsSUFBSSxDQUFDLElBQUksWUFBWSxJQUFJLENBQUEsQUFBQyxFQUFFOztBQUVoQyxZQUFNLElBQUksS0FBSyxDQUNiLCtIQUMwRCxDQUMzRCxDQUFDO0tBQ0g7R0FDRjs7QUFFRCxzQkFBb0IsRUFBQSxnQ0FBRztBQUNyQixRQUFNLElBQUksR0FBRyxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUM7O0FBRTVCLFNBQUssSUFBSSxHQUFHLElBQUksSUFBSSxDQUFDLGNBQWMsRUFBRTtBQUNuQyxVQUFJLENBQUMsSUFBSSxD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cG9uZW50TWV0aG9kcy5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogUmVhY3QgQ29tcG9uZW50IG1ldGhvZHMuIFRoZXNlIGFyZSB0aGUgcHJpbWl0aXZlcyB1c2VkIHRvIGltcGxlbWVudFxuICogZmx1eE1peGluIGFuZCBGbHV4Q29tcG9uZW50LlxuICpcbiAqIEV4cG9zZXMgYSBGbHV4IGluc3RhbmNlIGFzIGB0aGlzLmZsdXhgLiBUaGlzIHJlcXVpcmVzIHRoYXQgZmx1eCBiZSBwYXNzZWQgYXNcbiAqIGVpdGhlciBjb250ZXh0IG9yIGFzIGEgcHJvcCAocHJvcCB0YWtlcyBwcmVjZWRlbmNlKS4gQ2hpbGRyZW4gYWxzbyBhcmUgZ2l2ZW5cbiAqIGFjY2VzcyB0byBmbHV4IGluc3RhbmNlIGFzIGBjb250ZXh0LmZsdXhgLlxuICpcbiAqIEl0IGFsc28gYWRkcyB0aGUgbWV0aG9kIGBjb25uZWN0VG9TdG9yZXMoKWAsIHdoaWNoIGVuc3VyZXMgdGhhdCB0aGUgY29tcG9uZW50XG4gKiBzdGF0ZSBzdGF5cyBpbiBzeW5jIHdpdGggdGhlIHNwZWNpZmllZCBGbHV4IHN0b3Jlcy4gU2VlIHRoZSBpbmxpbmUgZG9jc1xuICogb2YgYGNvbm5lY3RUb1N0b3Jlc2AgZm9yIGRldGFpbHMuXG4gKi9cblxuaW1wb3J0IHsgZGVmYXVsdCBhcyBSZWFjdCwgUHJvcFR5cGVzIH0gZnJvbSAncmVhY3QtbmF0aXZlJztcbmltcG9ydCB7IEZsdXggfSBmcm9tICcuLi9GbHV4JztcbmltcG9ydCBhc3NpZ24gZnJvbSAnb2JqZWN0LWFzc2lnbic7XG5cbmNvbnN0IGluc3RhbmNlTWV0aG9kcyA9IHtcblxuICBnZXRDaGlsZENvbnRleHQoKSB7XG4gICAgY29uc3QgZmx1eCA9IHRoaXMuZ2V0Rmx1eCgpO1xuXG4gICAgaWYgKCFmbHV4KSByZXR1cm4ge307XG5cbiAgICByZXR1cm4geyBmbHV4IH07XG4gIH0sXG5cbiAgZ2V0Rmx1eCgpIHtcbiAgICByZXR1cm4gdGhpcy5wcm9wcy5mbHV4IHx8IHRoaXMuY29udGV4dC5mbHV4O1xuICB9LFxuXG4gIGluaXRpYWxpemUoKSB7XG4gICAgdGhpcy5fZmx1eFN0YXRlR2V0dGVycyA9IFtdO1xuICAgIHRoaXMuX2ZsdXhMaXN0ZW5lcnMgPSB7fTtcbiAgICB0aGlzLmZsdXggPSB0aGlzLmdldEZsdXgoKTtcblxuICAgIGlmICghKHRoaXMuZmx1eCBpbnN0YW5jZW9mIEZsdXgpKSB7XG4gICAgICAvLyBUT0RPOiBwcmludCB0aGUgYWN0dWFsIGNsYXNzIG5hbWUgaGVyZVxuICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICBgZmx1eE1peGluOiBDb3VsZCBub3QgZmluZCBGbHV4IGluc3RhbmNlLiBFbnN1cmUgdGhhdCB5b3VyIGNvbXBvbmVudCBgXG4gICAgICArIGBoYXMgZWl0aGVyIFxcYHRoaXMuY29udGV4dC5mbHV4XFxgIG9yIFxcYHRoaXMucHJvcHMuZmx1eFxcYC5gXG4gICAgICApO1xuICAgIH1cbiAgfSxcblxuICBjb21wb25lbnRXaWxsVW5tb3VudCgpIHtcbiAgICBjb25zdCBmbHV4ID0gdGhpcy5nZXRGbHV4KCk7XG5cbiAgICBmb3IgKGxldCBrZXkgaW4gdGhpcy5fZmx1eExpc3RlbmVycykge1xuICAgICAgaWYgKCF0aGlzLl9mbHV4TGlzdGVuZXJzLmhhc093blByb3BlcnR5KGtleSkpIGNvbnRpbnVlO1xuXG4gICAgICBjb25zdCBzdG9yZSA9IGZsdXguZ2V0U3RvcmUoa2V5KTtcbiAgICAgIGlmICh0eXBlb2Ygc3RvcmUgPT09ICd1bmRlZmluZWQnKSBjb250aW51ZTtcblxuICAgICAgY29uc3QgbGlzdGVuZXIgPSB0aGlzLl9mbHV4TGlzdGVuZXJzW2tleV07XG5cbiAgICAgIHN0b3JlLnJlbW92ZUxpc3RlbmVyKCdjaGFuZ2UnLCBsaXN0ZW5lcik7XG4gICAgfVxuICB9LFxuXG4gIGNvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHMobmV4dFByb3BzKSB7XG4gICAgdGhpcy51cGRhdGVTdG9yZXMobmV4dFByb3BzKTtcbiAgfSxcblxuICB1cGRhdGVTdG9yZXMocHJvcHMgPSB0aGlzLnByb3BzKSB7XG4gICAgY29uc3Qgc3RhdGUgPSB0aGlzLmdldFN0b3JlU3RhdGUocHJvcHMpO1xuICAgIHRoaXMuc2V0U3RhdGUoc3RhdGUpO1xuICB9LFxuXG4gIGdldFN0b3JlU3RhdGUocHJvcHMgPSB0aGlzLnByb3BzKSB7XG4gICAgcmV0dXJuIHRoaXMuX2ZsdXhTdGF0ZUdldHRlcnMucmVkdWNlKFxuICAgICAgKHJlc3VsdCwgc3RhdGVHZXR0ZXIpID0+IHtcbiAgICAgICAgY29uc3QgeyBnZXR0ZXIsIHN0b3JlcyB9ID0gc3RhdGVHZXR0ZXI7XG4gICAgICAgIGNvbnN0IHN0YXRlRnJvbVN0b3JlcyA9IGdldHRlcihzdG9yZXMsIHByb3BzKTtcbiAgICAgICAgcmV0dXJuIGFzc2lnbihyZXN1bHQsIHN0YXRlRnJvbVN0b3Jlcyk7XG4gICAgICB9LCB7fVxuICAgICk7XG4gIH0sXG5cbiAgIC8qKlxuICAgICogQ29ubmVjdCBjb21wb25lbnQgdG8gc3RvcmVzLCBnZXQgdGhlIGNvbWJpbmVkIGluaXRpYWwgc3RhdGUsIGFuZFxuICAgICogc3Vic2NyaWJlIHRvIGZ1dHVyZSBjaGFuZ2VzLiBUaGVyZSBhcmUgdGhyZWUgd2F5cyB0byBjYWxsIGl0LiBUaGVcbiAgICAqIHNpbXBsZXN0IGlzIHRvIHBhc3MgYSBzaW5nbGUgc3RvcmUga2V5IGFuZCwgb3B0aW9uYWxseSwgYSBzdGF0ZSBnZXR0ZXIuXG4gICAgKiBUaGUgc3RhdGUgZ2V0dGVyIGlzIGEgZnVuY3Rpb24gdGhhdCB0YWtlcyB0aGUgc3RvcmUgYXMgYSBwYXJhbWV0ZXIgYW5kXG4gICAgKiByZXR1cm5zIHRoZSBzdGF0ZSB0aGF0IHNob3VsZCBiZSBwYXNzZWQgdG8gdGhlIGNvbXBvbmVudCdzIGBzZXRTdGF0ZSgpYC5cbiAgICAqIElmIG5vIHN0YXRlIGdldHRlciBpcyBzcGVjaWZpZWQsIHRoZSBkZWZhdWx0IGdldHRlciBpcyB1c2VkLCB3aGljaCBzaW1wbHlcbiAgICAqIHJldHVybnMgdGhlIGVudGlyZSBzdG9yZSBzdGF0ZS5cbiAgICAqXG4gICAgKiBUaGUgc2Vjb25kIGZvcm0gYWNjZXB0cyBhbiBhcnJheSBvZiBzdG9yZSBrZXlzLiBXaXRoIHRoaXMgZm9ybSwgdGhlIHN0YXRlXG4gICAgKiBnZXR0ZXIgaXMgY2FsbGVkIG9uY2Ugd2l0aCBhbiBhcnJheSBvZiBzdG9yZSBpbnN0YW5jZXMgKGluIHRoZSBzYW1lIG9yZGVyXG4gICAgKiBhcyB0aGUgc3RvcmUga2V5cykuIHRoZSBkZWZhdWx0IGdldHRlciBwZXJmb3JtYW5jZSBhIHJlZHVjZSBvbiB0aGUgZW50aXJlXG4gICAgKiBzdGF0ZSBmb3IgZWFjaCBzdG9yZS5cbiAgICAqXG4gICAgKiBUaGUgbGFzdCBmb3JtIGFjY2VwdHMgYW4gb2JqZWN0IG9mIHN0b3JlIGtleXMgbWFwcGVkIHRvIHN0YXRlIGdldHRlcnMuIEFzXG4gICAgKiBhIHNob3J0Y3V0LCB5b3UgY2FuIHBhc3MgYG51bGxgIGFzIGEgc3RhdGUgZ2V0dGVyIHRvIHVzZSB0aGUgZGVmYXVsdFxuICAgICogc3RhdGUgZ2V0dGVyLlxuICAgICpcbiAgICAqIFJldHVybnMgdGhlIGNvbWJpbmVkIGluaXRpYWwgc3RhdGUgb2YgYWxsIHNwZWNpZmllZCBzdG9yZXMuXG4gICAgKlxuICAgICogVGhpcyB3YXkgeW91IGNhbiB3cml0ZSBhbGwgdGhlIGluaXRpYWxpemF0aW9uIGFuZCB1cGRhdGUgbG9naWMgaW4gYSBzaW5nbGVcbiAgICAqIGxvY2F0aW9uLCB3aXRob3V0IGhhdmluZyB0byBtZXNzIHdpdGggYWRkaW5nL3JlbW92aW5nIGxpc3RlbmVycy5cbiAgICAqXG4gICAgKiBAdHlwZSB7c3RyaW5nfGFycmF5fG9iamVjdH0gc3RhdGVHZXR0ZXJNYXAgLSBtYXAgb2Yga2V5cyB0byBnZXR0ZXJzXG4gICAgKiBAcmV0dXJucyB7b2JqZWN0fSBDb21iaW5lZCBpbml0aWFsIHN0YXRlIG9mIHN0b3Jlc1xuICAgICovXG4gIGNvbm5lY3RUb1N0b3JlcyhzdGF0ZUdldHRlck1hcCA9IHt9LCBzdGF0ZUdldHRlciA9IG51bGwpIHtcbiAgICBjb25zdCBmbHV4ID0gdGhpcy5nZXRGbHV4KCk7XG5cbiAgICBjb25zdCBnZXRTdG9yZSA9IChrZXkpID0+IHtcbiAgICAgIGNvbnN0IHN0b3JlID0gZmx1eC5nZXRTdG9yZShrZXkpO1xuXG4gICAgICBpZiAodHlwZW9mIHN0b3JlID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICAgYGNvbm5lY3RUb1N0b3JlcygpOiBTdG9yZSB3aXRoIGtleSAnJHtrZXl9JyBkb2VzIG5vdCBleGlzdC5gXG4gICAgICAgICk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBzdG9yZTtcbiAgICB9O1xuXG4gICAgaWYgKHR5cGVvZiBzdGF0ZUdldHRlck1hcCA9PT0gJ3N0cmluZycpIHtcbiAgICAgIGNvbnN0IGtleSA9IHN0YXRlR2V0dGVyTWFwO1xuICAgICAgY29uc3Qgc3RvcmUgPSBnZXRTdG9yZShrZXkpO1xuICAgICAgY29uc3QgZ2V0dGVyID0gc3RhdGVHZXR0ZXIgfHwgZGVmYXVsdFN0YXRlR2V0dGVyO1xuXG4gICAgICB0aGlzLl9mbHV4U3RhdGVHZXR0ZXJzLnB1c2goeyBzdG9yZXM6IHN0b3JlLCBnZXR0ZXIgfSk7XG4gICAgICBjb25zdCBsaXN0ZW5lciA9IGNyZWF0ZVN0b3JlTGlzdGVuZXIodGhpcywgc3RvcmUsIGdldHRlcik7XG5cbiAgICAgIHN0b3JlLmFkZExpc3RlbmVyKCdjaGFuZ2UnLCBsaXN0ZW5lcik7XG4gICAgICB0aGlzLl9mbHV4TGlzdGVuZXJzW2tleV0gPSBsaXN0ZW5lcjtcbiAgICB9IGVsc2UgaWYgKEFycmF5LmlzQXJyYXkoc3RhdGVHZXR0ZXJNYXApKSB7XG4gICAgICBjb25zdCBzdG9yZXMgPSBzdGF0ZUdldHRlck1hcC5tYXAoZ2V0U3RvcmUpO1xuICAgICAgY29uc3QgZ2V0dGVyID0gc3RhdGVHZXR0ZXIgfHwgZGVmYXVsdFJlZHVjZVN0YXRlR2V0dGVyO1xuXG4gICAgICB0aGlzLl9mbHV4U3RhdGVHZXR0ZXJzLnB1c2goeyBzdG9yZXMsIGdldHRlciB9KTtcbiAgICAgIGNvbnN0IGxpc3RlbmVyID0gY3JlYXRlU3RvcmVMaXN0ZW5lcih0aGlzLCBzdG9yZXMsIGdldHRlcik7XG5cbiAgICAgIHN0YXRlR2V0dGVyTWFwLmZvckVhY2goKGtleSwgaW5kZXgpID0+IHtcbiAgICAgICAgY29uc3Qgc3RvcmUgPSBzdG9yZXNbaW5kZXhdO1xuICAgICAgICBzdG9yZS5hZGRMaXN0ZW5lcignY2hhbmdlJywgbGlzdGVuZXIpO1xuICAgICAgICB0aGlzLl9mbHV4TGlzdGVuZXJzW2tleV0gPSBsaXN0ZW5lcjtcbiAgICAgIH0pO1xuXG4gICAgfSBlbHNlIHtcbiAgICAgICBmb3IgKGxldCBrZXkgaW4gc3RhdGVHZXR0ZXJNYXApIHtcbiAgICAgICAgY29uc3Qgc3RvcmUgPSBnZXRTdG9yZShrZXkpO1xuICAgICAgICBjb25zdCBnZXR0ZXIgPSBzdGF0ZUdldHRlck1hcFtrZXldIHx8IGRlZmF1bHRTdGF0ZUdldHRlcjtcblxuICAgICAgICB0aGlzLl9mbHV4U3RhdGVHZXR0ZXJzLnB1c2goeyBzdG9yZXM6IHN0b3JlLCBnZXR0ZXIgfSk7XG4gICAgICAgIGNvbnN0IGxpc3RlbmVyID0gY3JlYXRlU3RvcmVMaXN0ZW5lcih0aGlzLCBzdG9yZSwgZ2V0dGVyKTtcblxuICAgICAgICBzdG9yZS5hZGRMaXN0ZW5lcignY2hhbmdlJywgbGlzdGVuZXIpO1xuICAgICAgICB0aGlzLl9mbHV4TGlzdGVuZXJzW2tleV0gPSBsaXN0ZW5lcjtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5nZXRTdG9yZVN0YXRlKCk7XG4gIH1cblxufTtcblxuY29uc3Qgc3RhdGljUHJvcGVydGllcyA9IHtcbiAgY29udGV4dFR5cGVzOiB7XG4gICAgZmx1eDogUHJvcFR5cGVzLmluc3RhbmNlT2YoRmx1eCksXG4gIH0sXG5cbiAgY2hpbGRDb250ZXh0VHlwZXM6IHtcbiAgICBmbHV4OiBQcm9wVHlwZXMuaW5zdGFuY2VPZihGbHV4KSxcbiAgfSxcblxuICBwcm9wVHlwZXM6IHtcbiAgICBjb25uZWN0VG9TdG9yZXM6IFByb3BUeXBlcy5vbmVPZlR5cGUoW1xuICAgICAgUHJvcFR5cGVzLnN0cmluZyxcbiAgICAgIFByb3BUeXBlcy5hcnJheU9mKFByb3BUeXBlcy5zdHJpbmcpLFxuICAgICAgUHJvcFR5cGVzLm9iamVjdFxuICAgIF0pLFxuICAgIGZsdXg6IFByb3BUeXBlcy5pbnN0YW5jZU9mKEZsdXgpLFxuICAgIHJlbmRlcjogUmVhY3QuUHJvcFR5cGVzLmZ1bmMsXG4gICAgc3RhdGVHZXR0ZXI6IFJlYWN0LlByb3BUeXBlcy5mdW5jLFxuICB9LFxufTtcblxuZXhwb3J0IHsgaW5zdGFuY2VNZXRob2RzLCBzdGF0aWNQcm9wZXJ0aWVzIH07XG5cbmZ1bmN0aW9uIGNyZWF0ZVN0b3JlTGlzdGVuZXIoY29tcG9uZW50LCBzdG9yZSwgc3RvcmVTdGF0ZUdldHRlcikge1xuICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgY29uc3Qgc3RhdGUgPSBzdG9yZVN0YXRlR2V0dGVyKHN0b3JlLCB0aGlzLnByb3BzKTtcbiAgICB0aGlzLnNldFN0YXRlKHN0YXRlKTtcbiAgfS5iaW5kKGNvbXBvbmVudCk7XG59XG5cbmZ1bmN0aW9uIGRlZmF1bHRTdGF0ZUdldHRlcihzdG9yZSkge1xuICByZXR1cm4gc3RvcmUuZ2V0U3RhdGVBc09iamVjdCgpO1xufVxuXG5mdW5jdGlvbiBkZWZhdWx0UmVkdWNlU3RhdGVHZXR0ZXIoc3RvcmVzKSB7XG4gIHJldHVybiBzdG9yZXMucmVkdWNlKFxuICAgIChyZXN1bHQsIHN0b3JlKSA9PiBhc3NpZ24ocmVzdWx0LCBzdG9yZS5nZXRTdGF0ZUFzT2JqZWN0KCkpLFxuICAgIHt9XG4gICk7XG59XG4iXX0=