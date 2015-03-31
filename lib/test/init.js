"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var chai = _interopRequire(require("chai"));

global.expect = chai.expect;

var chaiAsPromised = _interopRequire(require("chai-as-promised"));

chai.use(chaiAsPromised);

var Promise = require("es6-promise").Promise;

if (!global.Promise) global.Promise = Promise;

require("babel-runtime/regenerator/runtime");

var _jsdom = require("jsdom").jsdom;

global.document = _jsdom("<!doctype html><html><body></body></html>");
global.window = document.defaultView;
global.navigator = window.navigator;