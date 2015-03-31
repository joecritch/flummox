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
//# sourceMappingURL=data:application/json;base64,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O1dBQ3JCOztBQUVELGNBQUksQ0FBQyxtQkFBbUIsR0FBRyxLQUFLLENBQUM7QUFDakMsY0FBSSxDQUFDLGFBQWEsR0FBRyxTQUFTLENBQUM7QUFDL0IsY0FBSSxDQUFDLGdDQUFnQyxHQUFHLEtBQUssQ0FBQztTQUMvQztPQUNGOztBQUVELG9CQUFnQjthQUFBLDBCQUFDLFNBQVMsRUFBRSxJQUFJLEVBQUU7QUFDaEMsaUJBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQSxVQUFTLFFBQVEsRUFBRTtBQUNuQyxjQUFJLE9BQU8sUUFBUSxLQUFLLFVBQVUsRUFBRSxPQUFPO0FBQzNDLGtCQUFRLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztTQUM1QixDQUFBLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7T0FDZjs7O0FBM0lNLGVBQVc7YUFBQSxxQkFBQyxRQUFRLEVBQUUsUUFBUSxFQUFFO0FBQ3JDLGVBQU8sTUFBTSxDQUFDLEVBQUUsRUFBRSxRQUFRLEVBQUUsUUFBUSxDQUFDLENBQUM7T0FDdkM7Ozs7U0F0RGtCLEtBQUs7R0FBUyxZQUFZOztpQkFBMUIsS0FBSzs7QUFrTTFCLFNBQVMsY0FBYyxDQUFDLGdCQUFnQixFQUFFO0FBQ3hDLFNBQU8sT0FBTyxnQkFBZ0IsS0FBSyxVQUFVLEdBQ3pDLGdCQUFnQixDQUFDLEdBQUcsR0FDcEIsZ0JBQWdCLENBQUM7Q0FDdEIiLCJmaWxlIjoic3JjL1N0b3JlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBTdG9yZVxuICpcbiAqIFN0b3JlcyBob2xkIGFwcGxpY2F0aW9uIHN0YXRlLiBUaGV5IHJlc3BvbmQgdG8gYWN0aW9ucyBzZW50IGJ5IHRoZSBkaXNwYXRjaGVyXG4gKiBhbmQgYnJvYWRjYXN0IGNoYW5nZSBldmVudHMgdG8gbGlzdGVuZXJzLCBzbyB0aGV5IGNhbiBncmFiIHRoZSBsYXRlc3QgZGF0YS5cbiAqIFRoZSBrZXkgdGhpbmcgdG8gcmVtZW1iZXIgaXMgdGhhdCB0aGUgb25seSB3YXkgc3RvcmVzIHJlY2VpdmUgaW5mb3JtYXRpb25cbiAqIGZyb20gdGhlIG91dHNpZGUgd29ybGQgaXMgdmlhIHRoZSBkaXNwYXRjaGVyLlxuICovXG5cbmltcG9ydCBFdmVudEVtaXR0ZXIgZnJvbSAnZXZlbnRlbWl0dGVyMyc7XG5pbXBvcnQgYXNzaWduIGZyb20gJ29iamVjdC1hc3NpZ24nO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTdG9yZSBleHRlbmRzIEV2ZW50RW1pdHRlciB7XG5cbiAgLyoqXG4gICAqIFN0b3JlcyBhcmUgaW5pdGlhbGl6ZWQgd2l0aCBhIHJlZmVyZW5jZVxuICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgKi9cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5zdGF0ZSA9IG51bGw7XG5cbiAgICB0aGlzLl9oYW5kbGVycyA9IHt9O1xuICAgIHRoaXMuX2FzeW5jSGFuZGxlcnMgPSB7fTtcbiAgICB0aGlzLl9jYXRjaEFsbEhhbmRsZXJzID0gW107XG4gICAgdGhpcy5fY2F0Y2hBbGxBc3luY0hhbmRsZXJzID0ge1xuICAgICAgYmVnaW46IFtdLFxuICAgICAgc3VjY2VzczogW10sXG4gICAgICBmYWlsdXJlOiBbXSxcbiAgICB9O1xuICB9XG5cbiAgc2V0U3RhdGUobmV3U3RhdGUpIHtcbiAgICAvLyBEbyBhIHRyYW5zYWN0aW9uYWwgc3RhdGUgdXBkYXRlIGlmIGEgZnVuY3Rpb24gaXMgcGFzc2VkXG4gICAgaWYgKHR5cGVvZiBuZXdTdGF0ZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgY29uc3QgcHJldlN0YXRlID0gdGhpcy5faXNIYW5kbGluZ0Rpc3BhdGNoXG4gICAgICAgID8gdGhpcy5fcGVuZGluZ1N0YXRlXG4gICAgICAgIDogdGhpcy5zdGF0ZTtcblxuICAgICAgbmV3U3RhdGUgPSBuZXdTdGF0ZShwcmV2U3RhdGUpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLl9pc0hhbmRsaW5nRGlzcGF0Y2gpIHtcbiAgICAgIHRoaXMuX3BlbmRpbmdTdGF0ZSA9IHRoaXMuX2Fzc2lnblN0YXRlKHRoaXMuX3BlbmRpbmdTdGF0ZSwgbmV3U3RhdGUpO1xuICAgICAgdGhpcy5fZW1pdENoYW5nZUFmdGVySGFuZGxpbmdEaXNwYXRjaCA9IHRydWU7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuc3RhdGUgPSB0aGlzLl9hc3NpZ25TdGF0ZSh0aGlzLnN0YXRlLCBuZXdTdGF0ZSk7XG4gICAgICB0aGlzLmVtaXQoJ2NoYW5nZScpO1xuICAgIH1cbiAgfVxuXG4gIHJlcGxhY2VTdGF0ZShuZXdTdGF0ZSkge1xuICAgIGlmICh0aGlzLl9pc0hhbmRsaW5nRGlzcGF0Y2gpIHtcbiAgICAgIHRoaXMuX3BlbmRpbmdTdGF0ZSA9IHRoaXMuX2Fzc2lnblN0YXRlKHVuZGVmaW5lZCwgbmV3U3RhdGUpO1xuICAgICAgdGhpcy5fZW1pdENoYW5nZUFmdGVySGFuZGxpbmdEaXNwYXRjaCA9IHRydWU7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuc3RhdGUgPSB0aGlzLl9hc3NpZ25TdGF0ZSh1bmRlZmluZWQsIG5ld1N0YXRlKTtcbiAgICAgIHRoaXMuZW1pdCgnY2hhbmdlJyk7XG4gICAgfVxuICB9XG5cbiAgZ2V0U3RhdGVBc09iamVjdCgpIHtcbiAgICByZXR1cm4gdGhpcy5zdGF0ZTtcbiAgfVxuXG4gIHN0YXRpYyBhc3NpZ25TdGF0ZShvbGRTdGF0ZSwgbmV3U3RhdGUpIHtcbiAgICByZXR1cm4gYXNzaWduKHt9LCBvbGRTdGF0ZSwgbmV3U3RhdGUpO1xuICB9XG5cbiAgX2Fzc2lnblN0YXRlKC4uLmFyZ3Mpe1xuICAgIHJldHVybiAodGhpcy5jb25zdHJ1Y3Rvci5hc3NpZ25TdGF0ZSB8fCBTdG9yZS5hc3NpZ25TdGF0ZSkoLi4uYXJncyk7XG4gIH1cblxuICBmb3JjZVVwZGF0ZSgpIHtcbiAgICBpZiAodGhpcy5faXNIYW5kbGluZ0Rpc3BhdGNoKSB7XG4gICAgICB0aGlzLl9lbWl0Q2hhbmdlQWZ0ZXJIYW5kbGluZ0Rpc3BhdGNoID0gdHJ1ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5lbWl0KCdjaGFuZ2UnKTtcbiAgICB9XG4gIH1cblxuICByZWdpc3RlcihhY3Rpb25JZCwgaGFuZGxlcikge1xuICAgIGFjdGlvbklkID0gZW5zdXJlQWN0aW9uSWQoYWN0aW9uSWQpO1xuXG4gICAgaWYgKHR5cGVvZiBoYW5kbGVyICE9PSAnZnVuY3Rpb24nKSByZXR1cm47XG5cbiAgICB0aGlzLl9oYW5kbGVyc1thY3Rpb25JZF0gPSBoYW5kbGVyLmJpbmQodGhpcyk7XG4gIH1cblxuICByZWdpc3RlckFzeW5jKGFjdGlvbklkLCBiZWdpbkhhbmRsZXIsIHN1Y2Nlc3NIYW5kbGVyLCBmYWlsdXJlSGFuZGxlcikge1xuICAgIGFjdGlvbklkID0gZW5zdXJlQWN0aW9uSWQoYWN0aW9uSWQpO1xuXG4gICAgY29uc3QgYXN5bmNIYW5kbGVycyA9IHRoaXMuX2JpbmRBc3luY0hhbmRsZXJzKHtcbiAgICAgIGJlZ2luOiBiZWdpbkhhbmRsZXIsXG4gICAgICBzdWNjZXNzOiBzdWNjZXNzSGFuZGxlcixcbiAgICAgIGZhaWx1cmU6IGZhaWx1cmVIYW5kbGVyLFxuICAgIH0pO1xuXG4gICAgdGhpcy5fYXN5bmNIYW5kbGVyc1thY3Rpb25JZF0gPSBhc3luY0hhbmRsZXJzO1xuICB9XG5cbiAgcmVnaXN0ZXJBbGwoaGFuZGxlcikge1xuICAgIGlmICh0eXBlb2YgaGFuZGxlciAhPT0gJ2Z1bmN0aW9uJykgcmV0dXJuO1xuXG4gICAgdGhpcy5fY2F0Y2hBbGxIYW5kbGVycy5wdXNoKGhhbmRsZXIuYmluZCh0aGlzKSk7XG4gIH1cblxuICByZWdpc3RlckFsbEFzeW5jKGJlZ2luSGFuZGxlciwgc3VjY2Vzc0hhbmRsZXIsIGZhaWx1cmVIYW5kbGVyKSB7XG4gICAgY29uc3QgYXN5bmNIYW5kbGVycyA9IHRoaXMuX2JpbmRBc3luY0hhbmRsZXJzKHtcbiAgICAgIGJlZ2luOiBiZWdpbkhhbmRsZXIsXG4gICAgICBzdWNjZXNzOiBzdWNjZXNzSGFuZGxlcixcbiAgICAgIGZhaWx1cmU6IGZhaWx1cmVIYW5kbGVyLFxuICAgIH0pO1xuXG4gICAgT2JqZWN0LmtleXMoYXN5bmNIYW5kbGVycykuZm9yRWFjaCgoa2V5KSA9PiB7XG4gICAgICB0aGlzLl9jYXRjaEFsbEFzeW5jSGFuZGxlcnNba2V5XS5wdXNoKFxuICAgICAgICBhc3luY0hhbmRsZXJzW2tleV1cbiAgICAgICk7XG4gICAgfSk7XG4gIH1cblxuICBfYmluZEFzeW5jSGFuZGxlcnMoYXN5bmNIYW5kbGVycykge1xuICAgIGZvciAobGV0IGtleSBpbiBhc3luY0hhbmRsZXJzKSB7XG4gICAgICBpZiAoIWFzeW5jSGFuZGxlcnMuaGFzT3duUHJvcGVydHkoa2V5KSkgY29udGludWU7XG5cbiAgICAgIGNvbnN0IGhhbmRsZXIgPSBhc3luY0hhbmRsZXJzW2tleV07XG5cbiAgICAgIGlmICh0eXBlb2YgaGFuZGxlciA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICBhc3luY0hhbmRsZXJzW2tleV0gPSBoYW5kbGVyLmJpbmQodGhpcyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBkZWxldGUgYXN5bmNIYW5kbGVyc1trZXldO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBhc3luY0hhbmRsZXJzO1xuICB9XG5cbiAgd2FpdEZvcih0b2tlbnNPclN0b3Jlcykge1xuICAgIHRoaXMuX3dhaXRGb3IodG9rZW5zT3JTdG9yZXMpO1xuICB9XG5cbiAgaGFuZGxlcihwYXlsb2FkKSB7XG4gICAgY29uc3Qge1xuICAgICAgYm9keSxcbiAgICAgIGFjdGlvbklkLFxuICAgICAgYXN5bmM6IF9hc3luYyxcbiAgICAgIGFjdGlvbkFyZ3MsXG4gICAgICBlcnJvclxuICAgIH0gPSBwYXlsb2FkO1xuXG4gICAgY29uc3QgX2FsbEhhbmRsZXJzID0gdGhpcy5fY2F0Y2hBbGxIYW5kbGVycztcbiAgICBjb25zdCBfaGFuZGxlciA9IHRoaXMuX2hhbmRsZXJzW2FjdGlvbklkXTtcblxuICAgIGNvbnN0IF9hbGxBc3luY0hhbmRsZXJzID0gdGhpcy5fY2F0Y2hBbGxBc3luY0hhbmRsZXJzW19hc3luY107XG4gICAgY29uc3QgX2FzeW5jSGFuZGxlciA9IHRoaXMuX2FzeW5jSGFuZGxlcnNbYWN0aW9uSWRdXG4gICAgICAmJiB0aGlzLl9hc3luY0hhbmRsZXJzW2FjdGlvbklkXVtfYXN5bmNdO1xuXG4gICAgaWYgKF9hc3luYykge1xuICAgICAgbGV0IGJlZ2luT3JGYWlsdXJlSGFuZGxlcnMgPSBfYWxsQXN5bmNIYW5kbGVycy5jb25jYXQoW19hc3luY0hhbmRsZXJdKTtcblxuICAgICAgc3dpdGNoIChfYXN5bmMpIHtcbiAgICAgICAgY2FzZSAnYmVnaW4nOlxuICAgICAgICAgIHRoaXMuX3BlcmZvcm1IYW5kbGVyKGJlZ2luT3JGYWlsdXJlSGFuZGxlcnMsIGFjdGlvbkFyZ3MpO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgY2FzZSAnZmFpbHVyZSc6XG4gICAgICAgICAgdGhpcy5fcGVyZm9ybUhhbmRsZXIoYmVnaW5PckZhaWx1cmVIYW5kbGVycywgW2Vycm9yLmNvbmNhdChhY3Rpb25BcmdzKV0pO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgY2FzZSAnc3VjY2Vzcyc6XG4gICAgICAgICAgdGhpcy5fcGVyZm9ybUhhbmRsZXIoX2FsbEFzeW5jSGFuZGxlcnMuY29uY2F0KFtcbiAgICAgICAgICAgIChfYXN5bmNIYW5kbGVyIHx8IF9oYW5kbGVyKVxuICAgICAgICAgIF0pLCBbYm9keV0pO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy5fcGVyZm9ybUhhbmRsZXIoX2FsbEhhbmRsZXJzLmNvbmNhdChbX2hhbmRsZXJdKSwgW2JvZHldKTtcbiAgfVxuXG4gIF9wZXJmb3JtSGFuZGxlcihfaGFuZGxlcnMsIGFyZ3MpIHtcbiAgICB0aGlzLl9pc0hhbmRsaW5nRGlzcGF0Y2ggPSB0cnVlO1xuICAgIHRoaXMuX3BlbmRpbmdTdGF0ZSA9IHRoaXMuX2Fzc2lnblN0YXRlKHVuZGVmaW5lZCwgdGhpcy5zdGF0ZSk7XG4gICAgdGhpcy5fZW1pdENoYW5nZUFmdGVySGFuZGxpbmdEaXNwYXRjaCA9IGZhbHNlO1xuXG4gICAgdHJ5IHtcbiAgICAgIHRoaXMuX3BlcmZvcm1IYW5kbGVycyhfaGFuZGxlcnMsIGFyZ3MpO1xuICAgIH0gZmluYWxseSB7XG4gICAgICBpZiAodGhpcy5fZW1pdENoYW5nZUFmdGVySGFuZGxpbmdEaXNwYXRjaCkge1xuICAgICAgICB0aGlzLnN0YXRlID0gdGhpcy5fcGVuZGluZ1N0YXRlO1xuICAgICAgICB0aGlzLmVtaXQoJ2NoYW5nZScpO1xuICAgICAgfVxuXG4gICAgICB0aGlzLl9pc0hhbmRsaW5nRGlzcGF0Y2ggPSBmYWxzZTtcbiAgICAgIHRoaXMuX3BlbmRpbmdTdGF0ZSA9IHVuZGVmaW5lZDtcbiAgICAgIHRoaXMuX2VtaXRDaGFuZ2VBZnRlckhhbmRsaW5nRGlzcGF0Y2ggPSBmYWxzZTtcbiAgICB9XG4gIH1cblxuICBfcGVyZm9ybUhhbmRsZXJzKF9oYW5kbGVycywgYXJncykge1xuICAgIF9oYW5kbGVycy5mb3JFYWNoKGZ1bmN0aW9uKF9oYW5kbGVyKSB7XG4gICAgICBpZiAodHlwZW9mIF9oYW5kbGVyICE9PSAnZnVuY3Rpb24nKSByZXR1cm47XG4gICAgICBfaGFuZGxlci5hcHBseSh0aGlzLCBhcmdzKTtcbiAgICB9LmJpbmQodGhpcykpO1xuICB9XG59XG5cbmZ1bmN0aW9uIGVuc3VyZUFjdGlvbklkKGFjdGlvbk9yQWN0aW9uSWQpIHtcbiAgcmV0dXJuIHR5cGVvZiBhY3Rpb25PckFjdGlvbklkID09PSAnZnVuY3Rpb24nXG4gICAgPyBhY3Rpb25PckFjdGlvbklkLl9pZFxuICAgIDogYWN0aW9uT3JBY3Rpb25JZDtcbn1cbiJdfQ==