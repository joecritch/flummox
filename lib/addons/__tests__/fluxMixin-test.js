"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var _get = function get(object, property, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc && desc.writable) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var fluxMixin = _interopRequire(require("../fluxMixin"));

var _Flux = require("../../Flux");

var Flummox = _Flux.Flummox;
var Store = _Flux.Store;
var Actions = _Flux.Actions;

var addContext = _interopRequire(require("./addContext"));

var sinon = _interopRequire(require("sinon"));

var React = _interopRequire(require("react/addons"));

var PropTypes = React.PropTypes;
var TestUtils = React.addons.TestUtils;

describe("fluxMixin", function () {
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
      this.createStore("test2", TestStore, this);
    }

    _inherits(Flux, _Flummox);

    return Flux;
  })(Flummox);

  var ComponentWithFluxMixin = React.createClass({
    displayName: "ComponentWithFluxMixin",

    mixins: [fluxMixin()],

    render: function render() {
      return null;
    }
  });

  it("gets flux from either props or context", function () {
    var flux = new Flux();
    var contextComponent = undefined,
        propsComponent = undefined;

    var ContextComponent = addContext(ComponentWithFluxMixin, { flux: flux }, { flux: React.PropTypes.instanceOf(Flummox) });

    var tree = TestUtils.renderIntoDocument(React.createElement(ContextComponent, null));

    contextComponent = TestUtils.findRenderedComponentWithType(tree, ComponentWithFluxMixin);

    propsComponent = TestUtils.renderIntoDocument(React.createElement(ComponentWithFluxMixin, { flux: flux }));

    expect(contextComponent.flux).to.be.an["instanceof"](Flummox);
    expect(propsComponent.flux).to.be.an["instanceof"](Flummox);
  });

  it("exposes flux as context", function () {
    var flux = new Flux();

    var ChildComponent = React.createClass({
      displayName: "ChildComponent",

      contextTypes: {
        flux: PropTypes.instanceOf(Flummox) },

      render: function render() {
        return React.createElement("div", null);
      }
    });

    var Component = React.createClass({
      displayName: "Component",

      mixins: [fluxMixin()],

      render: function render() {
        return React.createElement(
          "div",
          null,
          React.createElement(ChildComponent, { key: "test" })
        );
      }
    });

    var tree = TestUtils.renderIntoDocument(React.createElement(Component, { flux: flux }));

    var childComponent = TestUtils.findRenderedComponentWithType(tree, ChildComponent);

    expect(childComponent.context.flux).to.equal(flux);
  });

  it("throws error if neither props or context is set", function () {
    var flux = new Flux();

    expect(TestUtils.renderIntoDocument.bind(null, React.createElement(ComponentWithFluxMixin, null))).to["throw"]("fluxMixin: Could not find Flux instance. Ensure that your component " + "has either `this.context.flux` or `this.props.flux`.");
  });

  it("ignores change event after unmounted", function () {
    var flux = new Flux();
    flux.getActions("test").getSomething("foo");

    var getterMap = {
      test: function (store) {
        return { something: store.state.something };
      }
    };
    var Component = React.createClass({
      displayName: "Component",

      mixins: [fluxMixin(getterMap)],

      render: function render() {
        return null;
      }
    });

    var container = document.createElement("div");
    var component = React.render(React.createElement(Component, { flux: flux }), container);
    var listener = flux.getStore("test").listeners("change")[0];

    React.unmountComponentAtNode(container);

    flux.getActions("test").getSomething("bar");
    listener();

    expect(component.state.something).to.equal("foo");
  });

  it("uses #connectToStores() to get initial state", function () {
    var flux = new Flux();

    flux.getActions("test").getSomething("foobar");

    var getterMap = {
      test: function (store) {
        return {
          something: store.state.something,
          custom: true };
      } };

    var mixin = fluxMixin(getterMap);

    var connectToStores = sinon.spy(mixin, "connectToStores");

    var Component = React.createClass({
      displayName: "Component",

      mixins: [mixin],

      getInitialState: function getInitialState() {
        return {
          foobar: "baz" };
      },

      render: function render() {
        return null;
      }
    });

    var component = TestUtils.renderIntoDocument(React.createElement(Component, { key: "test", flux: flux }));

    expect(connectToStores.calledOnce).to.be["true"];
    expect(connectToStores.firstCall.args[0]).to.equal(getterMap);

    expect(flux.getStore("test").listeners("change")).to.have.length(1);

    expect(component.state).to.deep.equal({
      something: "foobar",
      custom: true,
      foobar: "baz" });
  });

  describe("#connectToStores", function () {

    it("returns initial state", function () {
      var flux = new Flux();

      var component = TestUtils.renderIntoDocument(React.createElement(ComponentWithFluxMixin, { key: "test", flux: flux }));

      var initialState = component.connectToStores("test");

      expect(initialState).to.deep.equal({
        something: null });
    });

    it("merges store state with component state on change", function () {
      var flux = new Flux();

      var component = TestUtils.renderIntoDocument(React.createElement(ComponentWithFluxMixin, { key: "test", flux: flux }));

      component.setState({ otherThing: "barbaz" });

      component.connectToStores("test");
      flux.getActions("test").getSomething("foobar");

      expect(component.state).to.deep.equal({
        something: "foobar",
        otherThing: "barbaz" });
    });

    it("uses custom state getter, if given", function () {
      var flux = new Flux();

      var component = TestUtils.renderIntoDocument(React.createElement(ComponentWithFluxMixin, { key: "test", flux: flux, bar: "baz" }));

      component.setState({ otherThing: "barbaz" });

      component.connectToStores("test", function (store, props) {
        return {
          something: store.state.something,
          barbaz: "bar" + props.bar };
      });

      flux.getActions("test").getSomething("foobar");

      expect(component.state).to.deep.equal({
        something: "foobar",
        otherThing: "barbaz",
        barbaz: "barbaz" });
    });

    it("syncs with store after prop change", function () {
      var flux = new Flux();

      var Component = React.createClass({
        displayName: "Component",

        mixins: [fluxMixin({
          test: function test(store, props) {
            return {
              foo: "foo is " + props.foo };
          } })],

        render: function render() {
          return null;
        }
      });

      var component = TestUtils.renderIntoDocument(React.createElement(Component, { key: "test", flux: flux, foo: "bar" }));

      expect(component.state.foo).to.equal("foo is bar");

      component.setProps({ foo: "baz" });

      expect(component.state.foo).to.equal("foo is baz");
    });

    it("accepts object of keys to state getters", function () {
      var flux = new Flux();

      var component = TestUtils.renderIntoDocument(React.createElement(ComponentWithFluxMixin, { key: "test", flux: flux }));

      component.setState({ otherThing: "barbaz" });

      component.connectToStores({
        test: function (store) {
          return {
            something: store.state.something,
            custom: true };
        } });

      flux.getActions("test").getSomething("foobar");

      expect(component.state).to.deep.equal({
        something: "foobar",
        otherThing: "barbaz",
        custom: true });
    });

    it("calls default state getter once with array of stores", function () {
      var flux = new Flux();

      flux.getStore("test2").setState({ otherThing: "barbaz" });

      var component = TestUtils.renderIntoDocument(React.createElement(ComponentWithFluxMixin, { key: "test", flux: flux }));

      component.connectToStores(["test", "test2"]);

      flux.getActions("test").getSomething("foobar");

      expect(component.state).to.deep.equal({
        something: "foobar",
        otherThing: "barbaz"
      });
    });

    it("calls custom state getter once with array of stores", function () {
      var flux = new Flux();
      var testStore = flux.getStore("test");
      var test2Store = flux.getStore("test2");

      testStore._testId = "test";
      test2Store._testId = "test2";

      var component = TestUtils.renderIntoDocument(React.createElement(ComponentWithFluxMixin, { key: "test", flux: flux }));

      var stateGetter = sinon.stub().returns({ foo: "bar" });
      var state = component.connectToStores(["test", "test2"], stateGetter);

      expect(stateGetter.calledOnce).to.be["true"];
      // Use _testId as unique identifier on store.
      expect(stateGetter.firstCall.args[0][0]._testId).to.equal("test");
      expect(stateGetter.firstCall.args[0][1]._testId).to.equal("test2");

      expect(state).to.deep.equal({
        foo: "bar"
      });
    });

    it("uses default getter if null is passed as getter", function () {
      var flux = new Flux();

      var component = TestUtils.renderIntoDocument(React.createElement(ComponentWithFluxMixin, { key: "test", flux: flux }));

      component.setState({ otherThing: "barbaz" });

      component.connectToStores("test", null);

      flux.getActions("test").getSomething("foobar");

      expect(component.state).to.deep.equal({
        something: "foobar",
        otherThing: "barbaz" });
    });

    it("removes listener before unmounting", function () {
      var flux = new Flux();
      var div = document.createElement("div");

      var component = React.render(React.createElement(ComponentWithFluxMixin, { flux: flux }), div);

      var store = flux.getStore("test");
      component.connectToStores("test");

      expect(store.listeners("change").length).to.equal(1);
      React.unmountComponentAtNode(div);
      expect(store.listeners("change").length).to.equal(0);
    });
  });

  describe("#getStoreState", function () {
    it("gets combined state of connected stores", function () {
      var flux = new Flux();

      var component = TestUtils.renderIntoDocument(React.createElement(ComponentWithFluxMixin, { key: "test", flux: flux }));

      component.connectToStores({
        test: function (store) {
          return {
            foo: "bar" };
        },
        test2: function (store) {
          return {
            bar: "baz"
          };
        }
      });

      component.setState({ baz: "foo" });

      expect(component.getStoreState()).to.deep.equal({
        foo: "bar",
        bar: "baz"
      });
    });
  });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9hZGRvbnMvX190ZXN0c19fL2ZsdXhNaXhpbi10ZXN0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztJQUFPLFNBQVMsMkJBQU0sY0FBYzs7b0JBQ0ksWUFBWTs7SUFBM0MsT0FBTyxTQUFQLE9BQU87SUFBRSxLQUFLLFNBQUwsS0FBSztJQUFFLE9BQU8sU0FBUCxPQUFPOztJQUN6QixVQUFVLDJCQUFNLGNBQWM7O0lBQzlCLEtBQUssMkJBQU0sT0FBTzs7SUFFbEIsS0FBSywyQkFBTSxjQUFjOztJQUN4QixTQUFTLEdBQUssS0FBSyxDQUFuQixTQUFTO0lBQ1QsU0FBUyxHQUFLLEtBQUssQ0FBQyxNQUFNLENBQTFCLFNBQVM7O0FBRWpCLFFBQVEsQ0FBQyxXQUFXLEVBQUUsWUFBTTtNQUVwQixXQUFXO2FBQVgsV0FBVzs0QkFBWCxXQUFXOzs7Ozs7O2NBQVgsV0FBVzs7aUJBQVgsV0FBVztBQUNmLGtCQUFZO2VBQUEsc0JBQUMsU0FBUyxFQUFFO0FBQ3RCLGlCQUFPLFNBQVMsQ0FBQztTQUNsQjs7OztXQUhHLFdBQVc7S0FBUyxPQUFPOztNQU0zQixTQUFTO0FBQ0YsYUFEUCxTQUFTLENBQ0QsSUFBSSxFQUFFOzRCQURkLFNBQVM7O0FBRVgsaUNBRkUsU0FBUyw2Q0FFSDs7QUFFUixVQUFNLFdBQVcsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQzVDLFVBQUksQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDLFlBQVksRUFBRSxJQUFJLENBQUMsa0JBQWtCLENBQUMsQ0FBQzs7QUFFakUsVUFBSSxDQUFDLEtBQUssR0FBRztBQUNYLGlCQUFTLEVBQUUsSUFBSTtPQUNoQixDQUFDO0tBQ0g7O2NBVkcsU0FBUzs7aUJBQVQsU0FBUztBQVliLHdCQUFrQjtlQUFBLDRCQUFDLFNBQVMsRUFBRTtBQUM1QixjQUFJLENBQUMsUUFBUSxDQUFDLEVBQUUsU0FBUyxFQUFULFNBQVMsRUFBRSxD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RyxTQUFTLENBQUMsa0JBQWtCLENBQzVDLG9CQUFDLHNCQUFzQixJQUFDLEdBQUcsRUFBQyxNQUFNLEVBQUMsSUFBSSxFQUFFLElBQUksQUFBQyxHQUFHLENBQ2xELENBQUM7O0FBRUYsZUFBUyxDQUFDLGVBQWUsQ0FBQztBQUN4QixZQUFJLEVBQUUsVUFBQSxLQUFLO2lCQUFLO0FBQ2QsZUFBRyxFQUFFLEtBQUssRUFDWDtTQUFDO0FBQ0YsYUFBSyxFQUFFLFVBQUEsS0FBSztpQkFBSztBQUNmLGVBQUcsRUFBRSxLQUFLO1dBQ1g7U0FBQztPQUNILENBQUMsQ0FBQzs7QUFFSCxlQUFTLENBQUMsUUFBUSxDQUFDLEVBQUUsR0FBRyxFQUFFLEtBQUssRUFBRSxDQUFDLENBQUM7O0FBRW5DLFlBQU0sQ0FBQyxTQUFTLENBQUMsYUFBYSxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQztBQUM5QyxXQUFHLEVBQUUsS0FBSztBQUNWLFdBQUcsRUFBRSxLQUFLO09BQ1gsQ0FBQyxDQUFDO0tBQ0osQ0FBQyxDQUFDO0dBQ0osQ0FBQyxDQUFDO0NBRUosQ0FBQyxDQUFDIiwiZmlsZSI6InNyYy9hZGRvbnMvX190ZXN0c19fL2ZsdXhNaXhpbi10ZXN0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGZsdXhNaXhpbiBmcm9tICcuLi9mbHV4TWl4aW4nO1xuaW1wb3J0IHsgRmx1bW1veCwgU3RvcmUsIEFjdGlvbnMgfSBmcm9tICcuLi8uLi9GbHV4JztcbmltcG9ydCBhZGRDb250ZXh0IGZyb20gJy4vYWRkQ29udGV4dCc7XG5pbXBvcnQgc2lub24gZnJvbSAnc2lub24nO1xuXG5pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QvYWRkb25zJztcbmNvbnN0IHsgUHJvcFR5cGVzIH0gPSBSZWFjdDtcbmNvbnN0IHsgVGVzdFV0aWxzIH0gPSBSZWFjdC5hZGRvbnM7XG5cbmRlc2NyaWJlKCdmbHV4TWl4aW4nLCAoKSA9PiB7XG5cbiAgY2xhc3MgVGVzdEFjdGlvbnMgZXh0ZW5kcyBBY3Rpb25zIHtcbiAgICBnZXRTb21ldGhpbmcoc29tZXRoaW5nKSB7XG4gICAgICByZXR1cm4gc29tZXRoaW5nO1xuICAgIH1cbiAgfVxuXG4gIGNsYXNzIFRlc3RTdG9yZSBleHRlbmRzIFN0b3JlIHtcbiAgICBjb25zdHJ1Y3RvcihmbHV4KSB7XG4gICAgICBzdXBlcigpO1xuXG4gICAgICBjb25zdCB0ZXN0QWN0aW9ucyA9IGZsdXguZ2V0QWN0aW9ucygndGVzdCcpO1xuICAgICAgdGhpcy5yZWdpc3Rlcih0ZXN0QWN0aW9ucy5nZXRTb21ldGhpbmcsIHRoaXMuaGFuZGxlR2V0U29tZXRoaW5nKTtcblxuICAgICAgdGhpcy5zdGF0ZSA9IHtcbiAgICAgICAgc29tZXRoaW5nOiBudWxsXG4gICAgICB9O1xuICAgIH1cblxuICAgIGhhbmRsZUdldFNvbWV0aGluZyhzb21ldGhpbmcpIHtcbiAgICAgIHRoaXMuc2V0U3RhdGUoeyBzb21ldGhpbmcgfSk7XG4gICAgfVxuICB9XG5cbiAgY2xhc3MgRmx1eCBleHRlbmRzIEZsdW1tb3gge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgc3VwZXIoKTtcblxuICAgICAgdGhpcy5jcmVhdGVBY3Rpb25zKCd0ZXN0JywgVGVzdEFjdGlvbnMpO1xuICAgICAgdGhpcy5jcmVhdGVTdG9yZSgndGVzdCcsIFRlc3RTdG9yZSwgdGhpcyk7XG4gICAgICB0aGlzLmNyZWF0ZVN0b3JlKCd0ZXN0MicsIFRlc3RTdG9yZSwgdGhpcyk7XG4gICAgfVxuICB9XG5cbiAgY29uc3QgQ29tcG9uZW50V2l0aEZsdXhNaXhpbiA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgICBtaXhpbnM6IFtmbHV4TWl4aW4oKV0sXG5cbiAgICByZW5kZXIoKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gIH0pO1xuXG4gIGl0KCdnZXRzIGZsdXggZnJvbSBlaXRoZXIgcHJvcHMgb3IgY29udGV4dCcsICgpID0+IHtcbiAgICBjb25zdCBmbHV4ID0gbmV3IEZsdXgoKTtcbiAgICBsZXQgY29udGV4dENvbXBvbmVudCwgcHJvcHNDb21wb25lbnQ7XG5cbiAgICBjb25zdCBDb250ZXh0Q29tcG9uZW50ID0gYWRkQ29udGV4dChcbiAgICAgIENvbXBvbmVudFdpdGhGbHV4TWl4aW4sXG4gICAgICB7IGZsdXggfSxcbiAgICAgIHsgZmx1eDogUmVhY3QuUHJvcFR5cGVzLmluc3RhbmNlT2YoRmx1bW1veCkgfVxuICAgICk7XG5cbiAgICBjb25zdCB0cmVlID0gVGVzdFV0aWxzLnJlbmRlckludG9Eb2N1bWVudChcbiAgICAgIDxDb250ZXh0Q29tcG9uZW50IC8+XG4gICAgKTtcblxuICAgIGNvbnRleHRDb21wb25lbnQgPSBUZXN0VXRpbHMuZmluZFJlbmRlcmVkQ29tcG9uZW50V2l0aFR5cGUoXG4gICAgICB0cmVlLCBDb21wb25lbnRXaXRoRmx1eE1peGluXG4gICAgKTtcblxuICAgIHByb3BzQ29tcG9uZW50ID0gVGVzdFV0aWxzLnJlbmRlckludG9Eb2N1bWVudChcbiAgICAgIDxDb21wb25lbnRXaXRoRmx1eE1peGluIGZsdXg9e2ZsdXh9IC8+XG4gICAgKTtcblxuICAgIGV4cGVjdChjb250ZXh0Q29tcG9uZW50LmZsdXgpLnRvLmJlLmFuLmluc3RhbmNlb2YoRmx1bW1veCk7XG4gICAgZXhwZWN0KHByb3BzQ29tcG9uZW50LmZsdXgpLnRvLmJlLmFuLmluc3RhbmNlb2YoRmx1bW1veCk7XG4gIH0pO1xuXG4gIGl0KCdleHBvc2VzIGZsdXggYXMgY29udGV4dCcsICgpID0+IHtcbiAgICBjb25zdCBmbHV4ID0gbmV3IEZsdXgoKTtcblxuICAgIGNvbnN0IENoaWxkQ29tcG9uZW50ID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICAgICAgY29udGV4dFR5cGVzOiB7XG4gICAgICAgIGZsdXg6IFByb3BUeXBlcy5pbnN0YW5jZU9mKEZsdW1tb3gpLFxuICAgICAgfSxcblxuICAgICAgcmVuZGVyKCkge1xuICAgICAgICByZXR1cm4gPGRpdiAvPjtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGNvbnN0IENvbXBvbmVudCA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgICAgIG1peGluczogW2ZsdXhNaXhpbigpXSxcblxuICAgICAgcmVuZGVyKCkge1xuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICA8Q2hpbGRDb21wb25lbnQga2V5PVwidGVzdFwiIC8+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBjb25zdCB0cmVlID0gVGVzdFV0aWxzLnJlbmRlckludG9Eb2N1bWVudCg8Q29tcG9uZW50IGZsdXg9e2ZsdXh9IC8+KTtcblxuICAgIGNvbnN0IGNoaWxkQ29tcG9uZW50ID0gVGVzdFV0aWxzLmZpbmRSZW5kZXJlZENvbXBvbmVudFdpdGhUeXBlKFxuICAgICAgdHJlZSxcbiAgICAgIENoaWxkQ29tcG9uZW50XG4gICAgKTtcblxuICAgIGV4cGVjdChjaGlsZENvbXBvbmVudC5jb250ZXh0LmZsdXgpLnRvLmVxdWFsKGZsdXgpO1xuICB9KTtcblxuICBpdCgndGhyb3dzIGVycm9yIGlmIG5laXRoZXIgcHJvcHMgb3IgY29udGV4dCBpcyBzZXQnLCAoKSA9PiB7XG4gICAgY29uc3QgZmx1eCA9IG5ldyBGbHV4KCk7XG5cbiAgICBleHBlY3QoVGVzdFV0aWxzLnJlbmRlckludG9Eb2N1bWVudC5iaW5kKG51bGwsIDxDb21wb25lbnRXaXRoRmx1eE1peGluIC8+KSlcbiAgICAgIC50by50aHJvdyhcbiAgICAgICAgJ2ZsdXhNaXhpbjogQ291bGQgbm90IGZpbmQgRmx1eCBpbnN0YW5jZS4gRW5zdXJlIHRoYXQgeW91ciBjb21wb25lbnQgJ1xuICAgICAgKyAnaGFzIGVpdGhlciBgdGhpcy5jb250ZXh0LmZsdXhgIG9yIGB0aGlzLnByb3BzLmZsdXhgLidcbiAgICAgICk7XG4gIH0pO1xuXG4gIGl0KCdpZ25vcmVzIGNoYW5nZSBldmVudCBhZnRlciB1bm1vdW50ZWQnLCAoKSA9PiB7XG4gICAgY29uc3QgZmx1eCA9IG5ldyBGbHV4KCk7XG4gICAgZmx1eC5nZXRBY3Rpb25zKCd0ZXN0JykuZ2V0U29tZXRoaW5nKCdmb28nKTtcblxuICAgIGNvbnN0IGdldHRlck1hcCA9IHtcbiAgICAgIHRlc3Q6IHN0b3JlID0+ICh7IHNvbWV0aGluZzogc3RvcmUuc3RhdGUuc29tZXRoaW5nIH0pXG4gICAgfTtcbiAgICBjb25zdCBDb21wb25lbnQgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gICAgICBtaXhpbnM6IFtmbHV4TWl4aW4oZ2V0dGVyTWFwKV0sXG5cbiAgICAgIHJlbmRlcigpIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBjb25zdCBjb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBjb25zdCBjb21wb25lbnQgPSBSZWFjdC5yZW5kZXIoPENvbXBvbmVudCBmbHV4PXtmbHV4fSAvPiwgY29udGFpbmVyKTtcbiAgICBjb25zdCBsaXN0ZW5lciA9IGZsdXguZ2V0U3RvcmUoJ3Rlc3QnKS5saXN0ZW5lcnMoJ2NoYW5nZScpWzBdO1xuXG4gICAgUmVhY3QudW5tb3VudENvbXBvbmVudEF0Tm9kZShjb250YWluZXIpO1xuXG4gICAgZmx1eC5nZXRBY3Rpb25zKCd0ZXN0JykuZ2V0U29tZXRoaW5nKCdiYXInKTtcbiAgICBsaXN0ZW5lcigpO1xuXG4gICAgZXhwZWN0KGNvbXBvbmVudC5zdGF0ZS5zb21ldGhpbmcpLnRvLmVxdWFsKCdmb28nKTtcbiAgfSk7XG5cbiAgaXQoJ3VzZXMgI2Nvbm5lY3RUb1N0b3JlcygpIHRvIGdldCBpbml0aWFsIHN0YXRlJywgKCkgPT4ge1xuICAgIGNvbnN0IGZsdXggPSBuZXcgRmx1eCgpO1xuXG4gICAgZmx1eC5nZXRBY3Rpb25zKCd0ZXN0JykuZ2V0U29tZXRoaW5nKCdmb29iYXInKTtcblxuICAgIGNvbnN0IGdldHRlck1hcCA9IHtcbiAgICAgIHRlc3Q6IHN0b3JlID0+ICh7XG4gICAgICAgIHNvbWV0aGluZzogc3RvcmUuc3RhdGUuc29tZXRoaW5nLFxuICAgICAgICBjdXN0b206IHRydWUsXG4gICAgICB9KSxcbiAgICB9O1xuXG4gICAgY29uc3QgbWl4aW4gPSBmbHV4TWl4aW4oZ2V0dGVyTWFwKTtcblxuICAgIGNvbnN0IGNvbm5lY3RUb1N0b3JlcyA9IHNpbm9uLnNweShtaXhpbiwgJ2Nvbm5lY3RUb1N0b3JlcycpO1xuXG4gICAgY29uc3QgQ29tcG9uZW50ID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICAgICAgbWl4aW5zOiBbbWl4aW5dLFxuXG4gICAgICBnZXRJbml0aWFsU3RhdGUoKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgZm9vYmFyOiAnYmF6JyxcbiAgICAgICAgfTtcbiAgICAgIH0sXG5cbiAgICAgIHJlbmRlcigpIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBjb25zdCBjb21wb25lbnQgPSBUZXN0VXRpbHMucmVuZGVySW50b0RvY3VtZW50KFxuICAgICAgPENvbXBvbmVudCBrZXk9XCJ0ZXN0XCIgZmx1eD17Zmx1eH0gLz5cbiAgICApO1xuXG4gICAgZXhwZWN0KGNvbm5lY3RUb1N0b3Jlcy5jYWxsZWRPbmNlKS50by5iZS50cnVlO1xuICAgIGV4cGVjdChjb25uZWN0VG9TdG9yZXMuZmlyc3RDYWxsLmFyZ3NbMF0pLnRvLmVxdWFsKGdldHRlck1hcCk7XG5cbiAgICBleHBlY3QoZmx1eC5nZXRTdG9yZSgndGVzdCcpLmxpc3RlbmVycygnY2hhbmdlJykpLnRvLmhhdmUubGVuZ3RoKDEpO1xuXG4gICAgZXhwZWN0KGNvbXBvbmVudC5zdGF0ZSkudG8uZGVlcC5lcXVhbCh7XG4gICAgICBzb21ldGhpbmc6ICdmb29iYXInLFxuICAgICAgY3VzdG9tOiB0cnVlLFxuICAgICAgZm9vYmFyOiAnYmF6JyxcbiAgICB9KTtcblxuICB9KTtcblxuICBkZXNjcmliZSgnI2Nvbm5lY3RUb1N0b3JlcycsICgpID0+IHtcblxuICAgIGl0KCdyZXR1cm5zIGluaXRpYWwgc3RhdGUnLCAoKSA9PiB7XG4gICAgICBjb25zdCBmbHV4ID0gbmV3IEZsdXgoKTtcblxuICAgICAgY29uc3QgY29tcG9uZW50ID0gVGVzdFV0aWxzLnJlbmRlckludG9Eb2N1bWVudChcbiAgICAgICAgPENvbXBvbmVudFdpdGhGbHV4TWl4aW4ga2V5PVwidGVzdFwiIGZsdXg9e2ZsdXh9IC8+XG4gICAgICApO1xuXG4gICAgICBjb25zdCBpbml0aWFsU3RhdGUgPSBjb21wb25lbnQuY29ubmVjdFRvU3RvcmVzKCd0ZXN0Jyk7XG5cbiAgICAgIGV4cGVjdChpbml0aWFsU3RhdGUpLnRvLmRlZXAuZXF1YWwoe1xuICAgICAgICBzb21ldGhpbmc6IG51bGwsXG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIGl0KCdtZXJnZXMgc3RvcmUgc3RhdGUgd2l0aCBjb21wb25lbnQgc3RhdGUgb24gY2hhbmdlJywgKCkgPT4ge1xuICAgICAgY29uc3QgZmx1eCA9IG5ldyBGbHV4KCk7XG5cbiAgICAgIGNvbnN0IGNvbXBvbmVudCA9IFRlc3RVdGlscy5yZW5kZXJJbnRvRG9jdW1lbnQoXG4gICAgICAgIDxDb21wb25lbnRXaXRoRmx1eE1peGluIGtleT1cInRlc3RcIiBmbHV4PXtmbHV4fSAvPlxuICAgICAgKTtcblxuICAgICAgY29tcG9uZW50LnNldFN0YXRlKHsgb3RoZXJUaGluZzogJ2JhcmJheicgfSk7XG5cbiAgICAgIGNvbXBvbmVudC5jb25uZWN0VG9TdG9yZXMoJ3Rlc3QnKTtcbiAgICAgIGZsdXguZ2V0QWN0aW9ucygndGVzdCcpLmdldFNvbWV0aGluZygnZm9vYmFyJyk7XG5cbiAgICAgIGV4cGVjdChjb21wb25lbnQuc3RhdGUpLnRvLmRlZXAuZXF1YWwoe1xuICAgICAgICBzb21ldGhpbmc6ICdmb29iYXInLFxuICAgICAgICBvdGhlclRoaW5nOiAnYmFyYmF6JyxcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgaXQoJ3VzZXMgY3VzdG9tIHN0YXRlIGdldHRlciwgaWYgZ2l2ZW4nLCAoKSA9PiB7XG4gICAgICBjb25zdCBmbHV4ID0gbmV3IEZsdXgoKTtcblxuICAgICAgY29uc3QgY29tcG9uZW50ID0gVGVzdFV0aWxzLnJlbmRlckludG9Eb2N1bWVudChcbiAgICAgICAgPENvbXBvbmVudFdpdGhGbHV4TWl4aW4ga2V5PVwidGVzdFwiIGZsdXg9e2ZsdXh9IGJhcj1cImJhelwiIC8+XG4gICAgICApO1xuXG4gICAgICBjb21wb25lbnQuc2V0U3RhdGUoeyBvdGhlclRoaW5nOiAnYmFyYmF6JyB9KTtcblxuICAgICAgY29tcG9uZW50LmNvbm5lY3RUb1N0b3JlcygndGVzdCcsIChzdG9yZSwgcHJvcHMpID0+ICh7XG4gICAgICAgIHNvbWV0aGluZzogc3RvcmUuc3RhdGUuc29tZXRoaW5nLFxuICAgICAgICBiYXJiYXo6ICdiYXInICsgcHJvcHMuYmFyLFxuICAgICAgfSkpO1xuXG4gICAgICBmbHV4LmdldEFjdGlvbnMoJ3Rlc3QnKS5nZXRTb21ldGhpbmcoJ2Zvb2JhcicpO1xuXG4gICAgICBleHBlY3QoY29tcG9uZW50LnN0YXRlKS50by5kZWVwLmVxdWFsKHtcbiAgICAgICAgc29tZXRoaW5nOiAnZm9vYmFyJyxcbiAgICAgICAgb3RoZXJUaGluZzogJ2JhcmJheicsXG4gICAgICAgIGJhcmJhejogJ2JhcmJheicsXG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIGl0KCdzeW5jcyB3aXRoIHN0b3JlIGFmdGVyIHByb3AgY2hhbmdlJywgKCkgPT4ge1xuICAgICAgY29uc3QgZmx1eCA9IG5ldyBGbHV4KCk7XG5cbiAgICAgIGNvbnN0IENvbXBvbmVudCA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgICAgICAgbWl4aW5zOiBbZmx1eE1peGluKHtcbiAgICAgICAgICB0ZXN0OiBmdW5jdGlvbihzdG9yZSwgcHJvcHMpIHtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgIGZvbzogJ2ZvbyBpcyAnICsgcHJvcHMuZm9vLFxuICAgICAgICAgICAgfTtcbiAgICAgICAgICB9LFxuICAgICAgICB9KV0sXG5cbiAgICAgICAgcmVuZGVyKCkge1xuICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgY29uc3QgY29tcG9uZW50ID0gVGVzdFV0aWxzLnJlbmRlckludG9Eb2N1bWVudChcbiAgICAgICAgPENvbXBvbmVudCBrZXk9XCJ0ZXN0XCIgZmx1eD17Zmx1eH0gZm9vPVwiYmFyXCIgLz5cbiAgICAgICk7XG5cbiAgICAgIGV4cGVjdChjb21wb25lbnQuc3RhdGUuZm9vKS50by5lcXVhbCgnZm9vIGlzIGJhcicpO1xuXG4gICAgICBjb21wb25lbnQuc2V0UHJvcHMoeyBmb286ICdiYXonIH0pO1xuXG4gICAgICBleHBlY3QoY29tcG9uZW50LnN0YXRlLmZvbykudG8uZXF1YWwoJ2ZvbyBpcyBiYXonKTtcbiAgICB9KTtcblxuICAgIGl0KCdhY2NlcHRzIG9iamVjdCBvZiBrZXlzIHRvIHN0YXRlIGdldHRlcnMnLCAoKSA9PiB7XG4gICAgICBjb25zdCBmbHV4ID0gbmV3IEZsdXgoKTtcblxuICAgICAgY29uc3QgY29tcG9uZW50ID0gVGVzdFV0aWxzLnJlbmRlckludG9Eb2N1bWVudChcbiAgICAgICAgPENvbXBvbmVudFdpdGhGbHV4TWl4aW4ga2V5PVwidGVzdFwiIGZsdXg9e2ZsdXh9IC8+XG4gICAgICApO1xuXG4gICAgICBjb21wb25lbnQuc2V0U3RhdGUoeyBvdGhlclRoaW5nOiAnYmFyYmF6JyB9KTtcblxuICAgICAgY29tcG9uZW50LmNvbm5lY3RUb1N0b3Jlcyh7XG4gICAgICAgIHRlc3Q6IHN0b3JlID0+ICh7XG4gICAgICAgICAgc29tZXRoaW5nOiBzdG9yZS5zdGF0ZS5zb21ldGhpbmcsXG4gICAgICAgICAgY3VzdG9tOiB0cnVlLFxuICAgICAgICB9KSxcbiAgICAgIH0pO1xuXG4gICAgICBmbHV4LmdldEFjdGlvbnMoJ3Rlc3QnKS5nZXRTb21ldGhpbmcoJ2Zvb2JhcicpO1xuXG4gICAgICBleHBlY3QoY29tcG9uZW50LnN0YXRlKS50by5kZWVwLmVxdWFsKHtcbiAgICAgICAgc29tZXRoaW5nOiAnZm9vYmFyJyxcbiAgICAgICAgb3RoZXJUaGluZzogJ2JhcmJheicsXG4gICAgICAgIGN1c3RvbTogdHJ1ZSxcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgaXQoJ2NhbGxzIGRlZmF1bHQgc3RhdGUgZ2V0dGVyIG9uY2Ugd2l0aCBhcnJheSBvZiBzdG9yZXMnLCAoKSA9PiB7XG4gICAgICBjb25zdCBmbHV4ID0gbmV3IEZsdXgoKTtcblxuICAgICAgZmx1eC5nZXRTdG9yZSgndGVzdDInKS5zZXRTdGF0ZSh7IG90aGVyVGhpbmc6ICdiYXJiYXonIH0pO1xuXG4gICAgICBjb25zdCBjb21wb25lbnQgPSBUZXN0VXRpbHMucmVuZGVySW50b0RvY3VtZW50KFxuICAgICAgICA8Q29tcG9uZW50V2l0aEZsdXhNaXhpbiBrZXk9XCJ0ZXN0XCIgZmx1eD17Zmx1eH0gLz5cbiAgICAgICk7XG5cbiAgICAgIGNvbXBvbmVudC5jb25uZWN0VG9TdG9yZXMoWyd0ZXN0JywgJ3Rlc3QyJ10pO1xuXG4gICAgICBmbHV4LmdldEFjdGlvbnMoJ3Rlc3QnKS5nZXRTb21ldGhpbmcoJ2Zvb2JhcicpO1xuXG4gICAgICBleHBlY3QoY29tcG9uZW50LnN0YXRlKS50by5kZWVwLmVxdWFsKHtcbiAgICAgICAgc29tZXRoaW5nOiAnZm9vYmFyJyxcbiAgICAgICAgb3RoZXJUaGluZzogJ2JhcmJheidcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgaXQoJ2NhbGxzIGN1c3RvbSBzdGF0ZSBnZXR0ZXIgb25jZSB3aXRoIGFycmF5IG9mIHN0b3JlcycsICgpID0+IHtcbiAgICAgIGNvbnN0IGZsdXggPSBuZXcgRmx1eCgpO1xuICAgICAgY29uc3QgdGVzdFN0b3JlID0gZmx1eC5nZXRTdG9yZSgndGVzdCcpO1xuICAgICAgY29uc3QgdGVzdDJTdG9yZSA9IGZsdXguZ2V0U3RvcmUoJ3Rlc3QyJyk7XG5cbiAgICAgIHRlc3RTdG9yZS5fdGVzdElkID0gJ3Rlc3QnO1xuICAgICAgdGVzdDJTdG9yZS5fdGVzdElkID0gJ3Rlc3QyJztcblxuICAgICAgY29uc3QgY29tcG9uZW50ID0gVGVzdFV0aWxzLnJlbmRlckludG9Eb2N1bWVudChcbiAgICAgICAgPENvbXBvbmVudFdpdGhGbHV4TWl4aW4ga2V5PVwidGVzdFwiIGZsdXg9e2ZsdXh9IC8+XG4gICAgICApO1xuXG4gICAgICBjb25zdCBzdGF0ZUdldHRlciA9IHNpbm9uLnN0dWIoKS5yZXR1cm5zKHsgZm9vOiAnYmFyJyB9KTtcbiAgICAgIGNvbnN0IHN0YXRlID0gY29tcG9uZW50LmNvbm5lY3RUb1N0b3JlcyhbJ3Rlc3QnLCAndGVzdDInXSwgc3RhdGVHZXR0ZXIpO1xuXG4gICAgICBleHBlY3Qoc3RhdGVHZXR0ZXIuY2FsbGVkT25jZSkudG8uYmUudHJ1ZTtcbiAgICAgIC8vIFVzZSBfdGVzdElkIGFzIHVuaXF1ZSBpZGVudGlmaWVyIG9uIHN0b3JlLlxuICAgICAgZXhwZWN0KHN0YXRlR2V0dGVyLmZpcnN0Q2FsbC5hcmdzWzBdWzBdLl90ZXN0SWQpLnRvLmVxdWFsKCd0ZXN0Jyk7XG4gICAgICBleHBlY3Qoc3RhdGVHZXR0ZXIuZmlyc3RDYWxsLmFyZ3NbMF1bMV0uX3Rlc3RJZCkudG8uZXF1YWwoJ3Rlc3QyJyk7XG5cbiAgICAgIGV4cGVjdChzdGF0ZSkudG8uZGVlcC5lcXVhbCh7XG4gICAgICAgIGZvbzogJ2JhcidcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgaXQoJ3VzZXMgZGVmYXVsdCBnZXR0ZXIgaWYgbnVsbCBpcyBwYXNzZWQgYXMgZ2V0dGVyJywgKCkgPT4ge1xuICAgICAgY29uc3QgZmx1eCA9IG5ldyBGbHV4KCk7XG5cbiAgICAgIGNvbnN0IGNvbXBvbmVudCA9IFRlc3RVdGlscy5yZW5kZXJJbnRvRG9jdW1lbnQoXG4gICAgICAgIDxDb21wb25lbnRXaXRoRmx1eE1peGluIGtleT1cInRlc3RcIiBmbHV4PXtmbHV4fSAvPlxuICAgICAgKTtcblxuICAgICAgY29tcG9uZW50LnNldFN0YXRlKHsgb3RoZXJUaGluZzogJ2JhcmJheicgfSk7XG5cbiAgICAgIGNvbXBvbmVudC5jb25uZWN0VG9TdG9yZXMoJ3Rlc3QnLCBudWxsKTtcblxuICAgICAgZmx1eC5nZXRBY3Rpb25zKCd0ZXN0JykuZ2V0U29tZXRoaW5nKCdmb29iYXInKTtcblxuICAgICAgZXhwZWN0KGNvbXBvbmVudC5zdGF0ZSkudG8uZGVlcC5lcXVhbCh7XG4gICAgICAgIHNvbWV0aGluZzogJ2Zvb2JhcicsXG4gICAgICAgIG90aGVyVGhpbmc6ICdiYXJiYXonLFxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBpdCgncmVtb3ZlcyBsaXN0ZW5lciBiZWZvcmUgdW5tb3VudGluZycsICgpID0+IHtcbiAgICAgIGNvbnN0IGZsdXggPSBuZXcgRmx1eCgpO1xuICAgICAgY29uc3QgZGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG5cbiAgICAgIGNvbnN0IGNvbXBvbmVudCA9IFJlYWN0LnJlbmRlcig8Q29tcG9uZW50V2l0aEZsdXhNaXhpbiBmbHV4PXtmbHV4fSAvPiwgZGl2KTtcblxuICAgICAgY29uc3Qgc3RvcmUgPSBmbHV4LmdldFN0b3JlKCd0ZXN0Jyk7XG4gICAgICBjb21wb25lbnQuY29ubmVjdFRvU3RvcmVzKCd0ZXN0Jyk7XG5cbiAgICAgIGV4cGVjdChzdG9yZS5saXN0ZW5lcnMoJ2NoYW5nZScpLmxlbmd0aCkudG8uZXF1YWwoMSk7XG4gICAgICBSZWFjdC51bm1vdW50Q29tcG9uZW50QXROb2RlKGRpdik7XG4gICAgICBleHBlY3Qoc3RvcmUubGlzdGVuZXJzKCdjaGFuZ2UnKS5sZW5ndGgpLnRvLmVxdWFsKDApO1xuICAgIH0pO1xuXG4gIH0pO1xuXG4gIGRlc2NyaWJlKCcjZ2V0U3RvcmVTdGF0ZScsICgpID0+IHtcbiAgICBpdCgnZ2V0cyBjb21iaW5lZCBzdGF0ZSBvZiBjb25uZWN0ZWQgc3RvcmVzJywgKCkgPT4ge1xuICAgICAgY29uc3QgZmx1eCA9IG5ldyBGbHV4KCk7XG5cbiAgICAgIGNvbnN0IGNvbXBvbmVudCA9IFRlc3RVdGlscy5yZW5kZXJJbnRvRG9jdW1lbnQoXG4gICAgICAgIDxDb21wb25lbnRXaXRoRmx1eE1peGluIGtleT1cInRlc3RcIiBmbHV4PXtmbHV4fSAvPlxuICAgICAgKTtcblxuICAgICAgY29tcG9uZW50LmNvbm5lY3RUb1N0b3Jlcyh7XG4gICAgICAgIHRlc3Q6IHN0b3JlID0+ICh7XG4gICAgICAgICAgZm9vOiAnYmFyJyxcbiAgICAgICAgfSksXG4gICAgICAgIHRlc3QyOiBzdG9yZSA9PiAoe1xuICAgICAgICAgIGJhcjogJ2JheidcbiAgICAgICAgfSlcbiAgICAgIH0pO1xuXG4gICAgICBjb21wb25lbnQuc2V0U3RhdGUoeyBiYXo6ICdmb28nIH0pO1xuXG4gICAgICBleHBlY3QoY29tcG9uZW50LmdldFN0b3JlU3RhdGUoKSkudG8uZGVlcC5lcXVhbCh7XG4gICAgICAgIGZvbzogJ2JhcicsXG4gICAgICAgIGJhcjogJ2JheidcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9KTtcblxufSk7XG4iXX0=