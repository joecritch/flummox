"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var _get = function get(object, property, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc && desc.writable) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var connectToStores = _interopRequire(require("../connectToStores"));

var addContext = _interopRequire(require("./addContext"));

var _Flux = require("../../Flux");

var Actions = _Flux.Actions;
var Store = _Flux.Store;
var Flummox = _Flux.Flummox;

var React = _interopRequire(require("react/addons"));

var PropTypes = React.PropTypes;
var TestUtils = React.addons.TestUtils;

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

describe("connectToStores (HoC)", function () {
  it("gets Flux from either props or context", function () {
    var flux = new Flux();
    var contextComponent = undefined,
        propsComponent = undefined;

    var BaseComponent = (function (_React$Component) {
      function BaseComponent() {
        _classCallCheck(this, BaseComponent);

        if (_React$Component != null) {
          _React$Component.apply(this, arguments);
        }
      }

      _inherits(BaseComponent, _React$Component);

      _createClass(BaseComponent, {
        render: {
          value: function render() {
            return React.createElement("div", null);
          }
        }
      });

      return BaseComponent;
    })(React.Component);

    var ConnectedComponent = connectToStores(BaseComponent, "test");

    var ContextComponent = addContext(ConnectedComponent, { flux: flux }, { flux: React.PropTypes.instanceOf(Flummox) });

    var tree = TestUtils.renderIntoDocument(React.createElement(ContextComponent, null));

    contextComponent = TestUtils.findRenderedComponentWithType(tree, ConnectedComponent);

    propsComponent = TestUtils.renderIntoDocument(React.createElement(ConnectedComponent, { flux: flux }));

    expect(contextComponent.flux).to.be.an["instanceof"](Flummox);
    expect(propsComponent.flux).to.be.an["instanceof"](Flummox);
  });

  it("syncs with store after state change", function () {
    var flux = new Flux();

    var BaseComponent = (function (_React$Component) {
      function BaseComponent() {
        _classCallCheck(this, BaseComponent);

        if (_React$Component != null) {
          _React$Component.apply(this, arguments);
        }
      }

      _inherits(BaseComponent, _React$Component);

      _createClass(BaseComponent, {
        render: {
          value: function render() {
            return React.createElement("div", null);
          }
        }
      });

      return BaseComponent;
    })(React.Component);

    var ConnectedComponent = connectToStores(BaseComponent, "test");

    var tree = TestUtils.renderIntoDocument(React.createElement(ConnectedComponent, { flux: flux }));

    var component = TestUtils.findRenderedComponentWithType(tree, BaseComponent);

    var getSomething = flux.getActions("test").getSomething;

    expect(component.props.something).to.be["null"];

    getSomething("do");

    expect(component.props.something).to.equal("do");

    getSomething("re");

    expect(component.props.something).to.equal("re");
  });
});