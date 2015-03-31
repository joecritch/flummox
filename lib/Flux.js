"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var _applyConstructor = function (Constructor, args) { var instance = Object.create(Constructor.prototype); var result = Constructor.apply(instance, args); return result != null && (typeof result == "object" || typeof result == "function") ? result : instance; };

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * Flux
 *
 * The main Flux class.
 */

var Store = _interopRequire(require("./Store"));

var Actions = _interopRequire(require("./Actions"));

var Dispatcher = require("flux").Dispatcher;

var EventEmitter = _interopRequire(require("eventemitter3"));

var Flux = (function (_EventEmitter) {
  function Flux() {
    _classCallCheck(this, Flux);

    this.dispatcher = new Dispatcher();

    this._stores = {};
    this._actions = {};
  }

  _inherits(Flux, _EventEmitter);

  _createClass(Flux, {
    createStore: {
      value: function createStore(key, _Store) {
        for (var _len = arguments.length, constructorArgs = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
          constructorArgs[_key - 2] = arguments[_key];
        }

        if (!(_Store.prototype instanceof Store)) {
          var className = getClassName(_Store);

          throw new Error("You've attempted to create a store from the class " + className + ", which " + "does not have the base Store class in its prototype chain. Make sure " + ("you're using the `extends` keyword: `class " + className + " extends ") + "Store { ... }`");
        }

        if (this._stores.hasOwnProperty(key) && this._stores[key]) {
          throw new Error("You've attempted to create multiple stores with key " + key + ". Keys must " + "be unique.");
        }

        var store = _applyConstructor(_Store, constructorArgs);
        var token = this.dispatcher.register(store.handler.bind(store));

        store._waitFor = this.waitFor.bind(this);
        store._token = token;
        store._getAllActionIds = this.getAllActionIds.bind(this);

        this._stores[key] = store;

        return store;
      }
    },
    getStore: {
      value: function getStore(key) {
        return this._stores.hasOwnProperty(key) ? this._stores[key] : undefined;
      }
    },
    createActions: {
      value: function createActions(key, _Actions) {
        for (var _len = arguments.length, constructorArgs = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
          constructorArgs[_key - 2] = arguments[_key];
        }

        if (!(_Actions.prototype instanceof Actions) && _Actions !== Actions) {
          var className = getClassName(_Actions);

          throw new Error("You've attempted to create actions from the class " + className + ", which " + "does not have the base Actions class in its prototype chain. Make " + ("sure you're using the `extends` keyword: `class " + className + " ") + "extends Actions { ... }`");
        }

        if (this._actions.hasOwnProperty(key) && this._actions[key]) {
          throw new Error("You've attempted to create multiple actions with key " + key + ". Keys " + "must be unique.");
        }

        var actions = _applyConstructor(_Actions, constructorArgs);
        actions.dispatch = this.dispatch.bind(this);
        actions.dispatchAsync = this.dispatchAsync.bind(this);

        this._actions[key] = actions;

        return actions;
      }
    },
    getActions: {
      value: function getActions(key) {
        return this._actions.hasOwnProperty(key) ? this._actions[key] : undefined;
      }
    },
    getActionIds: {
      value: function getActionIds(key) {
        var actions = this.getActions(key);

        if (!actions) {
          return;
        }return actions.getConstants();
      }
    },
    getAllActionIds: {
      value: function getAllActionIds() {
        var actionIds = [];

        for (var key in this._actions) {
          if (!this._actions.hasOwnProperty(key)) continue;

          var actionConstants = this._actions[key].getConstants();

          actionIds = actionIds.concat(getValues(actionConstants));
        }

        return actionIds;
      }
    },
    dispatch: {
      value: function dispatch(actionId, body) {
        this._dispatch({ actionId: actionId, body: body });
      }
    },
    dispatchAsync: {
      value: function dispatchAsync(actionId, promise, actionArgs) {
        var _this = this;

        var payload = {
          actionId: actionId,
          async: "begin" };

        if (actionArgs) payload.actionArgs = actionArgs;

        this._dispatch(payload);

        return promise.then(function (body) {
          _this._dispatch({
            actionId: actionId,
            body: body,
            async: "success"
          });

          return body;
        }, function (error) {
          _this._dispatch({
            actionId: actionId,
            error: error,
            actionArgs: actionArgs,
            async: "failure" });

          return Promise.reject(error);
        })["catch"](function (error) {
          _this.emit("error", error);

          return Promise.reject(error);
        });
      }
    },
    _dispatch: {
      value: function _dispatch(payload) {
        this.dispatcher.dispatch(payload);
        this.emit("dispatch", payload);
      }
    },
    waitFor: {
      value: function waitFor(tokensOrStores) {

        if (!Array.isArray(tokensOrStores)) tokensOrStores = [tokensOrStores];

        var ensureIsToken = function (tokenOrStore) {
          return tokenOrStore instanceof Store ? tokenOrStore._token : tokenOrStore;
        };

        var tokens = tokensOrStores.map(ensureIsToken);

        this.dispatcher.waitFor(tokens);
      }
    },
    removeAllStoreListeners: {
      value: function removeAllStoreListeners(event) {
        for (var key in this._stores) {
          if (!this._stores.hasOwnProperty(key)) continue;

          var store = this._stores[key];

          store.removeAllListeners(event);
        }
      }
    },
    serialize: {
      value: function serialize() {
        var stateTree = {};

        for (var key in this._stores) {
          if (!this._stores.hasOwnProperty(key)) continue;

          var store = this._stores[key];

          var serialize = store.constructor.serialize;

          if (typeof serialize !== "function") continue;

          var serializedStoreState = serialize(store.state);

          if (typeof serializedStoreState !== "string") {
            var className = store.constructor.name;

            if (process.env.NODE_ENV !== "production") {
              console.warn("The store with key '" + key + "' was not serialized because the static " + ("method `" + className + ".serialize()` returned a non-string with type ") + ("'" + typeof serializedStoreState + "'."));
            }
          }

          stateTree[key] = serializedStoreState;

          if (typeof store.constructor.deserialize !== "function") {
            var className = store.constructor.name;

            if (process.env.NODE_ENV !== "production") {
              console.warn("The class `" + className + "` has a `serialize()` method, but no " + "corresponding `deserialize()` method.");
            }
          }
        }

        return JSON.stringify(stateTree);
      }
    },
    deserialize: {
      value: function deserialize(serializedState) {
        var stateMap = undefined;

        try {
          stateMap = JSON.parse(serializedState);
        } catch (error) {
          var className = this.constructor.name;

          if (process.env.NODE_ENV !== "production") {
            throw new Error("Invalid value passed to `" + className + "#deserialize()`: " + ("" + serializedState));
          }
        }

        for (var key in this._stores) {
          if (!this._stores.hasOwnProperty(key)) continue;

          var store = this._stores[key];

          var deserialize = store.constructor.deserialize;

          if (typeof deserialize !== "function") continue;

          var storeStateString = stateMap[key];
          var storeState = deserialize(storeStateString);

          store.replaceState(storeState);

          if (typeof store.constructor.serialize !== "function") {
            var className = store.constructor.name;

            if (process.env.NODE_ENV !== "production") {
              console.warn("The class `" + className + "` has a `deserialize()` method, but no " + "corresponding `serialize()` method.");
            }
          }
        }
      }
    }
  });

  return Flux;
})(EventEmitter);

exports["default"] = Flux;

// Aliases
Flux.prototype.getConstants = Flux.prototype.getActionIds;
Flux.prototype.getAllConstants = Flux.prototype.getAllActionIds;
Flux.prototype.dehydrate = Flux.prototype.serialize;
Flux.prototype.hydrate = Flux.prototype.deserialize;

function getClassName(Class) {
  return Class.prototype.constructor.name;
}

function getValues(object) {
  var values = [];

  for (var key in object) {
    if (!object.hasOwnProperty(key)) continue;

    values.push(object[key]);
  }

  return values;
}

var Flummox = Flux;

exports.Flux = Flux;
exports.Flummox = Flummox;
exports.Store = Store;
exports.Actions = Actions;