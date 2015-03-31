"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var _get = function get(object, property, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc && desc.writable) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var _Flux = require("../../Flux");

var Flummox = _Flux.Flummox;
var Store = _Flux.Store;
var Actions = _Flux.Actions;

var addContext = _interopRequire(require("./addContext"));

var React = _interopRequire(require("react/addons"));

var TestUtils = React.addons.TestUtils;

var FluxComponent = _interopRequire(require("../FluxComponent"));

var sinon = _interopRequire(require("sinon"));

describe("FluxComponent", function () {
  var TestActions = (function (_Actions) {
    function TestActions() {
      _classCallCheck(this, TestActions);

      if (_Actions != null) {
        _Actions.apply(this, arguments);
      }
    }

    _inherits(TestActions, _Actions);

    _createClass(TestActions, {
      getSomething: {
        value: function getSomething(something) {
          return something;
        }
      }
    });

    return TestActions;
  })(Actions);

  var TestStore = (function (_Store) {
    function TestStore(flux) {
      _classCallCheck(this, TestStore);

      _get(Object.getPrototypeOf(TestStore.prototype), "constructor", this).call(this);

      var testActions = flux.getActions("test");
      this.register(testActions.getSomething, this.handleGetSomething);

      this.state = {
        something: null
      };
    }

    _inherits(TestStore, _Store);

    _createClass(TestStore, {
      handleGetSomething: {
        value: function handleGetSomething(something) {
          this.setState({ something: something });
        }
      }
    });

    return TestStore;
  })(Store);

  var Flux = (function (_Flummox) {
    function Flux() {
      _classCallCheck(this, Flux);

      _get(Object.getPrototypeOf(Flux.prototype), "constructor", this).call(this);

      this.createActions("test", TestActions);
      this.createStore("test", TestStore, this);
    }

    _inherits(Flux, _Flummox);

    return Flux;
  })(Flummox);

  it("gets Flux property from either props or context", function () {
    var flux = new Flux();
    var contextComponent = undefined,
        propsComponent = undefined;

    var ContextComponent = addContext(FluxComponent, { flux: flux }, { flux: React.PropTypes.instanceOf(Flummox) });

    var tree = TestUtils.renderIntoDocument(React.createElement(ContextComponent, null));

    contextComponent = TestUtils.findRenderedComponentWithType(tree, FluxComponent);

    propsComponent = TestUtils.renderIntoDocument(React.createElement(FluxComponent, { flux: flux }));

    expect(contextComponent.flux).to.be.an["instanceof"](Flummox);
    expect(propsComponent.flux).to.be.an["instanceof"](Flummox);
  });

  it("allows for FluxComponents through the tree via context", function () {
    var flux = new Flux();
    var actions = flux.getActions("test");

    var TopView = (function (_React$Component) {
      function TopView() {
        _classCallCheck(this, TopView);

        if (_React$Component != null) {
          _React$Component.apply(this, arguments);
        }
      }

      _inherits(TopView, _React$Component);

      _createClass(TopView, {
        render: {
          value: function render() {
            return React.createElement(
              FluxComponent,
              { flux: flux },
              React.createElement(SubView, null)
            );
          }
        }
      });

      return TopView;
    })(React.Component);

    var SubView = (function (_React$Component2) {
      function SubView() {
        _classCallCheck(this, SubView);

        if (_React$Component2 != null) {
          _React$Component2.apply(this, arguments);
        }
      }

      _inherits(SubView, _React$Component2);

      _createClass(SubView, {
        render: {
          value: function render() {
            return React.createElement(SubSubView, null);
          }
        }
      });

      return SubView;
    })(React.Component);

    var SubSubView = (function (_React$Component3) {
      function SubSubView() {
        _classCallCheck(this, SubSubView);

        if (_React$Component3 != null) {
          _React$Component3.apply(this, arguments);
        }
      }

      _inherits(SubSubView, _React$Component3);

      _createClass(SubSubView, {
        render: {
          value: function render() {
            return React.createElement(
              FluxComponent,
              { connectToStores: "test" },
              React.createElement("div", null)
            );
          }
        }
      });

      return SubSubView;
    })(React.Component);

    var tree = TestUtils.renderIntoDocument(React.createElement(TopView, null));

    var div = TestUtils.findRenderedDOMComponentWithTag(tree, "div");

    actions.getSomething("something good");
    expect(div.props.something).to.equal("something good");
  });

  it("passes connectToStore prop to reactComponentMethod connectToStores()", function () {
    var flux = new Flux();
    var actions = flux.getActions("test");

    var component = TestUtils.renderIntoDocument(React.createElement(FluxComponent, { flux: flux, connectToStores: "test" }));

    actions.getSomething("something good");
    expect(component.state.something).to.deep.equal("something good");
    actions.getSomething("something else");
    expect(component.state.something).to.deep.equal("something else");
  });

  it("passes stateGetter prop to reactComponentMethod connectToStores()", function () {
    var flux = new Flux();
    var actions = flux.getActions("test");
    var stateGetter = sinon.stub().returns({ fiz: "bin" });

    var component = TestUtils.renderIntoDocument(React.createElement(FluxComponent, { flux: flux, connectToStores: "test", stateGetter: stateGetter }));

    expect(component.state.fiz).to.equal("bin");
  });

  it("injects children with flux prop", function () {
    var flux = new Flux();
    var actions = flux.getActions("test");

    var tree = TestUtils.renderIntoDocument(React.createElement(
      FluxComponent,
      { flux: flux },
      React.createElement("div", null)
    ));

    var div = TestUtils.findRenderedDOMComponentWithTag(tree, "div");

    expect(div.props.flux).to.equal(flux);
  });

  it("injects children with props corresponding to component state", function () {
    var flux = new Flux();
    var actions = flux.getActions("test");

    var tree = TestUtils.renderIntoDocument(React.createElement(
      FluxComponent,
      { flux: flux, connectToStores: "test" },
      React.createElement("div", null)
    ));

    var div = TestUtils.findRenderedDOMComponentWithTag(tree, "div");

    actions.getSomething("something good");
    expect(div.props.something).to.equal("something good");
    actions.getSomething("something else");
    expect(div.props.something).to.equal("something else");
  });

  it("injects children with any extra props", function () {
    var flux = new Flux();
    var stateGetter = function () {};

    // Pass all possible PropTypes to ensure only extra props
    // are injected.
    var tree = TestUtils.renderIntoDocument(React.createElement(FluxComponent, {
      flux: flux,
      connectToStores: "test",
      stateGetter: stateGetter,
      extraProp: "hello",
      render: function (props) {
        return React.createElement("div", props);
      }
    }));

    var div = TestUtils.findRenderedDOMComponentWithTag(tree, "div");

    expect(div.props.extraProp).to.equal("hello");
    expect(Object.keys(div.props)).to.deep.equal(["flux", "extraProp"]);
  });

  it("wraps multiple children in span tag", function () {
    var flux = new Flux();

    var tree = TestUtils.renderIntoDocument(React.createElement(
      FluxComponent,
      { flux: flux },
      React.createElement("div", null),
      React.createElement("div", null)
    ));

    var wrapper = TestUtils.findRenderedDOMComponentWithTag(tree, "span");
    var divs = TestUtils.scryRenderedDOMComponentsWithTag(tree, "div");

    expect(divs.length).to.equal(2);
  });

  it("does not wrap single child in span tag", function () {
    var flux = new Flux();

    var tree = TestUtils.renderIntoDocument(React.createElement(
      FluxComponent,
      { flux: flux },
      React.createElement("div", null)
    ));

    expect(TestUtils.findRenderedDOMComponentWithTag.bind(TestUtils, tree, "span")).to["throw"]("Did not find exactly one match for tag:span");
  });

  it("allows for nested FluxComponents", function () {
    var flux = new Flux();
    var actions = flux.getActions("test");

    var tree = TestUtils.renderIntoDocument(React.createElement(
      FluxComponent,
      { flux: flux, connectToStores: "test" },
      React.createElement(
        FluxComponent,
        null,
        React.createElement("div", null)
      )
    ));

    var div = TestUtils.findRenderedDOMComponentWithTag(tree, "div");

    actions.getSomething("something good");
    expect(div.props.something).to.equal("something good");
    actions.getSomething("something else");
    expect(div.props.something).to.equal("something else");
  });

  it("uses `render` prop for custom rendering, if it exists", function () {
    var flux = new Flux();
    var actions = flux.getActions("test");

    var tree = TestUtils.renderIntoDocument(React.createElement(FluxComponent, {
      flux: flux,
      connectToStores: "test",
      render: function (props) {
        return React.createElement("div", { something: props.something });
      }
    }));

    var div = TestUtils.findRenderedDOMComponentWithTag(tree, "div");

    actions.getSomething("something good");
    expect(div.props.something).to.equal("something good");
    actions.getSomething("something else");
    expect(div.props.something).to.equal("something else");
  });

  it("updates with render-time computed values in state getters on componentWillReceiveProps()", function () {
    var flux = new Flux();

    var Owner = (function (_React$Component) {
      function Owner(props) {
        _classCallCheck(this, Owner);

        _get(Object.getPrototypeOf(Owner.prototype), "constructor", this).call(this, props);

        this.state = {
          foo: "bar"
        };
      }

      _inherits(Owner, _React$Component);

      _createClass(Owner, {
        render: {
          value: function render() {
            var _this = this;

            return React.createElement(FluxComponent, {
              flux: flux,
              connectToStores: {
                test: function (store) {
                  return {
                    yay: _this.state.foo
                  };
                }
              },
              render: function (storeState) {
                return React.createElement("div", storeState);
              }
            });
          }
        }
      });

      return Owner;
    })(React.Component);

    var owner = TestUtils.renderIntoDocument(React.createElement(Owner, null));
    var div = TestUtils.findRenderedDOMComponentWithTag(owner, "div");

    expect(div.props.yay).to.equal("bar");
    owner.setState({ foo: "baz" });
    expect(div.props.yay).to.equal("baz");
  });
});