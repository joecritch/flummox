"use strict";

var _defineProperty = function (obj, key, value) { return Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); };

var _get = function get(object, property, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc && desc.writable) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var _Flux = require("../Flux");

var Flummox = _Flux.Flummox;
var Store = _Flux.Store;
var Actions = _Flux.Actions;

describe("Examples:", function () {

  /**
   * A simple Flummox example
   */
  describe("Messages", function () {

    /**
     * To create some actions, create a new class that extends from the base
     * Actions class. Methods on the class's prototype will be converted into
     * actions, each with its own action id.
     *
     * In this example, calling `newMessage` will fire the dispatcher, with
     * a payload containing the passed message content. Easy!
     */

    var MessageActions = (function (_Actions) {
      function MessageActions() {
        _classCallCheck(this, MessageActions);

        if (_Actions != null) {
          _Actions.apply(this, arguments);
        }
      }

      _inherits(MessageActions, _Actions);

      _createClass(MessageActions, {
        newMessage: {
          value: function newMessage(content) {

            // The return value from the action is sent to the dispatcher.
            return content;
          }
        }
      });

      return MessageActions;
    })(Actions);

    /**
     * Now we need to a Store that will receive payloads from the dispatcher
     * and update itself accordingly. Like before, create a new class that
     * extends from the Store class.
     *
     * Stores are automatically registered with the dispatcher, but rather than
     * using a giant `switch` statement to check for specific action types, we
     * register handlers with action ids, or with a reference to the action
     * itself.
     *
     * Stores have a React-inspired API for managing state. Use `this.setState`
     * to update state within your handlers. Multiple calls to `this.setState`
     * within the same handler will be batched. A change event will fire after
     * the batched updates are applied. Your view controllers can listen
     * for change events using the EventEmitter API.
     */

    var MessageStore = (function (_Store) {

      // Note that passing a flux instance to the constructor is not required;
      // we do it here so we have access to any action ids we're interested in.

      function MessageStore(flux) {
        _classCallCheck(this, MessageStore);

        // Don't forget to call the super constructor
        _get(Object.getPrototypeOf(MessageStore.prototype), "constructor", this).call(this);

        var messageActions = flux.getActions("messages");
        this.register(messageActions.newMessage, this.handleNewMessage);
        this.messageCounter = 0;

        this.state = {};
      }

      _inherits(MessageStore, _Store);

      _createClass(MessageStore, {
        handleNewMessage: {
          value: function handleNewMessage(content) {
            var id = this.messageCounter++;

            this.setState(_defineProperty({}, id, {
              content: content,
              id: id }));
          }
        }
      });

      return MessageStore;
    })(Store);

    /**
     * Here's where it all comes together. Extend from the base Flummox class
     * to create a class that encapsulates your entire flux set-up.
     */

    var Flux = (function (_Flummox) {
      function Flux() {
        _classCallCheck(this, Flux);

        _get(Object.getPrototypeOf(Flux.prototype), "constructor", this).call(this);

        // Create actions first so our store can reference them in
        // its constructor
        this.createActions("messages", MessageActions);

        // Extra arguments are sent to the store's constructor. Here, we're
        // padding a reference to this flux instance
        this.createStore("messages", MessageStore, this);
      }

      _inherits(Flux, _Flummox);

      return Flux;
    })(Flummox);

    /**
     * And that's it! No need for singletons or global references -- just create
     * a new instance.
     *
     * Now let's test it.
     */

    it("creates new messages", function () {
      var flux = new Flux();
      var messageStore = flux.getStore("messages");
      var messageActions = flux.getActions("messages");

      expect(messageStore.state).to.deep.equal({});

      messageActions.newMessage("Hello, world!");
      expect(messageStore.state).to.deep.equal(_defineProperty({}, 0, {
        content: "Hello, world!",
        id: 0 }));
    });
  });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9fX3Rlc3RzX18vZXhhbXBsZUZsdXgtdGVzdC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7b0JBQXdDLFNBQVM7O0lBQXhDLE9BQU8sU0FBUCxPQUFPO0lBQUUsS0FBSyxTQUFMLEtBQUs7SUFBRSxPQUFPLFNBQVAsT0FBTzs7QUFFaEMsUUFBUSxDQUFDLFdBQVcsRUFBRSxZQUFNOzs7OztBQUsxQixVQUFRLENBQUMsVUFBVSxFQUFFLFlBQU07Ozs7Ozs7Ozs7O1FBVW5CLGNBQWM7ZUFBZCxjQUFjOzhCQUFkLGNBQWM7Ozs7Ozs7Z0JBQWQsY0FBYzs7bUJBQWQsY0FBYztBQUNsQixrQkFBVTtpQkFBQSxvQkFBQyxPQUFPLEVBQUU7OztBQUdsQixtQkFBTyxPQUFPLENBQUM7V0FDaEI7Ozs7YUFMRyxjQUFjO09BQVMsT0FBTzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztRQXdCOUIsWUFBWTs7Ozs7QUFJTCxlQUpQLFlBQVksQ0FJSixJQUFJLEVBQUU7OEJBSmQsWUFBWTs7O0FBT2QsbUNBUEUsWUFBWSw2Q0FPTjs7QUFFUixZQUFNLGNBQWMsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBQ25ELFlBQUksQ0FBQyxRQUFRLENBQUMsY0FBYyxDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztBQUNoRSxZQUFJLENBQUMsY0FBYyxHQUFHLENBQUMsQ0FBQzs7QUFFeEIsWUFBSSxDQUFDLEtBQUssR0FBRyxFQUFFLENBQUM7T0FDakI7O2dCQWRHLFlBQVk7O21CQUFaLFlBQVk7QUFnQmhCLHdCQUFnQjtpQkFBQSwwQkFBQyxPQUFPLEVBQUU7QUFDeEIsZ0JBQU0sRUFBRSxHQUFHLElBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQzs7QUFFakMsZ0JBQUksQ0FBQyxRQUFRLHFCQUNWLEVBQUUsRUFBRztBQUNKLHFCQUFPLEVBQVAsT0FBTztBQUNQLGdCQUFFLEVBQUYsRUFBRSxFQUNILEVBQ0QsQ0FBQztXQUNKOzs7O2FBekJHLFlBQVk7T0FBUyxLQUFLOzs7Ozs7O1FBaUMxQixJQUFJO0FBQ0csZUFEUCxJQUFJLEdBQ007OEJBRFYsSUFBSTs7QUFFTixtQ0FGRSxJQUFJLDZDQUVFOzs7O0FBSVIsWUFBSSxDQUFDLGFBQWEsQ0FBQyxVQUFVLEVBQUUsY0FBYyxDQUFDLENBQUM7Ozs7QUFJL0MsWUFBSSxDQUFDLFdBQVcsQ0FBQyxVQUFVLEVBQUUsWUFBWSxFQUFFLElBQUksQ0FBQyxDQUFDO09BQ2xEOztnQkFYRyxJQUFJOzthQUFKLElBQUk7T0FBUyxPQUFPOzs7Ozs7Ozs7QUFxQjFCLE1BQUUsQ0FBQyxzQkFBc0IsRUFBRSxZQUFNO0FBQy9CLFVBQU0sSUFBSSxHQUFHLElBQUksSUFBSSxFQUFFLENBQUM7QUFDeEIsVUFBTSxZQUFZLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsQ0FBQztBQUMvQyxVQUFNLGNBQWMsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLFVBQVUsQ0FBQyxDQUFDOztBQUVuRCxZQUFNLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDOztBQUU3QyxvQkFBYyxDQUFDLFVBQVUsQ0FBQyxlQUFlLENBQUMsQ0FBQztBQUMzQyxZQUFNLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsS0FBSyxxQkFDckMsQ0FBQyxFQUFHO0FBQ0gsZUFBTyxFQUFFLGVBQWU7QUFDeEIsVUFBRSxFQUFFLENBQUMsRUFDTixFQUNELENBQUM7S0FDSixDQUFDLENBQUM7R0FDSixDQUFDLENBQUM7Q0FFSixDQUFDLENBQUMiLCJmaWxlIjoic3JjL19fdGVzdHNfXy9leGFtcGxlRmx1eC10ZXN0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgRmx1bW1veCwgU3RvcmUsIEFjdGlvbnMgfSBmcm9tICcuLi9GbHV4JztcblxuZGVzY3JpYmUoJ0V4YW1wbGVzOicsICgpID0+IHtcblxuICAvKipcbiAgICogQSBzaW1wbGUgRmx1bW1veCBleGFtcGxlXG4gICAqL1xuICBkZXNjcmliZSgnTWVzc2FnZXMnLCAoKSA9PiB7XG5cbiAgICAvKipcbiAgICAgKiBUbyBjcmVhdGUgc29tZSBhY3Rpb25zLCBjcmVhdGUgYSBuZXcgY2xhc3MgdGhhdCBleHRlbmRzIGZyb20gdGhlIGJhc2VcbiAgICAgKiBBY3Rpb25zIGNsYXNzLiBNZXRob2RzIG9uIHRoZSBjbGFzcydzIHByb3RvdHlwZSB3aWxsIGJlIGNvbnZlcnRlZCBpbnRvXG4gICAgICogYWN0aW9ucywgZWFjaCB3aXRoIGl0cyBvd24gYWN0aW9uIGlkLlxuICAgICAqXG4gICAgICogSW4gdGhpcyBleGFtcGxlLCBjYWxsaW5nIGBuZXdNZXNzYWdlYCB3aWxsIGZpcmUgdGhlIGRpc3BhdGNoZXIsIHdpdGhcbiAgICAgKiBhIHBheWxvYWQgY29udGFpbmluZyB0aGUgcGFzc2VkIG1lc3NhZ2UgY29udGVudC4gRWFzeSFcbiAgICAgKi9cbiAgICBjbGFzcyBNZXNzYWdlQWN0aW9ucyBleHRlbmRzIEFjdGlvbnMge1xuICAgICAgbmV3TWVzc2FnZShjb250ZW50KSB7XG5cbiAgICAgICAgLy8gVGhlIHJldHVybiB2YWx1ZSBmcm9tIHRoZSBhY3Rpb24gaXMgc2VudCB0byB0aGUgZGlzcGF0Y2hlci5cbiAgICAgICAgcmV0dXJuIGNvbnRlbnQ7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogTm93IHdlIG5lZWQgdG8gYSBTdG9yZSB0aGF0IHdpbGwgcmVjZWl2ZSBwYXlsb2FkcyBmcm9tIHRoZSBkaXNwYXRjaGVyXG4gICAgICogYW5kIHVwZGF0ZSBpdHNlbGYgYWNjb3JkaW5nbHkuIExpa2UgYmVmb3JlLCBjcmVhdGUgYSBuZXcgY2xhc3MgdGhhdFxuICAgICAqIGV4dGVuZHMgZnJvbSB0aGUgU3RvcmUgY2xhc3MuXG4gICAgICpcbiAgICAgKiBTdG9yZXMgYXJlIGF1dG9tYXRpY2FsbHkgcmVnaXN0ZXJlZCB3aXRoIHRoZSBkaXNwYXRjaGVyLCBidXQgcmF0aGVyIHRoYW5cbiAgICAgKiB1c2luZyBhIGdpYW50IGBzd2l0Y2hgIHN0YXRlbWVudCB0byBjaGVjayBmb3Igc3BlY2lmaWMgYWN0aW9uIHR5cGVzLCB3ZVxuICAgICAqIHJlZ2lzdGVyIGhhbmRsZXJzIHdpdGggYWN0aW9uIGlkcywgb3Igd2l0aCBhIHJlZmVyZW5jZSB0byB0aGUgYWN0aW9uXG4gICAgICogaXRzZWxmLlxuICAgICAqXG4gICAgICogU3RvcmVzIGhhdmUgYSBSZWFjdC1pbnNwaXJlZCBBUEkgZm9yIG1hbmFnaW5nIHN0YXRlLiBVc2UgYHRoaXMuc2V0U3RhdGVgXG4gICAgICogdG8gdXBkYXRlIHN0YXRlIHdpdGhpbiB5b3VyIGhhbmRsZXJzLiBNdWx0aXBsZSBjYWxscyB0byBgdGhpcy5zZXRTdGF0ZWBcbiAgICAgKiB3aXRoaW4gdGhlIHNhbWUgaGFuZGxlciB3aWxsIGJlIGJhdGNoZWQuIEEgY2hhbmdlIGV2ZW50IHdpbGwgZmlyZSBhZnRlclxuICAgICAqIHRoZSBiYXRjaGVkIHVwZGF0ZXMgYXJlIGFwcGxpZWQuIFlvdXIgdmlldyBjb250cm9sbGVycyBjYW4gbGlzdGVuXG4gICAgICogZm9yIGNoYW5nZSBldmVudHMgdXNpbmcgdGhlIEV2ZW50RW1pdHRlciBBUEkuXG4gICAgICovXG4gICAgY2xhc3MgTWVzc2FnZVN0b3JlIGV4dGVuZHMgU3RvcmUge1xuXG4gICAgICAvLyBOb3RlIHRoYXQgcGFzc2luZyBhIGZsdXggaW5zdGFuY2UgdG8gdGhlIGNvbnN0cnVjdG9yIGlzIG5vdCByZXF1aXJlZDtcbiAgICAgIC8vIHdlIGRvIGl0IGhlcmUgc28gd2UgaGF2ZSBhY2Nlc3MgdG8gYW55IGFjdGlvbiBpZHMgd2UncmUgaW50ZXJlc3RlZCBpbi5cbiAgICAgIGNvbnN0cnVjdG9yKGZsdXgpIHtcblxuICAgICAgICAvLyBEb24ndCBmb3JnZXQgdG8gY2FsbCB0aGUgc3VwZXIgY29uc3RydWN0b3JcbiAgICAgICAgc3VwZXIoKTtcblxuICAgICAgICBjb25zdCBtZXNzYWdlQWN0aW9ucyA9IGZsdXguZ2V0QWN0aW9ucygnbWVzc2FnZXMnKTtcbiAgICAgICAgdGhpcy5yZWdpc3RlcihtZXNzYWdlQWN0aW9ucy5uZXdNZXNzYWdlLCB0aGlzLmhhbmRsZU5ld01lc3NhZ2UpO1xuICAgICAgICB0aGlzLm1lc3NhZ2VDb3VudGVyID0gMDtcblxuICAgICAgICB0aGlzLnN0YXRlID0ge307XG4gICAgICB9XG5cbiAgICAgIGhhbmRsZU5ld01lc3NhZ2UoY29udGVudCkge1xuICAgICAgICBjb25zdCBpZCA9IHRoaXMubWVzc2FnZUNvdW50ZXIrKztcblxuICAgICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgICBbaWRdOiB7XG4gICAgICAgICAgICBjb250ZW50LFxuICAgICAgICAgICAgaWQsXG4gICAgICAgICAgfSxcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuXG5cbiAgICAvKipcbiAgICAgKiBIZXJlJ3Mgd2hlcmUgaXQgYWxsIGNvbWVzIHRvZ2V0aGVyLiBFeHRlbmQgZnJvbSB0aGUgYmFzZSBGbHVtbW94IGNsYXNzXG4gICAgICogdG8gY3JlYXRlIGEgY2xhc3MgdGhhdCBlbmNhcHN1bGF0ZXMgeW91ciBlbnRpcmUgZmx1eCBzZXQtdXAuXG4gICAgICovXG4gICAgY2xhc3MgRmx1eCBleHRlbmRzIEZsdW1tb3gge1xuICAgICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKCk7XG5cbiAgICAgICAgLy8gQ3JlYXRlIGFjdGlvbnMgZmlyc3Qgc28gb3VyIHN0b3JlIGNhbiByZWZlcmVuY2UgdGhlbSBpblxuICAgICAgICAvLyBpdHMgY29uc3RydWN0b3JcbiAgICAgICAgdGhpcy5jcmVhdGVBY3Rpb25zKCdtZXNzYWdlcycsIE1lc3NhZ2VBY3Rpb25zKTtcblxuICAgICAgICAvLyBFeHRyYSBhcmd1bWVudHMgYXJlIHNlbnQgdG8gdGhlIHN0b3JlJ3MgY29uc3RydWN0b3IuIEhlcmUsIHdlJ3JlXG4gICAgICAgIC8vIHBhZGRpbmcgYSByZWZlcmVuY2UgdG8gdGhpcyBmbHV4IGluc3RhbmNlXG4gICAgICAgIHRoaXMuY3JlYXRlU3RvcmUoJ21lc3NhZ2VzJywgTWVzc2FnZVN0b3JlLCB0aGlzKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBBbmQgdGhhdCdzIGl0ISBObyBuZWVkIGZvciBzaW5nbGV0b25zIG9yIGdsb2JhbCByZWZlcmVuY2VzIC0tIGp1c3QgY3JlYXRlXG4gICAgICogYSBuZXcgaW5zdGFuY2UuXG4gICAgICpcbiAgICAgKiBOb3cgbGV0J3MgdGVzdCBpdC5cbiAgICAgKi9cblxuICAgIGl0KCdjcmVhdGVzIG5ldyBtZXNzYWdlcycsICgpID0+IHtcbiAgICAgIGNvbnN0IGZsdXggPSBuZXcgRmx1eCgpO1xuICAgICAgY29uc3QgbWVzc2FnZVN0b3JlID0gZmx1eC5nZXRTdG9yZSgnbWVzc2FnZXMnKTtcbiAgICAgIGNvbnN0IG1lc3NhZ2VBY3Rpb25zID0gZmx1eC5nZXRBY3Rpb25zKCdtZXNzYWdlcycpO1xuXG4gICAgICBleHBlY3QobWVzc2FnZVN0b3JlLnN0YXRlKS50by5kZWVwLmVxdWFsKHt9KTtcblxuICAgICAgbWVzc2FnZUFjdGlvbnMubmV3TWVzc2FnZSgnSGVsbG8sIHdvcmxkIScpO1xuICAgICAgZXhwZWN0KG1lc3NhZ2VTdG9yZS5zdGF0ZSkudG8uZGVlcC5lcXVhbCh7XG4gICAgICAgIFswXToge1xuICAgICAgICAgIGNvbnRlbnQ6ICdIZWxsbywgd29ybGQhJyxcbiAgICAgICAgICBpZDogMCxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9KTtcblxufSk7XG4iXX0=