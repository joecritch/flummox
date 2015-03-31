"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { "default": obj }; };

var TestUtils = _interopRequireWildcard(require("../TestUtils"));

var sinon = _interopRequire(require("sinon"));

describe("TestUtils", function () {
  describe("#simulateAction", function () {
    it("calls the stores handler", function () {
      var store = mockStore();
      var actionFunc = function actionFunc() {};
      actionFunc._id = "actionFunc";

      TestUtils.simulateAction(store, "foo", "foo body");
      TestUtils.simulateAction(store, actionFunc, "actionFunc body");

      expect(store.handler.calledTwice).to.be["true"];

      expect(store.handler.getCall(0).args[0]).to.deep.equal({
        actionId: "foo",
        body: "foo body"
      });

      expect(store.handler.getCall(1).args[0]).to.deep.equal({
        actionId: "actionFunc",
        body: "actionFunc body"
      });
    });
  });

  describe("#simulateActionAsync", function () {
    it("it handles async begin", function () {
      var store = mockStore();

      TestUtils.simulateActionAsync(store, "foo", "begin");

      expect(store.handler.calledOnce).to.be["true"];
      expect(store.handler.firstCall.args[0]).to.deep.equal({
        actionId: "foo",
        async: "begin"
      });
    });

    it("it handles async begin w/ action args", function () {
      var store = mockStore();

      TestUtils.simulateActionAsync(store, "foo", "begin", "arg1", "arg2");

      expect(store.handler.calledOnce).to.be["true"];
      expect(store.handler.firstCall.args[0]).to.deep.equal({
        actionId: "foo",
        async: "begin",
        actionArgs: ["arg1", "arg2"]
      });
    });

    it("it handles async success", function () {
      var store = mockStore();

      TestUtils.simulateActionAsync(store, "foo", "success", { foo: "bar" });

      expect(store.handler.calledOnce).to.be["true"];
      expect(store.handler.firstCall.args[0]).to.deep.equal({
        actionId: "foo",
        async: "success",
        body: {
          foo: "bar"
        }
      });
    });

    it("it handles async failure", function () {
      var store = mockStore();

      TestUtils.simulateActionAsync(store, "foo", "failure", "error message");

      expect(store.handler.calledOnce).to.be["true"];
      expect(store.handler.firstCall.args[0]).to.deep.equal({
        actionId: "foo",
        async: "failure",
        error: "error message"
      });
    });

    it("it throws error with invalid asyncAction", function () {
      var store = mockStore();
      var simulate = function () {
        return TestUtils.simulateActionAsync(store, "foo", "fizbin");
      };

      expect(simulate).to["throw"]("asyncAction must be one of: begin, success or failure");
    });
  });
});

function mockStore() {
  return {
    handler: sinon.spy()
  };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9hZGRvbnMvX190ZXN0c19fL1Rlc3RVdGlscy10ZXN0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztJQUFZLFNBQVMsbUNBQU0sY0FBYzs7SUFDbEMsS0FBSywyQkFBTSxPQUFPOztBQUd6QixRQUFRLENBQUMsV0FBVyxFQUFFLFlBQU07QUFDMUIsVUFBUSxDQUFDLGlCQUFpQixFQUFFLFlBQU07QUFDaEMsTUFBRSxDQUFDLDBCQUEwQixFQUFFLFlBQU07QUFDbkMsVUFBTSxLQUFLLEdBQUcsU0FBUyxFQUFFLENBQUM7QUFDMUIsVUFBTSxVQUFVLEdBQUcsc0JBQVcsRUFBRSxDQUFDO0FBQ2pDLGdCQUFVLENBQUMsR0FBRyxHQUFHLFlBQVksQ0FBQzs7QUFFOUIsZUFBUyxDQUFDLGNBQWMsQ0FBQyxLQUFLLEVBQUUsS0FBSyxFQUFFLFVBQVUsQ0FBQyxDQUFDO0FBQ25ELGVBQVMsQ0FBQyxjQUFjLENBQUMsS0FBSyxFQUFFLFVBQVUsRUFBRSxpQkFBaUIsQ0FBQyxDQUFDOztBQUUvRCxZQUFNLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxRQUFLLENBQUM7O0FBRTdDLFlBQU0sQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQztBQUNyRCxnQkFBUSxFQUFFLEtBQUs7QUFDZixZQUFJLEVBQUUsVUFBVTtPQUNqQixDQUFDLENBQUM7O0FBRUgsWUFBTSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDO0FBQ3JELGdCQUFRLEVBQUUsWUFBWTtBQUN0QixZQUFJLEVBQUUsaUJB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O0FBRUgsTUFBRSxDQUFDLDBDQUEwQyxFQUFFLFlBQU07QUFDbkQsVUFBTSxLQUFLLEdBQUcsU0FBUyxFQUFFLENBQUM7QUFDMUIsVUFBTSxRQUFRLEdBQUc7ZUFBTSxTQUFTLENBQUMsbUJBQW1CLENBQUMsS0FBSyxFQUFFLEtBQUssRUFBRSxRQUFRLENBQUM7T0FBQSxDQUFDOztBQUU3RSxZQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsRUFBRSxTQUFNLENBQUMsdURBQXVELENBQUMsQ0FBQztLQUNwRixDQUFDLENBQUM7R0FDSixDQUFDLENBQUM7Q0FDSixDQUFDLENBQUM7O0FBRUgsU0FBUyxTQUFTLEdBQUc7QUFDbkIsU0FBTztBQUNMLFdBQU8sRUFBRSxLQUFLLENBQUMsR0FBRyxFQUFFO0dBQ3JCLENBQUM7Q0FDSCIsImZpbGUiOiJzcmMvYWRkb25zL19fdGVzdHNfXy9UZXN0VXRpbHMtdGVzdC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIFRlc3RVdGlscyBmcm9tICcuLi9UZXN0VXRpbHMnO1xuaW1wb3J0IHNpbm9uIGZyb20gJ3Npbm9uJztcblxuXG5kZXNjcmliZSgnVGVzdFV0aWxzJywgKCkgPT4ge1xuICBkZXNjcmliZSgnI3NpbXVsYXRlQWN0aW9uJywgKCkgPT4ge1xuICAgIGl0KCdjYWxscyB0aGUgc3RvcmVzIGhhbmRsZXInLCAoKSA9PiB7XG4gICAgICBjb25zdCBzdG9yZSA9IG1vY2tTdG9yZSgpO1xuICAgICAgY29uc3QgYWN0aW9uRnVuYyA9IGZ1bmN0aW9uKCkge307XG4gICAgICBhY3Rpb25GdW5jLl9pZCA9ICdhY3Rpb25GdW5jJztcblxuICAgICAgVGVzdFV0aWxzLnNpbXVsYXRlQWN0aW9uKHN0b3JlLCAnZm9vJywgJ2ZvbyBib2R5Jyk7XG4gICAgICBUZXN0VXRpbHMuc2ltdWxhdGVBY3Rpb24oc3RvcmUsIGFjdGlvbkZ1bmMsICdhY3Rpb25GdW5jIGJvZHknKTtcblxuICAgICAgZXhwZWN0KHN0b3JlLmhhbmRsZXIuY2FsbGVkVHdpY2UpLnRvLmJlLnRydWU7XG5cbiAgICAgIGV4cGVjdChzdG9yZS5oYW5kbGVyLmdldENhbGwoMCkuYXJnc1swXSkudG8uZGVlcC5lcXVhbCh7XG4gICAgICAgIGFjdGlvbklkOiAnZm9vJyxcbiAgICAgICAgYm9keTogJ2ZvbyBib2R5J1xuICAgICAgfSk7XG5cbiAgICAgIGV4cGVjdChzdG9yZS5oYW5kbGVyLmdldENhbGwoMSkuYXJnc1swXSkudG8uZGVlcC5lcXVhbCh7XG4gICAgICAgIGFjdGlvbklkOiAnYWN0aW9uRnVuYycsXG4gICAgICAgIGJvZHk6ICdhY3Rpb25GdW5jIGJvZHknXG4gICAgICB9KTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJyNzaW11bGF0ZUFjdGlvbkFzeW5jJywgKCkgPT4ge1xuICAgIGl0KCdpdCBoYW5kbGVzIGFzeW5jIGJlZ2luJywgKCkgPT4ge1xuICAgICAgY29uc3Qgc3RvcmUgPSBtb2NrU3RvcmUoKTtcblxuICAgICAgVGVzdFV0aWxzLnNpbXVsYXRlQWN0aW9uQXN5bmMoc3RvcmUsICdmb28nLCAnYmVnaW4nKTtcblxuICAgICAgZXhwZWN0KHN0b3JlLmhhbmRsZXIuY2FsbGVkT25jZSkudG8uYmUudHJ1ZTtcbiAgICAgIGV4cGVjdChzdG9yZS5oYW5kbGVyLmZpcnN0Q2FsbC5hcmdzWzBdKS50by5kZWVwLmVxdWFsKHtcbiAgICAgICAgYWN0aW9uSWQ6ICdmb28nLFxuICAgICAgICBhc3luYzogJ2JlZ2luJ1xuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBpdCgnaXQgaGFuZGxlcyBhc3luYyBiZWdpbiB3LyBhY3Rpb24gYXJncycsICgpID0+IHtcbiAgICAgIGNvbnN0IHN0b3JlID0gbW9ja1N0b3JlKCk7XG5cbiAgICAgIFRlc3RVdGlscy5zaW11bGF0ZUFjdGlvbkFzeW5jKHN0b3JlLCAnZm9vJywgJ2JlZ2luJywgJ2FyZzEnLCAnYXJnMicpO1xuXG4gICAgICBleHBlY3Qoc3RvcmUuaGFuZGxlci5jYWxsZWRPbmNlKS50by5iZS50cnVlO1xuICAgICAgZXhwZWN0KHN0b3JlLmhhbmRsZXIuZmlyc3RDYWxsLmFyZ3NbMF0pLnRvLmRlZXAuZXF1YWwoe1xuICAgICAgICBhY3Rpb25JZDogJ2ZvbycsXG4gICAgICAgIGFzeW5jOiAnYmVnaW4nLFxuICAgICAgICBhY3Rpb25BcmdzOiBbJ2FyZzEnLCAnYXJnMiddXG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIGl0KCdpdCBoYW5kbGVzIGFzeW5jIHN1Y2Nlc3MnLCAoKSA9PiB7XG4gICAgICBjb25zdCBzdG9yZSA9IG1vY2tTdG9yZSgpO1xuXG4gICAgICBUZXN0VXRpbHMuc2ltdWxhdGVBY3Rpb25Bc3luYyhzdG9yZSwgJ2ZvbycsICdzdWNjZXNzJywgeyBmb286ICdiYXInIH0pO1xuXG4gICAgICBleHBlY3Qoc3RvcmUuaGFuZGxlci5jYWxsZWRPbmNlKS50by5iZS50cnVlO1xuICAgICAgZXhwZWN0KHN0b3JlLmhhbmRsZXIuZmlyc3RDYWxsLmFyZ3NbMF0pLnRvLmRlZXAuZXF1YWwoe1xuICAgICAgICBhY3Rpb25JZDogJ2ZvbycsXG4gICAgICAgIGFzeW5jOiAnc3VjY2VzcycsXG4gICAgICAgIGJvZHk6IHtcbiAgICAgICAgICBmb286ICdiYXInXG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgaXQoJ2l0IGhhbmRsZXMgYXN5bmMgZmFpbHVyZScsICgpID0+IHtcbiAgICAgIGNvbnN0IHN0b3JlID0gbW9ja1N0b3JlKCk7XG5cbiAgICAgIFRlc3RVdGlscy5zaW11bGF0ZUFjdGlvbkFzeW5jKHN0b3JlLCAnZm9vJywgJ2ZhaWx1cmUnLCAnZXJyb3IgbWVzc2FnZScpO1xuXG4gICAgICBleHBlY3Qoc3RvcmUuaGFuZGxlci5jYWxsZWRPbmNlKS50by5iZS50cnVlO1xuICAgICAgZXhwZWN0KHN0b3JlLmhhbmRsZXIuZmlyc3RDYWxsLmFyZ3NbMF0pLnRvLmRlZXAuZXF1YWwoe1xuICAgICAgICBhY3Rpb25JZDogJ2ZvbycsXG4gICAgICAgIGFzeW5jOiAnZmFpbHVyZScsXG4gICAgICAgIGVycm9yOiAnZXJyb3IgbWVzc2FnZSdcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgaXQoJ2l0IHRocm93cyBlcnJvciB3aXRoIGludmFsaWQgYXN5bmNBY3Rpb24nLCAoKSA9PiB7XG4gICAgICBjb25zdCBzdG9yZSA9IG1vY2tTdG9yZSgpO1xuICAgICAgY29uc3Qgc2ltdWxhdGUgPSAoKSA9PiBUZXN0VXRpbHMuc2ltdWxhdGVBY3Rpb25Bc3luYyhzdG9yZSwgJ2ZvbycsICdmaXpiaW4nKTtcblxuICAgICAgZXhwZWN0KHNpbXVsYXRlKS50by50aHJvdygnYXN5bmNBY3Rpb24gbXVzdCBiZSBvbmUgb2Y6IGJlZ2luLCBzdWNjZXNzIG9yIGZhaWx1cmUnKTtcbiAgICB9KTtcbiAgfSk7XG59KTtcblxuZnVuY3Rpb24gbW9ja1N0b3JlKCkge1xuICByZXR1cm4ge1xuICAgIGhhbmRsZXI6IHNpbm9uLnNweSgpXG4gIH07XG59XG4iXX0=