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

var EventEmitter = _interopRequire(require("eventemitter3"));

var assign = _interopRequire(require("object-assign"));

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