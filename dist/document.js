'use strict';

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var chainProxy = require('async-chain-proxy');

var _require = require('./error'),
    TimeoutError = _require.TimeoutError,
    WaitTimeoutError = _require.WaitTimeoutError,
    EvaluateTimeoutError = _require.EvaluateTimeoutError,
    EvaluateError = _require.EvaluateError;

var _require2 = require('./functionToSource'),
    wrapFunctionForEvaluation = _require2.wrapFunctionForEvaluation,
    wrapFunctionForCallFunction = _require2.wrapFunctionForCallFunction;

var _require3 = require('./util'),
    escapeHtml = _require3.escapeHtml,
    escapeSingleQuote = _require3.escapeSingleQuote;

var Document = function () {
  function Document(chromy, client) {
    var nodeId = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
    (0, _classCallCheck3.default)(this, Document);

    if (chromy) {
      this.chromy = chromy;
    } else {
      this.chromy = this;
    }
    this.client = client;
    this.nodeId = nodeId;
    this._originalNodeId = nodeId;
  }

  (0, _createClass3.default)(Document, [{
    key: 'chain',
    value: function chain() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      return chainProxy(this, options);
    }
  }, {
    key: 'iframe',
    value: function iframe(selector, callback) {
      var rect, originalPageOffset, doc, locationParams, _ref, iframeNodeId;

      return _regenerator2.default.async(function iframe$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return _regenerator2.default.awrap(this.getBoundingClientRect(selector));

            case 2:
              rect = _context.sent;

              if (rect) {
                _context.next = 5;
                break;
              }

              return _context.abrupt('return', Promise.resolve());

            case 5:
              _context.next = 7;
              return _regenerator2.default.awrap(this.getPageOffset());

            case 7:
              originalPageOffset = _context.sent;
              doc = null;
              _context.prev = 9;
              _context.next = 12;
              return _regenerator2.default.awrap(this.scrollTo(0, rect.top));

            case 12:
              locationParams = { x: rect.left + 10, y: rect.top + 10 };
              _context.next = 15;
              return _regenerator2.default.awrap(this.client.DOM.getNodeForLocation(locationParams));

            case 15:
              _ref = _context.sent;
              iframeNodeId = _ref.nodeId;

              if (iframeNodeId) {
                _context.next = 19;
                break;
              }

              return _context.abrupt('return', Promise.resolve());

            case 19:
              doc = new Document(this.chromy, this.client, iframeNodeId);
              doc._activateOnDocumentUpdatedListener();

            case 21:
              _context.prev = 21;
              _context.next = 24;
              return _regenerator2.default.awrap(this.scrollTo(originalPageOffset.x, originalPageOffset.y));

            case 24:
              return _context.finish(21);

            case 25:
              return _context.abrupt('return', Promise.resolve(callback.apply(this, [doc])));

            case 26:
            case 'end':
              return _context.stop();
          }
        }
      }, null, this, [[9,, 21, 25]]);
    }
  }, {
    key: 'click',
    value: function click(expr) {
      var inputOptions = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var defaults, options, promise, nid, evalExpr;
      return _regenerator2.default.async(function click$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              defaults = { waitLoadEvent: false };
              options = Object.assign({}, defaults, inputOptions);
              promise = null;

              if (options.waitLoadEvent) {
                promise = this.waitLoadEvent();
              }
              _context2.next = 6;
              return _regenerator2.default.awrap(this._getNodeId());

            case 6:
              nid = _context2.sent;
              evalExpr = 'document.querySelectorAll(\'' + escapeSingleQuote(expr) + '\').forEach(n => n.click())';

              if (!this._originalNodeId) {
                _context2.next = 13;
                break;
              }

              _context2.next = 11;
              return _regenerator2.default.awrap(this._evaluateOnNode(nid, evalExpr));

            case 11:
              _context2.next = 15;
              break;

            case 13:
              _context2.next = 15;
              return _regenerator2.default.awrap(this.evaluate(evalExpr));

            case 15:
              if (!(promise !== null)) {
                _context2.next = 18;
                break;
              }

              _context2.next = 18;
              return _regenerator2.default.awrap(promise);

            case 18:
            case 'end':
              return _context2.stop();
          }
        }
      }, null, this);
    }
  }, {
    key: 'insert',
    value: function insert(expr, value) {
      return _regenerator2.default.async(function insert$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              expr = escapeSingleQuote(expr);
              _context3.next = 3;
              return _regenerator2.default.awrap(this.evaluate('document.querySelector(\'' + expr + '\').focus()'));

            case 3:
              _context3.next = 5;
              return _regenerator2.default.awrap(this.evaluate('document.querySelector(\'' + expr + '\').value = "' + escapeHtml(value) + '"'));

            case 5:
            case 'end':
              return _context3.stop();
          }
        }
      }, null, this);
    }
  }, {
    key: 'check',
    value: function check(selector) {
      return _regenerator2.default.async(function check$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              _context4.next = 2;
              return _regenerator2.default.awrap(this.evaluate('document.querySelectorAll(\'' + escapeSingleQuote(selector) + '\').forEach(n => n.checked = true)'));

            case 2:
            case 'end':
              return _context4.stop();
          }
        }
      }, null, this);
    }
  }, {
    key: 'uncheck',
    value: function uncheck(selector) {
      return _regenerator2.default.async(function uncheck$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              _context5.next = 2;
              return _regenerator2.default.awrap(this.evaluate('document.querySelectorAll(\'' + escapeSingleQuote(selector) + '\').forEach(n => n.checked = false)'));

            case 2:
            case 'end':
              return _context5.stop();
          }
        }
      }, null, this);
    }
  }, {
    key: 'select',
    value: function select(selector, value) {
      var sel, src;
      return _regenerator2.default.async(function select$(_context6) {
        while (1) {
          switch (_context6.prev = _context6.next) {
            case 0:
              sel = escapeSingleQuote(selector);
              src = '\n      document.querySelectorAll(\'' + sel + ' > option\').forEach(n => {\n        if (n.value === "' + value + '") {\n          n.selected = true\n        }\n      })\n      ';
              _context6.next = 4;
              return _regenerator2.default.awrap(this.evaluate(src));

            case 4:
            case 'end':
              return _context6.stop();
          }
        }
      }, null, this);
    }
  }, {
    key: 'scroll',
    value: function scroll(x, y) {
      return _regenerator2.default.async(function scroll$(_context7) {
        while (1) {
          switch (_context7.prev = _context7.next) {
            case 0:
              return _context7.abrupt('return', this._evaluateWithReplaces(function () {
                var dx = _1; // eslint-disable-line no-undef
                var dy = _2; // eslint-disable-line no-undef
                window.scrollTo(window.pageXOffset + dx, window.pageYOffset + dy);
              }, {}, { '_1': x, '_2': y }));

            case 1:
            case 'end':
              return _context7.stop();
          }
        }
      }, null, this);
    }
  }, {
    key: 'scrollTo',
    value: function scrollTo(x, y) {
      return _regenerator2.default.async(function scrollTo$(_context8) {
        while (1) {
          switch (_context8.prev = _context8.next) {
            case 0:
              return _context8.abrupt('return', this._evaluateWithReplaces(function () {
                window.scrollTo(_1, _2); // eslint-disable-line no-undef
              }, {}, { '_1': x, '_2': y }));

            case 1:
            case 'end':
              return _context8.stop();
          }
        }
      }, null, this);
    }
  }, {
    key: 'getPageOffset',
    value: function getPageOffset() {
      return _regenerator2.default.async(function getPageOffset$(_context9) {
        while (1) {
          switch (_context9.prev = _context9.next) {
            case 0:
              return _context9.abrupt('return', this.evaluate(function (_) {
                return {
                  x: window.pageXOffset,
                  y: window.pageYOffset
                };
              }));

            case 1:
            case 'end':
              return _context9.stop();
          }
        }
      }, null, this);
    }
  }, {
    key: 'evaluate',
    value: function evaluate(expr) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      return _regenerator2.default.async(function evaluate$(_context10) {
        while (1) {
          switch (_context10.prev = _context10.next) {
            case 0:
              _context10.next = 2;
              return _regenerator2.default.awrap(this._evaluateWithReplaces(expr, options));

            case 2:
              return _context10.abrupt('return', _context10.sent);

            case 3:
            case 'end':
              return _context10.stop();
          }
        }
      }, null, this);
    }
  }, {
    key: '_evaluateWithReplaces',
    value: function _evaluateWithReplaces(expr) {
      var _this = this;

      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var replaces = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      var e, result, resultObject, type;
      return _regenerator2.default.async(function _evaluateWithReplaces$(_context12) {
        while (1) {
          switch (_context12.prev = _context12.next) {
            case 0:
              e = null;

              if (this._originalNodeId) {
                e = wrapFunctionForCallFunction(expr, replaces);
              } else {
                e = wrapFunctionForEvaluation(expr, replaces);
              }
              _context12.prev = 2;
              _context12.next = 5;
              return _regenerator2.default.awrap(this._waitFinish(this.chromy.options.evaluateTimeout, function _callee() {
                var contextNodeId, objectId, params;
                return _regenerator2.default.async(function _callee$(_context11) {
                  while (1) {
                    switch (_context11.prev = _context11.next) {
                      case 0:
                        if (_this.client) {
                          _context11.next = 2;
                          break;
                        }

                        return _context11.abrupt('return', null);

                      case 2:
                        if (!_this._originalNodeId) {
                          _context11.next = 15;
                          break;
                        }

                        _context11.next = 5;
                        return _regenerator2.default.awrap(_this._getNodeId());

                      case 5:
                        contextNodeId = _context11.sent;
                        _context11.next = 8;
                        return _regenerator2.default.awrap(_this._getObjectIdFromNodeId(contextNodeId));

                      case 8:
                        objectId = _context11.sent;
                        params = Object.assign({}, options, { objectId: objectId, functionDeclaration: e });
                        _context11.next = 12;
                        return _regenerator2.default.awrap(_this.client.Runtime.callFunctionOn(params));

                      case 12:
                        return _context11.abrupt('return', _context11.sent);

                      case 15:
                        _context11.next = 17;
                        return _regenerator2.default.awrap(_this.client.Runtime.evaluate({ expression: e }));

                      case 17:
                        return _context11.abrupt('return', _context11.sent);

                      case 18:
                      case 'end':
                        return _context11.stop();
                    }
                  }
                }, null, _this);
              }));

            case 5:
              result = _context12.sent;

              if (!(!result || !result.result)) {
                _context12.next = 8;
                break;
              }

              return _context12.abrupt('return', null);

            case 8:
              if (!(result.result.subtype === 'promise')) {
                _context12.next = 13;
                break;
              }

              _context12.next = 11;
              return _regenerator2.default.awrap(this.client.Runtime.awaitPromise({ promiseObjectId: result.result.objectId, returnByValue: true }));

            case 11:
              result = _context12.sent;

              // adjust to after process
              result.result.value = JSON.stringify({
                type: (0, _typeof3.default)(result.result.value),
                result: JSON.stringify(result.result.value)
              });

            case 13:
              if (!(result.result.subtype === 'error')) {
                _context12.next = 15;
                break;
              }

              throw new EvaluateError('An error has been occurred in evaluated script on a browser.' + result.result.description, result.result);

            case 15:
              resultObject = JSON.parse(result.result.value);
              type = resultObject.type;

              if (!(type === 'undefined')) {
                _context12.next = 21;
                break;
              }

              return _context12.abrupt('return', undefined);

            case 21:
              _context12.prev = 21;
              return _context12.abrupt('return', JSON.parse(resultObject.result));

            case 25:
              _context12.prev = 25;
              _context12.t0 = _context12['catch'](21);

              console.log('ERROR', resultObject);
              throw _context12.t0;

            case 29:
              _context12.next = 38;
              break;

            case 31:
              _context12.prev = 31;
              _context12.t1 = _context12['catch'](2);

              if (!(_context12.t1 instanceof TimeoutError)) {
                _context12.next = 37;
                break;
              }

              throw new EvaluateTimeoutError('evaluate() timeout');

            case 37:
              throw _context12.t1;

            case 38:
            case 'end':
              return _context12.stop();
          }
        }
      }, null, this, [[2, 31], [21, 25]]);
    }

    // evaluate a function on the specified node context.

  }, {
    key: '_evaluateOnNode',
    value: function _evaluateOnNode(nodeId, fn) {
      var objectId, src, functionDeclaration, params;
      return _regenerator2.default.async(function _evaluateOnNode$(_context13) {
        while (1) {
          switch (_context13.prev = _context13.next) {
            case 0:
              _context13.next = 2;
              return _regenerator2.default.awrap(this._getObjectIdFromNodeId(nodeId));

            case 2:
              objectId = _context13.sent;
              src = fn.toString();
              functionDeclaration = 'function () {\n      return (' + src + ')()\n    }';
              params = {
                objectId: objectId,
                functionDeclaration: functionDeclaration
              };
              _context13.next = 8;
              return _regenerator2.default.awrap(this.client.Runtime.enable());

            case 8:
              _context13.next = 10;
              return _regenerator2.default.awrap(this.client.Runtime.callFunctionOn(params));

            case 10:
            case 'end':
              return _context13.stop();
          }
        }
      }, null, this);
    }
  }, {
    key: 'exists',
    value: function exists(selector) {
      return _regenerator2.default.async(function exists$(_context14) {
        while (1) {
          switch (_context14.prev = _context14.next) {
            case 0:
              return _context14.abrupt('return', this._evaluateWithReplaces(function (_) {
                return document.body.querySelector('?') !== null;
              }, {}, { '?': escapeSingleQuote(selector) }));

            case 1:
            case 'end':
              return _context14.stop();
          }
        }
      }, null, this);
    }
  }, {
    key: 'visible',
    value: function visible(selector) {
      return _regenerator2.default.async(function visible$(_context15) {
        while (1) {
          switch (_context15.prev = _context15.next) {
            case 0:
              return _context15.abrupt('return', this._evaluateWithReplaces(function (_) {
                var dom = document.body.querySelector('?');
                return dom !== null && dom.offsetWidth > 0 && dom.offsetHeight > 0;
              }, {}, { '?': escapeSingleQuote(selector) }));

            case 1:
            case 'end':
              return _context15.stop();
          }
        }
      }, null, this);
    }
  }, {
    key: 'wait',
    value: function wait(cond) {
      return _regenerator2.default.async(function wait$(_context16) {
        while (1) {
          switch (_context16.prev = _context16.next) {
            case 0:
              if (!(typeof cond === 'number')) {
                _context16.next = 5;
                break;
              }

              _context16.next = 3;
              return _regenerator2.default.awrap(this.sleep(cond));

            case 3:
              _context16.next = 12;
              break;

            case 5:
              if (!(typeof cond === 'function')) {
                _context16.next = 10;
                break;
              }

              _context16.next = 8;
              return _regenerator2.default.awrap(this._waitFunction(cond));

            case 8:
              _context16.next = 12;
              break;

            case 10:
              _context16.next = 12;
              return _regenerator2.default.awrap(this._waitSelector(cond));

            case 12:
            case 'end':
              return _context16.stop();
          }
        }
      }, null, this);
    }

    // wait for func to return true.

  }, {
    key: '_waitFunction',
    value: function _waitFunction(func) {
      var _this2 = this;

      return _regenerator2.default.async(function _waitFunction$(_context18) {
        while (1) {
          switch (_context18.prev = _context18.next) {
            case 0:
              _context18.next = 2;
              return _regenerator2.default.awrap(this._waitFinish(this.chromy.options.waitTimeout, function _callee2() {
                var r;
                return _regenerator2.default.async(function _callee2$(_context17) {
                  while (1) {
                    switch (_context17.prev = _context17.next) {
                      case 0:
                        if (!true) {
                          _context17.next = 10;
                          break;
                        }

                        _context17.next = 3;
                        return _regenerator2.default.awrap(_this2.evaluate(func));

                      case 3:
                        r = _context17.sent;

                        if (!r) {
                          _context17.next = 6;
                          break;
                        }

                        return _context17.abrupt('break', 10);

                      case 6:
                        _context17.next = 8;
                        return _regenerator2.default.awrap(_this2.sleep(_this2.chromy.options.waitFunctionPollingInterval));

                      case 8:
                        _context17.next = 0;
                        break;

                      case 10:
                      case 'end':
                        return _context17.stop();
                    }
                  }
                }, null, _this2);
              }));

            case 2:
            case 'end':
              return _context18.stop();
          }
        }
      }, null, this);
    }
  }, {
    key: '_waitSelector',
    value: function _waitSelector(selector) {
      var _this3 = this;

      var _check, startTime;

      return _regenerator2.default.async(function _waitSelector$(_context20) {
        while (1) {
          switch (_context20.prev = _context20.next) {
            case 0:
              _check = null;
              startTime = Date.now();
              _context20.next = 4;
              return _regenerator2.default.awrap(new Promise(function (resolve, reject) {
                _check = function check() {
                  setTimeout(function _callee3() {
                    var now, result;
                    return _regenerator2.default.async(function _callee3$(_context19) {
                      while (1) {
                        switch (_context19.prev = _context19.next) {
                          case 0:
                            _context19.prev = 0;
                            now = Date.now();

                            if (!(now - startTime > _this3.chromy.options.waitTimeout)) {
                              _context19.next = 5;
                              break;
                            }

                            reject(new WaitTimeoutError('wait() timeout'));
                            return _context19.abrupt('return');

                          case 5:
                            _context19.next = 7;
                            return _regenerator2.default.awrap(_this3._evaluateWithReplaces(function () {
                              return document.querySelector('?');
                            }, {}, { '?': escapeSingleQuote(selector) }));

                          case 7:
                            result = _context19.sent;

                            if (result) {
                              resolve(result);
                            } else {
                              _check();
                            }
                            _context19.next = 14;
                            break;

                          case 11:
                            _context19.prev = 11;
                            _context19.t0 = _context19['catch'](0);

                            reject(_context19.t0);

                          case 14:
                          case 'end':
                            return _context19.stop();
                        }
                      }
                    }, null, _this3, [[0, 11]]);
                  }, _this3.chromy.options.waitFunctionPollingInterval);
                };
                _check();
              }));

            case 4:
            case 'end':
              return _context20.stop();
          }
        }
      }, null, this);
    }
  }, {
    key: '_waitFinish',
    value: function _waitFinish(timeout, callback) {
      var _this4 = this;

      var start, finished, error, result, f, now;
      return _regenerator2.default.async(function _waitFinish$(_context22) {
        while (1) {
          switch (_context22.prev = _context22.next) {
            case 0:
              start = Date.now();
              finished = false;
              error = null;
              result = null;

              f = function _callee4() {
                return _regenerator2.default.async(function _callee4$(_context21) {
                  while (1) {
                    switch (_context21.prev = _context21.next) {
                      case 0:
                        _context21.prev = 0;
                        _context21.next = 3;
                        return _regenerator2.default.awrap(callback.apply());

                      case 3:
                        result = _context21.sent;

                        finished = true;
                        return _context21.abrupt('return', result);

                      case 8:
                        _context21.prev = 8;
                        _context21.t0 = _context21['catch'](0);

                        error = _context21.t0;
                        finished = true;

                      case 12:
                      case 'end':
                        return _context21.stop();
                    }
                  }
                }, null, _this4, [[0, 8]]);
              };

              f.apply();

            case 6:
              if (finished) {
                _context22.next = 14;
                break;
              }

              now = Date.now();

              if (!(now - start > timeout)) {
                _context22.next = 10;
                break;
              }

              throw new TimeoutError('timeout');

            case 10:
              _context22.next = 12;
              return _regenerator2.default.awrap(this.sleep(this.chromy.options.waitFunctionPollingInterval));

            case 12:
              _context22.next = 6;
              break;

            case 14:
              if (!(error !== null)) {
                _context22.next = 16;
                break;
              }

              throw error;

            case 16:
              return _context22.abrupt('return', result);

            case 17:
            case 'end':
              return _context22.stop();
          }
        }
      }, null, this);
    }
  }, {
    key: 'sleep',
    value: function sleep(msec) {
      return _regenerator2.default.async(function sleep$(_context23) {
        while (1) {
          switch (_context23.prev = _context23.next) {
            case 0:
              _context23.next = 2;
              return _regenerator2.default.awrap(new Promise(function (resolve, reject) {
                setTimeout(function () {
                  resolve();
                }, msec);
              }));

            case 2:
            case 'end':
              return _context23.stop();
          }
        }
      }, null, this);
    }
  }, {
    key: 'getBoundingClientRect',
    value: function getBoundingClientRect(selector) {
      var rect;
      return _regenerator2.default.async(function getBoundingClientRect$(_context24) {
        while (1) {
          switch (_context24.prev = _context24.next) {
            case 0:
              _context24.next = 2;
              return _regenerator2.default.awrap(this._evaluateWithReplaces(function () {
                var dom = document.querySelector('?');
                if (!dom) {
                  return null;
                }
                var r = dom.getBoundingClientRect();
                return { top: r.top, left: r.left, width: r.width, height: r.height };
              }, {}, { '?': escapeSingleQuote(selector) }));

            case 2:
              rect = _context24.sent;

              if (rect) {
                _context24.next = 5;
                break;
              }

              return _context24.abrupt('return', null);

            case 5:
              return _context24.abrupt('return', {
                top: Math.floor(rect.top),
                left: Math.floor(rect.left),
                width: Math.floor(rect.width),
                height: Math.floor(rect.height)
              });

            case 6:
            case 'end':
              return _context24.stop();
          }
        }
      }, null, this);
    }
  }, {
    key: 'getBoundingClientRectAll',
    value: function getBoundingClientRectAll(selector) {
      var rects;
      return _regenerator2.default.async(function getBoundingClientRectAll$(_context25) {
        while (1) {
          switch (_context25.prev = _context25.next) {
            case 0:
              _context25.next = 2;
              return _regenerator2.default.awrap(this._evaluateWithReplaces(function () {
                var doms = document.querySelectorAll('?');
                return Array.prototype.map.call(doms, function (dom) {
                  var r = dom.getBoundingClientRect();
                  return { top: r.top, left: r.left, width: r.width, height: r.height };
                });
              }, {}, { '?': escapeSingleQuote(selector) }));

            case 2:
              rects = _context25.sent;
              return _context25.abrupt('return', rects.map(function (rect) {
                return {
                  top: Math.floor(rect.top),
                  left: Math.floor(rect.left),
                  width: Math.floor(rect.width),
                  height: Math.floor(rect.height)
                };
              }));

            case 4:
            case 'end':
              return _context25.stop();
          }
        }
      }, null, this);
    }
  }, {
    key: '_activateOnDocumentUpdatedListener',
    value: function _activateOnDocumentUpdatedListener() {
      var _this5 = this;

      this._onDocumentUpdatedListener = function () {
        _this5.nodeId = null;
      };
      this.client.DOM.documentUpdated(this._onDocumentUpdatedListener);
    }
  }, {
    key: '_getObjectIdFromNodeId',
    value: function _getObjectIdFromNodeId(nodeId) {
      var _ref2, rObj;

      return _regenerator2.default.async(function _getObjectIdFromNodeId$(_context26) {
        while (1) {
          switch (_context26.prev = _context26.next) {
            case 0:
              _context26.next = 2;
              return _regenerator2.default.awrap(this.client.DOM.resolveNode({ nodeId: nodeId }));

            case 2:
              _ref2 = _context26.sent;
              rObj = _ref2.object;

              if (rObj) {
                _context26.next = 6;
                break;
              }

              return _context26.abrupt('return', null);

            case 6:
              return _context26.abrupt('return', rObj.objectId);

            case 7:
            case 'end':
              return _context26.stop();
          }
        }
      }, null, this);
    }
  }, {
    key: '_getNodeId',
    value: function _getNodeId() {
      var _ref3, root;

      return _regenerator2.default.async(function _getNodeId$(_context27) {
        while (1) {
          switch (_context27.prev = _context27.next) {
            case 0:
              if (this.nodeId) {
                _context27.next = 6;
                break;
              }

              _context27.next = 3;
              return _regenerator2.default.awrap(this.client.DOM.getDocument());

            case 3:
              _ref3 = _context27.sent;
              root = _ref3.root;

              this.nodeId = root.nodeId;

            case 6:
              return _context27.abrupt('return', this.nodeId);

            case 7:
            case 'end':
              return _context27.stop();
          }
        }
      }, null, this);
    }
  }]);
  return Document;
}();

module.exports = Document;
//# sourceMappingURL=document.js.map