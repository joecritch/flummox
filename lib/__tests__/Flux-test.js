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