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
//# sourceMappingURL=data:application/json;base64,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MUQsSUFBSSxDQUFDLFNBQVMsQ0FBQyxlQUFlLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxlQUFlLENBQUM7QUFDaEUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxTQUFTLENBQUM7QUFDcEQsSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxXQUFXLENBQUM7O0FBRXBELFNBQVMsWUFBWSxDQUFDLEtBQUssRUFBRTtBQUMzQixTQUFPLEtBQUssQ0FBQyxTQUFTLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQztDQUN6Qzs7QUFFRCxTQUFTLFNBQVMsQ0FBQyxNQUFNLEVBQUU7QUFDekIsTUFBSSxNQUFNLEdBQUcsRUFBRSxDQUFDOztBQUVoQixPQUFLLElBQUksR0FBRyxJQUFJLE1BQU0sRUFBRTtBQUN0QixRQUFJLENBQUMsTUFBTSxDQUFDLGNBQWMsQ0FBQyxHQUFHLENBQUMsRUFBRSxTQUFTOztBQUUxQyxVQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO0dBQzFCOztBQUVELFNBQU8sTUFBTSxDQUFDO0NBQ2Y7O0FBRUQsSUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDOztRQUduQixJQUFJLEdBQUosSUFBSTtRQUNKLE9BQU8sR0FBUCxPQUFPO1FBQ1AsS0FBSyxHQUFMLEtBQUs7UUFDTCxPQUFPLEdBQVAsT0FBTyIsImZpbGUiOiJzcmMvRmx1eC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogRmx1eFxuICpcbiAqIFRoZSBtYWluIEZsdXggY2xhc3MuXG4gKi9cblxuaW1wb3J0IFN0b3JlIGZyb20gJy4vU3RvcmUnO1xuaW1wb3J0IEFjdGlvbnMgZnJvbSAnLi9BY3Rpb25zJztcbmltcG9ydCB7IERpc3BhdGNoZXIgfSBmcm9tICdmbHV4JztcbmltcG9ydCBFdmVudEVtaXR0ZXIgZnJvbSAnZXZlbnRlbWl0dGVyMyc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEZsdXggZXh0ZW5kcyBFdmVudEVtaXR0ZXIge1xuXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuZGlzcGF0Y2hlciA9IG5ldyBEaXNwYXRjaGVyKCk7XG5cbiAgICB0aGlzLl9zdG9yZXMgPSB7fTtcbiAgICB0aGlzLl9hY3Rpb25zID0ge307XG4gIH1cblxuICBjcmVhdGVTdG9yZShrZXksIF9TdG9yZSwgLi4uY29uc3RydWN0b3JBcmdzKSB7XG5cbiAgICBpZiAoIShfU3RvcmUucHJvdG90eXBlIGluc3RhbmNlb2YgU3RvcmUpKSB7XG4gICAgICBjb25zdCBjbGFzc05hbWUgPSBnZXRDbGFzc05hbWUoX1N0b3JlKTtcblxuICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICBgWW91J3ZlIGF0dGVtcHRlZCB0byBjcmVhdGUgYSBzdG9yZSBmcm9tIHRoZSBjbGFzcyAke2NsYXNzTmFtZX0sIHdoaWNoIGBcbiAgICAgICsgYGRvZXMgbm90IGhhdmUgdGhlIGJhc2UgU3RvcmUgY2xhc3MgaW4gaXRzIHByb3RvdHlwZSBjaGFpbi4gTWFrZSBzdXJlIGBcbiAgICAgICsgYHlvdSdyZSB1c2luZyB0aGUgXFxgZXh0ZW5kc1xcYCBrZXl3b3JkOiBcXGBjbGFzcyAke2NsYXNzTmFtZX0gZXh0ZW5kcyBgXG4gICAgICArIGBTdG9yZSB7IC4uLiB9XFxgYFxuICAgICAgKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5fc3RvcmVzLmhhc093blByb3BlcnR5KGtleSkgJiYgdGhpcy5fc3RvcmVzW2tleV0pIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgYFlvdSd2ZSBhdHRlbXB0ZWQgdG8gY3JlYXRlIG11bHRpcGxlIHN0b3JlcyB3aXRoIGtleSAke2tleX0uIEtleXMgbXVzdCBgXG4gICAgICArIGBiZSB1bmlxdWUuYFxuICAgICAgKTtcbiAgICB9XG5cbiAgICBjb25zdCBzdG9yZSA9IG5ldyBfU3RvcmUoLi4uY29uc3RydWN0b3JBcmdzKTtcbiAgICBjb25zdCB0b2tlbiA9IHRoaXMuZGlzcGF0Y2hlci5yZWdpc3RlcihzdG9yZS5oYW5kbGVyLmJpbmQoc3RvcmUpKTtcblxuICAgIHN0b3JlLl93YWl0Rm9yID0gdGhpcy53YWl0Rm9yLmJpbmQodGhpcyk7XG4gICAgc3RvcmUuX3Rva2VuID0gdG9rZW47XG4gICAgc3RvcmUuX2dldEFsbEFjdGlvbklkcyA9IHRoaXMuZ2V0QWxsQWN0aW9uSWRzLmJpbmQodGhpcyk7XG5cbiAgICB0aGlzLl9zdG9yZXNba2V5XSA9IHN0b3JlO1xuXG4gICAgcmV0dXJuIHN0b3JlO1xuICB9XG5cbiAgZ2V0U3RvcmUoa2V5KSB7XG4gICAgcmV0dXJuIHRoaXMuX3N0b3Jlcy5oYXNPd25Qcm9wZXJ0eShrZXkpID8gdGhpcy5fc3RvcmVzW2tleV0gOiB1bmRlZmluZWQ7XG4gIH1cblxuICBjcmVhdGVBY3Rpb25zKGtleSwgX0FjdGlvbnMsIC4uLmNvbnN0cnVjdG9yQXJncykge1xuXG4gICAgaWYgKCEoX0FjdGlvbnMucHJvdG90eXBlIGluc3RhbmNlb2YgQWN0aW9ucykgJiYgX0FjdGlvbnMgIT09IEFjdGlvbnMpIHtcbiAgICAgIGNvbnN0IGNsYXNzTmFtZSA9IGdldENsYXNzTmFtZShfQWN0aW9ucyk7XG5cbiAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgYFlvdSd2ZSBhdHRlbXB0ZWQgdG8gY3JlYXRlIGFjdGlvbnMgZnJvbSB0aGUgY2xhc3MgJHtjbGFzc05hbWV9LCB3aGljaCBgXG4gICAgICArIGBkb2VzIG5vdCBoYXZlIHRoZSBiYXNlIEFjdGlvbnMgY2xhc3MgaW4gaXRzIHByb3RvdHlwZSBjaGFpbi4gTWFrZSBgXG4gICAgICArIGBzdXJlIHlvdSdyZSB1c2luZyB0aGUgXFxgZXh0ZW5kc1xcYCBrZXl3b3JkOiBcXGBjbGFzcyAke2NsYXNzTmFtZX0gYFxuICAgICAgKyBgZXh0ZW5kcyBBY3Rpb25zIHsgLi4uIH1cXGBgXG4gICAgICApO1xuICAgIH1cblxuICAgIGlmICh0aGlzLl9hY3Rpb25zLmhhc093blByb3BlcnR5KGtleSkgJiYgdGhpcy5fYWN0aW9uc1trZXldKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgIGBZb3UndmUgYXR0ZW1wdGVkIHRvIGNyZWF0ZSBtdWx0aXBsZSBhY3Rpb25zIHdpdGgga2V5ICR7a2V5fS4gS2V5cyBgXG4gICAgICArIGBtdXN0IGJlIHVuaXF1ZS5gXG4gICAgICApO1xuICAgIH1cblxuICAgIGNvbnN0IGFjdGlvbnMgPSBuZXcgX0FjdGlvbnMoLi4uY29uc3RydWN0b3JBcmdzKTtcbiAgICBhY3Rpb25zLmRpc3BhdGNoID0gdGhpcy5kaXNwYXRjaC5iaW5kKHRoaXMpO1xuICAgIGFjdGlvbnMuZGlzcGF0Y2hBc3luYyA9IHRoaXMuZGlzcGF0Y2hBc3luYy5iaW5kKHRoaXMpO1xuXG4gICAgdGhpcy5fYWN0aW9uc1trZXldID0gYWN0aW9ucztcblxuICAgIHJldHVybiBhY3Rpb25zO1xuICB9XG5cbiAgZ2V0QWN0aW9ucyhrZXkpIHtcbiAgICByZXR1cm4gdGhpcy5fYWN0aW9ucy5oYXNPd25Qcm9wZXJ0eShrZXkpID8gdGhpcy5fYWN0aW9uc1trZXldIDogdW5kZWZpbmVkO1xuICB9XG5cbiAgZ2V0QWN0aW9uSWRzKGtleSkge1xuICAgIGNvbnN0IGFjdGlvbnMgPSB0aGlzLmdldEFjdGlvbnMoa2V5KTtcblxuICAgIGlmICghYWN0aW9ucykgcmV0dXJuO1xuXG4gICAgcmV0dXJuIGFjdGlvbnMuZ2V0Q29uc3RhbnRzKCk7XG4gIH1cblxuICBnZXRBbGxBY3Rpb25JZHMoKSB7XG4gICAgbGV0IGFjdGlvbklkcyA9IFtdO1xuXG4gICAgZm9yIChsZXQga2V5IGluIHRoaXMuX2FjdGlvbnMpIHtcbiAgICAgIGlmICghdGhpcy5fYWN0aW9ucy5oYXNPd25Qcm9wZXJ0eShrZXkpKSBjb250aW51ZTtcblxuICAgICAgY29uc3QgYWN0aW9uQ29uc3RhbnRzID0gdGhpcy5fYWN0aW9uc1trZXldLmdldENvbnN0YW50cygpO1xuXG4gICAgICBhY3Rpb25JZHMgPSBhY3Rpb25JZHMuY29uY2F0KGdldFZhbHVlcyhhY3Rpb25Db25zdGFudHMpKTtcbiAgICB9XG5cbiAgICByZXR1cm4gYWN0aW9uSWRzO1xuICB9XG5cbiAgZGlzcGF0Y2goYWN0aW9uSWQsIGJvZHkpIHtcbiAgICB0aGlzLl9kaXNwYXRjaCh7IGFjdGlvbklkLCBib2R5IH0pO1xuICB9XG5cbiAgZGlzcGF0Y2hBc3luYyhhY3Rpb25JZCwgcHJvbWlzZSwgYWN0aW9uQXJncykge1xuICAgIGNvbnN0IHBheWxvYWQgPSB7XG4gICAgICBhY3Rpb25JZCxcbiAgICAgIGFzeW5jOiAnYmVnaW4nLFxuICAgIH07XG5cbiAgICBpZiAoYWN0aW9uQXJncykgcGF5bG9hZC5hY3Rpb25BcmdzID0gYWN0aW9uQXJncztcblxuICAgIHRoaXMuX2Rpc3BhdGNoKHBheWxvYWQpO1xuXG4gICAgcmV0dXJuIHByb21pc2VcbiAgICAgIC50aGVuKFxuICAgICAgICBib2R5ID0+IHtcbiAgICAgICAgICB0aGlzLl9kaXNwYXRjaCh7XG4gICAgICAgICAgICBhY3Rpb25JZCxcbiAgICAgICAgICAgIGJvZHksXG4gICAgICAgICAgICBhc3luYzogJ3N1Y2Nlc3MnXG4gICAgICAgICAgfSk7XG5cbiAgICAgICAgICByZXR1cm4gYm9keTtcbiAgICAgICAgfSxcbiAgICAgICAgZXJyb3IgPT4ge1xuICAgICAgICAgIHRoaXMuX2Rpc3BhdGNoKHtcbiAgICAgICAgICAgIGFjdGlvbklkLFxuICAgICAgICAgICAgZXJyb3IsXG4gICAgICAgICAgICBhY3Rpb25BcmdzOiBhY3Rpb25BcmdzLFxuICAgICAgICAgICAgYXN5bmM6ICdmYWlsdXJlJyxcbiAgICAgICAgICB9KTtcblxuICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChlcnJvcik7XG4gICAgICAgIH1cbiAgICAgIClcbiAgICAgIC5jYXRjaChlcnJvciA9PiB7XG4gICAgICAgIHRoaXMuZW1pdCgnZXJyb3InLCBlcnJvcik7XG5cbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KGVycm9yKTtcbiAgICAgIH0pO1xuICB9XG5cbiAgX2Rpc3BhdGNoKHBheWxvYWQpIHtcbiAgICB0aGlzLmRpc3BhdGNoZXIuZGlzcGF0Y2gocGF5bG9hZCk7XG4gICAgdGhpcy5lbWl0KCdkaXNwYXRjaCcsIHBheWxvYWQpO1xuICB9XG5cbiAgd2FpdEZvcih0b2tlbnNPclN0b3Jlcykge1xuXG4gICAgaWYgKCFBcnJheS5pc0FycmF5KHRva2Vuc09yU3RvcmVzKSkgdG9rZW5zT3JTdG9yZXMgPSBbdG9rZW5zT3JTdG9yZXNdO1xuXG4gICAgY29uc3QgZW5zdXJlSXNUb2tlbiA9IHRva2VuT3JTdG9yZSA9PiB7XG4gICAgICByZXR1cm4gdG9rZW5PclN0b3JlIGluc3RhbmNlb2YgU3RvcmVcbiAgICAgICAgPyB0b2tlbk9yU3RvcmUuX3Rva2VuXG4gICAgICAgIDogdG9rZW5PclN0b3JlO1xuICAgIH07XG5cbiAgICBjb25zdCB0b2tlbnMgPSB0b2tlbnNPclN0b3Jlcy5tYXAoZW5zdXJlSXNUb2tlbik7XG5cbiAgICB0aGlzLmRpc3BhdGNoZXIud2FpdEZvcih0b2tlbnMpO1xuICB9XG5cbiAgcmVtb3ZlQWxsU3RvcmVMaXN0ZW5lcnMoZXZlbnQpIHtcbiAgICBmb3IgKGxldCBrZXkgaW4gdGhpcy5fc3RvcmVzKSB7XG4gICAgICBpZiAoIXRoaXMuX3N0b3Jlcy5oYXNPd25Qcm9wZXJ0eShrZXkpKSBjb250aW51ZTtcblxuICAgICAgY29uc3Qgc3RvcmUgPSB0aGlzLl9zdG9yZXNba2V5XTtcblxuICAgICAgc3RvcmUucmVtb3ZlQWxsTGlzdGVuZXJzKGV2ZW50KTtcbiAgICB9XG4gIH1cblxuICBzZXJpYWxpemUoKSB7XG4gICAgY29uc3Qgc3RhdGVUcmVlID0ge307XG5cbiAgICBmb3IgKGxldCBrZXkgaW4gdGhpcy5fc3RvcmVzKSB7XG4gICAgICBpZiAoIXRoaXMuX3N0b3Jlcy5oYXNPd25Qcm9wZXJ0eShrZXkpKSBjb250aW51ZTtcblxuICAgICAgY29uc3Qgc3RvcmUgPSB0aGlzLl9zdG9yZXNba2V5XTtcblxuICAgICAgY29uc3Qgc2VyaWFsaXplID0gc3RvcmUuY29uc3RydWN0b3Iuc2VyaWFsaXplO1xuXG4gICAgICBpZiAodHlwZW9mIHNlcmlhbGl6ZSAhPT0gJ2Z1bmN0aW9uJykgY29udGludWU7XG5cbiAgICAgIGNvbnN0IHNlcmlhbGl6ZWRTdG9yZVN0YXRlID0gc2VyaWFsaXplKHN0b3JlLnN0YXRlKTtcblxuICAgICAgaWYgKHR5cGVvZiBzZXJpYWxpemVkU3RvcmVTdGF0ZSAhPT0gJ3N0cmluZycpIHtcbiAgICAgICAgY29uc3QgY2xhc3NOYW1lID0gc3RvcmUuY29uc3RydWN0b3IubmFtZTtcblxuICAgICAgICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykge1xuICAgICAgICAgIGNvbnNvbGUud2FybihcbiAgICAgICAgICAgIGBUaGUgc3RvcmUgd2l0aCBrZXkgJyR7a2V5fScgd2FzIG5vdCBzZXJpYWxpemVkIGJlY2F1c2UgdGhlIHN0YXRpYyBgXG4gICAgICAgICAgKyBgbWV0aG9kIFxcYCR7Y2xhc3NOYW1lfS5zZXJpYWxpemUoKVxcYCByZXR1cm5lZCBhIG5vbi1zdHJpbmcgd2l0aCB0eXBlIGBcbiAgICAgICAgICArIGAnJHt0eXBlb2Ygc2VyaWFsaXplZFN0b3JlU3RhdGV9Jy5gXG4gICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBzdGF0ZVRyZWVba2V5XSA9IHNlcmlhbGl6ZWRTdG9yZVN0YXRlO1xuXG4gICAgICBpZiAodHlwZW9mIHN0b3JlLmNvbnN0cnVjdG9yLmRlc2VyaWFsaXplICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIGNvbnN0IGNsYXNzTmFtZSA9IHN0b3JlLmNvbnN0cnVjdG9yLm5hbWU7XG5cbiAgICAgICAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpIHtcbiAgICAgICAgICBjb25zb2xlLndhcm4oXG4gICAgICAgICAgICBgVGhlIGNsYXNzIFxcYCR7Y2xhc3NOYW1lfVxcYCBoYXMgYSBcXGBzZXJpYWxpemUoKVxcYCBtZXRob2QsIGJ1dCBubyBgXG4gICAgICAgICAgKyBgY29ycmVzcG9uZGluZyBcXGBkZXNlcmlhbGl6ZSgpXFxgIG1ldGhvZC5gXG4gICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgfVxuXG4gICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KHN0YXRlVHJlZSk7XG4gIH1cblxuICBkZXNlcmlhbGl6ZShzZXJpYWxpemVkU3RhdGUpIHtcbiAgICBsZXQgc3RhdGVNYXA7XG5cbiAgICB0cnkge1xuICAgICAgc3RhdGVNYXAgPSBKU09OLnBhcnNlKHNlcmlhbGl6ZWRTdGF0ZSk7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIGNvbnN0IGNsYXNzTmFtZSA9IHRoaXMuY29uc3RydWN0b3IubmFtZTtcblxuICAgICAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICAgIGBJbnZhbGlkIHZhbHVlIHBhc3NlZCB0byBcXGAke2NsYXNzTmFtZX0jZGVzZXJpYWxpemUoKVxcYDogYFxuICAgICAgICArIGAke3NlcmlhbGl6ZWRTdGF0ZX1gXG4gICAgICAgICk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgZm9yIChsZXQga2V5IGluIHRoaXMuX3N0b3Jlcykge1xuICAgICAgaWYgKCF0aGlzLl9zdG9yZXMuaGFzT3duUHJvcGVydHkoa2V5KSkgY29udGludWU7XG5cbiAgICAgIGNvbnN0IHN0b3JlID0gdGhpcy5fc3RvcmVzW2tleV07XG5cbiAgICAgIGNvbnN0IGRlc2VyaWFsaXplID0gc3RvcmUuY29uc3RydWN0b3IuZGVzZXJpYWxpemU7XG5cbiAgICAgIGlmICh0eXBlb2YgZGVzZXJpYWxpemUgIT09ICdmdW5jdGlvbicpIGNvbnRpbnVlO1xuXG4gICAgICBjb25zdCBzdG9yZVN0YXRlU3RyaW5nID0gc3RhdGVNYXBba2V5XTtcbiAgICAgIGNvbnN0IHN0b3JlU3RhdGUgPSBkZXNlcmlhbGl6ZShzdG9yZVN0YXRlU3RyaW5nKTtcblxuICAgICAgc3RvcmUucmVwbGFjZVN0YXRlKHN0b3JlU3RhdGUpO1xuXG4gICAgICBpZiAodHlwZW9mIHN0b3JlLmNvbnN0cnVjdG9yLnNlcmlhbGl6ZSAhPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICBjb25zdCBjbGFzc05hbWUgPSBzdG9yZS5jb25zdHJ1Y3Rvci5uYW1lO1xuXG4gICAgICAgIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSB7XG4gICAgICAgICAgY29uc29sZS53YXJuKFxuICAgICAgICAgICAgYFRoZSBjbGFzcyBcXGAke2NsYXNzTmFtZX1cXGAgaGFzIGEgXFxgZGVzZXJpYWxpemUoKVxcYCBtZXRob2QsIGJ1dCBubyBgXG4gICAgICAgICAgKyBgY29ycmVzcG9uZGluZyBcXGBzZXJpYWxpemUoKVxcYCBtZXRob2QuYFxuICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxufVxuXG4vLyBBbGlhc2VzXG5GbHV4LnByb3RvdHlwZS5nZXRDb25zdGFudHMgPSBGbHV4LnByb3RvdHlwZS5nZXRBY3Rpb25JZHM7XG5GbHV4LnByb3RvdHlwZS5nZXRBbGxDb25zdGFudHMgPSBGbHV4LnByb3RvdHlwZS5nZXRBbGxBY3Rpb25JZHM7XG5GbHV4LnByb3RvdHlwZS5kZWh5ZHJhdGUgPSBGbHV4LnByb3RvdHlwZS5zZXJpYWxpemU7XG5GbHV4LnByb3RvdHlwZS5oeWRyYXRlID0gRmx1eC5wcm90b3R5cGUuZGVzZXJpYWxpemU7XG5cbmZ1bmN0aW9uIGdldENsYXNzTmFtZShDbGFzcykge1xuICByZXR1cm4gQ2xhc3MucHJvdG90eXBlLmNvbnN0cnVjdG9yLm5hbWU7XG59XG5cbmZ1bmN0aW9uIGdldFZhbHVlcyhvYmplY3QpIHtcbiAgbGV0IHZhbHVlcyA9IFtdO1xuXG4gIGZvciAobGV0IGtleSBpbiBvYmplY3QpIHtcbiAgICBpZiAoIW9iamVjdC5oYXNPd25Qcm9wZXJ0eShrZXkpKSBjb250aW51ZTtcblxuICAgIHZhbHVlcy5wdXNoKG9iamVjdFtrZXldKTtcbiAgfVxuXG4gIHJldHVybiB2YWx1ZXM7XG59XG5cbmNvbnN0IEZsdW1tb3ggPSBGbHV4O1xuXG5leHBvcnQge1xuICBGbHV4LFxuICBGbHVtbW94LFxuICBTdG9yZSxcbiAgQWN0aW9ucyxcbn07XG4iXX0=