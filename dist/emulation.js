'use strict';

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var FullscreenEmulationManager = function () {
  function FullscreenEmulationManager(chromy, model) {
    (0, _classCallCheck3.default)(this, FullscreenEmulationManager);

    this._chromy = chromy;
    this._client = chromy.client;
    this._model = model;
    this.browserInfo = null;
  }

  (0, _createClass3.default)(FullscreenEmulationManager, [{
    key: 'init',
    value: function init() {
      var width, height, info, DOM, _ref, documentNodeId, _ref2, bodyNodeId, box;

      return _regenerator2.default.async(function init$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              width = 0;
              height = 0;
              _context.next = 4;
              return _regenerator2.default.awrap(this._chromy.evaluate(function () {
                return {
                  devicePixelRatio: window.devicePixelRatio,
                  width: document.body.scrollWidth,
                  height: document.body.scrollHeight,
                  viewportWidth: window.innerWidth,
                  viewportHeight: window.innerHeight
                };
              }));

            case 4:
              info = _context.sent;

              this.browserInfo = info;

              if (!(this._model === 'box')) {
                _context.next = 23;
                break;
              }

              DOM = this._client.DOM;
              _context.next = 10;
              return _regenerator2.default.awrap(DOM.getDocument());

            case 10:
              _ref = _context.sent;
              documentNodeId = _ref.root.nodeId;
              _context.next = 14;
              return _regenerator2.default.awrap(DOM.querySelector({
                selector: 'body',
                nodeId: documentNodeId
              }));

            case 14:
              _ref2 = _context.sent;
              bodyNodeId = _ref2.nodeId;
              _context.next = 18;
              return _regenerator2.default.awrap(DOM.getBoxModel({ nodeId: bodyNodeId }));

            case 18:
              box = _context.sent;

              width = box.model.width;
              height = box.model.height;
              _context.next = 25;
              break;

            case 23:
              width = info.width;
              height = info.height;

            case 25:
              this._deviceMetrics = {
                width: width,
                height: height,
                deviceScaleFactor: 0,
                mobile: false,
                fitWindow: false
              };
              if (this._chromy._chromeVersion >= 61) {
                this._deviceMetrics.deviceScaleFactor = info.devicePixelRatio;
              }

            case 27:
            case 'end':
              return _context.stop();
          }
        }
      }, null, this);
    }
  }, {
    key: 'emulate',
    value: function emulate() {
      var m;
      return _regenerator2.default.async(function emulate$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              m = this._deviceMetrics;

              if (!(this._chromy._chromeVersion < 61)) {
                _context2.next = 8;
                break;
              }

              _context2.next = 4;
              return _regenerator2.default.awrap(this._client.Emulation.setVisibleSize({ width: m.width, height: m.height }));

            case 4:
              _context2.next = 6;
              return _regenerator2.default.awrap(this._client.Emulation.forceViewport({ x: 0, y: 0, scale: 1 }));

            case 6:
              _context2.next = 10;
              break;

            case 8:
              _context2.next = 10;
              return _regenerator2.default.awrap(this._client.Emulation.resetPageScaleFactor());

            case 10:
              _context2.next = 12;
              return _regenerator2.default.awrap(this._client.Emulation.setDeviceMetricsOverride(m));

            case 12:
              _context2.next = 14;
              return _regenerator2.default.awrap(this._chromy.scrollTo(0, 0));

            case 14:
              _context2.next = 16;
              return _regenerator2.default.awrap(this._chromy.sleep(200));

            case 16:
            case 'end':
              return _context2.stop();
          }
        }
      }, null, this);
    }
  }, {
    key: 'reset',
    value: function reset() {
      var info;
      return _regenerator2.default.async(function reset$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              info = this.browserInfo;

              if (!(this._chromy._chromeVersion < 61)) {
                _context3.next = 10;
                break;
              }

              _context3.next = 4;
              return _regenerator2.default.awrap(this._client.Emulation.resetViewport());

            case 4:
              _context3.next = 6;
              return _regenerator2.default.awrap(this._client.Emulation.clearDeviceMetricsOverride());

            case 6:
              _context3.next = 8;
              return _regenerator2.default.awrap(this._client.Emulation.setVisibleSize({ width: info.viewportWidth, height: info.viewportHeight }));

            case 8:
              _context3.next = 12;
              break;

            case 10:
              _context3.next = 12;
              return _regenerator2.default.awrap(this._client.Emulation.clearDeviceMetricsOverride());

            case 12:
            case 'end':
              return _context3.stop();
          }
        }
      }, null, this);
    }
  }]);
  return FullscreenEmulationManager;
}();

function createFullscreenEmulationManager(chromy, model) {
  var manager;
  return _regenerator2.default.async(function createFullscreenEmulationManager$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          manager = new FullscreenEmulationManager(chromy, model);
          _context4.next = 3;
          return _regenerator2.default.awrap(manager.init());

        case 3:
          return _context4.abrupt('return', manager);

        case 4:
        case 'end':
          return _context4.stop();
      }
    }
  }, null, this);
}

exports.createFullscreenEmulationManager = createFullscreenEmulationManager;
//# sourceMappingURL=emulation.js.map