var Flummox =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

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
	
	var Store = _interopRequire(__webpack_require__(1));
	
	var Actions = _interopRequire(__webpack_require__(2));
	
	var Dispatcher = __webpack_require__(3).Dispatcher;
	
	var EventEmitter = _interopRequire(__webpack_require__(4));
	
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
	
	            if ((undefined) !== "production") {
	              console.warn("The store with key '" + key + "' was not serialized because the static " + ("method `" + className + ".serialize()` returned a non-string with type ") + ("'" + typeof serializedStoreState + "'."));
	            }
	          }
	
	          stateTree[key] = serializedStoreState;
	
	          if (typeof store.constructor.deserialize !== "function") {
	            var className = store.constructor.name;
	
	            if ((undefined) !== "production") {
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
	
	          if ((undefined) !== "production") {
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
	
	            if ((undefined) !== "production") {
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

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };
	
	var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();
	
	var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };
	
	var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };
	
	/**
	 * Store
	 *
	 * Stores hold application state. They respond to actions sent by the dispatcher
	 * and broadcast change events to listeners, so they can grab the latest data.
	 * The key thing to remember is that the only way stores receive information
	 * from the outside world is via the dispatcher.
	 */
	
	var EventEmitter = _interopRequire(__webpack_require__(4));
	
	var assign = _interopRequire(__webpack_require__(5));
	
	var Store = (function (_EventEmitter) {
	
	  /**
	   * Stores are initialized with a reference
	   * @type {Object}
	   */
	
	  function Store() {
	    _classCallCheck(this, Store);
	
	    this.state = null;
	
	    this._handlers = {};
	    this._asyncHandlers = {};
	    this._catchAllHandlers = [];
	    this._catchAllAsyncHandlers = {
	      begin: [],
	      success: [],
	      failure: [] };
	  }
	
	  _inherits(Store, _EventEmitter);
	
	  _createClass(Store, {
	    setState: {
	      value: function setState(newState) {
	        // Do a transactional state update if a function is passed
	        if (typeof newState === "function") {
	          var prevState = this._isHandlingDispatch ? this._pendingState : this.state;
	
	          newState = newState(prevState);
	        }
	
	        if (this._isHandlingDispatch) {
	          this._pendingState = this._assignState(this._pendingState, newState);
	          this._emitChangeAfterHandlingDispatch = true;
	        } else {
	          this.state = this._assignState(this.state, newState);
	          this.emit("change");
	        }
	      }
	    },
	    replaceState: {
	      value: function replaceState(newState) {
	        if (this._isHandlingDispatch) {
	          this._pendingState = this._assignState(undefined, newState);
	          this._emitChangeAfterHandlingDispatch = true;
	        } else {
	          this.state = this._assignState(undefined, newState);
	          this.emit("change");
	        }
	      }
	    },
	    getStateAsObject: {
	      value: function getStateAsObject() {
	        return this.state;
	      }
	    },
	    _assignState: {
	      value: function _assignState() {
	        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
	          args[_key] = arguments[_key];
	        }
	
	        return (this.constructor.assignState || Store.assignState).apply(undefined, args);
	      }
	    },
	    forceUpdate: {
	      value: function forceUpdate() {
	        if (this._isHandlingDispatch) {
	          this._emitChangeAfterHandlingDispatch = true;
	        } else {
	          this.emit("change");
	        }
	      }
	    },
	    register: {
	      value: function register(actionId, handler) {
	        actionId = ensureActionId(actionId);
	
	        if (typeof handler !== "function") {
	          return;
	        }this._handlers[actionId] = handler.bind(this);
	      }
	    },
	    registerAsync: {
	      value: function registerAsync(actionId, beginHandler, successHandler, failureHandler) {
	        actionId = ensureActionId(actionId);
	
	        var asyncHandlers = this._bindAsyncHandlers({
	          begin: beginHandler,
	          success: successHandler,
	          failure: failureHandler });
	
	        this._asyncHandlers[actionId] = asyncHandlers;
	      }
	    },
	    registerAll: {
	      value: function registerAll(handler) {
	        if (typeof handler !== "function") {
	          return;
	        }this._catchAllHandlers.push(handler.bind(this));
	      }
	    },
	    registerAllAsync: {
	      value: function registerAllAsync(beginHandler, successHandler, failureHandler) {
	        var _this = this;
	
	        var asyncHandlers = this._bindAsyncHandlers({
	          begin: beginHandler,
	          success: successHandler,
	          failure: failureHandler });
	
	        Object.keys(asyncHandlers).forEach(function (key) {
	          _this._catchAllAsyncHandlers[key].push(asyncHandlers[key]);
	        });
	      }
	    },
	    _bindAsyncHandlers: {
	      value: function _bindAsyncHandlers(asyncHandlers) {
	        for (var key in asyncHandlers) {
	          if (!asyncHandlers.hasOwnProperty(key)) continue;
	
	          var handler = asyncHandlers[key];
	
	          if (typeof handler === "function") {
	            asyncHandlers[key] = handler.bind(this);
	          } else {
	            delete asyncHandlers[key];
	          }
	        }
	
	        return asyncHandlers;
	      }
	    },
	    waitFor: {
	      value: function waitFor(tokensOrStores) {
	        this._waitFor(tokensOrStores);
	      }
	    },
	    handler: {
	      value: function handler(payload) {
	        var body = payload.body;
	        var actionId = payload.actionId;
	        var _async = payload.async;
	        var actionArgs = payload.actionArgs;
	        var error = payload.error;
	
	        var _allHandlers = this._catchAllHandlers;
	        var _handler = this._handlers[actionId];
	
	        var _allAsyncHandlers = this._catchAllAsyncHandlers[_async];
	        var _asyncHandler = this._asyncHandlers[actionId] && this._asyncHandlers[actionId][_async];
	
	        if (_async) {
	          var beginOrFailureHandlers = _allAsyncHandlers.concat([_asyncHandler]);
	
	          switch (_async) {
	            case "begin":
	              this._performHandler(beginOrFailureHandlers, actionArgs);
	              return;
	            case "failure":
	              this._performHandler(beginOrFailureHandlers, [error.concat(actionArgs)]);
	              return;
	            case "success":
	              this._performHandler(_allAsyncHandlers.concat([_asyncHandler || _handler]), [body]);
	              return;
	            default:
	              return;
	          }
	        }
	
	        this._performHandler(_allHandlers.concat([_handler]), [body]);
	      }
	    },
	    _performHandler: {
	      value: function _performHandler(_handlers, args) {
	        this._isHandlingDispatch = true;
	        this._pendingState = this._assignState(undefined, this.state);
	        this._emitChangeAfterHandlingDispatch = false;
	
	        try {
	          this._performHandlers(_handlers, args);
	        } finally {
	          if (this._emitChangeAfterHandlingDispatch) {
	            this.state = this._pendingState;
	            this.emit("change");
	          }
	
	          this._isHandlingDispatch = false;
	          this._pendingState = undefined;
	          this._emitChangeAfterHandlingDispatch = false;
	        }
	      }
	    },
	    _performHandlers: {
	      value: function _performHandlers(_handlers, args) {
	        _handlers.forEach((function (_handler) {
	          if (typeof _handler !== "function") return;
	          _handler.apply(this, args);
	        }).bind(this));
	      }
	    }
	  }, {
	    assignState: {
	      value: function assignState(oldState, newState) {
	        return assign({}, oldState, newState);
	      }
	    }
	  });
	
	  return Store;
	})(EventEmitter);
	
	module.exports = Store;
	
	function ensureActionId(actionOrActionId) {
	  return typeof actionOrActionId === "function" ? actionOrActionId._id : actionOrActionId;
	}

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };
	
	var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();
	
	var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };
	
	/**
	 * Actions
	 *
	 * Instances of the Actions class represent a set of actions. (In Flux parlance,
	 * these might be more accurately denoted as Action Creators, while Action
	 * refers to the payload sent to the dispatcher, but this is... confusing. We
	 * will use Action to mean the function you call to trigger a dispatch.)
	 *
	 * Create actions by extending from the base Actions class and adding methods.
	 * All methods on the prototype (except the constructor) will be
	 * converted into actions. The return value of an action is used as the body
	 * of the payload sent to the dispatcher.
	 */
	
	var uniqueId = _interopRequire(__webpack_require__(6));
	
	var Actions = (function () {
	  function Actions() {
	    _classCallCheck(this, Actions);
	
	    this._baseId = uniqueId();
	
	    var methodNames = this._getActionMethodNames();
	    for (var i = 0; i < methodNames.length; i++) {
	      var methodName = methodNames[i];
	      this._wrapAction(methodName);
	    }
	
	    this.getConstants = this.getActionIds;
	  }
	
	  _createClass(Actions, {
	    getActionIds: {
	      value: function getActionIds() {
	        var _this = this;
	
	        return this._getActionMethodNames().reduce(function (result, actionName) {
	          result[actionName] = _this[actionName]._id;
	          return result;
	        }, {});
	      }
	    },
	    _getActionMethodNames: {
	      value: function _getActionMethodNames(instance) {
	        var _this = this;
	
	        return Object.getOwnPropertyNames(this.constructor.prototype).filter(function (name) {
	          return name !== "constructor" && typeof _this[name] === "function";
	        });
	      }
	    },
	    _wrapAction: {
	      value: function _wrapAction(methodName) {
	        var _this = this;
	
	        var originalMethod = this[methodName];
	        var actionId = this._createActionId(methodName);
	
	        var action = function () {
	          for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
	            args[_key] = arguments[_key];
	          }
	
	          var body = originalMethod.apply(_this, args);
	
	          if (isPromise(body)) {
	            var promise = body;
	            _this._dispatchAsync(actionId, promise, args, methodName)
	            // Catch errors and do nothing
	            // They can be handled by store or caller
	            ["catch"](function (error) {});
	          } else {
	            _this._dispatch(actionId, body, args, methodName);
	          }
	
	          // Return original method's return value to caller
	          return body;
	        };
	
	        action._id = actionId;
	
	        this[methodName] = action;
	      }
	    },
	    _createActionId: {
	
	      /**
	       * Create unique string constant for an action method, using
	       * @param {string} methodName - Name of the action method
	       */
	
	      value: function _createActionId(methodName) {
	        return "" + this._baseId + "-" + methodName;
	      }
	    },
	    _dispatch: {
	      value: function _dispatch(actionId, body, args, methodName) {
	        if (typeof this.dispatch === "function") {
	          if (typeof body !== "undefined") {
	            this.dispatch(actionId, body, args);
	          }
	        } else {
	          if ((undefined) !== "production") {
	            console.warn("You've attempted to perform the action " + ("" + this.constructor.name + "#" + methodName + ", but it hasn't been added ") + "to a Flux instance.");
	          }
	        }
	
	        return body;
	      }
	    },
	    _dispatchAsync: {
	      value: function _dispatchAsync(actionId, promise, args, methodName) {
	        if (typeof this.dispatchAsync === "function") {
	          return this.dispatchAsync(actionId, promise, args);
	        } else {
	          if ((undefined) !== "production") {
	            console.warn("You've attempted to perform the asynchronous action " + ("" + this.constructor.name + "#" + methodName + ", but it hasn't been added ") + "to a Flux instance.");
	          }
	
	          return promise;
	        }
	      }
	    }
	  });
	
	  return Actions;
	})();
	
	module.exports = Actions;
	
	function isPromise(value) {
	  return value && typeof value.then === "function";
	}

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright (c) 2014, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 */
	
	module.exports.Dispatcher = __webpack_require__(7)


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	/**
	 * Representation of a single EventEmitter function.
	 *
	 * @param {Function} fn Event handler to be called.
	 * @param {Mixed} context Context for function execution.
	 * @param {Boolean} once Only emit once
	 * @api private
	 */
	function EE(fn, context, once) {
	  this.fn = fn;
	  this.context = context;
	  this.once = once || false;
	}
	
	/**
	 * Minimal EventEmitter interface that is molded against the Node.js
	 * EventEmitter interface.
	 *
	 * @constructor
	 * @api public
	 */
	function EventEmitter() { /* Nothing to set */ }
	
	/**
	 * Holds the assigned EventEmitters by name.
	 *
	 * @type {Object}
	 * @private
	 */
	EventEmitter.prototype._events = undefined;
	
	/**
	 * Return a list of assigned event listeners.
	 *
	 * @param {String} event The events that should be listed.
	 * @returns {Array}
	 * @api public
	 */
	EventEmitter.prototype.listeners = function listeners(event) {
	  if (!this._events || !this._events[event]) return [];
	  if (this._events[event].fn) return [this._events[event].fn];
	
	  for (var i = 0, l = this._events[event].length, ee = new Array(l); i < l; i++) {
	    ee[i] = this._events[event][i].fn;
	  }
	
	  return ee;
	};
	
	/**
	 * Emit an event to all registered event listeners.
	 *
	 * @param {String} event The name of the event.
	 * @returns {Boolean} Indication if we've emitted an event.
	 * @api public
	 */
	EventEmitter.prototype.emit = function emit(event, a1, a2, a3, a4, a5) {
	  if (!this._events || !this._events[event]) return false;
	
	  var listeners = this._events[event]
	    , len = arguments.length
	    , args
	    , i;
	
	  if ('function' === typeof listeners.fn) {
	    if (listeners.once) this.removeListener(event, listeners.fn, true);
	
	    switch (len) {
	      case 1: return listeners.fn.call(listeners.context), true;
	      case 2: return listeners.fn.call(listeners.context, a1), true;
	      case 3: return listeners.fn.call(listeners.context, a1, a2), true;
	      case 4: return listeners.fn.call(listeners.context, a1, a2, a3), true;
	      case 5: return listeners.fn.call(listeners.context, a1, a2, a3, a4), true;
	      case 6: return listeners.fn.call(listeners.context, a1, a2, a3, a4, a5), true;
	    }
	
	    for (i = 1, args = new Array(len -1); i < len; i++) {
	      args[i - 1] = arguments[i];
	    }
	
	    listeners.fn.apply(listeners.context, args);
	  } else {
	    var length = listeners.length
	      , j;
	
	    for (i = 0; i < length; i++) {
	      if (listeners[i].once) this.removeListener(event, listeners[i].fn, true);
	
	      switch (len) {
	        case 1: listeners[i].fn.call(listeners[i].context); break;
	        case 2: listeners[i].fn.call(listeners[i].context, a1); break;
	        case 3: listeners[i].fn.call(listeners[i].context, a1, a2); break;
	        default:
	          if (!args) for (j = 1, args = new Array(len -1); j < len; j++) {
	            args[j - 1] = arguments[j];
	          }
	
	          listeners[i].fn.apply(listeners[i].context, args);
	      }
	    }
	  }
	
	  return true;
	};
	
	/**
	 * Register a new EventListener for the given event.
	 *
	 * @param {String} event Name of the event.
	 * @param {Functon} fn Callback function.
	 * @param {Mixed} context The context of the function.
	 * @api public
	 */
	EventEmitter.prototype.on = function on(event, fn, context) {
	  var listener = new EE(fn, context || this);
	
	  if (!this._events) this._events = {};
	  if (!this._events[event]) this._events[event] = listener;
	  else {
	    if (!this._events[event].fn) this._events[event].push(listener);
	    else this._events[event] = [
	      this._events[event], listener
	    ];
	  }
	
	  return this;
	};
	
	/**
	 * Add an EventListener that's only called once.
	 *
	 * @param {String} event Name of the event.
	 * @param {Function} fn Callback function.
	 * @param {Mixed} context The context of the function.
	 * @api public
	 */
	EventEmitter.prototype.once = function once(event, fn, context) {
	  var listener = new EE(fn, context || this, true);
	
	  if (!this._events) this._events = {};
	  if (!this._events[event]) this._events[event] = listener;
	  else {
	    if (!this._events[event].fn) this._events[event].push(listener);
	    else this._events[event] = [
	      this._events[event], listener
	    ];
	  }
	
	  return this;
	};
	
	/**
	 * Remove event listeners.
	 *
	 * @param {String} event The event we want to remove.
	 * @param {Function} fn The listener that we need to find.
	 * @param {Boolean} once Only remove once listeners.
	 * @api public
	 */
	EventEmitter.prototype.removeListener = function removeListener(event, fn, once) {
	  if (!this._events || !this._events[event]) return this;
	
	  var listeners = this._events[event]
	    , events = [];
	
	  if (fn) {
	    if (listeners.fn && (listeners.fn !== fn || (once && !listeners.once))) {
	      events.push(listeners);
	    }
	    if (!listeners.fn) for (var i = 0, length = listeners.length; i < length; i++) {
	      if (listeners[i].fn !== fn || (once && !listeners[i].once)) {
	        events.push(listeners[i]);
	      }
	    }
	  }
	
	  //
	  // Reset the array, or remove it completely if we have no more listeners.
	  //
	  if (events.length) {
	    this._events[event] = events.length === 1 ? events[0] : events;
	  } else {
	    delete this._events[event];
	  }
	
	  return this;
	};
	
	/**
	 * Remove all listeners or only the listeners for the specified event.
	 *
	 * @param {String} event The event want to remove all listeners for.
	 * @api public
	 */
	EventEmitter.prototype.removeAllListeners = function removeAllListeners(event) {
	  if (!this._events) return this;
	
	  if (event) delete this._events[event];
	  else this._events = {};
	
	  return this;
	};
	
	//
	// Alias methods names because people roll like that.
	//
	EventEmitter.prototype.off = EventEmitter.prototype.removeListener;
	EventEmitter.prototype.addListener = EventEmitter.prototype.on;
	
	//
	// This function doesn't apply anymore.
	//
	EventEmitter.prototype.setMaxListeners = function setMaxListeners() {
	  return this;
	};
	
	//
	// Expose the module.
	//
	EventEmitter.EventEmitter = EventEmitter;
	EventEmitter.EventEmitter2 = EventEmitter;
	EventEmitter.EventEmitter3 = EventEmitter;
	
	//
	// Expose the module.
	//
	module.exports = EventEmitter;


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	function ToObject(val) {
		if (val == null) {
			throw new TypeError('Object.assign cannot be called with null or undefined');
		}
	
		return Object(val);
	}
	
	module.exports = Object.assign || function (target, source) {
		var from;
		var keys;
		var to = ToObject(target);
	
		for (var s = 1; s < arguments.length; s++) {
			from = arguments[s];
			keys = Object.keys(Object(from));
	
			for (var i = 0; i < keys.length; i++) {
				to[keys[i]] = from[keys[i]];
			}
		}
	
		return to;
	};


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	
	var count = 0;
	
	/**
	 * Generate a unique ID.
	 *
	 * Optionally pass a prefix to prepend, a suffix to append, or a
	 * multiplier to use on the ID.
	 *
	 * ```js
	 * uniqueId(); //=> '25'
	 *
	 * uniqueId({prefix: 'apple_'});
	 * //=> 'apple_10'
	 *
	 * uniqueId({suffix: '_orange'});
	 * //=> '10_orange'
	 *
	 * uniqueId({multiplier: 5});
	 * //=> 5, 10, 15, 20...
	 * ```
	 *
	 * To reset the `id` to zero, do `id.reset()`.
	 *
	 * @param  {Object} `options` Optionally pass a `prefix`, `suffix` and/or `multiplier.
	 * @return {String} The unique id.
	 * @api public
	 */
	
	var id = module.exports = function (options) {
	  options = options || {};
	
	  var prefix = options.prefix;
	  var suffix = options.suffix;
	
	  var id = ++count * (options.multiplier || 1);
	
	  if (prefix == null) {
	    prefix = '';
	  }
	
	  if (suffix == null) {
	    suffix = '';
	  }
	
	  return String(prefix) + id + String(suffix);
	};
	
	
	id.reset = function() {
	  return count = 0;
	};

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	/*
	 * Copyright (c) 2014, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule Dispatcher
	 * @typechecks
	 */
	
	"use strict";
	
	var invariant = __webpack_require__(8);
	
	var _lastID = 1;
	var _prefix = 'ID_';
	
	/**
	 * Dispatcher is used to broadcast payloads to registered callbacks. This is
	 * different from generic pub-sub systems in two ways:
	 *
	 *   1) Callbacks are not subscribed to particular events. Every payload is
	 *      dispatched to every registered callback.
	 *   2) Callbacks can be deferred in whole or part until other callbacks have
	 *      been executed.
	 *
	 * For example, consider this hypothetical flight destination form, which
	 * selects a default city when a country is selected:
	 *
	 *   var flightDispatcher = new Dispatcher();
	 *
	 *   // Keeps track of which country is selected
	 *   var CountryStore = {country: null};
	 *
	 *   // Keeps track of which city is selected
	 *   var CityStore = {city: null};
	 *
	 *   // Keeps track of the base flight price of the selected city
	 *   var FlightPriceStore = {price: null}
	 *
	 * When a user changes the selected city, we dispatch the payload:
	 *
	 *   flightDispatcher.dispatch({
	 *     actionType: 'city-update',
	 *     selectedCity: 'paris'
	 *   });
	 *
	 * This payload is digested by `CityStore`:
	 *
	 *   flightDispatcher.register(function(payload) {
	 *     if (payload.actionType === 'city-update') {
	 *       CityStore.city = payload.selectedCity;
	 *     }
	 *   });
	 *
	 * When the user selects a country, we dispatch the payload:
	 *
	 *   flightDispatcher.dispatch({
	 *     actionType: 'country-update',
	 *     selectedCountry: 'australia'
	 *   });
	 *
	 * This payload is digested by both stores:
	 *
	 *    CountryStore.dispatchToken = flightDispatcher.register(function(payload) {
	 *     if (payload.actionType === 'country-update') {
	 *       CountryStore.country = payload.selectedCountry;
	 *     }
	 *   });
	 *
	 * When the callback to update `CountryStore` is registered, we save a reference
	 * to the returned token. Using this token with `waitFor()`, we can guarantee
	 * that `CountryStore` is updated before the callback that updates `CityStore`
	 * needs to query its data.
	 *
	 *   CityStore.dispatchToken = flightDispatcher.register(function(payload) {
	 *     if (payload.actionType === 'country-update') {
	 *       // `CountryStore.country` may not be updated.
	 *       flightDispatcher.waitFor([CountryStore.dispatchToken]);
	 *       // `CountryStore.country` is now guaranteed to be updated.
	 *
	 *       // Select the default city for the new country
	 *       CityStore.city = getDefaultCityForCountry(CountryStore.country);
	 *     }
	 *   });
	 *
	 * The usage of `waitFor()` can be chained, for example:
	 *
	 *   FlightPriceStore.dispatchToken =
	 *     flightDispatcher.register(function(payload) {
	 *       switch (payload.actionType) {
	 *         case 'country-update':
	 *           flightDispatcher.waitFor([CityStore.dispatchToken]);
	 *           FlightPriceStore.price =
	 *             getFlightPriceStore(CountryStore.country, CityStore.city);
	 *           break;
	 *
	 *         case 'city-update':
	 *           FlightPriceStore.price =
	 *             FlightPriceStore(CountryStore.country, CityStore.city);
	 *           break;
	 *     }
	 *   });
	 *
	 * The `country-update` payload will be guaranteed to invoke the stores'
	 * registered callbacks in order: `CountryStore`, `CityStore`, then
	 * `FlightPriceStore`.
	 */
	
	  function Dispatcher() {
	    this.$Dispatcher_callbacks = {};
	    this.$Dispatcher_isPending = {};
	    this.$Dispatcher_isHandled = {};
	    this.$Dispatcher_isDispatching = false;
	    this.$Dispatcher_pendingPayload = null;
	  }
	
	  /**
	   * Registers a callback to be invoked with every dispatched payload. Returns
	   * a token that can be used with `waitFor()`.
	   *
	   * @param {function} callback
	   * @return {string}
	   */
	  Dispatcher.prototype.register=function(callback) {
	    var id = _prefix + _lastID++;
	    this.$Dispatcher_callbacks[id] = callback;
	    return id;
	  };
	
	  /**
	   * Removes a callback based on its token.
	   *
	   * @param {string} id
	   */
	  Dispatcher.prototype.unregister=function(id) {
	    invariant(
	      this.$Dispatcher_callbacks[id],
	      'Dispatcher.unregister(...): `%s` does not map to a registered callback.',
	      id
	    );
	    delete this.$Dispatcher_callbacks[id];
	  };
	
	  /**
	   * Waits for the callbacks specified to be invoked before continuing execution
	   * of the current callback. This method should only be used by a callback in
	   * response to a dispatched payload.
	   *
	   * @param {array<string>} ids
	   */
	  Dispatcher.prototype.waitFor=function(ids) {
	    invariant(
	      this.$Dispatcher_isDispatching,
	      'Dispatcher.waitFor(...): Must be invoked while dispatching.'
	    );
	    for (var ii = 0; ii < ids.length; ii++) {
	      var id = ids[ii];
	      if (this.$Dispatcher_isPending[id]) {
	        invariant(
	          this.$Dispatcher_isHandled[id],
	          'Dispatcher.waitFor(...): Circular dependency detected while ' +
	          'waiting for `%s`.',
	          id
	        );
	        continue;
	      }
	      invariant(
	        this.$Dispatcher_callbacks[id],
	        'Dispatcher.waitFor(...): `%s` does not map to a registered callback.',
	        id
	      );
	      this.$Dispatcher_invokeCallback(id);
	    }
	  };
	
	  /**
	   * Dispatches a payload to all registered callbacks.
	   *
	   * @param {object} payload
	   */
	  Dispatcher.prototype.dispatch=function(payload) {
	    invariant(
	      !this.$Dispatcher_isDispatching,
	      'Dispatch.dispatch(...): Cannot dispatch in the middle of a dispatch.'
	    );
	    this.$Dispatcher_startDispatching(payload);
	    try {
	      for (var id in this.$Dispatcher_callbacks) {
	        if (this.$Dispatcher_isPending[id]) {
	          continue;
	        }
	        this.$Dispatcher_invokeCallback(id);
	      }
	    } finally {
	      this.$Dispatcher_stopDispatching();
	    }
	  };
	
	  /**
	   * Is this Dispatcher currently dispatching.
	   *
	   * @return {boolean}
	   */
	  Dispatcher.prototype.isDispatching=function() {
	    return this.$Dispatcher_isDispatching;
	  };
	
	  /**
	   * Call the callback stored with the given id. Also do some internal
	   * bookkeeping.
	   *
	   * @param {string} id
	   * @internal
	   */
	  Dispatcher.prototype.$Dispatcher_invokeCallback=function(id) {
	    this.$Dispatcher_isPending[id] = true;
	    this.$Dispatcher_callbacks[id](this.$Dispatcher_pendingPayload);
	    this.$Dispatcher_isHandled[id] = true;
	  };
	
	  /**
	   * Set up bookkeeping needed when dispatching.
	   *
	   * @param {object} payload
	   * @internal
	   */
	  Dispatcher.prototype.$Dispatcher_startDispatching=function(payload) {
	    for (var id in this.$Dispatcher_callbacks) {
	      this.$Dispatcher_isPending[id] = false;
	      this.$Dispatcher_isHandled[id] = false;
	    }
	    this.$Dispatcher_pendingPayload = payload;
	    this.$Dispatcher_isDispatching = true;
	  };
	
	  /**
	   * Clear bookkeeping used for dispatching.
	   *
	   * @internal
	   */
	  Dispatcher.prototype.$Dispatcher_stopDispatching=function() {
	    this.$Dispatcher_pendingPayload = null;
	    this.$Dispatcher_isDispatching = false;
	  };
	
	
	module.exports = Dispatcher;


/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright (c) 2014, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule invariant
	 */
	
	"use strict";
	
	/**
	 * Use invariant() to assert state which your program assumes to be true.
	 *
	 * Provide sprintf-style format (only %s is supported) and arguments
	 * to provide information about what broke and what you were
	 * expecting.
	 *
	 * The invariant message will be stripped in production, but the invariant
	 * will remain to ensure logic does not differ in production.
	 */
	
	var invariant = function(condition, format, a, b, c, d, e, f) {
	  if (false) {
	    if (format === undefined) {
	      throw new Error('invariant requires an error message argument');
	    }
	  }
	
	  if (!condition) {
	    var error;
	    if (format === undefined) {
	      error = new Error(
	        'Minified exception occurred; use the non-minified dev environment ' +
	        'for the full error message and additional helpful warnings.'
	      );
	    } else {
	      var args = [a, b, c, d, e, f];
	      var argIndex = 0;
	      error = new Error(
	        'Invariant Violation: ' +
	        format.replace(/%s/g, function() { return args[argIndex++]; })
	      );
	    }
	
	    error.framesToPop = 1; // we don't care about invariant's own frame
	    throw error;
	  }
	};
	
	module.exports = invariant;


/***/ }
/******/ ]);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgNWUxZTczOGVkZGUxNDAzZDJjY2YiLCJ3ZWJwYWNrOi8vLy4vc3JjL0ZsdXguanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL1N0b3JlLmpzIiwid2VicGFjazovLy8uL3NyYy9BY3Rpb25zLmpzIiwid2VicGFjazovLy8uL34vZmx1eC9pbmRleC5qcyIsIndlYnBhY2s6Ly8vLi9+L2V2ZW50ZW1pdHRlcjMvaW5kZXguanMiLCJ3ZWJwYWNrOi8vLy4vfi9vYmplY3QtYXNzaWduL2luZGV4LmpzIiwid2VicGFjazovLy8uL34vdW5pcXVlaWQvaW5kZXguanMiLCJ3ZWJwYWNrOi8vLy4vfi9mbHV4L2xpYi9EaXNwYXRjaGVyLmpzIiwid2VicGFjazovLy8uL34vZmx1eC9saWIvaW52YXJpYW50LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsdUJBQWU7QUFDZjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQSx3Qzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztLQ2hDTyxLQUFLLHVDQUFNLENBQVM7O0tBQ3BCLE9BQU8sdUNBQU0sQ0FBVzs7S0FDdEIsVUFBVSx1QkFBUSxDQUFNLEVBQXhCLFVBQVU7O0tBQ1osWUFBWSx1Q0FBTSxDQUFlOztLQUVuQixJQUFJO0FBRVosWUFGUSxJQUFJLEdBRVQ7MkJBRkssSUFBSTs7QUFHckIsU0FBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLFVBQVUsRUFBRSxDQUFDOztBQUVuQyxTQUFJLENBQUMsT0FBTyxHQUFHLEVBQUUsQ0FBQztBQUNsQixTQUFJLENBQUMsUUFBUSxHQUFHLEVBQUUsQ0FBQztJQUNwQjs7YUFQa0IsSUFBSTs7Z0JBQUosSUFBSTtBQVN2Qixn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Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esc0NBQXFDO0FBQ3JDO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQSwyQ0FBMEMseUJBQXlCLEVBQUU7QUFDckU7QUFDQTs7QUFFQSwyQkFBMEI7QUFDMUI7QUFDQTtBQUNBOztBQUVBIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pXG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG5cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGV4cG9ydHM6IHt9LFxuIFx0XHRcdGlkOiBtb2R1bGVJZCxcbiBcdFx0XHRsb2FkZWQ6IGZhbHNlXG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmxvYWRlZCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oMCk7XG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogd2VicGFjay9ib290c3RyYXAgNWUxZTczOGVkZGUxNDAzZDJjY2ZcbiAqKi8iLCIvKipcbiAqIEZsdXhcbiAqXG4gKiBUaGUgbWFpbiBGbHV4IGNsYXNzLlxuICovXG5cbmltcG9ydCBTdG9yZSBmcm9tICcuL1N0b3JlJztcbmltcG9ydCBBY3Rpb25zIGZyb20gJy4vQWN0aW9ucyc7XG5pbXBvcnQgeyBEaXNwYXRjaGVyIH0gZnJvbSAnZmx1eCc7XG5pbXBvcnQgRXZlbnRFbWl0dGVyIGZyb20gJ2V2ZW50ZW1pdHRlcjMnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBGbHV4IGV4dGVuZHMgRXZlbnRFbWl0dGVyIHtcblxuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLmRpc3BhdGNoZXIgPSBuZXcgRGlzcGF0Y2hlcigpO1xuXG4gICAgdGhpcy5fc3RvcmVzID0ge307XG4gICAgdGhpcy5fYWN0aW9ucyA9IHt9O1xuICB9XG5cbiAgY3JlYXRlU3RvcmUoa2V5LCBfU3RvcmUsIC4uLmNvbnN0cnVjdG9yQXJncykge1xuXG4gICAgaWYgKCEoX1N0b3JlLnByb3RvdHlwZSBpbnN0YW5jZW9mIFN0b3JlKSkge1xuICAgICAgY29uc3QgY2xhc3NOYW1lID0gZ2V0Q2xhc3NOYW1lKF9TdG9yZSk7XG5cbiAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgYFlvdSd2ZSBhdHRlbXB0ZWQgdG8gY3JlYXRlIGEgc3RvcmUgZnJvbSB0aGUgY2xhc3MgJHtjbGFzc05hbWV9LCB3aGljaCBgXG4gICAgICArIGBkb2VzIG5vdCBoYXZlIHRoZSBiYXNlIFN0b3JlIGNsYXNzIGluIGl0cyBwcm90b3R5cGUgY2hhaW4uIE1ha2Ugc3VyZSBgXG4gICAgICArIGB5b3UncmUgdXNpbmcgdGhlIFxcYGV4dGVuZHNcXGAga2V5d29yZDogXFxgY2xhc3MgJHtjbGFzc05hbWV9IGV4dGVuZHMgYFxuICAgICAgKyBgU3RvcmUgeyAuLi4gfVxcYGBcbiAgICAgICk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuX3N0b3Jlcy5oYXNPd25Qcm9wZXJ0eShrZXkpICYmIHRoaXMuX3N0b3Jlc1trZXldKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgIGBZb3UndmUgYXR0ZW1wdGVkIHRvIGNyZWF0ZSBtdWx0aXBsZSBzdG9yZXMgd2l0aCBrZXkgJHtrZXl9LiBLZXlzIG11c3QgYFxuICAgICAgKyBgYmUgdW5pcXVlLmBcbiAgICAgICk7XG4gICAgfVxuXG4gICAgY29uc3Qgc3RvcmUgPSBuZXcgX1N0b3JlKC4uLmNvbnN0cnVjdG9yQXJncyk7XG4gICAgY29uc3QgdG9rZW4gPSB0aGlzLmRpc3BhdGNoZXIucmVnaXN0ZXIoc3RvcmUuaGFuZGxlci5iaW5kKHN0b3JlKSk7XG5cbiAgICBzdG9yZS5fd2FpdEZvciA9IHRoaXMud2FpdEZvci5iaW5kKHRoaXMpO1xuICAgIHN0b3JlLl90b2tlbiA9IHRva2VuO1xuICAgIHN0b3JlLl9nZXRBbGxBY3Rpb25JZHMgPSB0aGlzLmdldEFsbEFjdGlvbklkcy5iaW5kKHRoaXMpO1xuXG4gICAgdGhpcy5fc3RvcmVzW2tleV0gPSBzdG9yZTtcblxuICAgIHJldHVybiBzdG9yZTtcbiAgfVxuXG4gIGdldFN0b3JlKGtleSkge1xuICAgIHJldHVybiB0aGlzLl9zdG9yZXMuaGFzT3duUHJvcGVydHkoa2V5KSA/IHRoaXMuX3N0b3Jlc1trZXldIDogdW5kZWZpbmVkO1xuICB9XG5cbiAgY3JlYXRlQWN0aW9ucyhrZXksIF9BY3Rpb25zLCAuLi5jb25zdHJ1Y3RvckFyZ3MpIHtcblxuICAgIGlmICghKF9BY3Rpb25zLnByb3RvdHlwZSBpbnN0YW5jZW9mIEFjdGlvbnMpICYmIF9BY3Rpb25zICE9PSBBY3Rpb25zKSB7XG4gICAgICBjb25zdCBjbGFzc05hbWUgPSBnZXRDbGFzc05hbWUoX0FjdGlvbnMpO1xuXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgIGBZb3UndmUgYXR0ZW1wdGVkIHRvIGNyZWF0ZSBhY3Rpb25zIGZyb20gdGhlIGNsYXNzICR7Y2xhc3NOYW1lfSwgd2hpY2ggYFxuICAgICAgKyBgZG9lcyBub3QgaGF2ZSB0aGUgYmFzZSBBY3Rpb25zIGNsYXNzIGluIGl0cyBwcm90b3R5cGUgY2hhaW4uIE1ha2UgYFxuICAgICAgKyBgc3VyZSB5b3UncmUgdXNpbmcgdGhlIFxcYGV4dGVuZHNcXGAga2V5d29yZDogXFxgY2xhc3MgJHtjbGFzc05hbWV9IGBcbiAgICAgICsgYGV4dGVuZHMgQWN0aW9ucyB7IC4uLiB9XFxgYFxuICAgICAgKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5fYWN0aW9ucy5oYXNPd25Qcm9wZXJ0eShrZXkpICYmIHRoaXMuX2FjdGlvbnNba2V5XSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICBgWW91J3ZlIGF0dGVtcHRlZCB0byBjcmVhdGUgbXVsdGlwbGUgYWN0aW9ucyB3aXRoIGtleSAke2tleX0uIEtleXMgYFxuICAgICAgKyBgbXVzdCBiZSB1bmlxdWUuYFxuICAgICAgKTtcbiAgICB9XG5cbiAgICBjb25zdCBhY3Rpb25zID0gbmV3IF9BY3Rpb25zKC4uLmNvbnN0cnVjdG9yQXJncyk7XG4gICAgYWN0aW9ucy5kaXNwYXRjaCA9IHRoaXMuZGlzcGF0Y2guYmluZCh0aGlzKTtcbiAgICBhY3Rpb25zLmRpc3BhdGNoQXN5bmMgPSB0aGlzLmRpc3BhdGNoQXN5bmMuYmluZCh0aGlzKTtcblxuICAgIHRoaXMuX2FjdGlvbnNba2V5XSA9IGFjdGlvbnM7XG5cbiAgICByZXR1cm4gYWN0aW9ucztcbiAgfVxuXG4gIGdldEFjdGlvbnMoa2V5KSB7XG4gICAgcmV0dXJuIHRoaXMuX2FjdGlvbnMuaGFzT3duUHJvcGVydHkoa2V5KSA/IHRoaXMuX2FjdGlvbnNba2V5XSA6IHVuZGVmaW5lZDtcbiAgfVxuXG4gIGdldEFjdGlvbklkcyhrZXkpIHtcbiAgICBjb25zdCBhY3Rpb25zID0gdGhpcy5nZXRBY3Rpb25zKGtleSk7XG5cbiAgICBpZiAoIWFjdGlvbnMpIHJldHVybjtcblxuICAgIHJldHVybiBhY3Rpb25zLmdldENvbnN0YW50cygpO1xuICB9XG5cbiAgZ2V0QWxsQWN0aW9uSWRzKCkge1xuICAgIGxldCBhY3Rpb25JZHMgPSBbXTtcblxuICAgIGZvciAobGV0IGtleSBpbiB0aGlzLl9hY3Rpb25zKSB7XG4gICAgICBpZiAoIXRoaXMuX2FjdGlvbnMuaGFzT3duUHJvcGVydHkoa2V5KSkgY29udGludWU7XG5cbiAgICAgIGNvbnN0IGFjdGlvbkNvbnN0YW50cyA9IHRoaXMuX2FjdGlvbnNba2V5XS5nZXRDb25zdGFudHMoKTtcblxuICAgICAgYWN0aW9uSWRzID0gYWN0aW9uSWRzLmNvbmNhdChnZXRWYWx1ZXMoYWN0aW9uQ29uc3RhbnRzKSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGFjdGlvbklkcztcbiAgfVxuXG4gIGRpc3BhdGNoKGFjdGlvbklkLCBib2R5KSB7XG4gICAgdGhpcy5fZGlzcGF0Y2goeyBhY3Rpb25JZCwgYm9keSB9KTtcbiAgfVxuXG4gIGRpc3BhdGNoQXN5bmMoYWN0aW9uSWQsIHByb21pc2UsIGFjdGlvbkFyZ3MpIHtcbiAgICBjb25zdCBwYXlsb2FkID0ge1xuICAgICAgYWN0aW9uSWQsXG4gICAgICBhc3luYzogJ2JlZ2luJyxcbiAgICB9O1xuXG4gICAgaWYgKGFjdGlvbkFyZ3MpIHBheWxvYWQuYWN0aW9uQXJncyA9IGFjdGlvbkFyZ3M7XG5cbiAgICB0aGlzLl9kaXNwYXRjaChwYXlsb2FkKTtcblxuICAgIHJldHVybiBwcm9taXNlXG4gICAgICAudGhlbihcbiAgICAgICAgYm9keSA9PiB7XG4gICAgICAgICAgdGhpcy5fZGlzcGF0Y2goe1xuICAgICAgICAgICAgYWN0aW9uSWQsXG4gICAgICAgICAgICBib2R5LFxuICAgICAgICAgICAgYXN5bmM6ICdzdWNjZXNzJ1xuICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgcmV0dXJuIGJvZHk7XG4gICAgICAgIH0sXG4gICAgICAgIGVycm9yID0+IHtcbiAgICAgICAgICB0aGlzLl9kaXNwYXRjaCh7XG4gICAgICAgICAgICBhY3Rpb25JZCxcbiAgICAgICAgICAgIGVycm9yLFxuICAgICAgICAgICAgYWN0aW9uQXJnczogYWN0aW9uQXJncyxcbiAgICAgICAgICAgIGFzeW5jOiAnZmFpbHVyZScsXG4gICAgICAgICAgfSk7XG5cbiAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QoZXJyb3IpO1xuICAgICAgICB9XG4gICAgICApXG4gICAgICAuY2F0Y2goZXJyb3IgPT4ge1xuICAgICAgICB0aGlzLmVtaXQoJ2Vycm9yJywgZXJyb3IpO1xuXG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChlcnJvcik7XG4gICAgICB9KTtcbiAgfVxuXG4gIF9kaXNwYXRjaChwYXlsb2FkKSB7XG4gICAgdGhpcy5kaXNwYXRjaGVyLmRpc3BhdGNoKHBheWxvYWQpO1xuICAgIHRoaXMuZW1pdCgnZGlzcGF0Y2gnLCBwYXlsb2FkKTtcbiAgfVxuXG4gIHdhaXRGb3IodG9rZW5zT3JTdG9yZXMpIHtcblxuICAgIGlmICghQXJyYXkuaXNBcnJheSh0b2tlbnNPclN0b3JlcykpIHRva2Vuc09yU3RvcmVzID0gW3Rva2Vuc09yU3RvcmVzXTtcblxuICAgIGNvbnN0IGVuc3VyZUlzVG9rZW4gPSB0b2tlbk9yU3RvcmUgPT4ge1xuICAgICAgcmV0dXJuIHRva2VuT3JTdG9yZSBpbnN0YW5jZW9mIFN0b3JlXG4gICAgICAgID8gdG9rZW5PclN0b3JlLl90b2tlblxuICAgICAgICA6IHRva2VuT3JTdG9yZTtcbiAgICB9O1xuXG4gICAgY29uc3QgdG9rZW5zID0gdG9rZW5zT3JTdG9yZXMubWFwKGVuc3VyZUlzVG9rZW4pO1xuXG4gICAgdGhpcy5kaXNwYXRjaGVyLndhaXRGb3IodG9rZW5zKTtcbiAgfVxuXG4gIHJlbW92ZUFsbFN0b3JlTGlzdGVuZXJzKGV2ZW50KSB7XG4gICAgZm9yIChsZXQga2V5IGluIHRoaXMuX3N0b3Jlcykge1xuICAgICAgaWYgKCF0aGlzLl9zdG9yZXMuaGFzT3duUHJvcGVydHkoa2V5KSkgY29udGludWU7XG5cbiAgICAgIGNvbnN0IHN0b3JlID0gdGhpcy5fc3RvcmVzW2tleV07XG5cbiAgICAgIHN0b3JlLnJlbW92ZUFsbExpc3RlbmVycyhldmVudCk7XG4gICAgfVxuICB9XG5cbiAgc2VyaWFsaXplKCkge1xuICAgIGNvbnN0IHN0YXRlVHJlZSA9IHt9O1xuXG4gICAgZm9yIChsZXQga2V5IGluIHRoaXMuX3N0b3Jlcykge1xuICAgICAgaWYgKCF0aGlzLl9zdG9yZXMuaGFzT3duUHJvcGVydHkoa2V5KSkgY29udGludWU7XG5cbiAgICAgIGNvbnN0IHN0b3JlID0gdGhpcy5fc3RvcmVzW2tleV07XG5cbiAgICAgIGNvbnN0IHNlcmlhbGl6ZSA9IHN0b3JlLmNvbnN0cnVjdG9yLnNlcmlhbGl6ZTtcblxuICAgICAgaWYgKHR5cGVvZiBzZXJpYWxpemUgIT09ICdmdW5jdGlvbicpIGNvbnRpbnVlO1xuXG4gICAgICBjb25zdCBzZXJpYWxpemVkU3RvcmVTdGF0ZSA9IHNlcmlhbGl6ZShzdG9yZS5zdGF0ZSk7XG5cbiAgICAgIGlmICh0eXBlb2Ygc2VyaWFsaXplZFN0b3JlU3RhdGUgIT09ICdzdHJpbmcnKSB7XG4gICAgICAgIGNvbnN0IGNsYXNzTmFtZSA9IHN0b3JlLmNvbnN0cnVjdG9yLm5hbWU7XG5cbiAgICAgICAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpIHtcbiAgICAgICAgICBjb25zb2xlLndhcm4oXG4gICAgICAgICAgICBgVGhlIHN0b3JlIHdpdGgga2V5ICcke2tleX0nIHdhcyBub3Qgc2VyaWFsaXplZCBiZWNhdXNlIHRoZSBzdGF0aWMgYFxuICAgICAgICAgICsgYG1ldGhvZCBcXGAke2NsYXNzTmFtZX0uc2VyaWFsaXplKClcXGAgcmV0dXJuZWQgYSBub24tc3RyaW5nIHdpdGggdHlwZSBgXG4gICAgICAgICAgKyBgJyR7dHlwZW9mIHNlcmlhbGl6ZWRTdG9yZVN0YXRlfScuYFxuICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgc3RhdGVUcmVlW2tleV0gPSBzZXJpYWxpemVkU3RvcmVTdGF0ZTtcblxuICAgICAgaWYgKHR5cGVvZiBzdG9yZS5jb25zdHJ1Y3Rvci5kZXNlcmlhbGl6ZSAhPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICBjb25zdCBjbGFzc05hbWUgPSBzdG9yZS5jb25zdHJ1Y3Rvci5uYW1lO1xuXG4gICAgICAgIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSB7XG4gICAgICAgICAgY29uc29sZS53YXJuKFxuICAgICAgICAgICAgYFRoZSBjbGFzcyBcXGAke2NsYXNzTmFtZX1cXGAgaGFzIGEgXFxgc2VyaWFsaXplKClcXGAgbWV0aG9kLCBidXQgbm8gYFxuICAgICAgICAgICsgYGNvcnJlc3BvbmRpbmcgXFxgZGVzZXJpYWxpemUoKVxcYCBtZXRob2QuYFxuICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgIH1cblxuICAgIHJldHVybiBKU09OLnN0cmluZ2lmeShzdGF0ZVRyZWUpO1xuICB9XG5cbiAgZGVzZXJpYWxpemUoc2VyaWFsaXplZFN0YXRlKSB7XG4gICAgbGV0IHN0YXRlTWFwO1xuXG4gICAgdHJ5IHtcbiAgICAgIHN0YXRlTWFwID0gSlNPTi5wYXJzZShzZXJpYWxpemVkU3RhdGUpO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBjb25zdCBjbGFzc05hbWUgPSB0aGlzLmNvbnN0cnVjdG9yLm5hbWU7XG5cbiAgICAgIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgICBgSW52YWxpZCB2YWx1ZSBwYXNzZWQgdG8gXFxgJHtjbGFzc05hbWV9I2Rlc2VyaWFsaXplKClcXGA6IGBcbiAgICAgICAgKyBgJHtzZXJpYWxpemVkU3RhdGV9YFxuICAgICAgICApO1xuICAgICAgfVxuICAgIH1cblxuICAgIGZvciAobGV0IGtleSBpbiB0aGlzLl9zdG9yZXMpIHtcbiAgICAgIGlmICghdGhpcy5fc3RvcmVzLmhhc093blByb3BlcnR5KGtleSkpIGNvbnRpbnVlO1xuXG4gICAgICBjb25zdCBzdG9yZSA9IHRoaXMuX3N0b3Jlc1trZXldO1xuXG4gICAgICBjb25zdCBkZXNlcmlhbGl6ZSA9IHN0b3JlLmNvbnN0cnVjdG9yLmRlc2VyaWFsaXplO1xuXG4gICAgICBpZiAodHlwZW9mIGRlc2VyaWFsaXplICE9PSAnZnVuY3Rpb24nKSBjb250aW51ZTtcblxuICAgICAgY29uc3Qgc3RvcmVTdGF0ZVN0cmluZyA9IHN0YXRlTWFwW2tleV07XG4gICAgICBjb25zdCBzdG9yZVN0YXRlID0gZGVzZXJpYWxpemUoc3RvcmVTdGF0ZVN0cmluZyk7XG5cbiAgICAgIHN0b3JlLnJlcGxhY2VTdGF0ZShzdG9yZVN0YXRlKTtcblxuICAgICAgaWYgKHR5cGVvZiBzdG9yZS5jb25zdHJ1Y3Rvci5zZXJpYWxpemUgIT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgY29uc3QgY2xhc3NOYW1lID0gc3RvcmUuY29uc3RydWN0b3IubmFtZTtcblxuICAgICAgICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykge1xuICAgICAgICAgIGNvbnNvbGUud2FybihcbiAgICAgICAgICAgIGBUaGUgY2xhc3MgXFxgJHtjbGFzc05hbWV9XFxgIGhhcyBhIFxcYGRlc2VyaWFsaXplKClcXGAgbWV0aG9kLCBidXQgbm8gYFxuICAgICAgICAgICsgYGNvcnJlc3BvbmRpbmcgXFxgc2VyaWFsaXplKClcXGAgbWV0aG9kLmBcbiAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG5cbn1cblxuLy8gQWxpYXNlc1xuRmx1eC5wcm90b3R5cGUuZ2V0Q29uc3RhbnRzID0gRmx1eC5wcm90b3R5cGUuZ2V0QWN0aW9uSWRzO1xuRmx1eC5wcm90b3R5cGUuZ2V0QWxsQ29uc3RhbnRzID0gRmx1eC5wcm90b3R5cGUuZ2V0QWxsQWN0aW9uSWRzO1xuRmx1eC5wcm90b3R5cGUuZGVoeWRyYXRlID0gRmx1eC5wcm90b3R5cGUuc2VyaWFsaXplO1xuRmx1eC5wcm90b3R5cGUuaHlkcmF0ZSA9IEZsdXgucHJvdG90eXBlLmRlc2VyaWFsaXplO1xuXG5mdW5jdGlvbiBnZXRDbGFzc05hbWUoQ2xhc3MpIHtcbiAgcmV0dXJuIENsYXNzLnByb3RvdHlwZS5jb25zdHJ1Y3Rvci5uYW1lO1xufVxuXG5mdW5jdGlvbiBnZXRWYWx1ZXMob2JqZWN0KSB7XG4gIGxldCB2YWx1ZXMgPSBbXTtcblxuICBmb3IgKGxldCBrZXkgaW4gb2JqZWN0KSB7XG4gICAgaWYgKCFvYmplY3QuaGFzT3duUHJvcGVydHkoa2V5KSkgY29udGludWU7XG5cbiAgICB2YWx1ZXMucHVzaChvYmplY3Rba2V5XSk7XG4gIH1cblxuICByZXR1cm4gdmFsdWVzO1xufVxuXG5jb25zdCBGbHVtbW94ID0gRmx1eDtcblxuZXhwb3J0IHtcbiAgRmx1eCxcbiAgRmx1bW1veCxcbiAgU3RvcmUsXG4gIEFjdGlvbnMsXG59O1xuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9zcmMvRmx1eC5qc1xuICoqLyIsIi8qKlxuICogU3RvcmVcbiAqXG4gKiBTdG9yZXMgaG9sZCBhcHBsaWNhdGlvbiBzdGF0ZS4gVGhleSByZXNwb25kIHRvIGFjdGlvbnMgc2VudCBieSB0aGUgZGlzcGF0Y2hlclxuICogYW5kIGJyb2FkY2FzdCBjaGFuZ2UgZXZlbnRzIHRvIGxpc3RlbmVycywgc28gdGhleSBjYW4gZ3JhYiB0aGUgbGF0ZXN0IGRhdGEuXG4gKiBUaGUga2V5IHRoaW5nIHRvIHJlbWVtYmVyIGlzIHRoYXQgdGhlIG9ubHkgd2F5IHN0b3JlcyByZWNlaXZlIGluZm9ybWF0aW9uXG4gKiBmcm9tIHRoZSBvdXRzaWRlIHdvcmxkIGlzIHZpYSB0aGUgZGlzcGF0Y2hlci5cbiAqL1xuXG5pbXBvcnQgRXZlbnRFbWl0dGVyIGZyb20gJ2V2ZW50ZW1pdHRlcjMnO1xuaW1wb3J0IGFzc2lnbiBmcm9tICdvYmplY3QtYXNzaWduJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU3RvcmUgZXh0ZW5kcyBFdmVudEVtaXR0ZXIge1xuXG4gIC8qKlxuICAgKiBTdG9yZXMgYXJlIGluaXRpYWxpemVkIHdpdGggYSByZWZlcmVuY2VcbiAgICogQHR5cGUge09iamVjdH1cbiAgICovXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuc3RhdGUgPSBudWxsO1xuXG4gICAgdGhpcy5faGFuZGxlcnMgPSB7fTtcbiAgICB0aGlzLl9hc3luY0hhbmRsZXJzID0ge307XG4gICAgdGhpcy5fY2F0Y2hBbGxIYW5kbGVycyA9IFtdO1xuICAgIHRoaXMuX2NhdGNoQWxsQXN5bmNIYW5kbGVycyA9IHtcbiAgICAgIGJlZ2luOiBbXSxcbiAgICAgIHN1Y2Nlc3M6IFtdLFxuICAgICAgZmFpbHVyZTogW10sXG4gICAgfTtcbiAgfVxuXG4gIHNldFN0YXRlKG5ld1N0YXRlKSB7XG4gICAgLy8gRG8gYSB0cmFuc2FjdGlvbmFsIHN0YXRlIHVwZGF0ZSBpZiBhIGZ1bmN0aW9uIGlzIHBhc3NlZFxuICAgIGlmICh0eXBlb2YgbmV3U3RhdGUgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIGNvbnN0IHByZXZTdGF0ZSA9IHRoaXMuX2lzSGFuZGxpbmdEaXNwYXRjaFxuICAgICAgICA/IHRoaXMuX3BlbmRpbmdTdGF0ZVxuICAgICAgICA6IHRoaXMuc3RhdGU7XG5cbiAgICAgIG5ld1N0YXRlID0gbmV3U3RhdGUocHJldlN0YXRlKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5faXNIYW5kbGluZ0Rpc3BhdGNoKSB7XG4gICAgICB0aGlzLl9wZW5kaW5nU3RhdGUgPSB0aGlzLl9hc3NpZ25TdGF0ZSh0aGlzLl9wZW5kaW5nU3RhdGUsIG5ld1N0YXRlKTtcbiAgICAgIHRoaXMuX2VtaXRDaGFuZ2VBZnRlckhhbmRsaW5nRGlzcGF0Y2ggPSB0cnVlO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnN0YXRlID0gdGhpcy5fYXNzaWduU3RhdGUodGhpcy5zdGF0ZSwgbmV3U3RhdGUpO1xuICAgICAgdGhpcy5lbWl0KCdjaGFuZ2UnKTtcbiAgICB9XG4gIH1cblxuICByZXBsYWNlU3RhdGUobmV3U3RhdGUpIHtcbiAgICBpZiAodGhpcy5faXNIYW5kbGluZ0Rpc3BhdGNoKSB7XG4gICAgICB0aGlzLl9wZW5kaW5nU3RhdGUgPSB0aGlzLl9hc3NpZ25TdGF0ZSh1bmRlZmluZWQsIG5ld1N0YXRlKTtcbiAgICAgIHRoaXMuX2VtaXRDaGFuZ2VBZnRlckhhbmRsaW5nRGlzcGF0Y2ggPSB0cnVlO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnN0YXRlID0gdGhpcy5fYXNzaWduU3RhdGUodW5kZWZpbmVkLCBuZXdTdGF0ZSk7XG4gICAgICB0aGlzLmVtaXQoJ2NoYW5nZScpO1xuICAgIH1cbiAgfVxuXG4gIGdldFN0YXRlQXNPYmplY3QoKSB7XG4gICAgcmV0dXJuIHRoaXMuc3RhdGU7XG4gIH1cblxuICBzdGF0aWMgYXNzaWduU3RhdGUob2xkU3RhdGUsIG5ld1N0YXRlKSB7XG4gICAgcmV0dXJuIGFzc2lnbih7fSwgb2xkU3RhdGUsIG5ld1N0YXRlKTtcbiAgfVxuXG4gIF9hc3NpZ25TdGF0ZSguLi5hcmdzKXtcbiAgICByZXR1cm4gKHRoaXMuY29uc3RydWN0b3IuYXNzaWduU3RhdGUgfHwgU3RvcmUuYXNzaWduU3RhdGUpKC4uLmFyZ3MpO1xuICB9XG5cbiAgZm9yY2VVcGRhdGUoKSB7XG4gICAgaWYgKHRoaXMuX2lzSGFuZGxpbmdEaXNwYXRjaCkge1xuICAgICAgdGhpcy5fZW1pdENoYW5nZUFmdGVySGFuZGxpbmdEaXNwYXRjaCA9IHRydWU7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuZW1pdCgnY2hhbmdlJyk7XG4gICAgfVxuICB9XG5cbiAgcmVnaXN0ZXIoYWN0aW9uSWQsIGhhbmRsZXIpIHtcbiAgICBhY3Rpb25JZCA9IGVuc3VyZUFjdGlvbklkKGFjdGlvbklkKTtcblxuICAgIGlmICh0eXBlb2YgaGFuZGxlciAhPT0gJ2Z1bmN0aW9uJykgcmV0dXJuO1xuXG4gICAgdGhpcy5faGFuZGxlcnNbYWN0aW9uSWRdID0gaGFuZGxlci5iaW5kKHRoaXMpO1xuICB9XG5cbiAgcmVnaXN0ZXJBc3luYyhhY3Rpb25JZCwgYmVnaW5IYW5kbGVyLCBzdWNjZXNzSGFuZGxlciwgZmFpbHVyZUhhbmRsZXIpIHtcbiAgICBhY3Rpb25JZCA9IGVuc3VyZUFjdGlvbklkKGFjdGlvbklkKTtcblxuICAgIGNvbnN0IGFzeW5jSGFuZGxlcnMgPSB0aGlzLl9iaW5kQXN5bmNIYW5kbGVycyh7XG4gICAgICBiZWdpbjogYmVnaW5IYW5kbGVyLFxuICAgICAgc3VjY2Vzczogc3VjY2Vzc0hhbmRsZXIsXG4gICAgICBmYWlsdXJlOiBmYWlsdXJlSGFuZGxlcixcbiAgICB9KTtcblxuICAgIHRoaXMuX2FzeW5jSGFuZGxlcnNbYWN0aW9uSWRdID0gYXN5bmNIYW5kbGVycztcbiAgfVxuXG4gIHJlZ2lzdGVyQWxsKGhhbmRsZXIpIHtcbiAgICBpZiAodHlwZW9mIGhhbmRsZXIgIT09ICdmdW5jdGlvbicpIHJldHVybjtcblxuICAgIHRoaXMuX2NhdGNoQWxsSGFuZGxlcnMucHVzaChoYW5kbGVyLmJpbmQodGhpcykpO1xuICB9XG5cbiAgcmVnaXN0ZXJBbGxBc3luYyhiZWdpbkhhbmRsZXIsIHN1Y2Nlc3NIYW5kbGVyLCBmYWlsdXJlSGFuZGxlcikge1xuICAgIGNvbnN0IGFzeW5jSGFuZGxlcnMgPSB0aGlzLl9iaW5kQXN5bmNIYW5kbGVycyh7XG4gICAgICBiZWdpbjogYmVnaW5IYW5kbGVyLFxuICAgICAgc3VjY2Vzczogc3VjY2Vzc0hhbmRsZXIsXG4gICAgICBmYWlsdXJlOiBmYWlsdXJlSGFuZGxlcixcbiAgICB9KTtcblxuICAgIE9iamVjdC5rZXlzKGFzeW5jSGFuZGxlcnMpLmZvckVhY2goKGtleSkgPT4ge1xuICAgICAgdGhpcy5fY2F0Y2hBbGxBc3luY0hhbmRsZXJzW2tleV0ucHVzaChcbiAgICAgICAgYXN5bmNIYW5kbGVyc1trZXldXG4gICAgICApO1xuICAgIH0pO1xuICB9XG5cbiAgX2JpbmRBc3luY0hhbmRsZXJzKGFzeW5jSGFuZGxlcnMpIHtcbiAgICBmb3IgKGxldCBrZXkgaW4gYXN5bmNIYW5kbGVycykge1xuICAgICAgaWYgKCFhc3luY0hhbmRsZXJzLmhhc093blByb3BlcnR5KGtleSkpIGNvbnRpbnVlO1xuXG4gICAgICBjb25zdCBoYW5kbGVyID0gYXN5bmNIYW5kbGVyc1trZXldO1xuXG4gICAgICBpZiAodHlwZW9mIGhhbmRsZXIgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgYXN5bmNIYW5kbGVyc1trZXldID0gaGFuZGxlci5iaW5kKHRoaXMpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZGVsZXRlIGFzeW5jSGFuZGxlcnNba2V5XTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gYXN5bmNIYW5kbGVycztcbiAgfVxuXG4gIHdhaXRGb3IodG9rZW5zT3JTdG9yZXMpIHtcbiAgICB0aGlzLl93YWl0Rm9yKHRva2Vuc09yU3RvcmVzKTtcbiAgfVxuXG4gIGhhbmRsZXIocGF5bG9hZCkge1xuICAgIGNvbnN0IHtcbiAgICAgIGJvZHksXG4gICAgICBhY3Rpb25JZCxcbiAgICAgIGFzeW5jOiBfYXN5bmMsXG4gICAgICBhY3Rpb25BcmdzLFxuICAgICAgZXJyb3JcbiAgICB9ID0gcGF5bG9hZDtcblxuICAgIGNvbnN0IF9hbGxIYW5kbGVycyA9IHRoaXMuX2NhdGNoQWxsSGFuZGxlcnM7XG4gICAgY29uc3QgX2hhbmRsZXIgPSB0aGlzLl9oYW5kbGVyc1thY3Rpb25JZF07XG5cbiAgICBjb25zdCBfYWxsQXN5bmNIYW5kbGVycyA9IHRoaXMuX2NhdGNoQWxsQXN5bmNIYW5kbGVyc1tfYXN5bmNdO1xuICAgIGNvbnN0IF9hc3luY0hhbmRsZXIgPSB0aGlzLl9hc3luY0hhbmRsZXJzW2FjdGlvbklkXVxuICAgICAgJiYgdGhpcy5fYXN5bmNIYW5kbGVyc1thY3Rpb25JZF1bX2FzeW5jXTtcblxuICAgIGlmIChfYXN5bmMpIHtcbiAgICAgIGxldCBiZWdpbk9yRmFpbHVyZUhhbmRsZXJzID0gX2FsbEFzeW5jSGFuZGxlcnMuY29uY2F0KFtfYXN5bmNIYW5kbGVyXSk7XG5cbiAgICAgIHN3aXRjaCAoX2FzeW5jKSB7XG4gICAgICAgIGNhc2UgJ2JlZ2luJzpcbiAgICAgICAgICB0aGlzLl9wZXJmb3JtSGFuZGxlcihiZWdpbk9yRmFpbHVyZUhhbmRsZXJzLCBhY3Rpb25BcmdzKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIGNhc2UgJ2ZhaWx1cmUnOlxuICAgICAgICAgIHRoaXMuX3BlcmZvcm1IYW5kbGVyKGJlZ2luT3JGYWlsdXJlSGFuZGxlcnMsIFtlcnJvci5jb25jYXQoYWN0aW9uQXJncyldKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIGNhc2UgJ3N1Y2Nlc3MnOlxuICAgICAgICAgIHRoaXMuX3BlcmZvcm1IYW5kbGVyKF9hbGxBc3luY0hhbmRsZXJzLmNvbmNhdChbXG4gICAgICAgICAgICAoX2FzeW5jSGFuZGxlciB8fCBfaGFuZGxlcilcbiAgICAgICAgICBdKSwgW2JvZHldKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMuX3BlcmZvcm1IYW5kbGVyKF9hbGxIYW5kbGVycy5jb25jYXQoW19oYW5kbGVyXSksIFtib2R5XSk7XG4gIH1cblxuICBfcGVyZm9ybUhhbmRsZXIoX2hhbmRsZXJzLCBhcmdzKSB7XG4gICAgdGhpcy5faXNIYW5kbGluZ0Rpc3BhdGNoID0gdHJ1ZTtcbiAgICB0aGlzLl9wZW5kaW5nU3RhdGUgPSB0aGlzLl9hc3NpZ25TdGF0ZSh1bmRlZmluZWQsIHRoaXMuc3RhdGUpO1xuICAgIHRoaXMuX2VtaXRDaGFuZ2VBZnRlckhhbmRsaW5nRGlzcGF0Y2ggPSBmYWxzZTtcblxuICAgIHRyeSB7XG4gICAgICB0aGlzLl9wZXJmb3JtSGFuZGxlcnMoX2hhbmRsZXJzLCBhcmdzKTtcbiAgICB9IGZpbmFsbHkge1xuICAgICAgaWYgKHRoaXMuX2VtaXRDaGFuZ2VBZnRlckhhbmRsaW5nRGlzcGF0Y2gpIHtcbiAgICAgICAgdGhpcy5zdGF0ZSA9IHRoaXMuX3BlbmRpbmdTdGF0ZTtcbiAgICAgICAgdGhpcy5lbWl0KCdjaGFuZ2UnKTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5faXNIYW5kbGluZ0Rpc3BhdGNoID0gZmFsc2U7XG4gICAgICB0aGlzLl9wZW5kaW5nU3RhdGUgPSB1bmRlZmluZWQ7XG4gICAgICB0aGlzLl9lbWl0Q2hhbmdlQWZ0ZXJIYW5kbGluZ0Rpc3BhdGNoID0gZmFsc2U7XG4gICAgfVxuICB9XG5cbiAgX3BlcmZvcm1IYW5kbGVycyhfaGFuZGxlcnMsIGFyZ3MpIHtcbiAgICBfaGFuZGxlcnMuZm9yRWFjaChmdW5jdGlvbihfaGFuZGxlcikge1xuICAgICAgaWYgKHR5cGVvZiBfaGFuZGxlciAhPT0gJ2Z1bmN0aW9uJykgcmV0dXJuO1xuICAgICAgX2hhbmRsZXIuYXBwbHkodGhpcywgYXJncyk7XG4gICAgfS5iaW5kKHRoaXMpKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBlbnN1cmVBY3Rpb25JZChhY3Rpb25PckFjdGlvbklkKSB7XG4gIHJldHVybiB0eXBlb2YgYWN0aW9uT3JBY3Rpb25JZCA9PT0gJ2Z1bmN0aW9uJ1xuICAgID8gYWN0aW9uT3JBY3Rpb25JZC5faWRcbiAgICA6IGFjdGlvbk9yQWN0aW9uSWQ7XG59XG5cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL3NyYy9TdG9yZS5qc1xuICoqLyIsIi8qKlxuICogQWN0aW9uc1xuICpcbiAqIEluc3RhbmNlcyBvZiB0aGUgQWN0aW9ucyBjbGFzcyByZXByZXNlbnQgYSBzZXQgb2YgYWN0aW9ucy4gKEluIEZsdXggcGFybGFuY2UsXG4gKiB0aGVzZSBtaWdodCBiZSBtb3JlIGFjY3VyYXRlbHkgZGVub3RlZCBhcyBBY3Rpb24gQ3JlYXRvcnMsIHdoaWxlIEFjdGlvblxuICogcmVmZXJzIHRvIHRoZSBwYXlsb2FkIHNlbnQgdG8gdGhlIGRpc3BhdGNoZXIsIGJ1dCB0aGlzIGlzLi4uIGNvbmZ1c2luZy4gV2VcbiAqIHdpbGwgdXNlIEFjdGlvbiB0byBtZWFuIHRoZSBmdW5jdGlvbiB5b3UgY2FsbCB0byB0cmlnZ2VyIGEgZGlzcGF0Y2guKVxuICpcbiAqIENyZWF0ZSBhY3Rpb25zIGJ5IGV4dGVuZGluZyBmcm9tIHRoZSBiYXNlIEFjdGlvbnMgY2xhc3MgYW5kIGFkZGluZyBtZXRob2RzLlxuICogQWxsIG1ldGhvZHMgb24gdGhlIHByb3RvdHlwZSAoZXhjZXB0IHRoZSBjb25zdHJ1Y3Rvcikgd2lsbCBiZVxuICogY29udmVydGVkIGludG8gYWN0aW9ucy4gVGhlIHJldHVybiB2YWx1ZSBvZiBhbiBhY3Rpb24gaXMgdXNlZCBhcyB0aGUgYm9keVxuICogb2YgdGhlIHBheWxvYWQgc2VudCB0byB0aGUgZGlzcGF0Y2hlci5cbiAqL1xuXG5pbXBvcnQgdW5pcXVlSWQgZnJvbSAndW5pcXVlaWQnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBBY3Rpb25zIHtcblxuICBjb25zdHJ1Y3RvcigpIHtcblxuICAgIHRoaXMuX2Jhc2VJZCA9IHVuaXF1ZUlkKCk7XG5cbiAgICBjb25zdCBtZXRob2ROYW1lcyA9IHRoaXMuX2dldEFjdGlvbk1ldGhvZE5hbWVzKCk7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBtZXRob2ROYW1lcy5sZW5ndGg7IGkrKykge1xuICAgICAgY29uc3QgbWV0aG9kTmFtZSA9IG1ldGhvZE5hbWVzW2ldO1xuICAgICAgdGhpcy5fd3JhcEFjdGlvbihtZXRob2ROYW1lKTtcbiAgICB9XG5cbiAgICB0aGlzLmdldENvbnN0YW50cyA9IHRoaXMuZ2V0QWN0aW9uSWRzO1xuICB9XG5cbiAgZ2V0QWN0aW9uSWRzKCkge1xuICAgIHJldHVybiB0aGlzLl9nZXRBY3Rpb25NZXRob2ROYW1lcygpLnJlZHVjZSgocmVzdWx0LCBhY3Rpb25OYW1lKSA9PiB7XG4gICAgICByZXN1bHRbYWN0aW9uTmFtZV0gPSB0aGlzW2FjdGlvbk5hbWVdLl9pZDtcbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfSwge30pO1xuICB9XG5cbiAgX2dldEFjdGlvbk1ldGhvZE5hbWVzKGluc3RhbmNlKSB7XG4gICAgcmV0dXJuIE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKHRoaXMuY29uc3RydWN0b3IucHJvdG90eXBlKVxuICAgICAgLmZpbHRlcihuYW1lID0+XG4gICAgICAgIG5hbWUgIT09ICdjb25zdHJ1Y3RvcicgJiZcbiAgICAgICAgdHlwZW9mIHRoaXNbbmFtZV0gPT09ICdmdW5jdGlvbidcbiAgICAgICk7XG4gIH1cblxuICBfd3JhcEFjdGlvbihtZXRob2ROYW1lKSB7XG4gICAgY29uc3Qgb3JpZ2luYWxNZXRob2QgPSB0aGlzW21ldGhvZE5hbWVdO1xuICAgIGNvbnN0IGFjdGlvbklkID0gdGhpcy5fY3JlYXRlQWN0aW9uSWQobWV0aG9kTmFtZSk7XG5cbiAgICBjb25zdCBhY3Rpb24gPSAoLi4uYXJncykgPT4ge1xuICAgICAgY29uc3QgYm9keSA9IG9yaWdpbmFsTWV0aG9kLmFwcGx5KHRoaXMsIGFyZ3MpO1xuXG4gICAgICBpZiAoaXNQcm9taXNlKGJvZHkpKSB7XG4gICAgICAgIGNvbnN0IHByb21pc2UgPSBib2R5O1xuICAgICAgICB0aGlzLl9kaXNwYXRjaEFzeW5jKGFjdGlvbklkLCBwcm9taXNlLCBhcmdzLCBtZXRob2ROYW1lKVxuICAgICAgICAgIC8vIENhdGNoIGVycm9ycyBhbmQgZG8gbm90aGluZ1xuICAgICAgICAgIC8vIFRoZXkgY2FuIGJlIGhhbmRsZWQgYnkgc3RvcmUgb3IgY2FsbGVyXG4gICAgICAgICAgLmNhdGNoKGVycm9yID0+IHt9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuX2Rpc3BhdGNoKGFjdGlvbklkLCBib2R5LCBhcmdzLCBtZXRob2ROYW1lKTtcbiAgICAgIH1cblxuICAgICAgLy8gUmV0dXJuIG9yaWdpbmFsIG1ldGhvZCdzIHJldHVybiB2YWx1ZSB0byBjYWxsZXJcbiAgICAgIHJldHVybiBib2R5O1xuICAgIH07XG5cbiAgICBhY3Rpb24uX2lkID0gYWN0aW9uSWQ7XG5cbiAgICB0aGlzW21ldGhvZE5hbWVdID0gYWN0aW9uO1xuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZSB1bmlxdWUgc3RyaW5nIGNvbnN0YW50IGZvciBhbiBhY3Rpb24gbWV0aG9kLCB1c2luZ1xuICAgKiBAcGFyYW0ge3N0cmluZ30gbWV0aG9kTmFtZSAtIE5hbWUgb2YgdGhlIGFjdGlvbiBtZXRob2RcbiAgICovXG4gIF9jcmVhdGVBY3Rpb25JZChtZXRob2ROYW1lKSB7XG4gICAgcmV0dXJuIGAke3RoaXMuX2Jhc2VJZH0tJHttZXRob2ROYW1lfWA7XG4gIH1cblxuICBfZGlzcGF0Y2goYWN0aW9uSWQsIGJvZHksIGFyZ3MsIG1ldGhvZE5hbWUpIHtcbiAgICBpZiAodHlwZW9mIHRoaXMuZGlzcGF0Y2ggPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIGlmICh0eXBlb2YgYm9keSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgdGhpcy5kaXNwYXRjaChhY3Rpb25JZCwgYm9keSwgYXJncyk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSB7XG4gICAgICAgIGNvbnNvbGUud2FybihcbiAgICAgICAgICBgWW91J3ZlIGF0dGVtcHRlZCB0byBwZXJmb3JtIHRoZSBhY3Rpb24gYFxuICAgICAgICArIGAke3RoaXMuY29uc3RydWN0b3IubmFtZX0jJHttZXRob2ROYW1lfSwgYnV0IGl0IGhhc24ndCBiZWVuIGFkZGVkIGBcbiAgICAgICAgKyBgdG8gYSBGbHV4IGluc3RhbmNlLmBcbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gYm9keTtcbiAgfVxuXG4gIF9kaXNwYXRjaEFzeW5jKGFjdGlvbklkLCBwcm9taXNlLCBhcmdzLCBtZXRob2ROYW1lKSB7XG4gICAgaWYgKHR5cGVvZiB0aGlzLmRpc3BhdGNoQXN5bmMgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIHJldHVybiB0aGlzLmRpc3BhdGNoQXN5bmMoYWN0aW9uSWQsIHByb21pc2UsIGFyZ3MpO1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykge1xuICAgICAgICBjb25zb2xlLndhcm4oXG4gICAgICAgICAgYFlvdSd2ZSBhdHRlbXB0ZWQgdG8gcGVyZm9ybSB0aGUgYXN5bmNocm9ub3VzIGFjdGlvbiBgXG4gICAgICAgICsgYCR7dGhpcy5jb25zdHJ1Y3Rvci5uYW1lfSMke21ldGhvZE5hbWV9LCBidXQgaXQgaGFzbid0IGJlZW4gYWRkZWQgYFxuICAgICAgICArIGB0byBhIEZsdXggaW5zdGFuY2UuYFxuICAgICAgICApO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gcHJvbWlzZTtcbiAgICB9XG5cbiAgfVxuXG59XG5cbmZ1bmN0aW9uIGlzUHJvbWlzZSh2YWx1ZSkge1xuICByZXR1cm4gdmFsdWUgJiYgdHlwZW9mIHZhbHVlLnRoZW4gPT09ICdmdW5jdGlvbic7XG59XG5cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL3NyYy9BY3Rpb25zLmpzXG4gKiovIiwiLyoqXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTQsIEZhY2Vib29rLCBJbmMuXG4gKiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIEJTRC1zdHlsZSBsaWNlbnNlIGZvdW5kIGluIHRoZVxuICogTElDRU5TRSBmaWxlIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLiBBbiBhZGRpdGlvbmFsIGdyYW50XG4gKiBvZiBwYXRlbnQgcmlnaHRzIGNhbiBiZSBmb3VuZCBpbiB0aGUgUEFURU5UUyBmaWxlIGluIHRoZSBzYW1lIGRpcmVjdG9yeS5cbiAqL1xuXG5tb2R1bGUuZXhwb3J0cy5EaXNwYXRjaGVyID0gcmVxdWlyZSgnLi9saWIvRGlzcGF0Y2hlcicpXG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vfi9mbHV4L2luZGV4LmpzXG4gKiogbW9kdWxlIGlkID0gM1xuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwiJ3VzZSBzdHJpY3QnO1xuXG4vKipcbiAqIFJlcHJlc2VudGF0aW9uIG9mIGEgc2luZ2xlIEV2ZW50RW1pdHRlciBmdW5jdGlvbi5cbiAqXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmbiBFdmVudCBoYW5kbGVyIHRvIGJlIGNhbGxlZC5cbiAqIEBwYXJhbSB7TWl4ZWR9IGNvbnRleHQgQ29udGV4dCBmb3IgZnVuY3Rpb24gZXhlY3V0aW9uLlxuICogQHBhcmFtIHtCb29sZWFufSBvbmNlIE9ubHkgZW1pdCBvbmNlXG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuZnVuY3Rpb24gRUUoZm4sIGNvbnRleHQsIG9uY2UpIHtcbiAgdGhpcy5mbiA9IGZuO1xuICB0aGlzLmNvbnRleHQgPSBjb250ZXh0O1xuICB0aGlzLm9uY2UgPSBvbmNlIHx8IGZhbHNlO1xufVxuXG4vKipcbiAqIE1pbmltYWwgRXZlbnRFbWl0dGVyIGludGVyZmFjZSB0aGF0IGlzIG1vbGRlZCBhZ2FpbnN0IHRoZSBOb2RlLmpzXG4gKiBFdmVudEVtaXR0ZXIgaW50ZXJmYWNlLlxuICpcbiAqIEBjb25zdHJ1Y3RvclxuICogQGFwaSBwdWJsaWNcbiAqL1xuZnVuY3Rpb24gRXZlbnRFbWl0dGVyKCkgeyAvKiBOb3RoaW5nIHRvIHNldCAqLyB9XG5cbi8qKlxuICogSG9sZHMgdGhlIGFzc2lnbmVkIEV2ZW50RW1pdHRlcnMgYnkgbmFtZS5cbiAqXG4gKiBAdHlwZSB7T2JqZWN0fVxuICogQHByaXZhdGVcbiAqL1xuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5fZXZlbnRzID0gdW5kZWZpbmVkO1xuXG4vKipcbiAqIFJldHVybiBhIGxpc3Qgb2YgYXNzaWduZWQgZXZlbnQgbGlzdGVuZXJzLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBldmVudCBUaGUgZXZlbnRzIHRoYXQgc2hvdWxkIGJlIGxpc3RlZC5cbiAqIEByZXR1cm5zIHtBcnJheX1cbiAqIEBhcGkgcHVibGljXG4gKi9cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUubGlzdGVuZXJzID0gZnVuY3Rpb24gbGlzdGVuZXJzKGV2ZW50KSB7XG4gIGlmICghdGhpcy5fZXZlbnRzIHx8ICF0aGlzLl9ldmVudHNbZXZlbnRdKSByZXR1cm4gW107XG4gIGlmICh0aGlzLl9ldmVudHNbZXZlbnRdLmZuKSByZXR1cm4gW3RoaXMuX2V2ZW50c1tldmVudF0uZm5dO1xuXG4gIGZvciAodmFyIGkgPSAwLCBsID0gdGhpcy5fZXZlbnRzW2V2ZW50XS5sZW5ndGgsIGVlID0gbmV3IEFycmF5KGwpOyBpIDwgbDsgaSsrKSB7XG4gICAgZWVbaV0gPSB0aGlzLl9ldmVudHNbZXZlbnRdW2ldLmZuO1xuICB9XG5cbiAgcmV0dXJuIGVlO1xufTtcblxuLyoqXG4gKiBFbWl0IGFuIGV2ZW50IHRvIGFsbCByZWdpc3RlcmVkIGV2ZW50IGxpc3RlbmVycy5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gZXZlbnQgVGhlIG5hbWUgb2YgdGhlIGV2ZW50LlxuICogQHJldHVybnMge0Jvb2xlYW59IEluZGljYXRpb24gaWYgd2UndmUgZW1pdHRlZCBhbiBldmVudC5cbiAqIEBhcGkgcHVibGljXG4gKi9cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuZW1pdCA9IGZ1bmN0aW9uIGVtaXQoZXZlbnQsIGExLCBhMiwgYTMsIGE0LCBhNSkge1xuICBpZiAoIXRoaXMuX2V2ZW50cyB8fCAhdGhpcy5fZXZlbnRzW2V2ZW50XSkgcmV0dXJuIGZhbHNlO1xuXG4gIHZhciBsaXN0ZW5lcnMgPSB0aGlzLl9ldmVudHNbZXZlbnRdXG4gICAgLCBsZW4gPSBhcmd1bWVudHMubGVuZ3RoXG4gICAgLCBhcmdzXG4gICAgLCBpO1xuXG4gIGlmICgnZnVuY3Rpb24nID09PSB0eXBlb2YgbGlzdGVuZXJzLmZuKSB7XG4gICAgaWYgKGxpc3RlbmVycy5vbmNlKSB0aGlzLnJlbW92ZUxpc3RlbmVyKGV2ZW50LCBsaXN0ZW5lcnMuZm4sIHRydWUpO1xuXG4gICAgc3dpdGNoIChsZW4pIHtcbiAgICAgIGNhc2UgMTogcmV0dXJuIGxpc3RlbmVycy5mbi5jYWxsKGxpc3RlbmVycy5jb250ZXh0KSwgdHJ1ZTtcbiAgICAgIGNhc2UgMjogcmV0dXJuIGxpc3RlbmVycy5mbi5jYWxsKGxpc3RlbmVycy5jb250ZXh0LCBhMSksIHRydWU7XG4gICAgICBjYXNlIDM6IHJldHVybiBsaXN0ZW5lcnMuZm4uY2FsbChsaXN0ZW5lcnMuY29udGV4dCwgYTEsIGEyKSwgdHJ1ZTtcbiAgICAgIGNhc2UgNDogcmV0dXJuIGxpc3RlbmVycy5mbi5jYWxsKGxpc3RlbmVycy5jb250ZXh0LCBhMSwgYTIsIGEzKSwgdHJ1ZTtcbiAgICAgIGNhc2UgNTogcmV0dXJuIGxpc3RlbmVycy5mbi5jYWxsKGxpc3RlbmVycy5jb250ZXh0LCBhMSwgYTIsIGEzLCBhNCksIHRydWU7XG4gICAgICBjYXNlIDY6IHJldHVybiBsaXN0ZW5lcnMuZm4uY2FsbChsaXN0ZW5lcnMuY29udGV4dCwgYTEsIGEyLCBhMywgYTQsIGE1KSwgdHJ1ZTtcbiAgICB9XG5cbiAgICBmb3IgKGkgPSAxLCBhcmdzID0gbmV3IEFycmF5KGxlbiAtMSk7IGkgPCBsZW47IGkrKykge1xuICAgICAgYXJnc1tpIC0gMV0gPSBhcmd1bWVudHNbaV07XG4gICAgfVxuXG4gICAgbGlzdGVuZXJzLmZuLmFwcGx5KGxpc3RlbmVycy5jb250ZXh0LCBhcmdzKTtcbiAgfSBlbHNlIHtcbiAgICB2YXIgbGVuZ3RoID0gbGlzdGVuZXJzLmxlbmd0aFxuICAgICAgLCBqO1xuXG4gICAgZm9yIChpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICBpZiAobGlzdGVuZXJzW2ldLm9uY2UpIHRoaXMucmVtb3ZlTGlzdGVuZXIoZXZlbnQsIGxpc3RlbmVyc1tpXS5mbiwgdHJ1ZSk7XG5cbiAgICAgIHN3aXRjaCAobGVuKSB7XG4gICAgICAgIGNhc2UgMTogbGlzdGVuZXJzW2ldLmZuLmNhbGwobGlzdGVuZXJzW2ldLmNvbnRleHQpOyBicmVhaztcbiAgICAgICAgY2FzZSAyOiBsaXN0ZW5lcnNbaV0uZm4uY2FsbChsaXN0ZW5lcnNbaV0uY29udGV4dCwgYTEpOyBicmVhaztcbiAgICAgICAgY2FzZSAzOiBsaXN0ZW5lcnNbaV0uZm4uY2FsbChsaXN0ZW5lcnNbaV0uY29udGV4dCwgYTEsIGEyKTsgYnJlYWs7XG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgaWYgKCFhcmdzKSBmb3IgKGogPSAxLCBhcmdzID0gbmV3IEFycmF5KGxlbiAtMSk7IGogPCBsZW47IGorKykge1xuICAgICAgICAgICAgYXJnc1tqIC0gMV0gPSBhcmd1bWVudHNbal07XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgbGlzdGVuZXJzW2ldLmZuLmFwcGx5KGxpc3RlbmVyc1tpXS5jb250ZXh0LCBhcmdzKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZXR1cm4gdHJ1ZTtcbn07XG5cbi8qKlxuICogUmVnaXN0ZXIgYSBuZXcgRXZlbnRMaXN0ZW5lciBmb3IgdGhlIGdpdmVuIGV2ZW50LlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBldmVudCBOYW1lIG9mIHRoZSBldmVudC5cbiAqIEBwYXJhbSB7RnVuY3Rvbn0gZm4gQ2FsbGJhY2sgZnVuY3Rpb24uXG4gKiBAcGFyYW0ge01peGVkfSBjb250ZXh0IFRoZSBjb250ZXh0IG9mIHRoZSBmdW5jdGlvbi5cbiAqIEBhcGkgcHVibGljXG4gKi9cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUub24gPSBmdW5jdGlvbiBvbihldmVudCwgZm4sIGNvbnRleHQpIHtcbiAgdmFyIGxpc3RlbmVyID0gbmV3IEVFKGZuLCBjb250ZXh0IHx8IHRoaXMpO1xuXG4gIGlmICghdGhpcy5fZXZlbnRzKSB0aGlzLl9ldmVudHMgPSB7fTtcbiAgaWYgKCF0aGlzLl9ldmVudHNbZXZlbnRdKSB0aGlzLl9ldmVudHNbZXZlbnRdID0gbGlzdGVuZXI7XG4gIGVsc2Uge1xuICAgIGlmICghdGhpcy5fZXZlbnRzW2V2ZW50XS5mbikgdGhpcy5fZXZlbnRzW2V2ZW50XS5wdXNoKGxpc3RlbmVyKTtcbiAgICBlbHNlIHRoaXMuX2V2ZW50c1tldmVudF0gPSBbXG4gICAgICB0aGlzLl9ldmVudHNbZXZlbnRdLCBsaXN0ZW5lclxuICAgIF07XG4gIH1cblxuICByZXR1cm4gdGhpcztcbn07XG5cbi8qKlxuICogQWRkIGFuIEV2ZW50TGlzdGVuZXIgdGhhdCdzIG9ubHkgY2FsbGVkIG9uY2UuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGV2ZW50IE5hbWUgb2YgdGhlIGV2ZW50LlxuICogQHBhcmFtIHtGdW5jdGlvbn0gZm4gQ2FsbGJhY2sgZnVuY3Rpb24uXG4gKiBAcGFyYW0ge01peGVkfSBjb250ZXh0IFRoZSBjb250ZXh0IG9mIHRoZSBmdW5jdGlvbi5cbiAqIEBhcGkgcHVibGljXG4gKi9cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUub25jZSA9IGZ1bmN0aW9uIG9uY2UoZXZlbnQsIGZuLCBjb250ZXh0KSB7XG4gIHZhciBsaXN0ZW5lciA9IG5ldyBFRShmbiwgY29udGV4dCB8fCB0aGlzLCB0cnVlKTtcblxuICBpZiAoIXRoaXMuX2V2ZW50cykgdGhpcy5fZXZlbnRzID0ge307XG4gIGlmICghdGhpcy5fZXZlbnRzW2V2ZW50XSkgdGhpcy5fZXZlbnRzW2V2ZW50XSA9IGxpc3RlbmVyO1xuICBlbHNlIHtcbiAgICBpZiAoIXRoaXMuX2V2ZW50c1tldmVudF0uZm4pIHRoaXMuX2V2ZW50c1tldmVudF0ucHVzaChsaXN0ZW5lcik7XG4gICAgZWxzZSB0aGlzLl9ldmVudHNbZXZlbnRdID0gW1xuICAgICAgdGhpcy5fZXZlbnRzW2V2ZW50XSwgbGlzdGVuZXJcbiAgICBdO1xuICB9XG5cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbiAqIFJlbW92ZSBldmVudCBsaXN0ZW5lcnMuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGV2ZW50IFRoZSBldmVudCB3ZSB3YW50IHRvIHJlbW92ZS5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZuIFRoZSBsaXN0ZW5lciB0aGF0IHdlIG5lZWQgdG8gZmluZC5cbiAqIEBwYXJhbSB7Qm9vbGVhbn0gb25jZSBPbmx5IHJlbW92ZSBvbmNlIGxpc3RlbmVycy5cbiAqIEBhcGkgcHVibGljXG4gKi9cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUucmVtb3ZlTGlzdGVuZXIgPSBmdW5jdGlvbiByZW1vdmVMaXN0ZW5lcihldmVudCwgZm4sIG9uY2UpIHtcbiAgaWYgKCF0aGlzLl9ldmVudHMgfHwgIXRoaXMuX2V2ZW50c1tldmVudF0pIHJldHVybiB0aGlzO1xuXG4gIHZhciBsaXN0ZW5lcnMgPSB0aGlzLl9ldmVudHNbZXZlbnRdXG4gICAgLCBldmVudHMgPSBbXTtcblxuICBpZiAoZm4pIHtcbiAgICBpZiAobGlzdGVuZXJzLmZuICYmIChsaXN0ZW5lcnMuZm4gIT09IGZuIHx8IChvbmNlICYmICFsaXN0ZW5lcnMub25jZSkpKSB7XG4gICAgICBldmVudHMucHVzaChsaXN0ZW5lcnMpO1xuICAgIH1cbiAgICBpZiAoIWxpc3RlbmVycy5mbikgZm9yICh2YXIgaSA9IDAsIGxlbmd0aCA9IGxpc3RlbmVycy5sZW5ndGg7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgaWYgKGxpc3RlbmVyc1tpXS5mbiAhPT0gZm4gfHwgKG9uY2UgJiYgIWxpc3RlbmVyc1tpXS5vbmNlKSkge1xuICAgICAgICBldmVudHMucHVzaChsaXN0ZW5lcnNbaV0pO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8vXG4gIC8vIFJlc2V0IHRoZSBhcnJheSwgb3IgcmVtb3ZlIGl0IGNvbXBsZXRlbHkgaWYgd2UgaGF2ZSBubyBtb3JlIGxpc3RlbmVycy5cbiAgLy9cbiAgaWYgKGV2ZW50cy5sZW5ndGgpIHtcbiAgICB0aGlzLl9ldmVudHNbZXZlbnRdID0gZXZlbnRzLmxlbmd0aCA9PT0gMSA/IGV2ZW50c1swXSA6IGV2ZW50cztcbiAgfSBlbHNlIHtcbiAgICBkZWxldGUgdGhpcy5fZXZlbnRzW2V2ZW50XTtcbiAgfVxuXG4gIHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4gKiBSZW1vdmUgYWxsIGxpc3RlbmVycyBvciBvbmx5IHRoZSBsaXN0ZW5lcnMgZm9yIHRoZSBzcGVjaWZpZWQgZXZlbnQuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGV2ZW50IFRoZSBldmVudCB3YW50IHRvIHJlbW92ZSBhbGwgbGlzdGVuZXJzIGZvci5cbiAqIEBhcGkgcHVibGljXG4gKi9cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUucmVtb3ZlQWxsTGlzdGVuZXJzID0gZnVuY3Rpb24gcmVtb3ZlQWxsTGlzdGVuZXJzKGV2ZW50KSB7XG4gIGlmICghdGhpcy5fZXZlbnRzKSByZXR1cm4gdGhpcztcblxuICBpZiAoZXZlbnQpIGRlbGV0ZSB0aGlzLl9ldmVudHNbZXZlbnRdO1xuICBlbHNlIHRoaXMuX2V2ZW50cyA9IHt9O1xuXG4gIHJldHVybiB0aGlzO1xufTtcblxuLy9cbi8vIEFsaWFzIG1ldGhvZHMgbmFtZXMgYmVjYXVzZSBwZW9wbGUgcm9sbCBsaWtlIHRoYXQuXG4vL1xuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5vZmYgPSBFdmVudEVtaXR0ZXIucHJvdG90eXBlLnJlbW92ZUxpc3RlbmVyO1xuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5hZGRMaXN0ZW5lciA9IEV2ZW50RW1pdHRlci5wcm90b3R5cGUub247XG5cbi8vXG4vLyBUaGlzIGZ1bmN0aW9uIGRvZXNuJ3QgYXBwbHkgYW55bW9yZS5cbi8vXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLnNldE1heExpc3RlbmVycyA9IGZ1bmN0aW9uIHNldE1heExpc3RlbmVycygpIHtcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vL1xuLy8gRXhwb3NlIHRoZSBtb2R1bGUuXG4vL1xuRXZlbnRFbWl0dGVyLkV2ZW50RW1pdHRlciA9IEV2ZW50RW1pdHRlcjtcbkV2ZW50RW1pdHRlci5FdmVudEVtaXR0ZXIyID0gRXZlbnRFbWl0dGVyO1xuRXZlbnRFbWl0dGVyLkV2ZW50RW1pdHRlcjMgPSBFdmVudEVtaXR0ZXI7XG5cbi8vXG4vLyBFeHBvc2UgdGhlIG1vZHVsZS5cbi8vXG5tb2R1bGUuZXhwb3J0cyA9IEV2ZW50RW1pdHRlcjtcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9+L2V2ZW50ZW1pdHRlcjMvaW5kZXguanNcbiAqKiBtb2R1bGUgaWQgPSA0XG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCIndXNlIHN0cmljdCc7XG5cbmZ1bmN0aW9uIFRvT2JqZWN0KHZhbCkge1xuXHRpZiAodmFsID09IG51bGwpIHtcblx0XHR0aHJvdyBuZXcgVHlwZUVycm9yKCdPYmplY3QuYXNzaWduIGNhbm5vdCBiZSBjYWxsZWQgd2l0aCBudWxsIG9yIHVuZGVmaW5lZCcpO1xuXHR9XG5cblx0cmV0dXJuIE9iamVjdCh2YWwpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IE9iamVjdC5hc3NpZ24gfHwgZnVuY3Rpb24gKHRhcmdldCwgc291cmNlKSB7XG5cdHZhciBmcm9tO1xuXHR2YXIga2V5cztcblx0dmFyIHRvID0gVG9PYmplY3QodGFyZ2V0KTtcblxuXHRmb3IgKHZhciBzID0gMTsgcyA8IGFyZ3VtZW50cy5sZW5ndGg7IHMrKykge1xuXHRcdGZyb20gPSBhcmd1bWVudHNbc107XG5cdFx0a2V5cyA9IE9iamVjdC5rZXlzKE9iamVjdChmcm9tKSk7XG5cblx0XHRmb3IgKHZhciBpID0gMDsgaSA8IGtleXMubGVuZ3RoOyBpKyspIHtcblx0XHRcdHRvW2tleXNbaV1dID0gZnJvbVtrZXlzW2ldXTtcblx0XHR9XG5cdH1cblxuXHRyZXR1cm4gdG87XG59O1xuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL34vb2JqZWN0LWFzc2lnbi9pbmRleC5qc1xuICoqIG1vZHVsZSBpZCA9IDVcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsIid1c2Ugc3RyaWN0JztcblxuXG52YXIgY291bnQgPSAwO1xuXG4vKipcbiAqIEdlbmVyYXRlIGEgdW5pcXVlIElELlxuICpcbiAqIE9wdGlvbmFsbHkgcGFzcyBhIHByZWZpeCB0byBwcmVwZW5kLCBhIHN1ZmZpeCB0byBhcHBlbmQsIG9yIGFcbiAqIG11bHRpcGxpZXIgdG8gdXNlIG9uIHRoZSBJRC5cbiAqXG4gKiBgYGBqc1xuICogdW5pcXVlSWQoKTsgLy89PiAnMjUnXG4gKlxuICogdW5pcXVlSWQoe3ByZWZpeDogJ2FwcGxlXyd9KTtcbiAqIC8vPT4gJ2FwcGxlXzEwJ1xuICpcbiAqIHVuaXF1ZUlkKHtzdWZmaXg6ICdfb3JhbmdlJ30pO1xuICogLy89PiAnMTBfb3JhbmdlJ1xuICpcbiAqIHVuaXF1ZUlkKHttdWx0aXBsaWVyOiA1fSk7XG4gKiAvLz0+IDUsIDEwLCAxNSwgMjAuLi5cbiAqIGBgYFxuICpcbiAqIFRvIHJlc2V0IHRoZSBgaWRgIHRvIHplcm8sIGRvIGBpZC5yZXNldCgpYC5cbiAqXG4gKiBAcGFyYW0gIHtPYmplY3R9IGBvcHRpb25zYCBPcHRpb25hbGx5IHBhc3MgYSBgcHJlZml4YCwgYHN1ZmZpeGAgYW5kL29yIGBtdWx0aXBsaWVyLlxuICogQHJldHVybiB7U3RyaW5nfSBUaGUgdW5pcXVlIGlkLlxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG52YXIgaWQgPSBtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChvcHRpb25zKSB7XG4gIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuXG4gIHZhciBwcmVmaXggPSBvcHRpb25zLnByZWZpeDtcbiAgdmFyIHN1ZmZpeCA9IG9wdGlvbnMuc3VmZml4O1xuXG4gIHZhciBpZCA9ICsrY291bnQgKiAob3B0aW9ucy5tdWx0aXBsaWVyIHx8IDEpO1xuXG4gIGlmIChwcmVmaXggPT0gbnVsbCkge1xuICAgIHByZWZpeCA9ICcnO1xuICB9XG5cbiAgaWYgKHN1ZmZpeCA9PSBudWxsKSB7XG4gICAgc3VmZml4ID0gJyc7XG4gIH1cblxuICByZXR1cm4gU3RyaW5nKHByZWZpeCkgKyBpZCArIFN0cmluZyhzdWZmaXgpO1xufTtcblxuXG5pZC5yZXNldCA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gY291bnQgPSAwO1xufTtcblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vfi91bmlxdWVpZC9pbmRleC5qc1xuICoqIG1vZHVsZSBpZCA9IDZcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsIi8qXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTQsIEZhY2Vib29rLCBJbmMuXG4gKiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIEJTRC1zdHlsZSBsaWNlbnNlIGZvdW5kIGluIHRoZVxuICogTElDRU5TRSBmaWxlIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLiBBbiBhZGRpdGlvbmFsIGdyYW50XG4gKiBvZiBwYXRlbnQgcmlnaHRzIGNhbiBiZSBmb3VuZCBpbiB0aGUgUEFURU5UUyBmaWxlIGluIHRoZSBzYW1lIGRpcmVjdG9yeS5cbiAqXG4gKiBAcHJvdmlkZXNNb2R1bGUgRGlzcGF0Y2hlclxuICogQHR5cGVjaGVja3NcbiAqL1xuXG5cInVzZSBzdHJpY3RcIjtcblxudmFyIGludmFyaWFudCA9IHJlcXVpcmUoJy4vaW52YXJpYW50Jyk7XG5cbnZhciBfbGFzdElEID0gMTtcbnZhciBfcHJlZml4ID0gJ0lEXyc7XG5cbi8qKlxuICogRGlzcGF0Y2hlciBpcyB1c2VkIHRvIGJyb2FkY2FzdCBwYXlsb2FkcyB0byByZWdpc3RlcmVkIGNhbGxiYWNrcy4gVGhpcyBpc1xuICogZGlmZmVyZW50IGZyb20gZ2VuZXJpYyBwdWItc3ViIHN5c3RlbXMgaW4gdHdvIHdheXM6XG4gKlxuICogICAxKSBDYWxsYmFja3MgYXJlIG5vdCBzdWJzY3JpYmVkIHRvIHBhcnRpY3VsYXIgZXZlbnRzLiBFdmVyeSBwYXlsb2FkIGlzXG4gKiAgICAgIGRpc3BhdGNoZWQgdG8gZXZlcnkgcmVnaXN0ZXJlZCBjYWxsYmFjay5cbiAqICAgMikgQ2FsbGJhY2tzIGNhbiBiZSBkZWZlcnJlZCBpbiB3aG9sZSBvciBwYXJ0IHVudGlsIG90aGVyIGNhbGxiYWNrcyBoYXZlXG4gKiAgICAgIGJlZW4gZXhlY3V0ZWQuXG4gKlxuICogRm9yIGV4YW1wbGUsIGNvbnNpZGVyIHRoaXMgaHlwb3RoZXRpY2FsIGZsaWdodCBkZXN0aW5hdGlvbiBmb3JtLCB3aGljaFxuICogc2VsZWN0cyBhIGRlZmF1bHQgY2l0eSB3aGVuIGEgY291bnRyeSBpcyBzZWxlY3RlZDpcbiAqXG4gKiAgIHZhciBmbGlnaHREaXNwYXRjaGVyID0gbmV3IERpc3BhdGNoZXIoKTtcbiAqXG4gKiAgIC8vIEtlZXBzIHRyYWNrIG9mIHdoaWNoIGNvdW50cnkgaXMgc2VsZWN0ZWRcbiAqICAgdmFyIENvdW50cnlTdG9yZSA9IHtjb3VudHJ5OiBudWxsfTtcbiAqXG4gKiAgIC8vIEtlZXBzIHRyYWNrIG9mIHdoaWNoIGNpdHkgaXMgc2VsZWN0ZWRcbiAqICAgdmFyIENpdHlTdG9yZSA9IHtjaXR5OiBudWxsfTtcbiAqXG4gKiAgIC8vIEtlZXBzIHRyYWNrIG9mIHRoZSBiYXNlIGZsaWdodCBwcmljZSBvZiB0aGUgc2VsZWN0ZWQgY2l0eVxuICogICB2YXIgRmxpZ2h0UHJpY2VTdG9yZSA9IHtwcmljZTogbnVsbH1cbiAqXG4gKiBXaGVuIGEgdXNlciBjaGFuZ2VzIHRoZSBzZWxlY3RlZCBjaXR5LCB3ZSBkaXNwYXRjaCB0aGUgcGF5bG9hZDpcbiAqXG4gKiAgIGZsaWdodERpc3BhdGNoZXIuZGlzcGF0Y2goe1xuICogICAgIGFjdGlvblR5cGU6ICdjaXR5LXVwZGF0ZScsXG4gKiAgICAgc2VsZWN0ZWRDaXR5OiAncGFyaXMnXG4gKiAgIH0pO1xuICpcbiAqIFRoaXMgcGF5bG9hZCBpcyBkaWdlc3RlZCBieSBgQ2l0eVN0b3JlYDpcbiAqXG4gKiAgIGZsaWdodERpc3BhdGNoZXIucmVnaXN0ZXIoZnVuY3Rpb24ocGF5bG9hZCkge1xuICogICAgIGlmIChwYXlsb2FkLmFjdGlvblR5cGUgPT09ICdjaXR5LXVwZGF0ZScpIHtcbiAqICAgICAgIENpdHlTdG9yZS5jaXR5ID0gcGF5bG9hZC5zZWxlY3RlZENpdHk7XG4gKiAgICAgfVxuICogICB9KTtcbiAqXG4gKiBXaGVuIHRoZSB1c2VyIHNlbGVjdHMgYSBjb3VudHJ5LCB3ZSBkaXNwYXRjaCB0aGUgcGF5bG9hZDpcbiAqXG4gKiAgIGZsaWdodERpc3BhdGNoZXIuZGlzcGF0Y2goe1xuICogICAgIGFjdGlvblR5cGU6ICdjb3VudHJ5LXVwZGF0ZScsXG4gKiAgICAgc2VsZWN0ZWRDb3VudHJ5OiAnYXVzdHJhbGlhJ1xuICogICB9KTtcbiAqXG4gKiBUaGlzIHBheWxvYWQgaXMgZGlnZXN0ZWQgYnkgYm90aCBzdG9yZXM6XG4gKlxuICogICAgQ291bnRyeVN0b3JlLmRpc3BhdGNoVG9rZW4gPSBmbGlnaHREaXNwYXRjaGVyLnJlZ2lzdGVyKGZ1bmN0aW9uKHBheWxvYWQpIHtcbiAqICAgICBpZiAocGF5bG9hZC5hY3Rpb25UeXBlID09PSAnY291bnRyeS11cGRhdGUnKSB7XG4gKiAgICAgICBDb3VudHJ5U3RvcmUuY291bnRyeSA9IHBheWxvYWQuc2VsZWN0ZWRDb3VudHJ5O1xuICogICAgIH1cbiAqICAgfSk7XG4gKlxuICogV2hlbiB0aGUgY2FsbGJhY2sgdG8gdXBkYXRlIGBDb3VudHJ5U3RvcmVgIGlzIHJlZ2lzdGVyZWQsIHdlIHNhdmUgYSByZWZlcmVuY2VcbiAqIHRvIHRoZSByZXR1cm5lZCB0b2tlbi4gVXNpbmcgdGhpcyB0b2tlbiB3aXRoIGB3YWl0Rm9yKClgLCB3ZSBjYW4gZ3VhcmFudGVlXG4gKiB0aGF0IGBDb3VudHJ5U3RvcmVgIGlzIHVwZGF0ZWQgYmVmb3JlIHRoZSBjYWxsYmFjayB0aGF0IHVwZGF0ZXMgYENpdHlTdG9yZWBcbiAqIG5lZWRzIHRvIHF1ZXJ5IGl0cyBkYXRhLlxuICpcbiAqICAgQ2l0eVN0b3JlLmRpc3BhdGNoVG9rZW4gPSBmbGlnaHREaXNwYXRjaGVyLnJlZ2lzdGVyKGZ1bmN0aW9uKHBheWxvYWQpIHtcbiAqICAgICBpZiAocGF5bG9hZC5hY3Rpb25UeXBlID09PSAnY291bnRyeS11cGRhdGUnKSB7XG4gKiAgICAgICAvLyBgQ291bnRyeVN0b3JlLmNvdW50cnlgIG1heSBub3QgYmUgdXBkYXRlZC5cbiAqICAgICAgIGZsaWdodERpc3BhdGNoZXIud2FpdEZvcihbQ291bnRyeVN0b3JlLmRpc3BhdGNoVG9rZW5dKTtcbiAqICAgICAgIC8vIGBDb3VudHJ5U3RvcmUuY291bnRyeWAgaXMgbm93IGd1YXJhbnRlZWQgdG8gYmUgdXBkYXRlZC5cbiAqXG4gKiAgICAgICAvLyBTZWxlY3QgdGhlIGRlZmF1bHQgY2l0eSBmb3IgdGhlIG5ldyBjb3VudHJ5XG4gKiAgICAgICBDaXR5U3RvcmUuY2l0eSA9IGdldERlZmF1bHRDaXR5Rm9yQ291bnRyeShDb3VudHJ5U3RvcmUuY291bnRyeSk7XG4gKiAgICAgfVxuICogICB9KTtcbiAqXG4gKiBUaGUgdXNhZ2Ugb2YgYHdhaXRGb3IoKWAgY2FuIGJlIGNoYWluZWQsIGZvciBleGFtcGxlOlxuICpcbiAqICAgRmxpZ2h0UHJpY2VTdG9yZS5kaXNwYXRjaFRva2VuID1cbiAqICAgICBmbGlnaHREaXNwYXRjaGVyLnJlZ2lzdGVyKGZ1bmN0aW9uKHBheWxvYWQpIHtcbiAqICAgICAgIHN3aXRjaCAocGF5bG9hZC5hY3Rpb25UeXBlKSB7XG4gKiAgICAgICAgIGNhc2UgJ2NvdW50cnktdXBkYXRlJzpcbiAqICAgICAgICAgICBmbGlnaHREaXNwYXRjaGVyLndhaXRGb3IoW0NpdHlTdG9yZS5kaXNwYXRjaFRva2VuXSk7XG4gKiAgICAgICAgICAgRmxpZ2h0UHJpY2VTdG9yZS5wcmljZSA9XG4gKiAgICAgICAgICAgICBnZXRGbGlnaHRQcmljZVN0b3JlKENvdW50cnlTdG9yZS5jb3VudHJ5LCBDaXR5U3RvcmUuY2l0eSk7XG4gKiAgICAgICAgICAgYnJlYWs7XG4gKlxuICogICAgICAgICBjYXNlICdjaXR5LXVwZGF0ZSc6XG4gKiAgICAgICAgICAgRmxpZ2h0UHJpY2VTdG9yZS5wcmljZSA9XG4gKiAgICAgICAgICAgICBGbGlnaHRQcmljZVN0b3JlKENvdW50cnlTdG9yZS5jb3VudHJ5LCBDaXR5U3RvcmUuY2l0eSk7XG4gKiAgICAgICAgICAgYnJlYWs7XG4gKiAgICAgfVxuICogICB9KTtcbiAqXG4gKiBUaGUgYGNvdW50cnktdXBkYXRlYCBwYXlsb2FkIHdpbGwgYmUgZ3VhcmFudGVlZCB0byBpbnZva2UgdGhlIHN0b3JlcydcbiAqIHJlZ2lzdGVyZWQgY2FsbGJhY2tzIGluIG9yZGVyOiBgQ291bnRyeVN0b3JlYCwgYENpdHlTdG9yZWAsIHRoZW5cbiAqIGBGbGlnaHRQcmljZVN0b3JlYC5cbiAqL1xuXG4gIGZ1bmN0aW9uIERpc3BhdGNoZXIoKSB7XG4gICAgdGhpcy4kRGlzcGF0Y2hlcl9jYWxsYmFja3MgPSB7fTtcbiAgICB0aGlzLiREaXNwYXRjaGVyX2lzUGVuZGluZyA9IHt9O1xuICAgIHRoaXMuJERpc3BhdGNoZXJfaXNIYW5kbGVkID0ge307XG4gICAgdGhpcy4kRGlzcGF0Y2hlcl9pc0Rpc3BhdGNoaW5nID0gZmFsc2U7XG4gICAgdGhpcy4kRGlzcGF0Y2hlcl9wZW5kaW5nUGF5bG9hZCA9IG51bGw7XG4gIH1cblxuICAvKipcbiAgICogUmVnaXN0ZXJzIGEgY2FsbGJhY2sgdG8gYmUgaW52b2tlZCB3aXRoIGV2ZXJ5IGRpc3BhdGNoZWQgcGF5bG9hZC4gUmV0dXJuc1xuICAgKiBhIHRva2VuIHRoYXQgY2FuIGJlIHVzZWQgd2l0aCBgd2FpdEZvcigpYC5cbiAgICpcbiAgICogQHBhcmFtIHtmdW5jdGlvbn0gY2FsbGJhY2tcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgRGlzcGF0Y2hlci5wcm90b3R5cGUucmVnaXN0ZXI9ZnVuY3Rpb24oY2FsbGJhY2spIHtcbiAgICB2YXIgaWQgPSBfcHJlZml4ICsgX2xhc3RJRCsrO1xuICAgIHRoaXMuJERpc3BhdGNoZXJfY2FsbGJhY2tzW2lkXSA9IGNhbGxiYWNrO1xuICAgIHJldHVybiBpZDtcbiAgfTtcblxuICAvKipcbiAgICogUmVtb3ZlcyBhIGNhbGxiYWNrIGJhc2VkIG9uIGl0cyB0b2tlbi5cbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IGlkXG4gICAqL1xuICBEaXNwYXRjaGVyLnByb3RvdHlwZS51bnJlZ2lzdGVyPWZ1bmN0aW9uKGlkKSB7XG4gICAgaW52YXJpYW50KFxuICAgICAgdGhpcy4kRGlzcGF0Y2hlcl9jYWxsYmFja3NbaWRdLFxuICAgICAgJ0Rpc3BhdGNoZXIudW5yZWdpc3RlciguLi4pOiBgJXNgIGRvZXMgbm90IG1hcCB0byBhIHJlZ2lzdGVyZWQgY2FsbGJhY2suJyxcbiAgICAgIGlkXG4gICAgKTtcbiAgICBkZWxldGUgdGhpcy4kRGlzcGF0Y2hlcl9jYWxsYmFja3NbaWRdO1xuICB9O1xuXG4gIC8qKlxuICAgKiBXYWl0cyBmb3IgdGhlIGNhbGxiYWNrcyBzcGVjaWZpZWQgdG8gYmUgaW52b2tlZCBiZWZvcmUgY29udGludWluZyBleGVjdXRpb25cbiAgICogb2YgdGhlIGN1cnJlbnQgY2FsbGJhY2suIFRoaXMgbWV0aG9kIHNob3VsZCBvbmx5IGJlIHVzZWQgYnkgYSBjYWxsYmFjayBpblxuICAgKiByZXNwb25zZSB0byBhIGRpc3BhdGNoZWQgcGF5bG9hZC5cbiAgICpcbiAgICogQHBhcmFtIHthcnJheTxzdHJpbmc+fSBpZHNcbiAgICovXG4gIERpc3BhdGNoZXIucHJvdG90eXBlLndhaXRGb3I9ZnVuY3Rpb24oaWRzKSB7XG4gICAgaW52YXJpYW50KFxuICAgICAgdGhpcy4kRGlzcGF0Y2hlcl9pc0Rpc3BhdGNoaW5nLFxuICAgICAgJ0Rpc3BhdGNoZXIud2FpdEZvciguLi4pOiBNdXN0IGJlIGludm9rZWQgd2hpbGUgZGlzcGF0Y2hpbmcuJ1xuICAgICk7XG4gICAgZm9yICh2YXIgaWkgPSAwOyBpaSA8IGlkcy5sZW5ndGg7IGlpKyspIHtcbiAgICAgIHZhciBpZCA9IGlkc1tpaV07XG4gICAgICBpZiAodGhpcy4kRGlzcGF0Y2hlcl9pc1BlbmRpbmdbaWRdKSB7XG4gICAgICAgIGludmFyaWFudChcbiAgICAgICAgICB0aGlzLiREaXNwYXRjaGVyX2lzSGFuZGxlZFtpZF0sXG4gICAgICAgICAgJ0Rpc3BhdGNoZXIud2FpdEZvciguLi4pOiBDaXJjdWxhciBkZXBlbmRlbmN5IGRldGVjdGVkIHdoaWxlICcgK1xuICAgICAgICAgICd3YWl0aW5nIGZvciBgJXNgLicsXG4gICAgICAgICAgaWRcbiAgICAgICAgKTtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG4gICAgICBpbnZhcmlhbnQoXG4gICAgICAgIHRoaXMuJERpc3BhdGNoZXJfY2FsbGJhY2tzW2lkXSxcbiAgICAgICAgJ0Rpc3BhdGNoZXIud2FpdEZvciguLi4pOiBgJXNgIGRvZXMgbm90IG1hcCB0byBhIHJlZ2lzdGVyZWQgY2FsbGJhY2suJyxcbiAgICAgICAgaWRcbiAgICAgICk7XG4gICAgICB0aGlzLiREaXNwYXRjaGVyX2ludm9rZUNhbGxiYWNrKGlkKTtcbiAgICB9XG4gIH07XG5cbiAgLyoqXG4gICAqIERpc3BhdGNoZXMgYSBwYXlsb2FkIHRvIGFsbCByZWdpc3RlcmVkIGNhbGxiYWNrcy5cbiAgICpcbiAgICogQHBhcmFtIHtvYmplY3R9IHBheWxvYWRcbiAgICovXG4gIERpc3BhdGNoZXIucHJvdG90eXBlLmRpc3BhdGNoPWZ1bmN0aW9uKHBheWxvYWQpIHtcbiAgICBpbnZhcmlhbnQoXG4gICAgICAhdGhpcy4kRGlzcGF0Y2hlcl9pc0Rpc3BhdGNoaW5nLFxuICAgICAgJ0Rpc3BhdGNoLmRpc3BhdGNoKC4uLik6IENhbm5vdCBkaXNwYXRjaCBpbiB0aGUgbWlkZGxlIG9mIGEgZGlzcGF0Y2guJ1xuICAgICk7XG4gICAgdGhpcy4kRGlzcGF0Y2hlcl9zdGFydERpc3BhdGNoaW5nKHBheWxvYWQpO1xuICAgIHRyeSB7XG4gICAgICBmb3IgKHZhciBpZCBpbiB0aGlzLiREaXNwYXRjaGVyX2NhbGxiYWNrcykge1xuICAgICAgICBpZiAodGhpcy4kRGlzcGF0Y2hlcl9pc1BlbmRpbmdbaWRdKSB7XG4gICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy4kRGlzcGF0Y2hlcl9pbnZva2VDYWxsYmFjayhpZCk7XG4gICAgICB9XG4gICAgfSBmaW5hbGx5IHtcbiAgICAgIHRoaXMuJERpc3BhdGNoZXJfc3RvcERpc3BhdGNoaW5nKCk7XG4gICAgfVxuICB9O1xuXG4gIC8qKlxuICAgKiBJcyB0aGlzIERpc3BhdGNoZXIgY3VycmVudGx5IGRpc3BhdGNoaW5nLlxuICAgKlxuICAgKiBAcmV0dXJuIHtib29sZWFufVxuICAgKi9cbiAgRGlzcGF0Y2hlci5wcm90b3R5cGUuaXNEaXNwYXRjaGluZz1mdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy4kRGlzcGF0Y2hlcl9pc0Rpc3BhdGNoaW5nO1xuICB9O1xuXG4gIC8qKlxuICAgKiBDYWxsIHRoZSBjYWxsYmFjayBzdG9yZWQgd2l0aCB0aGUgZ2l2ZW4gaWQuIEFsc28gZG8gc29tZSBpbnRlcm5hbFxuICAgKiBib29ra2VlcGluZy5cbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IGlkXG4gICAqIEBpbnRlcm5hbFxuICAgKi9cbiAgRGlzcGF0Y2hlci5wcm90b3R5cGUuJERpc3BhdGNoZXJfaW52b2tlQ2FsbGJhY2s9ZnVuY3Rpb24oaWQpIHtcbiAgICB0aGlzLiREaXNwYXRjaGVyX2lzUGVuZGluZ1tpZF0gPSB0cnVlO1xuICAgIHRoaXMuJERpc3BhdGNoZXJfY2FsbGJhY2tzW2lkXSh0aGlzLiREaXNwYXRjaGVyX3BlbmRpbmdQYXlsb2FkKTtcbiAgICB0aGlzLiREaXNwYXRjaGVyX2lzSGFuZGxlZFtpZF0gPSB0cnVlO1xuICB9O1xuXG4gIC8qKlxuICAgKiBTZXQgdXAgYm9va2tlZXBpbmcgbmVlZGVkIHdoZW4gZGlzcGF0Y2hpbmcuXG4gICAqXG4gICAqIEBwYXJhbSB7b2JqZWN0fSBwYXlsb2FkXG4gICAqIEBpbnRlcm5hbFxuICAgKi9cbiAgRGlzcGF0Y2hlci5wcm90b3R5cGUuJERpc3BhdGNoZXJfc3RhcnREaXNwYXRjaGluZz1mdW5jdGlvbihwYXlsb2FkKSB7XG4gICAgZm9yICh2YXIgaWQgaW4gdGhpcy4kRGlzcGF0Y2hlcl9jYWxsYmFja3MpIHtcbiAgICAgIHRoaXMuJERpc3BhdGNoZXJfaXNQZW5kaW5nW2lkXSA9IGZhbHNlO1xuICAgICAgdGhpcy4kRGlzcGF0Y2hlcl9pc0hhbmRsZWRbaWRdID0gZmFsc2U7XG4gICAgfVxuICAgIHRoaXMuJERpc3BhdGNoZXJfcGVuZGluZ1BheWxvYWQgPSBwYXlsb2FkO1xuICAgIHRoaXMuJERpc3BhdGNoZXJfaXNEaXNwYXRjaGluZyA9IHRydWU7XG4gIH07XG5cbiAgLyoqXG4gICAqIENsZWFyIGJvb2trZWVwaW5nIHVzZWQgZm9yIGRpc3BhdGNoaW5nLlxuICAgKlxuICAgKiBAaW50ZXJuYWxcbiAgICovXG4gIERpc3BhdGNoZXIucHJvdG90eXBlLiREaXNwYXRjaGVyX3N0b3BEaXNwYXRjaGluZz1mdW5jdGlvbigpIHtcbiAgICB0aGlzLiREaXNwYXRjaGVyX3BlbmRpbmdQYXlsb2FkID0gbnVsbDtcbiAgICB0aGlzLiREaXNwYXRjaGVyX2lzRGlzcGF0Y2hpbmcgPSBmYWxzZTtcbiAgfTtcblxuXG5tb2R1bGUuZXhwb3J0cyA9IERpc3BhdGNoZXI7XG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vfi9mbHV4L2xpYi9EaXNwYXRjaGVyLmpzXG4gKiogbW9kdWxlIGlkID0gN1xuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwiLyoqXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTQsIEZhY2Vib29rLCBJbmMuXG4gKiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIEJTRC1zdHlsZSBsaWNlbnNlIGZvdW5kIGluIHRoZVxuICogTElDRU5TRSBmaWxlIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLiBBbiBhZGRpdGlvbmFsIGdyYW50XG4gKiBvZiBwYXRlbnQgcmlnaHRzIGNhbiBiZSBmb3VuZCBpbiB0aGUgUEFURU5UUyBmaWxlIGluIHRoZSBzYW1lIGRpcmVjdG9yeS5cbiAqXG4gKiBAcHJvdmlkZXNNb2R1bGUgaW52YXJpYW50XG4gKi9cblxuXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qKlxuICogVXNlIGludmFyaWFudCgpIHRvIGFzc2VydCBzdGF0ZSB3aGljaCB5b3VyIHByb2dyYW0gYXNzdW1lcyB0byBiZSB0cnVlLlxuICpcbiAqIFByb3ZpZGUgc3ByaW50Zi1zdHlsZSBmb3JtYXQgKG9ubHkgJXMgaXMgc3VwcG9ydGVkKSBhbmQgYXJndW1lbnRzXG4gKiB0byBwcm92aWRlIGluZm9ybWF0aW9uIGFib3V0IHdoYXQgYnJva2UgYW5kIHdoYXQgeW91IHdlcmVcbiAqIGV4cGVjdGluZy5cbiAqXG4gKiBUaGUgaW52YXJpYW50IG1lc3NhZ2Ugd2lsbCBiZSBzdHJpcHBlZCBpbiBwcm9kdWN0aW9uLCBidXQgdGhlIGludmFyaWFudFxuICogd2lsbCByZW1haW4gdG8gZW5zdXJlIGxvZ2ljIGRvZXMgbm90IGRpZmZlciBpbiBwcm9kdWN0aW9uLlxuICovXG5cbnZhciBpbnZhcmlhbnQgPSBmdW5jdGlvbihjb25kaXRpb24sIGZvcm1hdCwgYSwgYiwgYywgZCwgZSwgZikge1xuICBpZiAoZmFsc2UpIHtcbiAgICBpZiAoZm9ybWF0ID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignaW52YXJpYW50IHJlcXVpcmVzIGFuIGVycm9yIG1lc3NhZ2UgYXJndW1lbnQnKTtcbiAgICB9XG4gIH1cblxuICBpZiAoIWNvbmRpdGlvbikge1xuICAgIHZhciBlcnJvcjtcbiAgICBpZiAoZm9ybWF0ID09PSB1bmRlZmluZWQpIHtcbiAgICAgIGVycm9yID0gbmV3IEVycm9yKFxuICAgICAgICAnTWluaWZpZWQgZXhjZXB0aW9uIG9jY3VycmVkOyB1c2UgdGhlIG5vbi1taW5pZmllZCBkZXYgZW52aXJvbm1lbnQgJyArXG4gICAgICAgICdmb3IgdGhlIGZ1bGwgZXJyb3IgbWVzc2FnZSBhbmQgYWRkaXRpb25hbCBoZWxwZnVsIHdhcm5pbmdzLidcbiAgICAgICk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHZhciBhcmdzID0gW2EsIGIsIGMsIGQsIGUsIGZdO1xuICAgICAgdmFyIGFyZ0luZGV4ID0gMDtcbiAgICAgIGVycm9yID0gbmV3IEVycm9yKFxuICAgICAgICAnSW52YXJpYW50IFZpb2xhdGlvbjogJyArXG4gICAgICAgIGZvcm1hdC5yZXBsYWNlKC8lcy9nLCBmdW5jdGlvbigpIHsgcmV0dXJuIGFyZ3NbYXJnSW5kZXgrK107IH0pXG4gICAgICApO1xuICAgIH1cblxuICAgIGVycm9yLmZyYW1lc1RvUG9wID0gMTsgLy8gd2UgZG9uJ3QgY2FyZSBhYm91dCBpbnZhcmlhbnQncyBvd24gZnJhbWVcbiAgICB0aHJvdyBlcnJvcjtcbiAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBpbnZhcmlhbnQ7XG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vfi9mbHV4L2xpYi9pbnZhcmlhbnQuanNcbiAqKiBtb2R1bGUgaWQgPSA4XG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iXSwic291cmNlUm9vdCI6IiIsImZpbGUiOiJmbHVtbW94LmpzIn0=