'use strict';

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var fs = require('fs');

var CDP = require('chrome-remote-interface');
var uuidV4 = require('uuid/v4');
var devices = require('./devices');

var _require = require('./emulation'),
    createFullscreenEmulationManager = _require.createFullscreenEmulationManager;

var Document = require('./document');

var _require2 = require('./error'),
    TimeoutError = _require2.TimeoutError,
    GotoTimeoutError = _require2.GotoTimeoutError;

var _require3 = require('./util'),
    createChromeLauncher = _require3.createChromeLauncher,
    completeUrl = _require3.completeUrl;

var instances = [];
var instanceId = 1;

function makeSendToChromy(uuid) {
  return '\n  function () {\n    console.info(\'' + uuid + ':\' + JSON.stringify(arguments))\n  }\n  ';
}

function defaultTargetFunction(targets) {
  return targets.filter(function (t) {
    return t.type === 'page';
  }).shift();
}

var Chromy = function (_Document) {
  (0, _inherits3.default)(Chromy, _Document);

  function Chromy() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    (0, _classCallCheck3.default)(this, Chromy);

    var _this = (0, _possibleConstructorReturn3.default)(this, (Chromy.__proto__ || Object.getPrototypeOf(Chromy)).call(this, null, null, null));

    var defaults = {
      host: 'localhost',
      port: 9222,
      launchBrowser: true,
      userDataDir: null,
      chromeFlags: [],
      chromePath: null,
      activateOnStartUp: true,
      waitTimeout: 30000,
      gotoTimeout: 30000,
      loadTimeout: 30000,
      evaluateTimeout: 30000,
      waitFunctionPollingInterval: 100,
      typeInterval: 20,
      target: defaultTargetFunction
    };
    _this.options = Object.assign({}, defaults, options);
    _this.cdpOptions = {
      host: _this.options.host,
      port: _this.options.port,
      target: _this.options.target
    };
    _this.client = null;
    _this.launcher = null;
    _this.messagePrefix = null;
    _this.emulateMode = false;
    _this.currentEmulateDeviceName = null;
    _this.userAgentBeforeEmulate = null;
    _this.instanceId = instanceId++;
    return _this;
  }

  (0, _createClass3.default)(Chromy, [{
    key: 'start',
    value: function start() {
      var _this2 = this;

      var startingUrl = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
      return _regenerator2.default.async(function start$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              if (startingUrl === null) {
                startingUrl = 'about:blank';
              }

              if (!(this.client !== null)) {
                _context2.next = 3;
                break;
              }

              return _context2.abrupt('return');

            case 3:
              if (!this.options.launchBrowser) {
                _context2.next = 10;
                break;
              }

              if (this.launcher === null) {
                this.launcher = createChromeLauncher(completeUrl(startingUrl), this.options);
              }
              _context2.next = 7;
              return _regenerator2.default.awrap(this.launcher.launch());

            case 7:
              if (this.launcher.pid) {
                _context2.next = 9;
                break;
              }

              throw new Error('Failed to launch a browser.');

            case 9:
              instances.push(this);

            case 10:
              _context2.next = 12;
              return _regenerator2.default.awrap(new Promise(function (resolve, reject) {
                CDP(_this2.cdpOptions, function _callee(client) {
                  var DOM, Network, Page, Runtime, Console, targetId;
                  return _regenerator2.default.async(function _callee$(_context) {
                    while (1) {
                      switch (_context.prev = _context.next) {
                        case 0:
                          _context.prev = 0;

                          _this2.client = client;
                          DOM = client.DOM, Network = client.Network, Page = client.Page, Runtime = client.Runtime, Console = client.Console;
                          _context.next = 5;
                          return _regenerator2.default.awrap(Promise.all([DOM.enable(), Network.enable(), Page.enable(), Runtime.enable(), Console.enable()]));

                        case 5:
                          _context.next = 7;
                          return _regenerator2.default.awrap(_this2._cacheChromeVersion());

                        case 7:
                          if (!_this2.options.activateOnStartUp) {
                            _context.next = 13;
                            break;
                          }

                          _context.next = 10;
                          return _regenerator2.default.awrap(_this2._getTargetIdFromOption());

                        case 10:
                          targetId = _context.sent;
                          _context.next = 13;
                          return _regenerator2.default.awrap(_this2.client.Target.activateTarget({ targetId: targetId }));

                        case 13:
                          if (!('userAgent' in _this2.options)) {
                            _context.next = 16;
                            break;
                          }

                          _context.next = 16;
                          return _regenerator2.default.awrap(_this2.userAgent(_this2.options.userAgent));

                        case 16:
                          if (!('headers' in _this2.options)) {
                            _context.next = 19;
                            break;
                          }

                          _context.next = 19;
                          return _regenerator2.default.awrap(_this2.headers(_this2.options.headers));

                        case 19:
                          _this2._activateOnDocumentUpdatedListener();
                          resolve(_this2);
                          _context.next = 26;
                          break;

                        case 23:
                          _context.prev = 23;
                          _context.t0 = _context['catch'](0);

                          reject(_context.t0);

                        case 26:
                        case 'end':
                          return _context.stop();
                      }
                    }
                  }, null, _this2, [[0, 23]]);
                }).on('error', function (err) {
                  reject(err);
                });
              }).catch(function (e) {
                throw e;
              }));

            case 12:
            case 'end':
              return _context2.stop();
          }
        }
      }, null, this);
    }
  }, {
    key: '_getTargetIdFromOption',
    value: function _getTargetIdFromOption() {
      var result, page;
      return _regenerator2.default.async(function _getTargetIdFromOption$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              if (!(typeof this.options.target === 'function')) {
                _context3.next = 8;
                break;
              }

              _context3.next = 3;
              return _regenerator2.default.awrap(this.client.Target.getTargets());

            case 3:
              result = _context3.sent;
              page = this.options.target(result.targetInfos);
              return _context3.abrupt('return', page.targetId);

            case 8:
              if (!((0, _typeof3.default)(this.options.target) === 'object')) {
                _context3.next = 12;
                break;
              }

              return _context3.abrupt('return', this.options.target.targetId);

            case 12:
              if (!(typeof this.options.target === 'string')) {
                _context3.next = 16;
                break;
              }

              return _context3.abrupt('return', this.options.target);

            case 16:
              throw new Error('type of `target` option is invalid.');

            case 17:
            case 'end':
              return _context3.stop();
          }
        }
      }, null, this);
    }
  }, {
    key: 'close',
    value: function close() {
      var _this3 = this;

      return _regenerator2.default.async(function close$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              if (!(this.client === null)) {
                _context4.next = 2;
                break;
              }

              return _context4.abrupt('return', false);

            case 2:
              _context4.next = 4;
              return _regenerator2.default.awrap(this.client.close());

            case 4:
              this.client = null;

              if (!(this.launcher !== null)) {
                _context4.next = 9;
                break;
              }

              _context4.next = 8;
              return _regenerator2.default.awrap(this.launcher.kill());

            case 8:
              this.launcher = null;

            case 9:
              instances = instances.filter(function (i) {
                return i.instanceId !== _this3.instanceId;
              });
              return _context4.abrupt('return', true);

            case 11:
            case 'end':
              return _context4.stop();
          }
        }
      }, null, this);
    }
  }, {
    key: 'getPageTargets',
    value: function getPageTargets() {
      var result;
      return _regenerator2.default.async(function getPageTargets$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              _context5.next = 2;
              return _regenerator2.default.awrap(this.client.Target.getTargets());

            case 2:
              result = _context5.sent;
              return _context5.abrupt('return', result.targetInfos.filter(function (t) {
                return t.type === 'page';
              }));

            case 4:
            case 'end':
              return _context5.stop();
          }
        }
      }, null, this);
    }
  }, {
    key: 'userAgent',
    value: function userAgent(ua) {
      return _regenerator2.default.async(function userAgent$(_context6) {
        while (1) {
          switch (_context6.prev = _context6.next) {
            case 0:
              _context6.next = 2;
              return _regenerator2.default.awrap(this._checkStart());

            case 2:
              _context6.next = 4;
              return _regenerator2.default.awrap(this.client.Network.setUserAgentOverride({ 'userAgent': ua }));

            case 4:
              return _context6.abrupt('return', _context6.sent);

            case 5:
            case 'end':
              return _context6.stop();
          }
        }
      }, null, this);
    }

    /**
     * Example:
     * chromy.headers({'X-Requested-By': 'foo'})
     */

  }, {
    key: 'headers',
    value: function headers(_headers) {
      return _regenerator2.default.async(function headers$(_context7) {
        while (1) {
          switch (_context7.prev = _context7.next) {
            case 0:
              _context7.next = 2;
              return _regenerator2.default.awrap(this._checkStart());

            case 2:
              _context7.next = 4;
              return _regenerator2.default.awrap(this.client.Network.setExtraHTTPHeaders({ 'headers': _headers }));

            case 4:
              return _context7.abrupt('return', _context7.sent);

            case 5:
            case 'end':
              return _context7.stop();
          }
        }
      }, null, this);
    }
  }, {
    key: 'console',
    value: function (_console) {
      function console(_x) {
        return _console.apply(this, arguments);
      }

      console.toString = function () {
        return _console.toString();
      };

      return console;
    }(function _callee2(callback) {
      var _this4 = this;

      return _regenerator2.default.async(function _callee2$(_context8) {
        while (1) {
          switch (_context8.prev = _context8.next) {
            case 0:
              _context8.next = 2;
              return _regenerator2.default.awrap(this._checkStart());

            case 2:
              this.client.Console.messageAdded(function (payload) {
                try {
                  var msg = payload.message.text;
                  var pre = _this4.messagePrefix;
                  if (typeof msg !== 'undefined') {
                    if (pre === null || msg.substring(0, pre.length + 1) !== pre + ':') {
                      callback.apply(_this4, [msg, payload.message]);
                    }
                  }
                } catch (e) {
                  console.warn(e);
                }
              });

            case 3:
            case 'end':
              return _context8.stop();
          }
        }
      }, null, this);
    })
  }, {
    key: 'receiveMessage',
    value: function receiveMessage(callback) {
      var _this5 = this;

      var uuid, f;
      return _regenerator2.default.async(function receiveMessage$(_context9) {
        while (1) {
          switch (_context9.prev = _context9.next) {
            case 0:
              _context9.next = 2;
              return _regenerator2.default.awrap(this._checkStart());

            case 2:
              uuid = uuidV4();

              this.messagePrefix = uuid;
              f = makeSendToChromy(this.messagePrefix);

              this.defineFunction({ sendToChromy: f });
              this.client.Console.messageAdded(function (payload) {
                try {
                  var msg = payload.message.text;
                  if (msg && msg.substring(0, uuid.length + 1) === uuid + ':') {
                    var data = JSON.parse(msg.substring(uuid.length + 1));
                    callback.apply(_this5, [data]);
                  }
                } catch (e) {
                  console.warn(e);
                }
              });

            case 7:
            case 'end':
              return _context9.stop();
          }
        }
      }, null, this);
    }
  }, {
    key: 'goto',
    value: function goto(url, options) {
      var _this6 = this;

      var defaultOptions;
      return _regenerator2.default.async(function goto$(_context11) {
        while (1) {
          switch (_context11.prev = _context11.next) {
            case 0:
              defaultOptions = {
                waitLoadEvent: true
              };

              options = Object.assign({}, defaultOptions, options);
              _context11.next = 4;
              return _regenerator2.default.awrap(this._checkStart(url));

            case 4:
              _context11.prev = 4;
              _context11.next = 7;
              return _regenerator2.default.awrap(this._waitFinish(this.options.gotoTimeout, function _callee3() {
                return _regenerator2.default.async(function _callee3$(_context10) {
                  while (1) {
                    switch (_context10.prev = _context10.next) {
                      case 0:
                        _context10.next = 2;
                        return _regenerator2.default.awrap(_this6.client.Page.navigate({ url: completeUrl(url) }));

                      case 2:
                        if (!options.waitLoadEvent) {
                          _context10.next = 5;
                          break;
                        }

                        _context10.next = 5;
                        return _regenerator2.default.awrap(_this6.client.Page.loadEventFired());

                      case 5:
                      case 'end':
                        return _context10.stop();
                    }
                  }
                }, null, _this6);
              }));

            case 7:
              _context11.next = 16;
              break;

            case 9:
              _context11.prev = 9;
              _context11.t0 = _context11['catch'](4);

              if (!(_context11.t0 instanceof TimeoutError)) {
                _context11.next = 15;
                break;
              }

              throw new GotoTimeoutError('goto() timeout');

            case 15:
              throw _context11.t0;

            case 16:
            case 'end':
              return _context11.stop();
          }
        }
      }, null, this, [[4, 9]]);
    }
  }, {
    key: 'waitLoadEvent',
    value: function waitLoadEvent() {
      var _this7 = this;

      return _regenerator2.default.async(function waitLoadEvent$(_context13) {
        while (1) {
          switch (_context13.prev = _context13.next) {
            case 0:
              _context13.next = 2;
              return _regenerator2.default.awrap(this._waitFinish(this.options.loadTimeout, function _callee4() {
                return _regenerator2.default.async(function _callee4$(_context12) {
                  while (1) {
                    switch (_context12.prev = _context12.next) {
                      case 0:
                        _context12.next = 2;
                        return _regenerator2.default.awrap(_this7.client.Page.loadEventFired());

                      case 2:
                      case 'end':
                        return _context12.stop();
                    }
                  }
                }, null, _this7);
              }));

            case 2:
            case 'end':
              return _context13.stop();
          }
        }
      }, null, this);
    }
  }, {
    key: 'forward',
    value: function forward() {
      var f, promise;
      return _regenerator2.default.async(function forward$(_context14) {
        while (1) {
          switch (_context14.prev = _context14.next) {
            case 0:
              f = 'window.history.forward()';
              promise = this.waitLoadEvent();
              _context14.next = 4;
              return _regenerator2.default.awrap(this.client.Runtime.evaluate({ expression: f }));

            case 4:
              _context14.next = 6;
              return _regenerator2.default.awrap(promise);

            case 6:
            case 'end':
              return _context14.stop();
          }
        }
      }, null, this);
    }
  }, {
    key: 'back',
    value: function back() {
      var f, promise;
      return _regenerator2.default.async(function back$(_context15) {
        while (1) {
          switch (_context15.prev = _context15.next) {
            case 0:
              f = 'window.history.back()';
              promise = this.waitLoadEvent();
              _context15.next = 4;
              return _regenerator2.default.awrap(this.client.Runtime.evaluate({ expression: f }));

            case 4:
              _context15.next = 6;
              return _regenerator2.default.awrap(promise);

            case 6:
            case 'end':
              return _context15.stop();
          }
        }
      }, null, this);
    }
  }, {
    key: 'reload',
    value: function reload(ignoreCache, scriptToEvaluateOnLoad) {
      return _regenerator2.default.async(function reload$(_context16) {
        while (1) {
          switch (_context16.prev = _context16.next) {
            case 0:
              _context16.next = 2;
              return _regenerator2.default.awrap(this.client.Page.reload({ ignoreCache: ignoreCache, scriptToEvaluateOnLoad: scriptToEvaluateOnLoad }));

            case 2:
            case 'end':
              return _context16.stop();
          }
        }
      }, null, this);
    }

    /**
     * define function
     *
     * @param func {(function|string|Array.<function>|Array.<string>)}
     * @returns {Promise.<void>}
     */

  }, {
    key: 'defineFunction',
    value: function defineFunction(def) {
      var funcs, i, f;
      return _regenerator2.default.async(function defineFunction$(_context17) {
        while (1) {
          switch (_context17.prev = _context17.next) {
            case 0:
              funcs = [];

              if (Array.isArray(def)) {
                funcs = def;
              } else if ((typeof def === 'undefined' ? 'undefined' : (0, _typeof3.default)(def)) === 'object') {
                funcs = this._moduleToFunctionSources(def);
              } else {
                funcs.push(def);
              }
              i = 0;

            case 3:
              if (!(i < funcs.length)) {
                _context17.next = 11;
                break;
              }

              f = funcs[i];

              if (typeof f === 'function') {
                f = f.toString();
              }
              _context17.next = 8;
              return _regenerator2.default.awrap(this.client.Runtime.evaluate({ expression: f }));

            case 8:
              i++;
              _context17.next = 3;
              break;

            case 11:
            case 'end':
              return _context17.stop();
          }
        }
      }, null, this);
    }
  }, {
    key: '_moduleToFunctionSources',
    value: function _moduleToFunctionSources(module) {
      var result = [];
      for (var funcName in module) {
        var func = module[funcName];
        var src = ('function ' + funcName + ' () { return (' + func.toString() + ')(...arguments) }').trim();
        result.push(src);
      }
      return result;
    }
  }, {
    key: 'type',
    value: function type(expr, value) {
      var characters, i, c;
      return _regenerator2.default.async(function type$(_context18) {
        while (1) {
          switch (_context18.prev = _context18.next) {
            case 0:
              _context18.next = 2;
              return _regenerator2.default.awrap(this.evaluate('document.querySelector("' + expr + '").focus()'));

            case 2:
              characters = value.split('');
              _context18.t0 = _regenerator2.default.keys(characters);

            case 4:
              if ((_context18.t1 = _context18.t0()).done) {
                _context18.next = 13;
                break;
              }

              i = _context18.t1.value;
              c = characters[i];
              _context18.next = 9;
              return _regenerator2.default.awrap(this.client.Input.dispatchKeyEvent({ type: 'char', text: c }));

            case 9:
              _context18.next = 11;
              return _regenerator2.default.awrap(this.sleep(this.options.typeInterval));

            case 11:
              _context18.next = 4;
              break;

            case 13:
            case 'end':
              return _context18.stop();
          }
        }
      }, null, this);
    }
  }, {
    key: 'mouseMoved',
    value: function mouseMoved(x, y) {
      var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      var opts;
      return _regenerator2.default.async(function mouseMoved$(_context19) {
        while (1) {
          switch (_context19.prev = _context19.next) {
            case 0:
              opts = Object.assign({ type: 'mouseMoved', x: x, y: y }, options);
              _context19.next = 3;
              return _regenerator2.default.awrap(this.client.Input.dispatchMouseEvent(opts));

            case 3:
            case 'end':
              return _context19.stop();
          }
        }
      }, null, this);
    }
  }, {
    key: 'mousePressed',
    value: function mousePressed(x, y) {
      var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      var opts;
      return _regenerator2.default.async(function mousePressed$(_context20) {
        while (1) {
          switch (_context20.prev = _context20.next) {
            case 0:
              opts = Object.assign({ type: 'mousePressed', x: x, y: y, button: 'left' }, options);
              _context20.next = 3;
              return _regenerator2.default.awrap(this.client.Input.dispatchMouseEvent(opts));

            case 3:
            case 'end':
              return _context20.stop();
          }
        }
      }, null, this);
    }
  }, {
    key: 'mouseReleased',
    value: function mouseReleased(x, y) {
      var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      var opts;
      return _regenerator2.default.async(function mouseReleased$(_context21) {
        while (1) {
          switch (_context21.prev = _context21.next) {
            case 0:
              opts = Object.assign({ type: 'mouseReleased', x: x, y: y, button: 'left' }, options);
              _context21.next = 3;
              return _regenerator2.default.awrap(this.client.Input.dispatchMouseEvent(opts));

            case 3:
            case 'end':
              return _context21.stop();
          }
        }
      }, null, this);
    }
  }, {
    key: 'tap',
    value: function tap(x, y) {
      var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      var time, opts;
      return _regenerator2.default.async(function tap$(_context22) {
        while (1) {
          switch (_context22.prev = _context22.next) {
            case 0:
              time = Date.now() / 1000;
              opts = Object.assign({ x: x, y: y, timestamp: time, button: 'left' }, options);
              _context22.next = 4;
              return _regenerator2.default.awrap(this.client.Input.synthesizeTapGesture(opts));

            case 4:
            case 'end':
              return _context22.stop();
          }
        }
      }, null, this);
    }
  }, {
    key: 'doubleTap',
    value: function doubleTap(x, y) {
      var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      var time, opts;
      return _regenerator2.default.async(function doubleTap$(_context23) {
        while (1) {
          switch (_context23.prev = _context23.next) {
            case 0:
              time = Date.now() / 1000;
              opts = Object.assign({ x: x, y: y, timestamp: time, button: 'left', tapCount: 2 }, options);
              _context23.next = 4;
              return _regenerator2.default.awrap(this.client.Input.synthesizeTapGesture(opts));

            case 4:
            case 'end':
              return _context23.stop();
          }
        }
      }, null, this);
    }
  }, {
    key: 'setFile',
    value: function setFile(selector, files) {
      var paramFiles, _ref, root, _ref2, fileNodeId;

      return _regenerator2.default.async(function setFile$(_context24) {
        while (1) {
          switch (_context24.prev = _context24.next) {
            case 0:
              paramFiles = files;

              if (typeof files === 'string') {
                paramFiles = [files];
              }

              if (!(paramFiles.length === 0)) {
                _context24.next = 4;
                break;
              }

              return _context24.abrupt('return');

            case 4:
              _context24.next = 6;
              return _regenerator2.default.awrap(this.client.DOM.getDocument());

            case 6:
              _ref = _context24.sent;
              root = _ref.root;
              _context24.next = 10;
              return _regenerator2.default.awrap(this.client.DOM.querySelector({
                nodeId: root.nodeId,
                selector: selector
              }));

            case 10:
              _ref2 = _context24.sent;
              fileNodeId = _ref2.nodeId;

              if (fileNodeId) {
                _context24.next = 14;
                break;
              }

              return _context24.abrupt('return');

            case 14:
              _context24.next = 16;
              return _regenerator2.default.awrap(this.client.DOM.setFileInputFiles({
                nodeId: fileNodeId,
                files: paramFiles
              }));

            case 16:
            case 'end':
              return _context24.stop();
          }
        }
      }, null, this);
    }
  }, {
    key: 'screenshot',
    value: function screenshot() {
      var format = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'png';
      var quality = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
      var fromSurface = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      var opts, params, captureParams, _ref3, data, image;

      return _regenerator2.default.async(function screenshot$(_context25) {
        while (1) {
          switch (_context25.prev = _context25.next) {
            case 0:
              opts = {
                format: 'png',
                fromSurface: true
              };

              if (typeof format === 'string') {
                // deprecated arguments style
                params = {
                  format: format,
                  quality: quality,
                  fromSurface: fromSurface
                };

                opts = Object.assign({}, opts, params);
              } else if ((typeof format === 'undefined' ? 'undefined' : (0, _typeof3.default)(format)) === 'object') {
                opts = Object.assign({}, opts, format);
              }

              if (!(['png', 'jpeg'].indexOf(opts.format) === -1)) {
                _context25.next = 4;
                break;
              }

              throw new Error('format is invalid.');

            case 4:
              captureParams = Object.assign({}, opts);
              _context25.next = 7;
              return _regenerator2.default.awrap(this.client.Page.captureScreenshot(captureParams));

            case 7:
              _ref3 = _context25.sent;
              data = _ref3.data;
              image = Buffer.from(data, 'base64');
              return _context25.abrupt('return', image);

            case 11:
            case 'end':
              return _context25.stop();
          }
        }
      }, null, this);
    }

    /*
     * Limitation:
     * maximum height is 16384px because of chrome's bug from Skia library.
     * https://groups.google.com/a/chromium.org/d/msg/headless-dev/DqaAEXyzvR0/kUTEqNYiDQAJ
     * https://stackoverflow.com/questions/44599858/max-height-of-16-384px-for-headless-chrome-screenshots
     */

  }, {
    key: 'screenshotDocument',
    value: function screenshotDocument() {
      var model = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'scroll';
      var format = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'png';
      var quality = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined;
      var fromSurface = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;
      var opts, params, emulation, result, screenshotParams;
      return _regenerator2.default.async(function screenshotDocument$(_context26) {
        while (1) {
          switch (_context26.prev = _context26.next) {
            case 0:
              opts = {
                model: 'scroll',
                format: 'png',
                fromSurface: true,
                useDeviceResolution: false
              };

              if (typeof model === 'string') {
                params = {
                  model: model,
                  format: format,
                  quality: quality,
                  fromSurface: fromSurface
                };

                opts = Object.assign({}, opts, params);
              } else if ((typeof model === 'undefined' ? 'undefined' : (0, _typeof3.default)(model)) === 'object') {
                opts = Object.assign({}, opts, model);
              }
              _context26.next = 4;
              return _regenerator2.default.awrap(createFullscreenEmulationManager(this, opts.model));

            case 4:
              emulation = _context26.sent;
              result = null;
              _context26.prev = 6;
              _context26.next = 9;
              return _regenerator2.default.awrap(emulation.emulate());

            case 9:
              screenshotParams = Object.assign({}, opts);

              delete screenshotParams.model;
              _context26.next = 13;
              return _regenerator2.default.awrap(this.screenshot(screenshotParams));

            case 13:
              result = _context26.sent;

            case 14:
              _context26.prev = 14;
              _context26.next = 17;
              return _regenerator2.default.awrap(emulation.reset());

            case 17:
              if (!(this.currentEmulateDeviceName !== null)) {
                _context26.next = 20;
                break;
              }

              _context26.next = 20;
              return _regenerator2.default.awrap(this.emulate(this.currentEmulateDeviceName));

            case 20:
              return _context26.finish(14);

            case 21:
              return _context26.abrupt('return', result);

            case 22:
            case 'end':
              return _context26.stop();
          }
        }
      }, null, this, [[6,, 14, 21]]);
    }
  }, {
    key: 'pdf',
    value: function pdf() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      var _ref4, data;

      return _regenerator2.default.async(function pdf$(_context27) {
        while (1) {
          switch (_context27.prev = _context27.next) {
            case 0:
              _context27.next = 2;
              return _regenerator2.default.awrap(this.client.Page.printToPDF(options));

            case 2:
              _ref4 = _context27.sent;
              data = _ref4.data;
              return _context27.abrupt('return', Buffer.from(data, 'base64'));

            case 5:
            case 'end':
              return _context27.stop();
          }
        }
      }, null, this);
    }
  }, {
    key: 'startScreencast',
    value: function startScreencast(callback) {
      var _this8 = this;

      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      return _regenerator2.default.async(function startScreencast$(_context29) {
        while (1) {
          switch (_context29.prev = _context29.next) {
            case 0:
              _context29.next = 2;
              return _regenerator2.default.awrap(this.client.Page.screencastFrame(function _callee5(payload) {
                return _regenerator2.default.async(function _callee5$(_context28) {
                  while (1) {
                    switch (_context28.prev = _context28.next) {
                      case 0:
                        _context28.next = 2;
                        return _regenerator2.default.awrap(callback.apply(_this8, [payload]));

                      case 2:
                        _context28.next = 4;
                        return _regenerator2.default.awrap(_this8.client.Page.screencastFrameAck({ sessionId: payload.sessionId }));

                      case 4:
                      case 'end':
                        return _context28.stop();
                    }
                  }
                }, null, _this8);
              }));

            case 2:
              _context29.next = 4;
              return _regenerator2.default.awrap(this.client.Page.startScreencast(options));

            case 4:
            case 'end':
              return _context29.stop();
          }
        }
      }, null, this);
    }
  }, {
    key: 'stopScreencast',
    value: function stopScreencast() {
      return _regenerator2.default.async(function stopScreencast$(_context30) {
        while (1) {
          switch (_context30.prev = _context30.next) {
            case 0:
              _context30.next = 2;
              return _regenerator2.default.awrap(this.client.Page.stopScreencast());

            case 2:
            case 'end':
              return _context30.stop();
          }
        }
      }, null, this);
    }

    // deprecated since 0.3.4

  }, {
    key: 'requestWillBeSent',
    value: function requestWillBeSent(callback) {
      return _regenerator2.default.async(function requestWillBeSent$(_context31) {
        while (1) {
          switch (_context31.prev = _context31.next) {
            case 0:
              _context31.next = 2;
              return _regenerator2.default.awrap(this._checkStart());

            case 2:
              _context31.next = 4;
              return _regenerator2.default.awrap(this.client.Network.requestWillBeSent(callback));

            case 4:
            case 'end':
              return _context31.stop();
          }
        }
      }, null, this);
    }
  }, {
    key: 'on',
    value: function on(event, callback) {
      return _regenerator2.default.async(function on$(_context32) {
        while (1) {
          switch (_context32.prev = _context32.next) {
            case 0:
              _context32.next = 2;
              return _regenerator2.default.awrap(this._checkStart());

            case 2:
              this.client.on(event, callback);

            case 3:
            case 'end':
              return _context32.stop();
          }
        }
      }, null, this);
    }
  }, {
    key: 'once',
    value: function once(event, callback) {
      return _regenerator2.default.async(function once$(_context33) {
        while (1) {
          switch (_context33.prev = _context33.next) {
            case 0:
              _context33.next = 2;
              return _regenerator2.default.awrap(this._checkStart());

            case 2:
              this.client.once(event, callback);

            case 3:
            case 'end':
              return _context33.stop();
          }
        }
      }, null, this);
    }
  }, {
    key: 'removeListener',
    value: function removeListener(event, callback) {
      return _regenerator2.default.async(function removeListener$(_context34) {
        while (1) {
          switch (_context34.prev = _context34.next) {
            case 0:
              _context34.next = 2;
              return _regenerator2.default.awrap(this._checkStart());

            case 2:
              this.client.removeListener(event, callback);

            case 3:
            case 'end':
              return _context34.stop();
          }
        }
      }, null, this);
    }
  }, {
    key: 'removeAllListeners',
    value: function removeAllListeners(event) {
      return _regenerator2.default.async(function removeAllListeners$(_context35) {
        while (1) {
          switch (_context35.prev = _context35.next) {
            case 0:
              _context35.next = 2;
              return _regenerator2.default.awrap(this._checkStart());

            case 2:
              this.client.removeAllListeners(event);

            case 3:
            case 'end':
              return _context35.stop();
          }
        }
      }, null, this);
    }
  }, {
    key: 'inject',
    value: function inject(type, file) {
      var data, script, expr, style, _expr;

      return _regenerator2.default.async(function inject$(_context36) {
        while (1) {
          switch (_context36.prev = _context36.next) {
            case 0:
              _context36.next = 2;
              return _regenerator2.default.awrap(new Promise(function (resolve, reject) {
                fs.readFile(file, { encoding: 'utf-8' }, function (err, data) {
                  if (err) reject(err);
                  resolve(data);
                });
              }).catch(function (e) {
                throw e;
              }));

            case 2:
              data = _context36.sent;

              if (!(type === 'js')) {
                _context36.next = 9;
                break;
              }

              script = data.replace(/\\/g, '\\\\').replace(/'/g, '\\\'').replace(/(\r|\n)/g, '\\n');
              expr = '\n      {\n         let script = document.createElement(\'script\')\n         script.type = \'text/javascript\'\n         script.innerHTML = \'' + script + '\'\n         document.body.appendChild(script)\n      }\n      ';
              return _context36.abrupt('return', this.evaluate(expr));

            case 9:
              if (!(type === 'css')) {
                _context36.next = 15;
                break;
              }

              style = data.replace(/`/g, '\\`').replace(/\\/g, '\\\\'); // .replace(/(\r|\n)/g, ' ')

              _expr = '\n      {\n         let style = document.createElement(\'style\')\n         style.type = \'text/css\'\n         style.innerText = `\n        ' + style + '\n        `\n         document.head.appendChild(style)\n      }\n      ';
              return _context36.abrupt('return', this.evaluate(_expr));

            case 15:
              throw new Error('found invalid type.');

            case 16:
            case 'end':
              return _context36.stop();
          }
        }
      }, null, this);
    }
  }, {
    key: 'emulate',
    value: function emulate(deviceName) {
      var device, platform;
      return _regenerator2.default.async(function emulate$(_context37) {
        while (1) {
          switch (_context37.prev = _context37.next) {
            case 0:
              _context37.next = 2;
              return _regenerator2.default.awrap(this._checkStart());

            case 2:
              if (this.emulateMode) {
                _context37.next = 6;
                break;
              }

              _context37.next = 5;
              return _regenerator2.default.awrap(this.evaluate('return navigator.userAgent'));

            case 5:
              this.userAgentBeforeEmulate = _context37.sent;

            case 6:
              device = devices[deviceName];
              _context37.next = 9;
              return _regenerator2.default.awrap(this.client.Emulation.setDeviceMetricsOverride({
                width: device.width,
                height: device.height,
                deviceScaleFactor: device.deviceScaleFactor,
                mobile: device.mobile,
                fitWindow: false,
                scale: device.pageScaleFactor
              }));

            case 9:
              platform = device.mobile ? 'mobile' : 'desktop';
              _context37.next = 12;
              return _regenerator2.default.awrap(this.client.Emulation.setTouchEmulationEnabled({ enabled: true, configuration: platform }));

            case 12:
              _context37.next = 14;
              return _regenerator2.default.awrap(this.userAgent(device.userAgent));

            case 14:
              this.currentEmulateDeviceName = deviceName;
              this.emulateMode = true;

            case 16:
            case 'end':
              return _context37.stop();
          }
        }
      }, null, this);
    }
  }, {
    key: 'clearEmulate',
    value: function clearEmulate() {
      return _regenerator2.default.async(function clearEmulate$(_context38) {
        while (1) {
          switch (_context38.prev = _context38.next) {
            case 0:
              _context38.next = 2;
              return _regenerator2.default.awrap(this.client.Emulation.clearDeviceMetricsOverride());

            case 2:
              _context38.next = 4;
              return _regenerator2.default.awrap(this.client.Emulation.setTouchEmulationEnabled({ enabled: false }));

            case 4:
              if (!this.userAgentBeforeEmulate) {
                _context38.next = 7;
                break;
              }

              _context38.next = 7;
              return _regenerator2.default.awrap(this.userAgent(this.userAgentBeforeEmulate));

            case 7:
              this.emulateMode = false;
              this.currentEmulateDeviceName = null;

            case 9:
            case 'end':
              return _context38.stop();
          }
        }
      }, null, this);
    }
  }, {
    key: 'blockUrls',
    value: function blockUrls(urls) {
      return _regenerator2.default.async(function blockUrls$(_context39) {
        while (1) {
          switch (_context39.prev = _context39.next) {
            case 0:
              _context39.next = 2;
              return _regenerator2.default.awrap(this._checkStart());

            case 2:
              _context39.next = 4;
              return _regenerator2.default.awrap(this.client.Network.setBlockedURLs({ urls: urls }));

            case 4:
            case 'end':
              return _context39.stop();
          }
        }
      }, null, this);
    }
  }, {
    key: 'clearBrowserCache',
    value: function clearBrowserCache() {
      return _regenerator2.default.async(function clearBrowserCache$(_context40) {
        while (1) {
          switch (_context40.prev = _context40.next) {
            case 0:
              _context40.next = 2;
              return _regenerator2.default.awrap(this._checkStart());

            case 2:
              _context40.next = 4;
              return _regenerator2.default.awrap(this.client.Network.clearBrowserCache());

            case 4:
            case 'end':
              return _context40.stop();
          }
        }
      }, null, this);
    }
  }, {
    key: 'setCookie',
    value: function setCookie(params) {
      var paramArray, currentUrl, i, item;
      return _regenerator2.default.async(function setCookie$(_context41) {
        while (1) {
          switch (_context41.prev = _context41.next) {
            case 0:
              _context41.next = 2;
              return _regenerator2.default.awrap(this._checkStart());

            case 2:
              paramArray = null;

              if (Array.isArray(params)) {
                paramArray = params;
              } else {
                paramArray = [params];
              }
              _context41.next = 6;
              return _regenerator2.default.awrap(this.evaluate(function (_) {
                return location.href;
              }));

            case 6:
              currentUrl = _context41.sent;

              paramArray = paramArray.map(function (obj) {
                if (obj.url) {
                  return obj;
                } else {
                  obj.url = currentUrl;
                  return obj;
                }
              });
              _context41.t0 = _regenerator2.default.keys(paramArray);

            case 9:
              if ((_context41.t1 = _context41.t0()).done) {
                _context41.next = 16;
                break;
              }

              i = _context41.t1.value;
              item = paramArray[i];
              _context41.next = 14;
              return _regenerator2.default.awrap(this.client.Network.setCookie(item));

            case 14:
              _context41.next = 9;
              break;

            case 16:
            case 'end':
              return _context41.stop();
          }
        }
      }, null, this);
    }
  }, {
    key: 'deleteCookie',
    value: function deleteCookie(name) {
      var url = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      var nameArray, paramUrl, i, n;
      return _regenerator2.default.async(function deleteCookie$(_context42) {
        while (1) {
          switch (_context42.prev = _context42.next) {
            case 0:
              _context42.next = 2;
              return _regenerator2.default.awrap(this._checkStart());

            case 2:
              nameArray = null;

              if (Array.isArray(name)) {
                nameArray = name;
              } else {
                nameArray = [name];
              }
              paramUrl = url;

              if (url) {
                _context42.next = 9;
                break;
              }

              _context42.next = 8;
              return _regenerator2.default.awrap(this.evaluate(function (_) {
                return location.href;
              }));

            case 8:
              paramUrl = _context42.sent;

            case 9:
              _context42.t0 = _regenerator2.default.keys(nameArray);

            case 10:
              if ((_context42.t1 = _context42.t0()).done) {
                _context42.next = 17;
                break;
              }

              i = _context42.t1.value;
              n = nameArray[i];
              _context42.next = 15;
              return _regenerator2.default.awrap(this.client.Network.deleteCookie({ cookieName: n, url: paramUrl }));

            case 15:
              _context42.next = 10;
              break;

            case 17:
            case 'end':
              return _context42.stop();
          }
        }
      }, null, this);
    }
  }, {
    key: 'clearAllCookies',
    value: function clearAllCookies() {
      return _regenerator2.default.async(function clearAllCookies$(_context43) {
        while (1) {
          switch (_context43.prev = _context43.next) {
            case 0:
              _context43.next = 2;
              return _regenerator2.default.awrap(this._checkStart());

            case 2:
              _context43.next = 4;
              return _regenerator2.default.awrap(this.client.Network.clearBrowserCookies());

            case 4:
            case 'end':
              return _context43.stop();
          }
        }
      }, null, this);
    }
  }, {
    key: 'getDOMCounters',
    value: function getDOMCounters() {
      return _regenerator2.default.async(function getDOMCounters$(_context44) {
        while (1) {
          switch (_context44.prev = _context44.next) {
            case 0:
              _context44.next = 2;
              return _regenerator2.default.awrap(this.client.Memory.getDOMCounters());

            case 2:
              return _context44.abrupt('return', _context44.sent);

            case 3:
            case 'end':
              return _context44.stop();
          }
        }
      }, null, this);
    }
  }, {
    key: 'clearDataForOrigin',
    value: function clearDataForOrigin() {
      var origin = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
      var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'all';
      return _regenerator2.default.async(function clearDataForOrigin$(_context45) {
        while (1) {
          switch (_context45.prev = _context45.next) {
            case 0:
              if (!(origin === null)) {
                _context45.next = 4;
                break;
              }

              _context45.next = 3;
              return _regenerator2.default.awrap(this.evaluate(function (_) {
                return location.origin;
              }));

            case 3:
              origin = _context45.sent;

            case 4:
              _context45.next = 6;
              return _regenerator2.default.awrap(this.client.Storage.clearDataForOrigin({ origin: origin, storageTypes: type }));

            case 6:
              return _context45.abrupt('return', _context45.sent);

            case 7:
            case 'end':
              return _context45.stop();
          }
        }
      }, null, this);
    }
  }, {
    key: '_checkStart',
    value: function _checkStart() {
      var startingUrl = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
      return _regenerator2.default.async(function _checkStart$(_context46) {
        while (1) {
          switch (_context46.prev = _context46.next) {
            case 0:
              if (!(this.client === null)) {
                _context46.next = 3;
                break;
              }

              _context46.next = 3;
              return _regenerator2.default.awrap(this.start(startingUrl));

            case 3:
            case 'end':
              return _context46.stop();
          }
        }
      }, null, this);
    }
  }, {
    key: '_cacheChromeVersion',
    value: function _cacheChromeVersion() {
      return _regenerator2.default.async(function _cacheChromeVersion$(_context47) {
        while (1) {
          switch (_context47.prev = _context47.next) {
            case 0:
              _context47.next = 2;
              return _regenerator2.default.awrap(this._getChromeVersion());

            case 2:
              this._chromeVersion = _context47.sent;

            case 3:
            case 'end':
              return _context47.stop();
          }
        }
      }, null, this);
    }
  }, {
    key: '_getChromeVersion',
    value: function _getChromeVersion() {
      return _regenerator2.default.async(function _getChromeVersion$(_context48) {
        while (1) {
          switch (_context48.prev = _context48.next) {
            case 0:
              return _context48.abrupt('return', this.evaluate(function (_) {
                var v = navigator.userAgent.match(/Chrom(e|ium)\/([0-9]+)\./);
                return v ? parseInt(v[2], 10) : false;
              }));

            case 1:
            case 'end':
              return _context48.stop();
          }
        }
      }, null, this);
    }
  }], [{
    key: 'addCustomDevice',
    value: function addCustomDevice() {
      var cusDevices = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

      if (!Array.isArray(cusDevices)) {
        cusDevices = [cusDevices];
      }
      cusDevices.forEach(function (item) {
        devices[item.name] = item;
      });
    }
  }, {
    key: 'cleanup',
    value: function cleanup() {
      var copy, promises;
      return _regenerator2.default.async(function cleanup$(_context49) {
        while (1) {
          switch (_context49.prev = _context49.next) {
            case 0:
              copy = [].concat(instances);
              promises = copy.map(function (i) {
                return i.close();
              });
              _context49.next = 4;
              return _regenerator2.default.awrap(Promise.all(promises));

            case 4:
            case 'end':
              return _context49.stop();
          }
        }
      }, null, this);
    }
  }]);
  return Chromy;
}(Document);

module.exports = Chromy;
//# sourceMappingURL=index.js.map