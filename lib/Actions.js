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

var uniqueId = _interopRequire(require("uniqueid"));

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
          if (process.env.NODE_ENV !== "production") {
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
          if (process.env.NODE_ENV !== "production") {
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