"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var _Flux = require("../Flux");

var Flux = _Flux.Flux;
var Store = _Flux.Store;
var Actions = _Flux.Actions;

var sinon = _interopRequire(require("sinon"));

function createSerializableStore(serializedState) {
  return (function (_Store) {
    function SerializableStore() {
      _classCallCheck(this, SerializableStore);

      if (_Store != null) {
        _Store.apply(this, arguments);
      }
    }

    _inherits(SerializableStore, _Store);

    _createClass(SerializableStore, null, {
      serialize: {
        value: function serialize() {
          return serializedState;
        }
      },
      deserialize: {
        value: function deserialize(stateString) {
          return {
            stateString: stateString,
            deserialized: true };
        }
      }
    });

    return SerializableStore;
  })(Store);
}

describe("Flux", function () {

  describe("#createStore()", function () {
    it("throws if key already exists", function () {
      var flux = new Flux();

      var TestStore = (function (_Store) {
        function TestStore() {
          _classCallCheck(this, TestStore);

          if (_Store != null) {
            _Store.apply(this, arguments);
          }
        }

        _inherits(TestStore, _Store);

        return TestStore;
      })(Store);

      flux.createStore("ExampleStore", TestStore);
      expect(flux.createStore.bind(flux, "ExampleStore", TestStore)).to["throw"]("You've attempted to create multiple stores with key ExampleStore. " + "Keys must be unique.");
    });

    it("throws if Store is not a prototype of class", function () {
      var flux = new Flux();

      var ForgotToExtendStore = function ForgotToExtendStore() {
        _classCallCheck(this, ForgotToExtendStore);
      };

      expect(flux.createStore.bind(flux, "Flux", ForgotToExtendStore)).to["throw"]("You've attempted to create a store from the class " + "ForgotToExtendStore, which does not have the base Store class in its " + "prototype chain. Make sure you're using the `extends` keyword: " + "`class ForgotToExtendStore extends Store { ... }`");
    });

    it("registers store's handler with central dispatcher", function () {
      var ExampleStore = (function (_Store) {
        function ExampleStore() {
          _classCallCheck(this, ExampleStore);

          if (_Store != null) {
            _Store.apply(this, arguments);
          }
        }

        _inherits(ExampleStore, _Store);

        return ExampleStore;
      })(Store);

      var spy1 = sinon.spy();
      var spy2 = sinon.spy();

      ExampleStore.prototype.foo = "bar";
      ExampleStore.prototype.handler = function (_payload) {
        spy1(_payload);
        spy2(this.foo);
      };

      var flux = new Flux();
      flux.createStore("ExampleStore", ExampleStore);

      var payload = "foobar";
      flux.dispatch("actionId", payload);
      expect(spy1.getCall(0).args[0].body).to.equal("foobar");
      expect(spy2.calledWith("bar")).to.be["true"];
    });

    it("returns the created store instance", function () {
      var ExampleStore = (function (_Store) {
        function ExampleStore() {
          _classCallCheck(this, ExampleStore);

          if (_Store != null) {
            _Store.apply(this, arguments);
          }
        }

        _inherits(ExampleStore, _Store);

        return ExampleStore;
      })(Store);

      var flux = new Flux();
      var store = flux.createStore("ExampleStore", ExampleStore);
      expect(store).to.be.an.instanceOf(ExampleStore);
    });
  });

  describe("#getStore()", function () {
    it("retrieves store for key", function () {
      var flux = new Flux();

      var TestStore = (function (_Store) {
        function TestStore() {
          _classCallCheck(this, TestStore);

          if (_Store != null) {
            _Store.apply(this, arguments);
          }
        }

        _inherits(TestStore, _Store);

        return TestStore;
      })(Store);

      flux.createStore("ExampleStore", TestStore);
      expect(flux.getStore("ExampleStore")).to.be.an.instanceOf(Store);
      expect(flux.getStore("NonexistentStore")).to.be.undefined;
    });
  });

  describe("#createActions()", function () {
    it("throws if key already exists", function () {
      var TestActions = (function (_Actions) {
        function TestActions() {
          _classCallCheck(this, TestActions);

          if (_Actions != null) {
            _Actions.apply(this, arguments);
          }
        }

        _inherits(TestActions, _Actions);

        return TestActions;
      })(Actions);

      var flux = new Flux();
      flux.createActions("ExampleActions", TestActions);

      expect(flux.createActions.bind(flux, "ExampleActions", Actions)).to["throw"]("You've attempted to create multiple actions with key ExampleActions. " + "Keys must be unique.");
    });

    it("throws if Actions is not a prototype of class", function () {
      var flux = new Flux();

      var ForgotToExtendActions = function ForgotToExtendActions() {
        _classCallCheck(this, ForgotToExtendActions);
      };

      expect(flux.createActions.bind(flux, "Flux", ForgotToExtendActions)).to["throw"]("You've attempted to create actions from the class " + "ForgotToExtendActions, which does not have the base Actions class " + "in its prototype chain. Make sure you're using the `extends` " + "keyword: `class ForgotToExtendActions extends Actions { ... }`");
    });

    it("returns the created action's instance", function () {
      var TestActions = (function (_Actions) {
        function TestActions() {
          _classCallCheck(this, TestActions);

          if (_Actions != null) {
            _Actions.apply(this, arguments);
          }
        }

        _inherits(TestActions, _Actions);

        return TestActions;
      })(Actions);

      var flux = new Flux();
      var actions = flux.createActions("TestActions", TestActions);
      expect(actions).to.be.an.instanceOf(TestActions);
    });
  });

  describe("#getActions()", function () {
    var TestActions = (function (_Actions) {
      function TestActions() {
        _classCallCheck(this, TestActions);

        if (_Actions != null) {
          _Actions.apply(this, arguments);
        }
      }

      _inherits(TestActions, _Actions);

      return TestActions;
    })(Actions);

    it("retrieves actions for key", function () {
      var flux = new Flux();
      flux.createActions("TestActions", TestActions);

      expect(flux.getActions("TestActions")).to.be.an.instanceOf(Actions);
      expect(flux.getActions("NonexistentActions")).to.be.undefined;
    });
  });

  describe("#getActionIds() / #getConstants()", function () {
    var TestActions = (function (_Actions) {
      function TestActions() {
        _classCallCheck(this, TestActions);

        if (_Actions != null) {
          _Actions.apply(this, arguments);
        }
      }

      _inherits(TestActions, _Actions);

      _createClass(TestActions, {
        getFoo: {
          value: function getFoo() {}
        }
      });

      return TestActions;
    })(Actions);

    it("retrives ids of actions for key", function () {
      var flux = new Flux();
      flux.createActions("TestActions", TestActions);

      expect(flux.getActionIds("TestActions").getFoo).to.be.a("string");
      expect(flux.getActionIds("NonexistentActions")).to.be.undefined;

      expect(flux.getConstants("TestActions").getFoo).to.be.a("string");
      expect(flux.getConstants("NonexistentActions")).to.be.undefined;
    });
  });

  describe("#getAllActionIds() / #getAllConstants()", function () {
    var TestFooActions = (function (_Actions) {
      function TestFooActions() {
        _classCallCheck(this, TestFooActions);

        if (_Actions != null) {
          _Actions.apply(this, arguments);
        }
      }

      _inherits(TestFooActions, _Actions);

      _createClass(TestFooActions, {
        getFoo: {
          value: function getFoo() {}
        },
        getBar: {
          value: function getBar() {}
        }
      });

      return TestFooActions;
    })(Actions);

    var TestBarActions = (function (_Actions2) {
      function TestBarActions() {
        _classCallCheck(this, TestBarActions);

        if (_Actions2 != null) {
          _Actions2.apply(this, arguments);
        }
      }

      _inherits(TestBarActions, _Actions2);

      _createClass(TestBarActions, {
        getFoo: {
          value: function getFoo() {}
        },
        getBar: {
          value: function getBar() {}
        }
      });

      return TestBarActions;
    })(Actions);

    it("retrives ids of all actions", function () {
      var flux = new Flux();
      flux.createActions("TestFooActions", TestFooActions);
      flux.createActions("TestBarActions", TestBarActions);

      expect(flux.getAllActionIds()).to.be.an("array");
      expect(flux.getAllActionIds()[0]).to.be.a("string");
      expect(flux.getAllActionIds()).to.have.length(4);

      expect(flux.getAllConstants()).to.be.an("array");
      expect(flux.getAllConstants()[0]).to.be.a("string");
      expect(flux.getAllConstants()).to.have.length(4);
    });
  });

  describe("#dispatch()", function () {

    it("delegates to dispatcher", function () {
      var flux = new Flux();
      var dispatch = sinon.spy();
      flux.dispatcher = { dispatch: dispatch };
      var actionId = "actionId";

      flux.dispatch(actionId, "foobar");

      expect(dispatch.firstCall.args[0]).to.deep.equal({
        actionId: actionId,
        body: "foobar" });
    });

    it("emits dispatch event", function () {
      var flux = new Flux();
      var listener = sinon.spy();

      flux.addListener("dispatch", listener);

      var actionId = "actionId";

      flux.dispatch(actionId, "foobar");

      expect(listener.calledOnce).to.be["true"];
      expect(listener.firstCall.args[0]).to.deep.equal({
        actionId: actionId,
        body: "foobar"
      });
    });
  });

  describe("#dispatchAsync()", function () {

    it("delegates to dispatcher", function callee$2$0() {
      var flux, dispatch, actionId;
      return regeneratorRuntime.async(function callee$2$0$(context$3$0) {
        while (1) switch (context$3$0.prev = context$3$0.next) {
          case 0:
            flux = new Flux();
            dispatch = sinon.spy();

            flux.dispatcher = { dispatch: dispatch };
            actionId = "actionId";
            context$3$0.next = 6;
            return flux.dispatchAsync(actionId, Promise.resolve("foobar"));

          case 6:

            expect(dispatch.callCount).to.equal(2);
            expect(dispatch.firstCall.args[0]).to.deep.equal({
              actionId: actionId,
              async: "begin" });
            expect(dispatch.secondCall.args[0]).to.deep.equal({
              actionId: actionId,
              body: "foobar",
              async: "success"
            });

          case 9:
          case "end":
            return context$3$0.stop();
        }
      }, null, this);
    });

    it("emits dispatch event", function callee$2$1() {
      var flux, listener, actionId;
      return regeneratorRuntime.async(function callee$2$1$(context$3$0) {
        while (1) switch (context$3$0.prev = context$3$0.next) {
          case 0:
            flux = new Flux();
            listener = sinon.spy();

            flux.addListener("dispatch", listener);

            actionId = "actionId";
            context$3$0.next = 6;
            return flux.dispatchAsync(actionId, Promise.resolve("foobar"));

          case 6:

            expect(listener.calledTwice).to.be["true"];
            expect(listener.firstCall.args[0]).to.deep.equal({
              actionId: actionId,
              async: "begin" });
            expect(listener.secondCall.args[0]).to.deep.equal({
              actionId: actionId,
              async: "success",
              body: "foobar" });

          case 9:
          case "end":
            return context$3$0.stop();
        }
      }, null, this);
    });

    it("resolves to value of given promise", function (done) {
      var flux = new Flux();
      var dispatch = sinon.spy();
      flux.dispatcher = { dispatch: dispatch };
      var actionId = "actionId";

      expect(flux.dispatchAsync(actionId, Promise.resolve("foobar"))).to.eventually.equal("foobar").notify(done);
    });

    it("rejects with error if promise rejects", function (done) {
      var flux = new Flux();
      var dispatch = sinon.spy();
      flux.dispatcher = { dispatch: dispatch };
      var actionId = "actionId";

      expect(flux.dispatchAsync(actionId, Promise.reject(new Error("error")))).to.be.rejectedWith("error").notify(done);
    });

    it("dispatches with error if promise rejects", function callee$2$2() {
      var flux, dispatch, actionId, actionArgs, error;
      return regeneratorRuntime.async(function callee$2$2$(context$3$0) {
        while (1) switch (context$3$0.prev = context$3$0.next) {
          case 0:
            flux = new Flux();
            dispatch = sinon.spy();

            flux.dispatcher = { dispatch: dispatch };
            actionId = "actionId";
            actionArgs = {};
            error = new Error("error");
            context$3$0.next = 8;
            return expect(flux.dispatchAsync(actionId, Promise.reject(error), actionArgs)).to.be.rejected;

          case 8:

            expect(dispatch.callCount).to.equal(2);
            expect(dispatch.firstCall.args[0]).to.deep.equal({
              actionId: actionId,
              actionArgs: actionArgs,
              async: "begin" });
            expect(dispatch.secondCall.args[0]).to.deep.equal({
              actionId: actionId,
              error: error,
              actionArgs: actionArgs,
              async: "failure"
            });

          case 11:
          case "end":
            return context$3$0.stop();
        }
      }, null, this);
    });

    it("emits error if promise rejects", function callee$2$3() {
      var ExampleStore, flux, listener, actionId;
      return regeneratorRuntime.async(function callee$2$3$(context$3$0) {
        while (1) switch (context$3$0.prev = context$3$0.next) {
          case 0:
            ExampleStore = (function (_Store) {
              function ExampleStore() {
                _classCallCheck(this, ExampleStore);

                if (_Store != null) {
                  _Store.apply(this, arguments);
                }
              }

              _inherits(ExampleStore, _Store);

              return ExampleStore;
            })(Store);

            flux = new Flux();
            listener = sinon.spy();

            flux.addListener("error", listener);

            actionId = "actionId";
            context$3$0.next = 7;
            return expect(flux.dispatchAsync(actionId, Promise.reject(new Error("foobar")))).to.be.rejectedWith("foobar");

          case 7:

            expect(listener.calledOnce).to.be["true"];
            expect(listener.firstCall.args[0].message).to.equal("foobar");

          case 9:
          case "end":
            return context$3$0.stop();
        }
      }, null, this);
    });

    it("emit errors that occur as result of dispatch", function callee$2$4() {
      var ExampleStore, flux, listener, actionId, store;
      return regeneratorRuntime.async(function callee$2$4$(context$3$0) {
        while (1) switch (context$3$0.prev = context$3$0.next) {
          case 0:
            ExampleStore = (function (_Store) {
              function ExampleStore() {
                _classCallCheck(this, ExampleStore);

                if (_Store != null) {
                  _Store.apply(this, arguments);
                }
              }

              _inherits(ExampleStore, _Store);

              return ExampleStore;
            })(Store);

            flux = new Flux();
            listener = sinon.spy();

            flux.addListener("error", listener);

            actionId = "actionId";
            store = flux.createStore("example", ExampleStore);

            store.registerAsync(actionId, null, function () {
              throw new Error("success error");
            }, function () {
              throw new Error("failure error");
            });

            context$3$0.next = 9;
            return expect(flux.dispatchAsync(actionId, Promise.resolve("foobar"))).to.be.rejectedWith("success error");

          case 9:
            expect(listener.calledOnce).to.be["true"];
            expect(listener.firstCall.args[0].message).to.equal("success error");

            context$3$0.next = 13;
            return expect(flux.dispatchAsync(actionId, Promise.reject(new Error("foobar")))).to.be.rejectedWith("failure error");

          case 13:
            expect(listener.calledTwice).to.be["true"];
            expect(listener.secondCall.args[0].message).to.equal("failure error");

          case 15:
          case "end":
            return context$3$0.stop();
        }
      }, null, this);
    });
  });

  describe("#removeAllStoreListeners", function () {
    it("removes all listeners from stores", function () {
      var TestStore = (function (_Store) {
        function TestStore() {
          _classCallCheck(this, TestStore);

          if (_Store != null) {
            _Store.apply(this, arguments);
          }
        }

        _inherits(TestStore, _Store);

        return TestStore;
      })(Store);

      var flux = new Flux();
      var storeA = flux.createStore("storeA", TestStore);
      var storeB = flux.createStore("storeB", TestStore);

      var listener = function listener() {};

      storeA.addListener("change", listener);
      storeA.addListener("change", listener);
      storeB.addListener("change", listener);
      storeB.addListener("change", listener);

      expect(storeA.listeners("change").length).to.equal(2);
      expect(storeB.listeners("change").length).to.equal(2);

      flux.removeAllStoreListeners();

      expect(storeA.listeners("change").length).to.equal(0);
      expect(storeB.listeners("change").length).to.equal(0);
    });
  });

  describe("#serialize()", function () {

    it("returns state of all the stores as a JSON string", function () {
      var flux = new Flux();

      flux.createStore("foo", createSerializableStore("foo state"));
      flux.createStore("bar", createSerializableStore("bar state"));
      flux.createStore("baz", createSerializableStore("baz state"));

      expect(JSON.parse(flux.serialize())).to.deep.equal({
        foo: "foo state",
        bar: "bar state",
        baz: "baz state" });
    });

    it("ignores stores whose classes do not implement .serialize()", function () {
      var flux = new Flux();

      var TestStore = (function (_Store) {
        function TestStore() {
          _classCallCheck(this, TestStore);

          if (_Store != null) {
            _Store.apply(this, arguments);
          }
        }

        _inherits(TestStore, _Store);

        return TestStore;
      })(Store);

      flux.createStore("foo", createSerializableStore("foo state"));
      flux.createStore("bar", createSerializableStore("bar state"));
      flux.createStore("baz", TestStore);

      expect(JSON.parse(flux.serialize())).to.deep.equal({
        foo: "foo state",
        bar: "bar state" });
    });

    it("warns if any store classes .serialize() returns a non-string", function () {
      var flux = new Flux();
      var warn = sinon.spy(console, "warn");

      flux.createStore("foo", createSerializableStore({}));
      flux.serialize();

      expect(warn.firstCall.args[0]).to.equal("The store with key 'foo' was not serialized because the static " + "method `SerializableStore.serialize()` returned a non-string with " + "type 'object'.");

      console.warn.restore();
    });

    it("warns and skips stores whose classes do not implement .deserialize()", function () {
      var flux = new Flux();
      var warn = sinon.spy(console, "warn");

      var TestStore = (function (_Store) {
        function TestStore() {
          _classCallCheck(this, TestStore);

          if (_Store != null) {
            _Store.apply(this, arguments);
          }
        }

        _inherits(TestStore, _Store);

        _createClass(TestStore, null, {
          serialize: {
            value: function serialize() {
              return "state string";
            }
          }
        });

        return TestStore;
      })(Store);

      flux.createStore("test", TestStore);
      flux.serialize();

      expect(warn.firstCall.args[0]).to.equal("The class `TestStore` has a `serialize()` method, but no " + "corresponding `deserialize()` method.");

      console.warn.restore();
    });
  });

  describe("#deserialize()", function () {

    it("converts a serialized string into state and uses it to replace state of stores", function () {
      var flux = new Flux();

      flux.createStore("foo", createSerializableStore());
      flux.createStore("bar", createSerializableStore());
      flux.createStore("baz", createSerializableStore());

      flux.deserialize("{\n        \"foo\": \"foo state\",\n        \"bar\": \"bar state\",\n        \"baz\": \"baz state\"\n      }");

      var fooStore = flux.getStore("foo");
      var barStore = flux.getStore("bar");
      var bazStore = flux.getStore("baz");

      expect(fooStore.state.stateString).to.equal("foo state");
      expect(fooStore.state.deserialized).to.be["true"];
      expect(barStore.state.stateString).to.equal("bar state");
      expect(barStore.state.deserialized).to.be["true"];
      expect(bazStore.state.stateString).to.equal("baz state");
      expect(bazStore.state.deserialized).to.be["true"];
    });

    it("warns and skips if passed string is invalid JSON", function () {
      var flux = new Flux();

      var TestStore = (function (_Store) {
        function TestStore() {
          _classCallCheck(this, TestStore);

          if (_Store != null) {
            _Store.apply(this, arguments);
          }
        }

        _inherits(TestStore, _Store);

        return TestStore;
      })(Store);

      flux.createStore("foo", TestStore);

      expect(flux.deserialize.bind(flux, "not JSON")).to["throw"]("Invalid value passed to `Flux#deserialize()`: not JSON");
    });

    it("warns and skips stores whose classes do not implement .serialize()", function () {
      var flux = new Flux();
      var warn = sinon.spy(console, "warn");

      var TestStore = (function (_Store) {
        function TestStore() {
          _classCallCheck(this, TestStore);

          if (_Store != null) {
            _Store.apply(this, arguments);
          }
        }

        _inherits(TestStore, _Store);

        _createClass(TestStore, null, {
          deserialize: {
            value: function deserialize() {
              return {};
            }
          }
        });

        return TestStore;
      })(Store);

      flux.createStore("test", TestStore);
      flux.deserialize("{\"test\": \"test state\"}");

      expect(warn.firstCall.args[0]).to.equal("The class `TestStore` has a `deserialize()` method, but no " + "corresponding `serialize()` method.");

      console.warn.restore();
    });

    it("ignores stores whose classes do not implement .deserialize()", function () {
      var flux = new Flux();

      var TestStore = (function (_Store) {
        function TestStore() {
          _classCallCheck(this, TestStore);

          if (_Store != null) {
            _Store.apply(this, arguments);
          }
        }

        _inherits(TestStore, _Store);

        return TestStore;
      })(Store);

      flux.createStore("foo", createSerializableStore());
      flux.createStore("bar", createSerializableStore());
      flux.createStore("baz", TestStore);

      flux.deserialize("{\n        \"foo\": \"foo state\",\n        \"bar\": \"bar state\",\n        \"baz\": \"baz state\"\n      }");

      var fooStore = flux.getStore("foo");
      var barStore = flux.getStore("bar");
      var bazStore = flux.getStore("baz");

      expect(fooStore.state.stateString).to.equal("foo state");
      expect(fooStore.state.deserialized).to.be["true"];
      expect(barStore.state.stateString).to.equal("bar state");
      expect(barStore.state.deserialized).to.be["true"];
      expect(bazStore.state).to.be["null"];
    });
  });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9fX3Rlc3RzX18vRmx1eC10ZXN0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7b0JBQXFDLFNBQVM7O0lBQXJDLElBQUksU0FBSixJQUFJO0lBQUUsS0FBSyxTQUFMLEtBQUs7SUFBRSxPQUFPLFNBQVAsT0FBTzs7SUFDdEIsS0FBSywyQkFBTSxPQUFPOztBQUV6QixTQUFTLHVCQUF1QixDQUFDLGVBQWUsRUFBRTtBQUNoRDthQUFhLGlCQUFpQjs0QkFBakIsaUJBQWlCOzs7Ozs7O2NBQWpCLGlCQUFpQjs7aUJBQWpCLGlCQUFpQjtBQUNyQixlQUFTO2VBQUEscUJBQUc7QUFDakIsaUJBQU8sZUFBZSxDQUFDO1NBQ3hCOztBQUNNLGlCQUFXO2VBQUEscUJBQUMsV0FBVyxFQUFFO0FBQzlCLGlCQUFPO0FBQ0wsdUJBQVcsRUFBWCxXQUFXO0FBQ1gsd0JBQVksRUFBRSxJQUFJLEVBQ25CLENBQUM7U0FDSDs7OztXQVRVLGlCQUFpQjtLQUFTLEtBQUssRUFVMUM7Q0FDSDs7QUFFRCxRQUFRLENBQUMsTUFBTSxFQUFFLFlBQU07O0FBRXJCLFVBQVEsQ0FBQyxnQkFBZ0IsRUFBRSxZQUFNO0FBQy9CLE1BQUUsQ0FBQyw4QkFBOEIsRUFBRSxZQUFNO0FBQ3ZDLFVBQU0sSUFBSSxHQUFHLElBQUksSUFBSSxFQUFFLENBQUM7O1VBQ2xCLFNBQVM7aUJBQVQsU0FBUztnQ0FBVCxTQUFTOzs7Ozs7O2tCQUFULFNBQVM7O2VBQVQsU0FBUztTQUFTLEtBQUs7O0FBRTdCLFVBQUksQ0FBQyxXQUFXLENBQUMsY0FBYyxFQUFFLFNBQVMsQ0FBQyxDQUFDO0FBQzVDLFlBQU0sQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsY0FBYyxFQUFFLFNBQVMsQ0FBQyxDQUFDLENBQUMsRUFBRSxTQUFNLENBQ3JFLG9FQUFxRSxHQUNyRSxzQkFBc0IsQ0FDdkIsQ0FBQztLQUNILENBQUMsQ0FBQzs7QUFFSCxNQUFF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QUMsV0FBVyxDQUFDLEtBQUssRUFBRSx1QkFBdUIsRUFBRSxDQUFDLENBQUM7QUFDbkQsVUFBSSxDQUFDLFdBQVcsQ0FBQyxLQUFLLEVBQUUsU0FBUyxDQUFDLENBQUM7O0FBRW5DLFVBQUksQ0FBQyxXQUFXLGdIQUliLENBQUM7O0FBRUosVUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUN0QyxVQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQ3RDLFVBQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUM7O0FBRXRDLFlBQU0sQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLFdBQVcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDLENBQUM7QUFDekQsWUFBTSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsWUFBWSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsUUFBSyxDQUFDO0FBQy9DLFlBQU0sQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLFdBQVcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDLENBQUM7QUFDekQsWUFBTSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsWUFBWSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsUUFBSyxDQUFDO0FBQy9DLFlBQU0sQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsUUFBSyxDQUFDO0tBQ25DLENBQUMsQ0FBQztHQUVKLENBQUMsQ0FBQztDQUVKLENBQUMsQ0FBQyIsImZpbGUiOiJzcmMvX190ZXN0c19fL0ZsdXgtdGVzdC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEZsdXgsIFN0b3JlLCBBY3Rpb25zIH0gZnJvbSAnLi4vRmx1eCc7XG5pbXBvcnQgc2lub24gZnJvbSAnc2lub24nO1xuXG5mdW5jdGlvbiBjcmVhdGVTZXJpYWxpemFibGVTdG9yZShzZXJpYWxpemVkU3RhdGUpIHtcbiAgcmV0dXJuIGNsYXNzIFNlcmlhbGl6YWJsZVN0b3JlIGV4dGVuZHMgU3RvcmUge1xuICAgIHN0YXRpYyBzZXJpYWxpemUoKSB7XG4gICAgICByZXR1cm4gc2VyaWFsaXplZFN0YXRlO1xuICAgIH1cbiAgICBzdGF0aWMgZGVzZXJpYWxpemUoc3RhdGVTdHJpbmcpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHN0YXRlU3RyaW5nLFxuICAgICAgICBkZXNlcmlhbGl6ZWQ6IHRydWUsXG4gICAgICB9O1xuICAgIH1cbiAgfTtcbn1cblxuZGVzY3JpYmUoJ0ZsdXgnLCAoKSA9PiB7XG5cbiAgZGVzY3JpYmUoJyNjcmVhdGVTdG9yZSgpJywgKCkgPT4ge1xuICAgIGl0KCd0aHJvd3MgaWYga2V5IGFscmVhZHkgZXhpc3RzJywgKCkgPT4ge1xuICAgICAgY29uc3QgZmx1eCA9IG5ldyBGbHV4KCk7XG4gICAgICBjbGFzcyBUZXN0U3RvcmUgZXh0ZW5kcyBTdG9yZSB7fVxuXG4gICAgICBmbHV4LmNyZWF0ZVN0b3JlKCdFeGFtcGxlU3RvcmUnLCBUZXN0U3RvcmUpO1xuICAgICAgZXhwZWN0KGZsdXguY3JlYXRlU3RvcmUuYmluZChmbHV4LCAnRXhhbXBsZVN0b3JlJywgVGVzdFN0b3JlKSkudG8udGhyb3coXG4gICAgICAgICdZb3VcXCd2ZSBhdHRlbXB0ZWQgdG8gY3JlYXRlIG11bHRpcGxlIHN0b3JlcyB3aXRoIGtleSBFeGFtcGxlU3RvcmUuICdcbiAgICAgICsgJ0tleXMgbXVzdCBiZSB1bmlxdWUuJ1xuICAgICAgKTtcbiAgICB9KTtcblxuICAgIGl0KCd0aHJvd3MgaWYgU3RvcmUgaXMgbm90IGEgcHJvdG90eXBlIG9mIGNsYXNzJywgKCkgPT4ge1xuICAgICAgY29uc3QgZmx1eCA9IG5ldyBGbHV4KCk7XG4gICAgICBjbGFzcyBGb3Jnb3RUb0V4dGVuZFN0b3JlIHt9XG5cbiAgICAgIGV4cGVjdChmbHV4LmNyZWF0ZVN0b3JlLmJpbmQoZmx1eCwgJ0ZsdXgnLCBGb3Jnb3RUb0V4dGVuZFN0b3JlKSkudG8udGhyb3coXG4gICAgICAgICdZb3VcXCd2ZSBhdHRlbXB0ZWQgdG8gY3JlYXRlIGEgc3RvcmUgZnJvbSB0aGUgY2xhc3MgJ1xuICAgICAgKyAnRm9yZ290VG9FeHRlbmRTdG9yZSwgd2hpY2ggZG9lcyBub3QgaGF2ZSB0aGUgYmFzZSBTdG9yZSBjbGFzcyBpbiBpdHMgJ1xuICAgICAgKyAncHJvdG90eXBlIGNoYWluLiBNYWtlIHN1cmUgeW91XFwncmUgdXNpbmcgdGhlIGBleHRlbmRzYCBrZXl3b3JkOiAnXG4gICAgICArICdgY2xhc3MgRm9yZ290VG9FeHRlbmRTdG9yZSBleHRlbmRzIFN0b3JlIHsgLi4uIH1gJ1xuICAgICAgKTtcbiAgICB9KTtcblxuICAgIGl0KCdyZWdpc3RlcnMgc3RvcmVcXCdzIGhhbmRsZXIgd2l0aCBjZW50cmFsIGRpc3BhdGNoZXInLCAoKSA9PiB7XG4gICAgICBjbGFzcyBFeGFtcGxlU3RvcmUgZXh0ZW5kcyBTdG9yZSB7fVxuXG4gICAgICBjb25zdCBzcHkxID0gc2lub24uc3B5KCk7XG4gICAgICBjb25zdCBzcHkyID0gc2lub24uc3B5KCk7XG5cbiAgICAgIEV4YW1wbGVTdG9yZS5wcm90b3R5cGUuZm9vID0gJ2Jhcic7XG4gICAgICBFeGFtcGxlU3RvcmUucHJvdG90eXBlLmhhbmRsZXIgPSBmdW5jdGlvbihfcGF5bG9hZCkge1xuICAgICAgICBzcHkxKF9wYXlsb2FkKTtcbiAgICAgICAgc3B5Mih0aGlzLmZvbyk7XG4gICAgICB9O1xuXG4gICAgICBjb25zdCBmbHV4ID0gbmV3IEZsdXgoKTtcbiAgICAgIGZsdXguY3JlYXRlU3RvcmUoJ0V4YW1wbGVTdG9yZScsIEV4YW1wbGVTdG9yZSk7XG5cbiAgICAgIGNvbnN0IHBheWxvYWQgPSAnZm9vYmFyJztcbiAgICAgIGZsdXguZGlzcGF0Y2goJ2FjdGlvbklkJywgcGF5bG9hZCk7XG4gICAgICBleHBlY3Qoc3B5MS5nZXRDYWxsKDApLmFyZ3NbMF0uYm9keSkudG8uZXF1YWwoJ2Zvb2JhcicpO1xuICAgICAgZXhwZWN0KHNweTIuY2FsbGVkV2l0aCgnYmFyJykpLnRvLmJlLnRydWU7XG4gICAgfSk7XG5cbiAgICBpdCgncmV0dXJucyB0aGUgY3JlYXRlZCBzdG9yZSBpbnN0YW5jZScsICgpID0+IHtcbiAgICAgIGNsYXNzIEV4YW1wbGVTdG9yZSBleHRlbmRzIFN0b3JlIHt9XG5cbiAgICAgIGNvbnN0IGZsdXggPSBuZXcgRmx1eCgpO1xuICAgICAgY29uc3Qgc3RvcmUgPSBmbHV4LmNyZWF0ZVN0b3JlKCdFeGFtcGxlU3RvcmUnLCBFeGFtcGxlU3RvcmUpO1xuICAgICAgZXhwZWN0KHN0b3JlKS50by5iZS5hbi5pbnN0YW5jZU9mKEV4YW1wbGVTdG9yZSk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCcjZ2V0U3RvcmUoKScsICgpID0+IHtcbiAgICBpdCgncmV0cmlldmVzIHN0b3JlIGZvciBrZXknLCAoKSA9PiB7XG4gICAgICBjb25zdCBmbHV4ID0gbmV3IEZsdXgoKTtcbiAgICAgIGNsYXNzIFRlc3RTdG9yZSBleHRlbmRzIFN0b3JlIHt9XG5cbiAgICAgIGZsdXguY3JlYXRlU3RvcmUoJ0V4YW1wbGVTdG9yZScsIFRlc3RTdG9yZSk7XG4gICAgICBleHBlY3QoZmx1eC5nZXRTdG9yZSgnRXhhbXBsZVN0b3JlJykpLnRvLmJlLmFuLmluc3RhbmNlT2YoU3RvcmUpO1xuICAgICAgZXhwZWN0KGZsdXguZ2V0U3RvcmUoJ05vbmV4aXN0ZW50U3RvcmUnKSkudG8uYmUudW5kZWZpbmVkO1xuICAgIH0pO1xuICB9KTtcblxuICBkZXNjcmliZSgnI2NyZWF0ZUFjdGlvbnMoKScsICgpID0+IHtcbiAgICBpdCgndGhyb3dzIGlmIGtleSBhbHJlYWR5IGV4aXN0cycsICgpID0+IHtcbiAgICAgIGNsYXNzIFRlc3RBY3Rpb25zIGV4dGVuZHMgQWN0aW9ucyB7fVxuXG4gICAgICBjb25zdCBmbHV4ID0gbmV3IEZsdXgoKTtcbiAgICAgIGZsdXguY3JlYXRlQWN0aW9ucygnRXhhbXBsZUFjdGlvbnMnLCBUZXN0QWN0aW9ucyk7XG5cbiAgICAgIGV4cGVjdChmbHV4LmNyZWF0ZUFjdGlvbnMuYmluZChmbHV4LCAnRXhhbXBsZUFjdGlvbnMnLCBBY3Rpb25zKSkudG8udGhyb3coXG4gICAgICAgICdZb3VcXCd2ZSBhdHRlbXB0ZWQgdG8gY3JlYXRlIG11bHRpcGxlIGFjdGlvbnMgd2l0aCBrZXkgRXhhbXBsZUFjdGlvbnMuICdcbiAgICAgICsgJ0tleXMgbXVzdCBiZSB1bmlxdWUuJ1xuICAgICAgKTtcbiAgICB9KTtcblxuICAgIGl0KCd0aHJvd3MgaWYgQWN0aW9ucyBpcyBub3QgYSBwcm90b3R5cGUgb2YgY2xhc3MnLCAoKSA9PiB7XG4gICAgICBjb25zdCBmbHV4ID0gbmV3IEZsdXgoKTtcbiAgICAgIGNsYXNzIEZvcmdvdFRvRXh0ZW5kQWN0aW9ucyB7fVxuXG4gICAgICBleHBlY3QoZmx1eC5jcmVhdGVBY3Rpb25zLmJpbmQoZmx1eCwgJ0ZsdXgnLCBGb3Jnb3RUb0V4dGVuZEFjdGlvbnMpKVxuICAgICAgICAudG8udGhyb3coXG4gICAgICAgICAgJ1lvdVxcJ3ZlIGF0dGVtcHRlZCB0byBjcmVhdGUgYWN0aW9ucyBmcm9tIHRoZSBjbGFzcyAnXG4gICAgICAgICsgJ0ZvcmdvdFRvRXh0ZW5kQWN0aW9ucywgd2hpY2ggZG9lcyBub3QgaGF2ZSB0aGUgYmFzZSBBY3Rpb25zIGNsYXNzICdcbiAgICAgICAgKyAnaW4gaXRzIHByb3RvdHlwZSBjaGFpbi4gTWFrZSBzdXJlIHlvdVxcJ3JlIHVzaW5nIHRoZSBgZXh0ZW5kc2AgJ1xuICAgICAgICArICdrZXl3b3JkOiBgY2xhc3MgRm9yZ290VG9FeHRlbmRBY3Rpb25zIGV4dGVuZHMgQWN0aW9ucyB7IC4uLiB9YCdcbiAgICAgICk7XG4gICAgfSk7XG5cbiAgICBpdCgncmV0dXJucyB0aGUgY3JlYXRlZCBhY3Rpb25cXCdzIGluc3RhbmNlJywgKCkgPT4ge1xuICAgICAgY2xhc3MgVGVzdEFjdGlvbnMgZXh0ZW5kcyBBY3Rpb25zIHt9XG5cbiAgICAgIGNvbnN0IGZsdXggPSBuZXcgRmx1eCgpO1xuICAgICAgY29uc3QgYWN0aW9ucyA9IGZsdXguY3JlYXRlQWN0aW9ucygnVGVzdEFjdGlvbnMnLCBUZXN0QWN0aW9ucyk7XG4gICAgICBleHBlY3QoYWN0aW9ucykudG8uYmUuYW4uaW5zdGFuY2VPZihUZXN0QWN0aW9ucyk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCcjZ2V0QWN0aW9ucygpJywgKCkgPT4ge1xuICAgIGNsYXNzIFRlc3RBY3Rpb25zIGV4dGVuZHMgQWN0aW9ucyB7fVxuXG4gICAgaXQoJ3JldHJpZXZlcyBhY3Rpb25zIGZvciBrZXknLCAoKSA9PiB7XG4gICAgICBjb25zdCBmbHV4ID0gbmV3IEZsdXgoKTtcbiAgICAgIGZsdXguY3JlYXRlQWN0aW9ucygnVGVzdEFjdGlvbnMnLCBUZXN0QWN0aW9ucyk7XG5cbiAgICAgIGV4cGVjdChmbHV4LmdldEFjdGlvbnMoJ1Rlc3RBY3Rpb25zJykpLnRvLmJlLmFuLmluc3RhbmNlT2YoQWN0aW9ucyk7XG4gICAgICBleHBlY3QoZmx1eC5nZXRBY3Rpb25zKCdOb25leGlzdGVudEFjdGlvbnMnKSkudG8uYmUudW5kZWZpbmVkO1xuICAgIH0pO1xuXG4gIH0pO1xuXG4gIGRlc2NyaWJlKCcjZ2V0QWN0aW9uSWRzKCkgLyAjZ2V0Q29uc3RhbnRzKCknLCAoKSA9PiB7XG4gICAgY2xhc3MgVGVzdEFjdGlvbnMgZXh0ZW5kcyBBY3Rpb25zIHtcbiAgICAgIGdldEZvbygpIHt9XG4gICAgfVxuXG4gICAgaXQoJ3JldHJpdmVzIGlkcyBvZiBhY3Rpb25zIGZvciBrZXknLCAoKSA9PiB7XG4gICAgICBjb25zdCBmbHV4ID0gbmV3IEZsdXgoKTtcbiAgICAgIGZsdXguY3JlYXRlQWN0aW9ucygnVGVzdEFjdGlvbnMnLCBUZXN0QWN0aW9ucyk7XG5cbiAgICAgIGV4cGVjdChmbHV4LmdldEFjdGlvbklkcygnVGVzdEFjdGlvbnMnKS5nZXRGb28pLnRvLmJlLmEoJ3N0cmluZycpO1xuICAgICAgZXhwZWN0KGZsdXguZ2V0QWN0aW9uSWRzKCdOb25leGlzdGVudEFjdGlvbnMnKSkudG8uYmUudW5kZWZpbmVkO1xuXG4gICAgICBleHBlY3QoZmx1eC5nZXRDb25zdGFudHMoJ1Rlc3RBY3Rpb25zJykuZ2V0Rm9vKS50by5iZS5hKCdzdHJpbmcnKTtcbiAgICAgIGV4cGVjdChmbHV4LmdldENvbnN0YW50cygnTm9uZXhpc3RlbnRBY3Rpb25zJykpLnRvLmJlLnVuZGVmaW5lZDtcbiAgICB9KTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJyNnZXRBbGxBY3Rpb25JZHMoKSAvICNnZXRBbGxDb25zdGFudHMoKScsICgpID0+IHtcbiAgICBjbGFzcyBUZXN0Rm9vQWN0aW9ucyBleHRlbmRzIEFjdGlvbnMge1xuICAgICAgZ2V0Rm9vKCkge31cbiAgICAgIGdldEJhcigpIHt9XG4gICAgfVxuXG4gICAgY2xhc3MgVGVzdEJhckFjdGlvbnMgZXh0ZW5kcyBBY3Rpb25zIHtcbiAgICAgIGdldEZvbygpIHt9XG4gICAgICBnZXRCYXIoKSB7fVxuICAgIH1cblxuICAgIGl0KCdyZXRyaXZlcyBpZHMgb2YgYWxsIGFjdGlvbnMnLCAoKSA9PiB7XG4gICAgICBsZXQgZmx1eCA9IG5ldyBGbHV4KCk7XG4gICAgICBmbHV4LmNyZWF0ZUFjdGlvbnMoJ1Rlc3RGb29BY3Rpb25zJywgVGVzdEZvb0FjdGlvbnMpO1xuICAgICAgZmx1eC5jcmVhdGVBY3Rpb25zKCdUZXN0QmFyQWN0aW9ucycsIFRlc3RCYXJBY3Rpb25zKTtcblxuICAgICAgZXhwZWN0KGZsdXguZ2V0QWxsQWN0aW9uSWRzKCkpLnRvLmJlLmFuKCdhcnJheScpO1xuICAgICAgZXhwZWN0KGZsdXguZ2V0QWxsQWN0aW9uSWRzKClbMF0pLnRvLmJlLmEoJ3N0cmluZycpO1xuICAgICAgZXhwZWN0KGZsdXguZ2V0QWxsQWN0aW9uSWRzKCkpLnRvLmhhdmUubGVuZ3RoKDQpO1xuXG4gICAgICBleHBlY3QoZmx1eC5nZXRBbGxDb25zdGFudHMoKSkudG8uYmUuYW4oJ2FycmF5Jyk7XG4gICAgICBleHBlY3QoZmx1eC5nZXRBbGxDb25zdGFudHMoKVswXSkudG8uYmUuYSgnc3RyaW5nJyk7XG4gICAgICBleHBlY3QoZmx1eC5nZXRBbGxDb25zdGFudHMoKSkudG8uaGF2ZS5sZW5ndGgoNCk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCcjZGlzcGF0Y2goKScsICgpID0+IHtcblxuICAgIGl0KCdkZWxlZ2F0ZXMgdG8gZGlzcGF0Y2hlcicsICgpID0+IHtcbiAgICAgIGNvbnN0IGZsdXggPSBuZXcgRmx1eCgpO1xuICAgICAgY29uc3QgZGlzcGF0Y2ggPSBzaW5vbi5zcHkoKTtcbiAgICAgIGZsdXguZGlzcGF0Y2hlciA9IHsgZGlzcGF0Y2ggfTtcbiAgICAgIGNvbnN0IGFjdGlvbklkID0gJ2FjdGlvbklkJztcblxuICAgICAgZmx1eC5kaXNwYXRjaChhY3Rpb25JZCwgJ2Zvb2JhcicpO1xuXG4gICAgICBleHBlY3QoZGlzcGF0Y2guZmlyc3RDYWxsLmFyZ3NbMF0pLnRvLmRlZXAuZXF1YWwoe1xuICAgICAgICBhY3Rpb25JZCxcbiAgICAgICAgYm9keTogJ2Zvb2JhcicsXG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIGl0KCdlbWl0cyBkaXNwYXRjaCBldmVudCcsICgpID0+IHtcbiAgICAgIGNvbnN0IGZsdXggPSBuZXcgRmx1eCgpO1xuICAgICAgY29uc3QgbGlzdGVuZXIgPSBzaW5vbi5zcHkoKTtcblxuICAgICAgZmx1eC5hZGRMaXN0ZW5lcignZGlzcGF0Y2gnLCBsaXN0ZW5lcik7XG5cbiAgICAgIGNvbnN0IGFjdGlvbklkID0gJ2FjdGlvbklkJztcblxuICAgICAgZmx1eC5kaXNwYXRjaChhY3Rpb25JZCwgJ2Zvb2JhcicpO1xuXG4gICAgICBleHBlY3QobGlzdGVuZXIuY2FsbGVkT25jZSkudG8uYmUudHJ1ZTtcbiAgICAgIGV4cGVjdChsaXN0ZW5lci5maXJzdENhbGwuYXJnc1swXSkudG8uZGVlcC5lcXVhbCh7XG4gICAgICAgIGFjdGlvbklkLFxuICAgICAgICBib2R5OiAnZm9vYmFyJ1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCcjZGlzcGF0Y2hBc3luYygpJywgKCkgPT4ge1xuXG4gICAgaXQoJ2RlbGVnYXRlcyB0byBkaXNwYXRjaGVyJywgYXN5bmMgZnVuY3Rpb24oKSB7XG4gICAgICBjb25zdCBmbHV4ID0gbmV3IEZsdXgoKTtcbiAgICAgIGNvbnN0IGRpc3BhdGNoID0gc2lub24uc3B5KCk7XG4gICAgICBmbHV4LmRpc3BhdGNoZXIgPSB7IGRpc3BhdGNoIH07XG4gICAgICBjb25zdCBhY3Rpb25JZCA9ICdhY3Rpb25JZCc7XG5cbiAgICAgIGF3YWl0IGZsdXguZGlzcGF0Y2hBc3luYyhhY3Rpb25JZCwgUHJvbWlzZS5yZXNvbHZlKCdmb29iYXInKSk7XG5cbiAgICAgIGV4cGVjdChkaXNwYXRjaC5jYWxsQ291bnQpLnRvLmVxdWFsKDIpO1xuICAgICAgZXhwZWN0KGRpc3BhdGNoLmZpcnN0Q2FsbC5hcmdzWzBdKS50by5kZWVwLmVxdWFsKHtcbiAgICAgICAgYWN0aW9uSWQsXG4gICAgICAgIGFzeW5jOiAnYmVnaW4nLFxuICAgICAgfSk7XG4gICAgICBleHBlY3QoZGlzcGF0Y2guc2Vjb25kQ2FsbC5hcmdzWzBdKS50by5kZWVwLmVxdWFsKHtcbiAgICAgICAgYWN0aW9uSWQsXG4gICAgICAgIGJvZHk6ICdmb29iYXInLFxuICAgICAgICBhc3luYzogJ3N1Y2Nlc3MnXG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIGl0KCdlbWl0cyBkaXNwYXRjaCBldmVudCcsIGFzeW5jIGZ1bmN0aW9uKCkge1xuICAgICAgY29uc3QgZmx1eCA9IG5ldyBGbHV4KCk7XG4gICAgICBjb25zdCBsaXN0ZW5lciA9IHNpbm9uLnNweSgpO1xuXG4gICAgICBmbHV4LmFkZExpc3RlbmVyKCdkaXNwYXRjaCcsIGxpc3RlbmVyKTtcblxuICAgICAgY29uc3QgYWN0aW9uSWQgPSAnYWN0aW9uSWQnO1xuXG4gICAgICBhd2FpdCBmbHV4LmRpc3BhdGNoQXN5bmMoYWN0aW9uSWQsIFByb21pc2UucmVzb2x2ZSgnZm9vYmFyJykpO1xuXG4gICAgICBleHBlY3QobGlzdGVuZXIuY2FsbGVkVHdpY2UpLnRvLmJlLnRydWU7XG4gICAgICBleHBlY3QobGlzdGVuZXIuZmlyc3RDYWxsLmFyZ3NbMF0pLnRvLmRlZXAuZXF1YWwoe1xuICAgICAgICBhY3Rpb25JZCxcbiAgICAgICAgYXN5bmM6ICdiZWdpbicsXG4gICAgICB9KTtcbiAgICAgIGV4cGVjdChsaXN0ZW5lci5zZWNvbmRDYWxsLmFyZ3NbMF0pLnRvLmRlZXAuZXF1YWwoe1xuICAgICAgICBhY3Rpb25JZCxcbiAgICAgICAgYXN5bmM6ICdzdWNjZXNzJyxcbiAgICAgICAgYm9keTogJ2Zvb2JhcicsXG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIGl0KCdyZXNvbHZlcyB0byB2YWx1ZSBvZiBnaXZlbiBwcm9taXNlJywgZG9uZSA9PiB7XG4gICAgICBjb25zdCBmbHV4ID0gbmV3IEZsdXgoKTtcbiAgICAgIGNvbnN0IGRpc3BhdGNoID0gc2lub24uc3B5KCk7XG4gICAgICBmbHV4LmRpc3BhdGNoZXIgPSB7IGRpc3BhdGNoIH07XG4gICAgICBjb25zdCBhY3Rpb25JZCA9ICdhY3Rpb25JZCc7XG5cbiAgICAgIGV4cGVjdChmbHV4LmRpc3BhdGNoQXN5bmMoYWN0aW9uSWQsIFByb21pc2UucmVzb2x2ZSgnZm9vYmFyJykpKVxuICAgICAgICAudG8uZXZlbnR1YWxseS5lcXVhbCgnZm9vYmFyJylcbiAgICAgICAgLm5vdGlmeShkb25lKTtcbiAgICB9KTtcblxuICAgIGl0KCdyZWplY3RzIHdpdGggZXJyb3IgaWYgcHJvbWlzZSByZWplY3RzJywgZG9uZSA9PiB7XG4gICAgICBjb25zdCBmbHV4ID0gbmV3IEZsdXgoKTtcbiAgICAgIGNvbnN0IGRpc3BhdGNoID0gc2lub24uc3B5KCk7XG4gICAgICBmbHV4LmRpc3BhdGNoZXIgPSB7IGRpc3BhdGNoIH07XG4gICAgICBjb25zdCBhY3Rpb25JZCA9ICdhY3Rpb25JZCc7XG5cbiAgICAgIGV4cGVjdChmbHV4LmRpc3BhdGNoQXN5bmMoYWN0aW9uSWQsIFByb21pc2UucmVqZWN0KG5ldyBFcnJvcignZXJyb3InKSkpKVxuICAgICAgICAudG8uYmUucmVqZWN0ZWRXaXRoKCdlcnJvcicpXG4gICAgICAgIC5ub3RpZnkoZG9uZSk7XG4gICAgfSk7XG5cbiAgICBpdCgnZGlzcGF0Y2hlcyB3aXRoIGVycm9yIGlmIHByb21pc2UgcmVqZWN0cycsIGFzeW5jIGZ1bmN0aW9uKCkge1xuICAgICAgY29uc3QgZmx1eCA9IG5ldyBGbHV4KCk7XG4gICAgICBjb25zdCBkaXNwYXRjaCA9IHNpbm9uLnNweSgpO1xuICAgICAgZmx1eC5kaXNwYXRjaGVyID0geyBkaXNwYXRjaCB9O1xuICAgICAgY29uc3QgYWN0aW9uSWQgPSAnYWN0aW9uSWQnO1xuICAgICAgY29uc3QgYWN0aW9uQXJncyA9IHt9O1xuXG4gICAgICBjb25zdCBlcnJvciA9IG5ldyBFcnJvcignZXJyb3InKTtcblxuICAgICAgYXdhaXQgZXhwZWN0KGZsdXguZGlzcGF0Y2hBc3luYyhhY3Rpb25JZCwgUHJvbWlzZS5yZWplY3QoZXJyb3IpLCBhY3Rpb25BcmdzKSlcbiAgICAgICAgLnRvLmJlLnJlamVjdGVkO1xuXG4gICAgICBleHBlY3QoZGlzcGF0Y2guY2FsbENvdW50KS50by5lcXVhbCgyKTtcbiAgICAgIGV4cGVjdChkaXNwYXRjaC5maXJzdENhbGwuYXJnc1swXSkudG8uZGVlcC5lcXVhbCh7XG4gICAgICAgIGFjdGlvbklkLFxuICAgICAgICBhY3Rpb25BcmdzLFxuICAgICAgICBhc3luYzogJ2JlZ2luJyxcbiAgICAgIH0pO1xuICAgICAgZXhwZWN0KGRpc3BhdGNoLnNlY29uZENhbGwuYXJnc1swXSkudG8uZGVlcC5lcXVhbCh7XG4gICAgICAgIGFjdGlvbklkLFxuICAgICAgICBlcnJvcixcbiAgICAgICAgYWN0aW9uQXJncyxcbiAgICAgICAgYXN5bmM6ICdmYWlsdXJlJ1xuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBpdCgnZW1pdHMgZXJyb3IgaWYgcHJvbWlzZSByZWplY3RzJywgYXN5bmMgZnVuY3Rpb24oKSB7XG4gICAgICBjbGFzcyBFeGFtcGxlU3RvcmUgZXh0ZW5kcyBTdG9yZSB7fVxuXG4gICAgICBjb25zdCBmbHV4ID0gbmV3IEZsdXgoKTtcbiAgICAgIGNvbnN0IGxpc3RlbmVyID0gc2lub24uc3B5KCk7XG4gICAgICBmbHV4LmFkZExpc3RlbmVyKCdlcnJvcicsIGxpc3RlbmVyKTtcblxuICAgICAgY29uc3QgYWN0aW9uSWQgPSAnYWN0aW9uSWQnO1xuXG4gICAgICBhd2FpdCBleHBlY3QoZmx1eC5kaXNwYXRjaEFzeW5jKGFjdGlvbklkLCBQcm9taXNlLnJlamVjdChuZXcgRXJyb3IoJ2Zvb2JhcicpKSkpXG4gICAgICAgIC50by5iZS5yZWplY3RlZFdpdGgoJ2Zvb2JhcicpO1xuXG4gICAgICBleHBlY3QobGlzdGVuZXIuY2FsbGVkT25jZSkudG8uYmUudHJ1ZTtcbiAgICAgIGV4cGVjdChsaXN0ZW5lci5maXJzdENhbGwuYXJnc1swXS5tZXNzYWdlKS50by5lcXVhbCgnZm9vYmFyJyk7XG4gICAgfSk7XG5cbiAgICBpdCgnZW1pdCBlcnJvcnMgdGhhdCBvY2N1ciBhcyByZXN1bHQgb2YgZGlzcGF0Y2gnLCBhc3luYyBmdW5jdGlvbigpIHtcbiAgICAgIGNsYXNzIEV4YW1wbGVTdG9yZSBleHRlbmRzIFN0b3JlIHt9XG5cbiAgICAgIGNvbnN0IGZsdXggPSBuZXcgRmx1eCgpO1xuICAgICAgY29uc3QgbGlzdGVuZXIgPSBzaW5vbi5zcHkoKTtcbiAgICAgIGZsdXguYWRkTGlzdGVuZXIoJ2Vycm9yJywgbGlzdGVuZXIpO1xuXG4gICAgICBjb25zdCBhY3Rpb25JZCA9ICdhY3Rpb25JZCc7XG4gICAgICBjb25zdCBzdG9yZSA9IGZsdXguY3JlYXRlU3RvcmUoJ2V4YW1wbGUnLCBFeGFtcGxlU3RvcmUpO1xuXG4gICAgICBzdG9yZS5yZWdpc3RlckFzeW5jKFxuICAgICAgICBhY3Rpb25JZCxcbiAgICAgICAgbnVsbCxcbiAgICAgICAgKCkgPT4ge1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcignc3VjY2VzcyBlcnJvcicpO1xuICAgICAgICB9LFxuICAgICAgICAoKSA9PiB7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdmYWlsdXJlIGVycm9yJyk7XG4gICAgICAgIH1cbiAgICAgICk7XG5cbiAgICAgIGF3YWl0IGV4cGVjdChmbHV4LmRpc3BhdGNoQXN5bmMoYWN0aW9uSWQsIFByb21pc2UucmVzb2x2ZSgnZm9vYmFyJykpKVxuICAgICAgICAudG8uYmUucmVqZWN0ZWRXaXRoKCdzdWNjZXNzIGVycm9yJyk7XG4gICAgICBleHBlY3QobGlzdGVuZXIuY2FsbGVkT25jZSkudG8uYmUudHJ1ZTtcbiAgICAgIGV4cGVjdChsaXN0ZW5lci5maXJzdENhbGwuYXJnc1swXS5tZXNzYWdlKS50by5lcXVhbCgnc3VjY2VzcyBlcnJvcicpO1xuXG4gICAgICBhd2FpdCBleHBlY3QoZmx1eC5kaXNwYXRjaEFzeW5jKGFjdGlvbklkLCBQcm9taXNlLnJlamVjdChuZXcgRXJyb3IoJ2Zvb2JhcicpKSkpXG4gICAgICAgIC50by5iZS5yZWplY3RlZFdpdGgoJ2ZhaWx1cmUgZXJyb3InKTtcbiAgICAgIGV4cGVjdChsaXN0ZW5lci5jYWxsZWRUd2ljZSkudG8uYmUudHJ1ZTtcbiAgICAgIGV4cGVjdChsaXN0ZW5lci5zZWNvbmRDYWxsLmFyZ3NbMF0ubWVzc2FnZSkudG8uZXF1YWwoJ2ZhaWx1cmUgZXJyb3InKTtcbiAgICB9KTtcblxuICB9KTtcblxuICBkZXNjcmliZSgnI3JlbW92ZUFsbFN0b3JlTGlzdGVuZXJzJywgKCkgPT4ge1xuICAgIGl0KCdyZW1vdmVzIGFsbCBsaXN0ZW5lcnMgZnJvbSBzdG9yZXMnLCAoKSA9PiB7XG4gICAgICBjbGFzcyBUZXN0U3RvcmUgZXh0ZW5kcyBTdG9yZSB7fVxuXG4gICAgICBjb25zdCBmbHV4ID0gbmV3IEZsdXgoKTtcbiAgICAgIGNvbnN0IHN0b3JlQSA9IGZsdXguY3JlYXRlU3RvcmUoJ3N0b3JlQScsIFRlc3RTdG9yZSk7XG4gICAgICBjb25zdCBzdG9yZUIgPSBmbHV4LmNyZWF0ZVN0b3JlKCdzdG9yZUInLCBUZXN0U3RvcmUpO1xuXG4gICAgICBjb25zdCBsaXN0ZW5lciA9IGZ1bmN0aW9uKCkge307XG5cbiAgICAgIHN0b3JlQS5hZGRMaXN0ZW5lcignY2hhbmdlJywgbGlzdGVuZXIpO1xuICAgICAgc3RvcmVBLmFkZExpc3RlbmVyKCdjaGFuZ2UnLCBsaXN0ZW5lcik7XG4gICAgICBzdG9yZUIuYWRkTGlzdGVuZXIoJ2NoYW5nZScsIGxpc3RlbmVyKTtcbiAgICAgIHN0b3JlQi5hZGRMaXN0ZW5lcignY2hhbmdlJywgbGlzdGVuZXIpO1xuXG4gICAgICBleHBlY3Qoc3RvcmVBLmxpc3RlbmVycygnY2hhbmdlJykubGVuZ3RoKS50by5lcXVhbCgyKTtcbiAgICAgIGV4cGVjdChzdG9yZUIubGlzdGVuZXJzKCdjaGFuZ2UnKS5sZW5ndGgpLnRvLmVxdWFsKDIpO1xuXG4gICAgICBmbHV4LnJlbW92ZUFsbFN0b3JlTGlzdGVuZXJzKCk7XG5cbiAgICAgIGV4cGVjdChzdG9yZUEubGlzdGVuZXJzKCdjaGFuZ2UnKS5sZW5ndGgpLnRvLmVxdWFsKDApO1xuICAgICAgZXhwZWN0KHN0b3JlQi5saXN0ZW5lcnMoJ2NoYW5nZScpLmxlbmd0aCkudG8uZXF1YWwoMCk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCcjc2VyaWFsaXplKCknLCAoKSA9PiB7XG5cbiAgICBpdCgncmV0dXJucyBzdGF0ZSBvZiBhbGwgdGhlIHN0b3JlcyBhcyBhIEpTT04gc3RyaW5nJywgKCkgPT4ge1xuICAgICAgY29uc3QgZmx1eCA9IG5ldyBGbHV4KCk7XG5cbiAgICAgIGZsdXguY3JlYXRlU3RvcmUoJ2ZvbycsIGNyZWF0ZVNlcmlhbGl6YWJsZVN0b3JlKCdmb28gc3RhdGUnKSk7XG4gICAgICBmbHV4LmNyZWF0ZVN0b3JlKCdiYXInLCBjcmVhdGVTZXJpYWxpemFibGVTdG9yZSgnYmFyIHN0YXRlJykpO1xuICAgICAgZmx1eC5jcmVhdGVTdG9yZSgnYmF6JywgY3JlYXRlU2VyaWFsaXphYmxlU3RvcmUoJ2JheiBzdGF0ZScpKTtcblxuICAgICAgZXhwZWN0KEpTT04ucGFyc2UoZmx1eC5zZXJpYWxpemUoKSkpLnRvLmRlZXAuZXF1YWwoe1xuICAgICAgICBmb286ICdmb28gc3RhdGUnLFxuICAgICAgICBiYXI6ICdiYXIgc3RhdGUnLFxuICAgICAgICBiYXo6ICdiYXogc3RhdGUnLFxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBpdCgnaWdub3JlcyBzdG9yZXMgd2hvc2UgY2xhc3NlcyBkbyBub3QgaW1wbGVtZW50IC5zZXJpYWxpemUoKScsICgpID0+IHtcbiAgICAgIGNvbnN0IGZsdXggPSBuZXcgRmx1eCgpO1xuICAgICAgY2xhc3MgVGVzdFN0b3JlIGV4dGVuZHMgU3RvcmUge31cblxuICAgICAgZmx1eC5jcmVhdGVTdG9yZSgnZm9vJywgY3JlYXRlU2VyaWFsaXphYmxlU3RvcmUoJ2ZvbyBzdGF0ZScpKTtcbiAgICAgIGZsdXguY3JlYXRlU3RvcmUoJ2JhcicsIGNyZWF0ZVNlcmlhbGl6YWJsZVN0b3JlKCdiYXIgc3RhdGUnKSk7XG4gICAgICBmbHV4LmNyZWF0ZVN0b3JlKCdiYXonLCBUZXN0U3RvcmUpO1xuXG4gICAgICBleHBlY3QoSlNPTi5wYXJzZShmbHV4LnNlcmlhbGl6ZSgpKSkudG8uZGVlcC5lcXVhbCh7XG4gICAgICAgIGZvbzogJ2ZvbyBzdGF0ZScsXG4gICAgICAgIGJhcjogJ2JhciBzdGF0ZScsXG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIGl0KCd3YXJucyBpZiBhbnkgc3RvcmUgY2xhc3NlcyAuc2VyaWFsaXplKCkgcmV0dXJucyBhIG5vbi1zdHJpbmcnLCAoKSA9PiB7XG4gICAgICBjb25zdCBmbHV4ID0gbmV3IEZsdXgoKTtcbiAgICAgIGNvbnN0IHdhcm4gPSBzaW5vbi5zcHkoY29uc29sZSwgJ3dhcm4nKTtcblxuICAgICAgZmx1eC5jcmVhdGVTdG9yZSgnZm9vJywgY3JlYXRlU2VyaWFsaXphYmxlU3RvcmUoe30pKTtcbiAgICAgIGZsdXguc2VyaWFsaXplKCk7XG5cbiAgICAgIGV4cGVjdCh3YXJuLmZpcnN0Q2FsbC5hcmdzWzBdKS50by5lcXVhbChcbiAgICAgICAgJ1RoZSBzdG9yZSB3aXRoIGtleSBcXCdmb29cXCcgd2FzIG5vdCBzZXJpYWxpemVkIGJlY2F1c2UgdGhlIHN0YXRpYyAnXG4gICAgICArICdtZXRob2QgYFNlcmlhbGl6YWJsZVN0b3JlLnNlcmlhbGl6ZSgpYCByZXR1cm5lZCBhIG5vbi1zdHJpbmcgd2l0aCAnXG4gICAgICArICd0eXBlIFxcJ29iamVjdFxcJy4nXG4gICAgICApO1xuXG4gICAgICBjb25zb2xlLndhcm4ucmVzdG9yZSgpO1xuICAgIH0pO1xuXG4gICAgaXQoJ3dhcm5zIGFuZCBza2lwcyBzdG9yZXMgd2hvc2UgY2xhc3NlcyBkbyBub3QgaW1wbGVtZW50IC5kZXNlcmlhbGl6ZSgpJywgKCkgPT4ge1xuICAgICAgY29uc3QgZmx1eCA9IG5ldyBGbHV4KCk7XG4gICAgICBjb25zdCB3YXJuID0gc2lub24uc3B5KGNvbnNvbGUsICd3YXJuJyk7XG5cbiAgICAgIGNsYXNzIFRlc3RTdG9yZSBleHRlbmRzIFN0b3JlIHtcbiAgICAgICAgc3RhdGljIHNlcmlhbGl6ZSgpIHtcbiAgICAgICAgICByZXR1cm4gJ3N0YXRlIHN0cmluZyc7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgZmx1eC5jcmVhdGVTdG9yZSgndGVzdCcsIFRlc3RTdG9yZSk7XG4gICAgICBmbHV4LnNlcmlhbGl6ZSgpO1xuXG4gICAgICBleHBlY3Qod2Fybi5maXJzdENhbGwuYXJnc1swXSkudG8uZXF1YWwoXG4gICAgICAgICdUaGUgY2xhc3MgYFRlc3RTdG9yZWAgaGFzIGEgYHNlcmlhbGl6ZSgpYCBtZXRob2QsIGJ1dCBubyAnXG4gICAgICArICdjb3JyZXNwb25kaW5nIGBkZXNlcmlhbGl6ZSgpYCBtZXRob2QuJ1xuICAgICAgKTtcblxuICAgICAgY29uc29sZS53YXJuLnJlc3RvcmUoKTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJyNkZXNlcmlhbGl6ZSgpJywgKCkgPT4ge1xuXG4gICAgaXQoJ2NvbnZlcnRzIGEgc2VyaWFsaXplZCBzdHJpbmcgaW50byBzdGF0ZSBhbmQgdXNlcyBpdCB0byByZXBsYWNlIHN0YXRlIG9mIHN0b3JlcycsICgpID0+IHtcbiAgICAgIGNvbnN0IGZsdXggPSBuZXcgRmx1eCgpO1xuXG4gICAgICBmbHV4LmNyZWF0ZVN0b3JlKCdmb28nLCBjcmVhdGVTZXJpYWxpemFibGVTdG9yZSgpKTtcbiAgICAgIGZsdXguY3JlYXRlU3RvcmUoJ2JhcicsIGNyZWF0ZVNlcmlhbGl6YWJsZVN0b3JlKCkpO1xuICAgICAgZmx1eC5jcmVhdGVTdG9yZSgnYmF6JywgY3JlYXRlU2VyaWFsaXphYmxlU3RvcmUoKSk7XG5cbiAgICAgIGZsdXguZGVzZXJpYWxpemUoYHtcbiAgICAgICAgXCJmb29cIjogXCJmb28gc3RhdGVcIixcbiAgICAgICAgXCJiYXJcIjogXCJiYXIgc3RhdGVcIixcbiAgICAgICAgXCJiYXpcIjogXCJiYXogc3RhdGVcIlxuICAgICAgfWApO1xuXG4gICAgICBjb25zdCBmb29TdG9yZSA9IGZsdXguZ2V0U3RvcmUoJ2ZvbycpO1xuICAgICAgY29uc3QgYmFyU3RvcmUgPSBmbHV4LmdldFN0b3JlKCdiYXInKTtcbiAgICAgIGNvbnN0IGJhelN0b3JlID0gZmx1eC5nZXRTdG9yZSgnYmF6Jyk7XG5cbiAgICAgIGV4cGVjdChmb29TdG9yZS5zdGF0ZS5zdGF0ZVN0cmluZykudG8uZXF1YWwoJ2ZvbyBzdGF0ZScpO1xuICAgICAgZXhwZWN0KGZvb1N0b3JlLnN0YXRlLmRlc2VyaWFsaXplZCkudG8uYmUudHJ1ZTtcbiAgICAgIGV4cGVjdChiYXJTdG9yZS5zdGF0ZS5zdGF0ZVN0cmluZykudG8uZXF1YWwoJ2JhciBzdGF0ZScpO1xuICAgICAgZXhwZWN0KGJhclN0b3JlLnN0YXRlLmRlc2VyaWFsaXplZCkudG8uYmUudHJ1ZTtcbiAgICAgIGV4cGVjdChiYXpTdG9yZS5zdGF0ZS5zdGF0ZVN0cmluZykudG8uZXF1YWwoJ2JheiBzdGF0ZScpO1xuICAgICAgZXhwZWN0KGJhelN0b3JlLnN0YXRlLmRlc2VyaWFsaXplZCkudG8uYmUudHJ1ZTtcbiAgICB9KTtcblxuICAgIGl0KCd3YXJucyBhbmQgc2tpcHMgaWYgcGFzc2VkIHN0cmluZyBpcyBpbnZhbGlkIEpTT04nLCAoKSA9PiB7XG4gICAgICBjb25zdCBmbHV4ID0gbmV3IEZsdXgoKTtcbiAgICAgIGNsYXNzIFRlc3RTdG9yZSBleHRlbmRzIFN0b3JlIHt9XG5cblxuICAgICAgZmx1eC5jcmVhdGVTdG9yZSgnZm9vJywgVGVzdFN0b3JlKTtcblxuICAgICAgZXhwZWN0KGZsdXguZGVzZXJpYWxpemUuYmluZChmbHV4LCAnbm90IEpTT04nKSkudG8udGhyb3coXG4gICAgICAgICdJbnZhbGlkIHZhbHVlIHBhc3NlZCB0byBgRmx1eCNkZXNlcmlhbGl6ZSgpYDogbm90IEpTT04nXG4gICAgICApO1xuICAgIH0pO1xuXG4gICAgaXQoJ3dhcm5zIGFuZCBza2lwcyBzdG9yZXMgd2hvc2UgY2xhc3NlcyBkbyBub3QgaW1wbGVtZW50IC5zZXJpYWxpemUoKScsICgpID0+IHtcbiAgICAgIGNvbnN0IGZsdXggPSBuZXcgRmx1eCgpO1xuICAgICAgY29uc3Qgd2FybiA9IHNpbm9uLnNweShjb25zb2xlLCAnd2FybicpO1xuXG4gICAgICBjbGFzcyBUZXN0U3RvcmUgZXh0ZW5kcyBTdG9yZSB7XG4gICAgICAgIHN0YXRpYyBkZXNlcmlhbGl6ZSgpIHtcbiAgICAgICAgICByZXR1cm4ge307XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgZmx1eC5jcmVhdGVTdG9yZSgndGVzdCcsIFRlc3RTdG9yZSk7XG4gICAgICBmbHV4LmRlc2VyaWFsaXplKCd7XCJ0ZXN0XCI6IFwidGVzdCBzdGF0ZVwifScpO1xuXG4gICAgICBleHBlY3Qod2Fybi5maXJzdENhbGwuYXJnc1swXSkudG8uZXF1YWwoXG4gICAgICAgICdUaGUgY2xhc3MgYFRlc3RTdG9yZWAgaGFzIGEgYGRlc2VyaWFsaXplKClgIG1ldGhvZCwgYnV0IG5vICdcbiAgICAgICsgJ2NvcnJlc3BvbmRpbmcgYHNlcmlhbGl6ZSgpYCBtZXRob2QuJ1xuICAgICAgKTtcblxuICAgICAgY29uc29sZS53YXJuLnJlc3RvcmUoKTtcbiAgICB9KTtcblxuICAgIGl0KCdpZ25vcmVzIHN0b3JlcyB3aG9zZSBjbGFzc2VzIGRvIG5vdCBpbXBsZW1lbnQgLmRlc2VyaWFsaXplKCknLCAoKSA9PiB7XG4gICAgICBjb25zdCBmbHV4ID0gbmV3IEZsdXgoKTtcbiAgICAgIGNsYXNzIFRlc3RTdG9yZSBleHRlbmRzIFN0b3JlIHt9XG5cbiAgICAgIGZsdXguY3JlYXRlU3RvcmUoJ2ZvbycsIGNyZWF0ZVNlcmlhbGl6YWJsZVN0b3JlKCkpO1xuICAgICAgZmx1eC5jcmVhdGVTdG9yZSgnYmFyJywgY3JlYXRlU2VyaWFsaXphYmxlU3RvcmUoKSk7XG4gICAgICBmbHV4LmNyZWF0ZVN0b3JlKCdiYXonLCBUZXN0U3RvcmUpO1xuXG4gICAgICBmbHV4LmRlc2VyaWFsaXplKGB7XG4gICAgICAgIFwiZm9vXCI6IFwiZm9vIHN0YXRlXCIsXG4gICAgICAgIFwiYmFyXCI6IFwiYmFyIHN0YXRlXCIsXG4gICAgICAgIFwiYmF6XCI6IFwiYmF6IHN0YXRlXCJcbiAgICAgIH1gKTtcblxuICAgICAgY29uc3QgZm9vU3RvcmUgPSBmbHV4LmdldFN0b3JlKCdmb28nKTtcbiAgICAgIGNvbnN0IGJhclN0b3JlID0gZmx1eC5nZXRTdG9yZSgnYmFyJyk7XG4gICAgICBjb25zdCBiYXpTdG9yZSA9IGZsdXguZ2V0U3RvcmUoJ2JheicpO1xuXG4gICAgICBleHBlY3QoZm9vU3RvcmUuc3RhdGUuc3RhdGVTdHJpbmcpLnRvLmVxdWFsKCdmb28gc3RhdGUnKTtcbiAgICAgIGV4cGVjdChmb29TdG9yZS5zdGF0ZS5kZXNlcmlhbGl6ZWQpLnRvLmJlLnRydWU7XG4gICAgICBleHBlY3QoYmFyU3RvcmUuc3RhdGUuc3RhdGVTdHJpbmcpLnRvLmVxdWFsKCdiYXIgc3RhdGUnKTtcbiAgICAgIGV4cGVjdChiYXJTdG9yZS5zdGF0ZS5kZXNlcmlhbGl6ZWQpLnRvLmJlLnRydWU7XG4gICAgICBleHBlY3QoYmF6U3RvcmUuc3RhdGUpLnRvLmJlLm51bGw7XG4gICAgfSk7XG5cbiAgfSk7XG5cbn0pO1xuIl19