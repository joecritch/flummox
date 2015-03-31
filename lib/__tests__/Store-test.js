"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(object, property, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc && desc.writable) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var _Flux = require("../Flux");

var Store = _Flux.Store;
var Flux = _Flux.Flux;
var Actions = _Flux.Actions;

var sinon = _interopRequire(require("sinon"));

describe("Store", function () {
  var ExampleStore = (function (_Store) {
    function ExampleStore() {
      _classCallCheck(this, ExampleStore);

      _get(Object.getPrototypeOf(ExampleStore.prototype), "constructor", this).call(this);
      this.state = { foo: "bar" };
    }

    _inherits(ExampleStore, _Store);

    return ExampleStore;
  })(Store);

  var actionId = "actionId";

  describe("#register()", function () {
    it("adds handler to internal collection of handlers", function () {
      var _store$_handlers;

      var store = new ExampleStore();
      var handler = sinon.spy();
      store.register(actionId, handler);

      var mockArgs = ["foo", "bar"];
      (_store$_handlers = store._handlers)[actionId].apply(_store$_handlers, mockArgs);

      expect(handler.calledWith.apply(handler, mockArgs)).to.be["true"];
    });

    it("binds handler to store", function () {
      var store = new ExampleStore();
      store.foo = "bar";

      function handler() {
        return this.foo;
      }

      store.register(actionId, handler);

      expect(store._handlers[actionId]()).to.equal("bar");
    });

    it("accepts actions instead of action ids", function () {
      var _store$_handlers;

      var ExampleActions = (function (_Actions) {
        function ExampleActions() {
          _classCallCheck(this, ExampleActions);

          if (_Actions != null) {
            _Actions.apply(this, arguments);
          }
        }

        _inherits(ExampleActions, _Actions);

        _createClass(ExampleActions, {
          getFoo: {
            value: function getFoo() {
              return "foo";
            }
          }
        });

        return ExampleActions;
      })(Actions);

      var actions = new ExampleActions();
      var store = new ExampleStore();
      var handler = sinon.spy();
      store.register(actions.getFoo, handler);

      var mockArgs = ["foo", "bar"];
      (_store$_handlers = store._handlers)[actions.getFoo._id].apply(_store$_handlers, mockArgs);

      expect(handler.calledWith.apply(handler, mockArgs)).to.be["true"];
    });

    it("ignores non-function handlers", function () {
      var store = new ExampleStore();
      expect(store.register.bind(store, null)).not.to["throw"]();
    });
  });

  it("default state is null", function () {
    var store = new Store();
    expect(store.state).to.be["null"];
  });

  describe("#registerAsync()", function () {
    it("registers handlers for begin, success, and failure of async action", function callee$2$0() {
      var error, ExampleActions, ExampleFlux, flux, actions, store, handler, begin, success, failure;
      return regeneratorRuntime.async(function callee$2$0$(context$3$0) {
        while (1) switch (context$3$0.prev = context$3$0.next) {
          case 0:
            error = new Error();

            ExampleActions = (function (_Actions) {
              function ExampleActions() {
                _classCallCheck(this, ExampleActions);

                if (_Actions != null) {
                  _Actions.apply(this, arguments);
                }
              }

              _inherits(ExampleActions, _Actions);

              _createClass(ExampleActions, {
                getFoo: {
                  value: function getFoo(message) {
                    var _success = arguments[1] === undefined ? true : arguments[1];

                    return regeneratorRuntime.async(function getFoo$(context$5$0) {
                      while (1) switch (context$5$0.prev = context$5$0.next) {
                        case 0:
                          if (_success) {
                            context$5$0.next = 2;
                            break;
                          }

                          throw error;

                        case 2:
                          return context$5$0.abrupt("return", message + " success");

                        case 3:
                        case "end":
                          return context$5$0.stop();
                      }
                    }, null, this);
                  }
                },
                getBar: {
                  value: function getBar(message) {
                    return regeneratorRuntime.async(function getBar$(context$5$0) {
                      while (1) switch (context$5$0.prev = context$5$0.next) {
                        case 0:
                          return context$5$0.abrupt("return", message);

                        case 1:
                        case "end":
                          return context$5$0.stop();
                      }
                    }, null, this);
                  }
                }
              });

              return ExampleActions;
            })(Actions);

            ExampleFlux = (function (_Flux) {
              function ExampleFlux() {
                _classCallCheck(this, ExampleFlux);

                _get(Object.getPrototypeOf(ExampleFlux.prototype), "constructor", this).call(this);
                this.createActions("example", ExampleActions);
                this.createStore("example", ExampleStore);
              }

              _inherits(ExampleFlux, _Flux);

              return ExampleFlux;
            })(Flux);

            flux = new ExampleFlux();
            actions = flux.getActions("example");
            store = flux.getStore("example");
            handler = sinon.spy();

            store.register(actions.getBar, handler);

            context$3$0.next = 10;
            return actions.getBar("bar");

          case 10:
            expect(handler.calledOnce).to.be["true"];
            expect(handler.firstCall.args).to.deep.equal(["bar"]);

            begin = sinon.spy();
            success = sinon.spy();
            failure = sinon.spy();

            store.registerAsync(actions.getFoo, begin, success, failure);

            context$3$0.next = 18;
            return actions.getFoo("foo", true);

          case 18:
            expect(begin.calledOnce).to.be["true"];
            expect(begin.firstCall.args).to.deep.equal(["foo", true]);
            expect(success.calledOnce).to.be["true"];
            expect(success.firstCall.args[0]).to.equal("foo success");
            expect(failure.called).to.be["false"];

            context$3$0.next = 25;
            return expect(actions.getFoo("bar", false)).to.be.rejected;

          case 25:

            expect(begin.calledTwice).to.be["true"];
            expect(success.calledOnce).to.be["true"];
            expect(failure.calledOnce).to.be["true"];
            expect(failure.firstCall.args[0]).to.equal(error);

          case 29:
          case "end":
            return context$3$0.stop();
        }
      }, null, this);
    });

    it("ignores non-function handlers", function () {
      var store = new ExampleStore();
      expect(store.registerAsync.bind(store, null)).not.to["throw"]();
    });
  });

  describe("#registerAll()", function () {
    it("adds handler to internal collection of \"catch all\" handlers", function () {
      var _store$_catchAllHandlers;

      var store = new ExampleStore();
      var handler = sinon.spy();
      store.registerAll(handler);

      var mockArgs = ["foo", "bar"];
      (_store$_catchAllHandlers = store._catchAllHandlers)[0].apply(_store$_catchAllHandlers, mockArgs);

      expect(handler.calledWith.apply(handler, mockArgs)).to.be["true"];
    });

    it("adds multiple handlers to internal collection of \"catch all\" handlers", function () {
      var _store$_catchAllHandlers, _store$_catchAllHandlers2;

      var store = new ExampleStore();
      var handler1 = sinon.spy();
      var handler2 = sinon.spy();
      store.registerAll(handler1);
      store.registerAll(handler2);

      var mockArgs = ["foo", "bar"];
      (_store$_catchAllHandlers = store._catchAllHandlers)[0].apply(_store$_catchAllHandlers, mockArgs);
      (_store$_catchAllHandlers2 = store._catchAllHandlers)[1].apply(_store$_catchAllHandlers2, mockArgs);

      expect(handler1.calledWith.apply(handler1, mockArgs)).to.be["true"];
      expect(handler2.calledWith.apply(handler2, mockArgs)).to.be["true"];
    });

    it("binds handler to store", function () {
      var store = new ExampleStore();
      store.foo = "bar";

      function handler() {
        return this.foo;
      }

      store.registerAll(handler);

      expect(store._catchAllHandlers[0]()).to.equal("bar");
    });

    it("accepts actions instead of action ids", function () {
      var _store$_catchAllHandlers;

      var ExampleActions = (function (_Actions) {
        function ExampleActions() {
          _classCallCheck(this, ExampleActions);

          if (_Actions != null) {
            _Actions.apply(this, arguments);
          }
        }

        _inherits(ExampleActions, _Actions);

        _createClass(ExampleActions, {
          getFoo: {
            value: function getFoo() {
              return "foo";
            }
          }
        });

        return ExampleActions;
      })(Actions);

      var actions = new ExampleActions();
      var store = new ExampleStore();
      var handler = sinon.spy();
      store.registerAll(handler);

      var mockArgs = ["foo", "bar"];
      (_store$_catchAllHandlers = store._catchAllHandlers)[0].apply(_store$_catchAllHandlers, mockArgs);

      expect(handler.calledWith.apply(handler, mockArgs)).to.be["true"];
    });

    it("ignores non-function handlers", function () {
      var store = new ExampleStore();
      expect(store.registerAll.bind(store, null)).not.to["throw"]();
    });
  });

  describe("#registerAllAsync()", function () {
    it("registers \"catch all\" handlers for begin, success, and failure of async action", function callee$2$0() {
      var error, ExampleActions, ExampleFlux, flux, actions, store, begin, success, failure;
      return regeneratorRuntime.async(function callee$2$0$(context$3$0) {
        while (1) switch (context$3$0.prev = context$3$0.next) {
          case 0:
            error = new Error();

            ExampleActions = (function (_Actions) {
              function ExampleActions() {
                _classCallCheck(this, ExampleActions);

                if (_Actions != null) {
                  _Actions.apply(this, arguments);
                }
              }

              _inherits(ExampleActions, _Actions);

              _createClass(ExampleActions, {
                getFoo: {
                  value: function getFoo(message) {
                    var _success = arguments[1] === undefined ? true : arguments[1];

                    return regeneratorRuntime.async(function getFoo$(context$5$0) {
                      while (1) switch (context$5$0.prev = context$5$0.next) {
                        case 0:
                          if (_success) {
                            context$5$0.next = 2;
                            break;
                          }

                          throw error;

                        case 2:
                          return context$5$0.abrupt("return", message + " success");

                        case 3:
                        case "end":
                          return context$5$0.stop();
                      }
                    }, null, this);
                  }
                },
                getBar: {
                  value: function getBar(message) {
                    var _success = arguments[1] === undefined ? true : arguments[1];

                    return regeneratorRuntime.async(function getBar$(context$5$0) {
                      while (1) switch (context$5$0.prev = context$5$0.next) {
                        case 0:
                          if (_success) {
                            context$5$0.next = 2;
                            break;
                          }

                          throw error;

                        case 2:
                          return context$5$0.abrupt("return", message + " success");

                        case 3:
                        case "end":
                          return context$5$0.stop();
                      }
                    }, null, this);
                  }
                }
              });

              return ExampleActions;
            })(Actions);

            ExampleFlux = (function (_Flux) {
              function ExampleFlux() {
                _classCallCheck(this, ExampleFlux);

                _get(Object.getPrototypeOf(ExampleFlux.prototype), "constructor", this).call(this);
                this.createActions("example", ExampleActions);
                this.createStore("example", ExampleStore);
              }

              _inherits(ExampleFlux, _Flux);

              return ExampleFlux;
            })(Flux);

            flux = new ExampleFlux();
            actions = flux.getActions("example");
            store = flux.getStore("example");
            begin = sinon.spy();
            success = sinon.spy();
            failure = sinon.spy();

            store.registerAllAsync(begin, success, failure);

            context$3$0.next = 12;
            return actions.getFoo("foo", true);

          case 12:
            expect(begin.calledOnce).to.be["true"];
            expect(begin.firstCall.args).to.deep.equal(["foo", true]);
            expect(success.calledOnce).to.be["true"];
            expect(success.firstCall.args[0]).to.equal("foo success");
            expect(failure.called).to.be["false"];

            context$3$0.next = 19;
            return expect(actions.getFoo("bar", false)).to.be.rejected;

          case 19:
            expect(begin.calledTwice).to.be["true"];
            expect(success.calledOnce).to.be["true"];
            expect(failure.calledOnce).to.be["true"];
            expect(failure.firstCall.args[0]).to.equal(error);

            context$3$0.next = 25;
            return actions.getBar("foo", true);

          case 25:
            expect(begin.calledThrice).to.be["true"];
            expect(begin.thirdCall.args).to.deep.equal(["foo", true]);
            expect(success.calledTwice).to.be["true"];
            expect(success.secondCall.args[0]).to.equal("foo success");
            expect(failure.calledTwice).to.be["false"];

            context$3$0.next = 32;
            return expect(actions.getBar("bar", false)).to.be.rejected;

          case 32:
            expect(begin.callCount).to.equal(4);
            expect(success.calledTwice).to.be["true"];
            expect(failure.calledTwice).to.be["true"];
            expect(failure.secondCall.args[0]).to.equal(error);

          case 36:
          case "end":
            return context$3$0.stop();
        }
      }, null, this);
    });

    it("ignores non-function handlers", function () {
      var store = new ExampleStore();
      expect(store.registerAsync.bind(store, null)).not.to["throw"]();
    });
  });

  describe("#handler()", function () {
    it("delegates dispatches to registered handlers", function () {
      var store = new ExampleStore();
      var handler = sinon.spy();
      store.register(actionId, handler);

      // Simulate dispatch
      var body = { foo: "bar" };
      store.handler({ body: body, actionId: actionId });

      expect(handler.calledWith(body)).to.be["true"];
    });

    it("delegates dispatches to registered \"catch all\" handlers", function () {
      var store = new ExampleStore();
      var handler = sinon.spy();
      var actionIds = ["actionId1", "actionId2"];
      store.registerAll(handler);

      // Simulate dispatch
      var body = { foo: "bar" };
      store.handler({ body: body, actionId: actionIds[0] });
      store.handler({ body: body, actionId: actionIds[1] });

      expect(handler.calledWith(body)).to.be["true"];
      expect(handler.calledTwice).to.be["true"];
    });
  });

  describe("#waitFor()", function () {
    it("waits for other stores", function () {
      var flux = new Flux();
      var result = [];

      var store2 = undefined;

      var Store1 = (function (_Store2) {
        function Store1() {
          _classCallCheck(this, Store1);

          _get(Object.getPrototypeOf(Store1.prototype), "constructor", this).call(this);

          this.register(actionId, function () {
            this.waitFor(store2);
            result.push(1);
          });
        }

        _inherits(Store1, _Store2);

        return Store1;
      })(Store);

      var Store2 = (function (_Store3) {
        function Store2() {
          _classCallCheck(this, Store2);

          _get(Object.getPrototypeOf(Store2.prototype), "constructor", this).call(this);

          this.register(actionId, function () {
            result.push(2);
          });
        }

        _inherits(Store2, _Store3);

        return Store2;
      })(Store);

      flux.createStore("store1", Store1);
      flux.createStore("store2", Store2);

      store2 = flux.getStore("store2");

      flux.dispatch(actionId, "foobar");

      expect(result).to.deep.equal([2, 1]);
    });
  });

  describe("#forceUpdate()", function () {
    it("emits change event", function () {
      var store = new ExampleStore();
      var listener = sinon.spy();
      store.addListener("change", listener);

      store.forceUpdate();

      expect(listener.calledOnce).to.be["true"];
    });

    it("doesn't modify existing state", function () {
      var store = new ExampleStore();
      var listener = sinon.spy();
      store.addListener("change", listener);

      store.register(actionId, function () {
        this.replaceState({ bar: "baz" });
        this.forceUpdate();

        expect(this.state).to.deep.equal({ foo: "bar" });
        expect(listener.called).to.be["false"];

        this.setState({ foo: "bar" });
        this.forceUpdate();
        this.replaceState({ baz: "foo" });
      });

      // Simulate dispatch
      store.handler({ actionId: actionId, body: "foobar" });

      expect(listener.calledOnce).to.be["true"];
      expect(store.state).to.deep.equal({ baz: "foo" });
    });
  });

  describe("#setState()", function () {
    it("shallow merges old state with new state", function () {
      var store = new ExampleStore();

      store.setState({ bar: "baz" });

      expect(store.state).to.deep.equal({
        foo: "bar",
        bar: "baz" });
    });

    it("supports transactional updates", function () {
      var store = new Store();
      store.state = { a: 1 };
      store.setState(function (state) {
        return { a: state.a + 1 };
      });
      expect(store.state.a).to.equal(2);
      store.setState(function (state) {
        return { a: state.a + 1 };
      });
      expect(store.state.a).to.equal(3);
      store.setState(function (state) {
        return { a: state.a + 1 };
      });
      expect(store.state.a).to.equal(4);
    });

    it("emits change event", function () {
      var store = new ExampleStore();
      var listener = sinon.spy();
      store.addListener("change", listener);

      store.setState({ foo: "bar" });

      expect(listener.calledOnce).to.be["true"];
    });

    it("batches multiple state updates within action handler", function () {
      var store = new ExampleStore();
      var listener = sinon.spy();
      store.addListener("change", listener);

      store.register(actionId, function () {
        this.setState({ bar: "baz" });

        expect(this.state).to.deep.equal({ foo: "bar" });
        expect(listener.called).to.be["false"];

        this.setState({ baz: "foo" });
      });

      // Simulate dispatch
      store.handler({ actionId: actionId, body: "foobar" });

      expect(listener.calledOnce).to.be["true"];
      expect(store.state).to.deep.equal({ foo: "bar", bar: "baz", baz: "foo" });
    });
  });

  describe("#replaceState()", function () {
    it("replaces old state with new state", function () {
      var store = new ExampleStore();

      store.replaceState({ bar: "baz" });

      expect(store.state).to.deep.equal({
        bar: "baz" });
    });

    it("batches multiple state updates within action handler", function () {
      var store = new ExampleStore();
      var listener = sinon.spy();
      store.addListener("change", listener);

      store.register(actionId, function () {
        this.replaceState({ bar: "baz" });

        expect(this.state).to.deep.equal({ foo: "bar" });
        expect(listener.called).to.be["false"];

        this.setState({ foo: "bar" });
        this.replaceState({ baz: "foo" });
      });

      // Simulate dispatch
      store.handler({ actionId: actionId, body: "foobar" });

      expect(listener.calledOnce).to.be["true"];
      expect(store.state).to.deep.equal({ baz: "foo" });
    });

    it("emits change event", function () {
      var store = new ExampleStore();
      var listener = sinon.spy();
      store.addListener("change", listener);

      store.replaceState({ foo: "bar" });

      expect(listener.calledOnce).to.be["true"];
    });
  });

  describe(".assignState", function () {
    it("can be overridden to enable custom state types", function () {
      var StringStore = (function (_Store2) {
        function StringStore() {
          _classCallCheck(this, StringStore);

          if (_Store2 != null) {
            _Store2.apply(this, arguments);
          }
        }

        _inherits(StringStore, _Store2);

        _createClass(StringStore, null, {
          assignState: {
            value: function assignState(prevState, nextState) {
              return [prevState, nextState].filter(function (state) {
                return typeof state === "string";
              }).join("");
            }
          }
        });

        return StringStore;
      })(Store);

      var store = new StringStore();

      expect(store.state).to.be["null"];
      store.setState("a");
      expect(store.state).to.equal("a");
      store.setState("b");
      expect(store.state).to.equal("ab");
      store.replaceState("xyz");
      expect(store.state).to.equal("xyz");
      store.setState("zyx");
      expect(store.state).to.equal("xyzzyx");
    });
  });

  describe("#getStateAsObject()", function () {
    it("returns the current state as an object", function () {
      var store = new Store();
      store.setState({ foo: "bar", bar: "baz" });
      expect(store.getStateAsObject()).to.deep.equal({ foo: "bar", bar: "baz" });
    });
  });

  describe("#forceUpdate()", function () {
    it("emits change event", function () {
      var store = new ExampleStore();
      var listener = sinon.spy();
      store.addListener("change", listener);

      store.forceUpdate();

      expect(listener.calledOnce).to.be["true"];
    });

    it("doesn't modify existing state", function () {
      var store = new ExampleStore();
      var listener = sinon.spy();
      store.addListener("change", listener);

      store.register(actionId, function () {
        this.replaceState({ bar: "baz" });
        this.forceUpdate();

        expect(this.state).to.deep.equal({ foo: "bar" });
        expect(listener.called).to.be["false"];

        this.setState({ foo: "bar" });
        this.forceUpdate();
        this.replaceState({ baz: "foo" });
      });

      // Simulate dispatch
      store.handler({ actionId: actionId, body: "foobar" });

      expect(listener.calledOnce).to.be["true"];
      expect(store.state).to.deep.equal({ baz: "foo" });
    });
  });
});