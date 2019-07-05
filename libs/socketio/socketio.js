var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = this && this.__extends || function __extends(t, e) { 
 function r() { 
 this.constructor = t;
}
for (var i in e) e.hasOwnProperty(i) && (t[i] = e[i]);
r.prototype = e.prototype, t.prototype = new r();
};
var egret;
(function (egret) {
    var socketio;
    (function (socketio) {
        /**
         * class Emitter
         */
        var Emitter = (function () {
            function Emitter() {
                this.callbacks = {};
            }
            Emitter.prototype.on = function (event, fn, listenerContext) {
                this.$addListener(event, fn, listenerContext);
                return this;
            };
            Emitter.prototype.once = function (event, fn, listenerContext) {
                this.$addListener(event, fn, listenerContext, true);
                return this;
            };
            Emitter.prototype.off = function (event, fn, listenerContext) {
                this.$removeListener(event, fn, listenerContext);
                return this;
            };
            Emitter.prototype.emit = function (event) {
                var args = [];
                for (var _i = 1; _i < arguments.length; _i++) {
                    args[_i - 1] = arguments[_i];
                }
                var callback = this.callbacks[event];
                if (typeof callback === 'undefined' || callback === null)
                    return;
                var onceList = [];
                callback.forEach(function (element) {
                    (_a = element.listion).call.apply(_a, [element.listenerContext].concat(args));
                    if (element.dispatchOnce) {
                        onceList.push(element);
                    }
                    var _a;
                });
                while (onceList.length) {
                    var eventBin = onceList.pop();
                    this.$removeListener(eventBin.event, eventBin.listener, eventBin.listenerContext);
                }
            };
            Emitter.prototype.$addListener = function (event, fn, listenerContext, dispatchOnce) {
                var callback = this.callbacks[event];
                if (!callback) {
                    callback = [];
                    this.callbacks[event] = callback;
                }
                var data = { listion: fn, listenerContext: listenerContext, event: event, dispatchOnce: !!dispatchOnce };
                callback.push(data);
            };
            Emitter.prototype.$removeListener = function (event, fn, listenerContext) {
                if (!event) {
                    this.callbacks = [];
                    return;
                }
                var callback = this.callbacks[event];
                if (callback) {
                    this.$removeEventBin(callback, fn, listenerContext);
                    if (callback.length == 0) {
                        this.callbacks[event] = null;
                    }
                }
            };
            Emitter.prototype.$removeEventBin = function (list, listener, thisObject) {
                if (listener && thisObject) {
                    for (var i = 0; i < list.length; i++) {
                        var bin = list[i];
                        if (bin.listener == listener && bin.listenerContext == thisObject) {
                            list.splice(i, 1);
                        }
                    }
                }
                else {
                    for (var i = 0; i < list.length; i++) {
                        list.splice(i, 1);
                    }
                }
            };
            return Emitter;
        }());
        socketio.Emitter = Emitter;
        __reflect(Emitter.prototype, "egret.socketio.Emitter");
    })(socketio = egret.socketio || (egret.socketio = {}));
})(egret || (egret = {}));
/// <reference path="../Interface.ts" />
/// <reference path="../Emitter.ts" />
var egret;
(function (egret) {
    var socketio;
    (function (socketio) {
        var engine;
        (function (engine) {
            /**
            * Transport
            */
            var Transport = (function (_super) {
                __extends(Transport, _super);
                function Transport(opts) {
                    var _this = _super.call(this) || this;
                    _this.readyState = socketio._emReadyState.CLOSED;
                    _this.writable = true;
                    _this.opts = opts.clone();
                    return _this;
                    // this.path = opts.path;
                    // this.hostname = opts.hostname;
                    // this.port = opts.port;
                    // this.secure = opts.secure;
                    // this.query = opts.query || new Map();
                    // this.timestampParam = opts.timestampParam;
                    // this.timestampRequests = opts.timestampRequests;
                }
                Transport.prototype.onError = function (msg) {
                    this.emit(socketio._emEvent.EVENT_ERROR);
                    return this;
                };
                Transport.prototype.open = function () {
                    if (this.readyState === socketio._emReadyState.CLOSED ||
                        this.readyState === null) {
                        this.readyState = socketio._emReadyState.OPENING;
                        this.doOpen();
                    }
                    return this;
                };
                Transport.prototype.close = function () {
                    if (this.readyState === socketio._emReadyState.OPENING ||
                        this.readyState === socketio._emReadyState.OPEN) {
                        this.doClose();
                        this.onClose();
                    }
                    return this;
                };
                Transport.prototype.send = function (packets) {
                    if (this.readyState === socketio._emReadyState.OPEN) {
                        this.write(packets);
                    }
                };
                Transport.prototype.onOpen = function () {
                    this.readyState = socketio._emReadyState.OPEN;
                    this.writable = true;
                    this.emit(socketio._emEvent.EVENT_OPEN);
                };
                Transport.prototype.onData = function (data) {
                    this.onPacket(engine.Parser.decodePacket(data, false));
                };
                Transport.prototype.onPacket = function (packet) {
                    this.emit(socketio._emEvent.EVENT_PACKET, packet);
                };
                Transport.prototype.onClose = function () {
                    this.readyState = socketio._emReadyState.CLOSED;
                    this.emit(socketio._emEvent.EVENT_CLOSE);
                };
                return Transport;
            }(socketio.Emitter));
            engine.Transport = Transport;
            __reflect(Transport.prototype, "egret.socketio.engine.Transport");
        })(engine = socketio.engine || (socketio.engine = {}));
    })(socketio = egret.socketio || (egret.socketio = {}));
})(egret || (egret = {}));
var egret;
(function (egret) {
    var socketio;
    (function (socketio) {
        var re = {
            starts_with_slashes: /^\/+/,
            ends_with_slashes: /\/+$/,
            pluses: /\+/g,
            query_separator: /[&;]/,
            uri_parser: /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@\/]*)(?::([^:@]*))?)?@)?(\[[0-9a-fA-F:.]+\]|[^:\/?#]*)(?::(\d+|(?=:)))?(:)?)((((?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/
        };
        function decode(s) {
            if (s) {
                s = s.toString().replace(re.pluses, '%20');
                s = decodeURIComponent(s);
            }
            return s;
        }
        function parseUri(str) {
            var parser = re.uri_parser;
            var parserKeys = ["source", "protocol", "authority", "userInfo", "user", "password", "host", "port", "isColonUri", "relative", "path", "directory", "file", "query", "anchor"];
            var m = parser.exec(str || '');
            var parts = {};
            parserKeys.forEach(function (value, index) {
                parts[value] = m[index] || '';
            });
            return parts;
        }
        function parseQuery(str) {
            var i, ps, p, n, k, v, l;
            var pairs = [];
            if (typeof (str) === 'undefined' || str === null || str === '') {
                return pairs;
            }
            if (str.indexOf('?') === 0) {
                str = str.substring(1);
            }
            ps = str.toString().split(re.query_separator);
            for (i = 0, l = ps.length; i < l; i++) {
                p = ps[i];
                n = p.indexOf('=');
                if (n !== 0) {
                    k = decode(p.substring(0, n));
                    v = decode(p.substring(n + 1));
                    pairs.push(n === -1 ? [p, null] : [k, v]);
                }
            }
            return pairs;
        }
        var Uri = (function () {
            /**
             * Creates a new Uri object
             * @constructor
             * @param {string} str
             */
            function Uri(str) {
                this.uriParts = parseUri(str);
                this.queryPairs = parseQuery(this.uriParts.query);
                this.hasAuthorityPrefixUserPref = null;
            }
            /**
             * if there is no protocol, the leading // can be enabled or disabled
             * @param  {Boolean}  val
             * @return {Boolean}
             */
            Uri.prototype.hasAuthorityPrefix = function (val) {
                if (typeof val !== 'undefined') {
                    this.hasAuthorityPrefixUserPref = val;
                }
                if (this.hasAuthorityPrefixUserPref === null) {
                    return (this.uriParts.source.indexOf('//') !== -1);
                }
                else {
                    return this.hasAuthorityPrefixUserPref;
                }
            };
            Uri.prototype.isColonUri = function (val) {
                if (typeof val !== 'undefined') {
                    this.uriParts.isColonUri = !!val;
                }
                else {
                    return !!this.uriParts.isColonUri;
                }
            };
            /**
            * Serializes the internal state of the query pairs
            * @param  {string} [val]   set a new query string
            * @return {string}         query string
            */
            Uri.prototype.query = function (val) {
                var s = '', i, param, l;
                if (typeof val !== 'undefined') {
                    this.queryPairs = parseQuery(val);
                }
                for (i = 0, l = this.queryPairs.length; i < l; i++) {
                    param = this.queryPairs[i];
                    if (s.length > 0) {
                        s += '&';
                    }
                    if (param[0] === null) {
                        s += param[0];
                    }
                    else {
                        s += param[0];
                        s += '=';
                        if (typeof param[1] != 'undefined') {
                            s += encodeURIComponent(param[1]);
                        }
                    }
                }
                return s.length > 0 ? '?' + s : s;
            };
            /**
             * returns the first query param value found for the key
             * @param  {string} key query key
             * @return {string}     first value found for key
             */
            Uri.prototype.getQueryParamValue = function (key) {
                var i, param, l;
                for (i = 0, l = this.queryPairs.length; i < l; i++) {
                    param = this.queryPairs[i];
                    if (key == param[0]) {
                        return param[1];
                    }
                }
            };
            /**
             * returns an array of query param values for the key
             * @param  {string} key query key
             * @return {array}      array of values
             */
            Uri.prototype.getQueryParamValues = function (key) {
                var arr = [], i, param, l;
                for (i = 0, l = this.queryPairs.length; i < l; i++) {
                    param = this.queryPairs[i];
                    if (key == param[0]) {
                        arr.push(param[1]);
                    }
                }
                return arr;
            };
            /**
             * removes query parameters
             * @param  {string} key     remove values for key
             * @param  {val}    [val]   remove a specific value, otherwise removes all
             * @return {Uri}            returns self for fluent chaining
             */
            Uri.prototype.deleteQueryParam = function (key, val) {
                var arr = [], i, param, keyMatchesFilter, valMatchesFilter, l;
                for (i = 0, l = this.queryPairs.length; i < l; i++) {
                    param = this.queryPairs[i];
                    keyMatchesFilter = decode(param[0]) === decode(key);
                    valMatchesFilter = param[1] === val;
                    if ((arguments.length === 1 && !keyMatchesFilter) || (arguments.length === 2 && (!keyMatchesFilter || !valMatchesFilter))) {
                        arr.push(param);
                    }
                }
                this.queryPairs = arr;
                return this;
            };
            /**
            * adds a query parameter
            * @param  {string}  key        add values for key
            * @param  {string}  val        value to add
            * @param  {integer} [index]    specific index to add the value at
            * @return {Uri}                returns self for fluent chaining
            */
            Uri.prototype.addQueryParam = function (key, val, index) {
                if (arguments.length === 3 && index !== -1) {
                    index = Math.min(index, this.queryPairs.length);
                    this.queryPairs.splice(index, 0, [key, val]);
                }
                else if (arguments.length > 0) {
                    this.queryPairs.push([key, val]);
                }
                return this;
            };
            /**
             * test for the existence of a query parameter
             * @param  {string}  key        check values for key
             * @return {Boolean}            true if key exists, otherwise false
             */
            Uri.prototype.hasQueryParam = function (key) {
                var i, len = this.queryPairs.length;
                for (i = 0; i < len; i++) {
                    if (this.queryPairs[i][0] == key)
                        return true;
                }
                return false;
            };
            /**
             * replaces query param values
             * @param  {string} key         key to replace value for
             * @param  {string} newVal      new value
             * @param  {string} [oldVal]    replace only one specific value (otherwise replaces all)
             * @return {Uri}                returns self for fluent chaining
             */
            Uri.prototype.replaceQueryParam = function (key, newVal, oldVal) {
                var index = -1, len = this.queryPairs.length, i, param;
                if (arguments.length === 3) {
                    for (i = 0; i < len; i++) {
                        param = this.queryPairs[i];
                        if (decode(param[0].toString()) === decode(key) && decodeURIComponent(param[1]) === decode(oldVal.toString())) {
                            index = i;
                            break;
                        }
                    }
                    if (index >= 0) {
                        this.deleteQueryParam(key, decode(oldVal.toString())).addQueryParam(key, newVal, index);
                    }
                }
                else {
                    for (i = 0; i < len; i++) {
                        param = this.queryPairs[i];
                        if (decode(param[0].toString()) === decode(key)) {
                            index = i;
                            break;
                        }
                    }
                    this.deleteQueryParam(key);
                    this.addQueryParam(key, newVal, index);
                }
                return this;
            };
            /**
             * Scheme name, colon and doubleslash, as required
             * @return {string} http:// or possibly just //
             */
            Uri.prototype.scheme = function () {
                var s = '';
                if (this.protocol) {
                    s += this.protocol;
                    if (this.protocol.indexOf(':') !== this.protocol.length - 1) {
                        s += ':';
                    }
                    s += '//';
                }
                else {
                    if (this.hasAuthorityPrefix() && this.host) {
                        s += '//';
                    }
                }
                return s;
            };
            /**
             * Same as Mozilla nsIURI.prePath
             * @return {string} scheme://user:password@host:port
             * @see  https://developer.mozilla.org/en/nsIURI
             */
            Uri.prototype.origin = function () {
                var s = this.scheme();
                if (this.userInfo && this.host) {
                    s += this.userInfo;
                    if (this.userInfo.indexOf('@') !== this.userInfo.length - 1) {
                        s += '@';
                    }
                }
                if (this.host) {
                    s += this.host;
                    if (this.port || (this.path.substr(0, 1).match(/[0-9]/))) {
                        s += ':' + this.port;
                    }
                }
                return s;
            };
            /**
             * Adds a trailing slash to the path
             */
            Uri.prototype.addTrailingSlash = function () {
                var path = this.path || '';
                if (path.substr(-1) !== '/') {
                    this.path = path + '/';
                }
                return this;
            };
            /**
             * Serializes the internal state of the Uri object
             * @return {string}
             */
            Uri.prototype.toString = function () {
                var path, s = this.origin();
                if (this.isColonUri()) {
                    if (this.path) {
                        s += ':' + this.path;
                    }
                }
                else if (this.path) {
                    path = this.path;
                    if (!(re.ends_with_slashes.test(s) || re.starts_with_slashes.test(path))) {
                        s += '/';
                    }
                    else {
                        if (s) {
                            s.replace(re.ends_with_slashes, '/');
                        }
                        path = path.replace(re.starts_with_slashes, '/');
                    }
                    s += path;
                }
                else {
                    if (this.host && (this.query.toString() || this.anchor)) {
                        s += '/';
                    }
                }
                if (this.query().toString()) {
                    s += this.query().toString();
                }
                if (this.anchor) {
                    if (this.anchor.indexOf('#') !== 0) {
                        s += '#';
                    }
                    s += this.anchor;
                }
                return s;
            };
            /**
             * Clone a Uri object
             * @return {Uri} duplicate copy of the Uri
             */
            Uri.prototype.clone = function () {
                return new Uri(this.toString());
            };
            Object.defineProperty(Uri.prototype, "protocol", {
                get: function () {
                    return this.uriParts.protocol;
                },
                set: function (v) {
                    this.uriParts.protocol = v;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Uri.prototype, "userInfo", {
                get: function () {
                    return this.uriParts.userInfo;
                },
                set: function (v) {
                    this.uriParts.userInfo = v;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Uri.prototype, "host", {
                get: function () {
                    return this.uriParts.host;
                },
                set: function (v) {
                    this.uriParts.host = v;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Uri.prototype, "port", {
                get: function () {
                    return this.uriParts.port;
                },
                set: function (v) {
                    this.uriParts.port = v;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Uri.prototype, "path", {
                get: function () {
                    return this.uriParts.path;
                },
                set: function (v) {
                    this.uriParts.path = v;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Uri.prototype, "anchor", {
                get: function () {
                    return this.uriParts.anchor;
                },
                set: function (v) {
                    this.uriParts.anchor = v;
                },
                enumerable: true,
                configurable: true
            });
            return Uri;
        }());
        socketio.Uri = Uri;
        __reflect(Uri.prototype, "egret.socketio.Uri");
    })(socketio = egret.socketio || (egret.socketio = {}));
})(egret || (egret = {}));
/// <reference path="./Transport.ts" />
var egret;
(function (egret) {
    var socketio;
    (function (socketio) {
        var engine;
        (function (engine) {
            var Polling = (function (_super) {
                __extends(Polling, _super);
                function Polling(opts) {
                    var _this = _super.call(this, opts) || this;
                    _this._writeMessage = "";
                    _this._readMessage = "";
                    _this.pause = function (onPause) {
                        _this.readyState = socketio._emReadyState.PAUSING;
                        var pause = function () {
                            _this.readyState = socketio._emReadyState.PAUSED;
                            onPause();
                        };
                        if (_this.polling || !_this.writable) {
                            var total_1 = 0;
                            if (_this.polling) {
                                total_1++;
                                _this.once(socketio._emEvent.EVENT_POLL_COMPLETE, function () {
                                    --total_1 || pause();
                                });
                            }
                            if (!_this.writable) {
                                total_1++;
                                _this.once(socketio._emEvent.EVENT_DRAIN, function () {
                                    --total_1 || pause();
                                });
                            }
                        }
                        else {
                            pause();
                        }
                    };
                    _this.name = Polling.NAME;
                    _this._readByte = new egret.ByteArray();
                    _this._writeByte = new egret.ByteArray();
                    return _this;
                }
                Polling.prototype.onData = function (data) {
                    var message;
                    if (typeof data === 'string') {
                        message = data;
                    }
                    else {
                        this._readByte.position = 0;
                        this._readByte._writeUint8Array(new Uint8Array(data));
                        message = this._readByte.readUTF();
                        this._readByte.clear();
                    }
                    this._onData(message);
                };
                Polling.prototype._onData = function (message) {
                    var _this = this;
                    var callbackfn = function (packet, index, total) {
                        if (_this.readyState === socketio._emReadyState.OPENING) {
                            _this.onOpen();
                        }
                        if (packet.type === engine._emPacketType[engine._emPacketType.close]) {
                            _this.onClose();
                            return false;
                        }
                        _this.onPacket(packet);
                        return true;
                    };
                    engine.Parser.decodePayload(message, callbackfn);
                    if (this.readyState != socketio._emReadyState.CLOSED) {
                        this.polling = false;
                        this.emit(socketio._emEvent.EVENT_POLL_COMPLETE);
                        if (this.readyState === socketio._emReadyState.OPEN) {
                            this.poll();
                        }
                        else {
                            console.debug("ignoring poll - transport state " + socketio._emReadyState[this.readyState]);
                        }
                    }
                };
                Polling.prototype.write = function (packets) {
                    var _this = this;
                    this.writable = false;
                    var callbackfn = function () {
                        _this.writable = true;
                        _this.emit(socketio._emEvent.EVENT_DRAIN);
                    };
                    engine.Parser.encodePayload(packets, function (data) {
                        _this.doWrite(data, callbackfn);
                    });
                };
                Polling.prototype.doOpen = function () {
                    this.poll();
                };
                Polling.prototype.doClose = function () {
                };
                Polling.prototype.poll = function () {
                    console.debug("polling");
                    this.polling = true;
                    this.doPoll();
                    this.emit(socketio._emEvent.EVENT_POLL);
                };
                Polling.prototype.uri = function () {
                    var uri = this.opts.clone();
                    uri.addTrailingSlash();
                    uri.addQueryParam('b64', 1);
                    var schema = uri.secure ? 'https' : 'http';
                    uri.protocol = schema;
                    if (uri.timestampRequests) {
                        uri.addQueryParam(uri.timestampParam, engine.Yeast.yeast());
                    }
                    return uri.toString();
                };
                Polling.NAME = 'polling';
                return Polling;
            }(engine.Transport));
            engine.Polling = Polling;
            __reflect(Polling.prototype, "egret.socketio.engine.Polling");
        })(engine = socketio.engine || (socketio.engine = {}));
    })(socketio = egret.socketio || (egret.socketio = {}));
})(egret || (egret = {}));
var egret;
(function (egret) {
    var socketio;
    (function (socketio) {
        /**
             * Manager
             */
        var Manager = (function (_super) {
            __extends(Manager, _super);
            function Manager(uri, opts) {
                var _this = _super.call(this) || this;
                _this.nsps = {};
                _this.subs = [];
                _this.connecting = [];
                _this.packetBuffer = [];
                opts = opts || {
                    timeout: 20000,
                    reconnection: true,
                };
                uri.path = opts.path || '/socket.io';
                // opts.uri = opts.uri || new engine.SocketUri(uri.toString());
                // opts.uri.path = opts.path || '/socket.io';
                opts.reconnection = opts.reconnection || true;
                _this.opts = opts;
                _this.reconnection(opts.reconnection);
                _this.reconnectionAttempts(opts.reconnectionAttempts || Infinity);
                _this.reconnectionDelay(opts.reconnectionDelay || 1000);
                _this.reconnectionDelayMax(opts.reconnectionDelayMax || 5000);
                _this.randomizationFactor(opts.randomizationFactor || 0.5);
                _this.timeout(opts.timeout || 20000);
                _this.backoff = new socketio.Backoff({
                    min: _this.reconnectionDelay(),
                    max: _this.reconnectionDelayMax(),
                    jitter: _this.randomizationFactor()
                });
                _this.readyState = socketio._emReadyState.CLOSED;
                _this.connecting = [];
                _this.lastPing = null;
                _this.encoding = false;
                _this.uri = uri;
                _this.encoder = opts.parser && opts.parser.Encoder || new socketio.parser.Encoder();
                _this.decoder = opts.parser && opts.parser.Decoder || new socketio.parser.Decoder();
                _this.autoConnect = opts.autoConnect !== false;
                return _this;
                // if (this.autoConnect) this.open();
            }
            Manager.prototype.emitAll = function (event) {
                var args = [];
                for (var _i = 1; _i < arguments.length; _i++) {
                    args[_i - 1] = arguments[_i];
                }
                this.emit(event, args);
                for (var key in this.nsps) {
                    this.nsps[key].emit(event, args);
                }
            };
            Manager.prototype.updateSocketIds = function () {
                for (var key in this.nsps) {
                    this.nsps[key].id = this.generateId(key);
                }
            };
            Manager.prototype.generateId = function (nsp) {
                return (("/" === nsp) ? "" : (nsp + "#") + this.engine.id);
            };
            Manager.prototype.reconnection = function (v) {
                if (!v)
                    return this._reconnection;
                this._reconnection = v;
                return this;
            };
            Manager.prototype.reconnectionAttempts = function (v) {
                if (!v)
                    return this._reconnectionAttempts;
                this._reconnectionAttempts = v;
                return this;
            };
            Manager.prototype.reconnectionDelay = function (v) {
                if (!v)
                    return this._reconnectionDelay;
                this._reconnectionDelay = v;
                this.backoff && this.backoff.setMin(v);
                return this;
            };
            Manager.prototype.randomizationFactor = function (v) {
                if (!v)
                    return this._randomizationFactor;
                this._randomizationFactor = v;
                this.backoff && this.backoff.setJitter(v);
                return this;
            };
            Manager.prototype.reconnectionDelayMax = function (v) {
                if (!v)
                    return this._reconnectionDelayMax;
                this._reconnectionDelayMax;
                this.backoff && this.backoff.setMax(v);
                return this;
            };
            Manager.prototype.timeout = function (v) {
                if (!v)
                    return this._timeout;
                this._timeout = v;
                return this;
            };
            Manager.prototype.maybeReconnectOnOpen = function () {
                if (!this.reconnecting && this._reconnection && this.backoff.attempts === 0) {
                    this.reconnect();
                }
            };
            Manager.prototype.open = function (fn, opts) {
                var _this = this;
                if (this.readyState === socketio._emReadyState.OPEN)
                    return this;
                var uri = new socketio.engine.SocketUri(this.uri.toString());
                uri.transports = this.opts.transports;
                this.engine = new socketio.engine.Socket(uri);
                var socket = this.engine;
                this.readyState = socketio._emReadyState.OPENING;
                this.skipReconnect = false;
                var openSub = socketio.on(socket, socketio._emEvent.EVENT_OPEN, function () {
                    _this.onopen();
                    fn && fn();
                });
                var errorSub = socketio.on(socket, socketio._emEvent.EVENT_ERROR, function (data) {
                    _this.cleanup();
                    _this.readyState = socketio._emReadyState.CLOSED;
                    _this.emitAll(socketio._emEvent.EVENT_CONNECT_ERROR, data);
                    if (fn) {
                        var err = new Error('Connection error');
                        err.data = data;
                        fn(err);
                    }
                    else {
                        _this.maybeReconnectOnOpen();
                    }
                });
                if (this._timeout) {
                    var timeout_1 = this._timeout;
                    var timer_1 = egret.setTimeout(function () {
                        openSub.destory();
                        socket.close();
                        socket.emit(socketio._emEvent.EVENT_ERROR, 'timeout');
                        _this.emitAll(socketio._emEvent.EVENT_CONNECT_ERROR, timeout_1);
                    }, this, timeout_1);
                    this.subs.push({
                        destory: function () {
                            egret.clearTimeout(timer_1);
                        }
                    });
                }
                this.subs.push(openSub);
                this.subs.push(errorSub);
                return this;
            };
            Manager.prototype.onopen = function () {
                console.debug('open');
                this.cleanup();
                this.readyState = socketio._emReadyState.OPEN;
                this.emit(socketio._emEvent.EVENT_OPEN);
                var socket = this.engine;
                this.subs.push(socketio.on(socket, socketio._emEvent.EVENT_DATA, this.ondata, this));
                this.subs.push(socketio.on(socket, socketio._emEvent.EVENT_PING, this.onping, this));
                this.subs.push(socketio.on(socket, socketio._emEvent.EVENT_PONG, this.onpong, this));
                this.subs.push(socketio.on(socket, socketio._emEvent.EVENT_ERROR, this.onerror, this));
                this.subs.push(socketio.on(socket, socketio._emEvent.EVENT_CLOSE, this.onclose, this));
                this.subs.push(socketio.on(this.decoder, socketio._emEvent.EVENT_DECODED, this.ondecoded, this));
            };
            Manager.prototype.cleanup = function () {
                var subsLength = this.subs.length;
                for (var i = 0; i < subsLength; i++) {
                    var sub = this.subs.shift();
                    sub.destory && sub.destory();
                }
                this.encoding = false;
                this.lastPing = null;
                this.decoder.destory();
            };
            Manager.prototype.socket = function (nsp, opts) {
                var _this = this;
                var socket = this.nsps[nsp];
                if (!socket) {
                    var onConnecting = function () {
                        if (!_this.connecting.indexOf(socket)) {
                            _this.connecting.push(socket);
                        }
                    };
                    socket = new socketio.Socket(this, nsp, this.uri);
                    this.nsps[nsp] = socket;
                    socket.on(socketio._emEvent.EVENT_CONNECTING, onConnecting);
                    socket.on(socketio._emEvent.EVENT_CONNECT, function () {
                        socket.id = _this.generateId(nsp);
                    });
                    if (this.autoConnect) {
                        onConnecting();
                    }
                }
                return socket;
            };
            Manager.prototype.packet = function (packet) {
                var _this = this;
                console.debug('writing packet', packet);
                if (packet.query && packet.type === 0)
                    packet.nsp += '?' + packet.query;
                if (!this.encoding) {
                    // encode, then write to engine with result
                    this.encoding = true;
                    this.encoder.encode(packet, function (encodedPackets) {
                        for (var i = 0; i < encodedPackets.length; i++) {
                            _this.engine.write(encodedPackets[i], packet.options);
                        }
                        _this.encoding = false;
                        _this.processPacketQueue();
                    });
                }
                else {
                    this.packetBuffer.push(packet);
                }
            };
            Manager.prototype.reconnect = function () {
                var _this = this;
                if (this.reconnecting || this.skipReconnect)
                    return this;
                if (this.backoff.attempts >= this._reconnectionAttempts) {
                    console.debug('reconnect failed');
                    this.backoff.reset();
                    this.emitAll('reconnect_failed');
                    this.reconnecting = false;
                }
                else {
                    var delay = this.backoff.duration();
                    console.debug('will wait ' + delay + 'dms before reconnect attempt');
                    this.reconnecting = true;
                    var timer_2 = egret.setTimeout(function () {
                        if (_this.skipReconnect)
                            return;
                        _this.emitAll(socketio._emEvent.EVENT_RECONNECT_ATTEMPT, _this.backoff.attempts);
                        _this.emitAll(socketio._emEvent.EVENT_RECONNECTING, _this.backoff.attempts);
                        if (_this.skipReconnect)
                            return;
                        _this.open(function (err) {
                            if (err) {
                                console.debug('reconnect attempt error');
                                _this.reconnecting = false;
                                _this.reconnect();
                                _this.emitAll(socketio._emEvent.EVENT_RECONNECT_ERROR, err.data);
                            }
                            else {
                                console.debug('reconnect success');
                                _this.onreconnect();
                            }
                        });
                    }, this, delay);
                    this.subs.push({
                        destory: function () {
                            egret.clearTimeout(timer_2);
                        }
                    });
                }
            };
            Manager.prototype.destroy = function (socket) {
                var index = this.connecting.indexOf(socket);
                if (index > 0)
                    this.connecting.splice(index, 1);
                if (this.connecting.length)
                    return;
                this.close();
            };
            Manager.prototype.processPacketQueue = function () {
                if (this.packetBuffer.length > 0 && !this.encoding) {
                    var pack = this.packetBuffer.shift();
                    this.packet(pack);
                }
            };
            Manager.prototype.close = function () {
                return this.disconnect();
            };
            Manager.prototype.disconnect = function () {
                console.debug('disconnect');
                this.skipReconnect = true;
                this.reconnecting = false;
                if (this.readyState === socketio._emReadyState.OPENING) {
                    this.cleanup();
                }
                this.backoff.reset();
                this.readyState = socketio._emReadyState.CLOSED;
                if (this.engine)
                    this.engine.close();
            };
            Manager.prototype.ondata = function (data) {
                this.decoder.add(data);
            };
            Manager.prototype.onping = function () {
                this.lastPing = new Date();
                this.emitAll(socketio._emEvent.EVENT_PING);
            };
            Manager.prototype.onpong = function () {
                this.emitAll(socketio._emEvent.EVENT_PONG, (new Date().getDate() - this.lastPing.getDate()));
            };
            Manager.prototype.onerror = function (err) {
                console.error(socketio._emEvent.EVENT_ERROR, err);
                this.emitAll(socketio._emEvent.EVENT_ERROR, err);
            };
            Manager.prototype.onclose = function (reasion) {
                console.debug('onclose');
                this.cleanup();
                this.backoff.reset();
                this.readyState = socketio._emReadyState.CLOSED;
                this.emit(socketio._emEvent.EVENT_CLOSE, reasion);
                if (this._reconnection && !this.skipReconnect) {
                    this.reconnect();
                }
            };
            Manager.prototype.ondecoded = function (packet) {
                this.emit(socketio._emEvent.EVENT_PACKET, packet);
            };
            Manager.prototype.onreconnect = function () {
                var attempt = this.backoff.attempts;
                this.reconnecting = false;
                this.backoff.reset();
                this.updateSocketIds();
                this.emitAll(socketio._emEvent.EVENT_RECONNECT, attempt);
            };
            return Manager;
        }(socketio.Emitter));
        socketio.Manager = Manager;
        __reflect(Manager.prototype, "egret.socketio.Manager");
    })(socketio = egret.socketio || (egret.socketio = {}));
})(egret || (egret = {}));
var egret;
(function (egret) {
    var socketio;
    (function (socketio) {
        function on(obj, ev, fn, listenerContext) {
            obj.on(ev, fn, listenerContext);
            return {
                destory: function () {
                    obj.off(ev, fn, listenerContext);
                }
            };
        }
        socketio.on = on;
    })(socketio = egret.socketio || (egret.socketio = {}));
})(egret || (egret = {}));
var egret;
(function (egret) {
    var socketio;
    (function (socketio) {
        var _emParser;
        (function (_emParser) {
            _emParser[_emParser["CONNECT"] = 0] = "CONNECT";
            _emParser[_emParser["DISCONNECT"] = 1] = "DISCONNECT";
            _emParser[_emParser["EVENT"] = 2] = "EVENT";
            _emParser[_emParser["ACK"] = 3] = "ACK";
            _emParser[_emParser["ERROR"] = 4] = "ERROR";
            _emParser[_emParser["BINARY_EVENT"] = 5] = "BINARY_EVENT";
            _emParser[_emParser["BINARY_ACK"] = 6] = "BINARY_ACK";
        })(_emParser = socketio._emParser || (socketio._emParser = {}));
        var parser;
        (function (parser) {
            var EncoderImpl = (function (_super) {
                __extends(EncoderImpl, _super);
                function EncoderImpl() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                EncoderImpl.prototype.encode = function (obj, callback) {
                    if (obj.type === _emParser.BINARY_EVENT || obj.type === _emParser.BINARY_ACK) {
                        this.encodeAsBinary(obj, callback);
                    }
                    else {
                        var encoding = this.encodeAsString(obj);
                        callback([encoding]);
                    }
                };
                EncoderImpl.prototype.encodeAsString = function (obj) {
                    var str = '' + obj.type;
                    if (_emParser.BINARY_EVENT === obj.type || _emParser.BINARY_ACK === obj.type) {
                        str += obj.attachments + '-';
                    }
                    if (obj.nsp && '/' !== obj.nsp) {
                        str += obj.nsp + ',';
                    }
                    if (obj.id) {
                        str += obj.id;
                    }
                    if (obj.data) {
                        var payload = this.tryStringify(obj.data);
                        if (payload !== false) {
                            str += payload;
                        }
                        else {
                            return EncoderImpl.ERROR_PACKET;
                        }
                    }
                    return str;
                };
                EncoderImpl.prototype.tryStringify = function (str) {
                    try {
                        return JSON.stringify(str);
                    }
                    catch (e) {
                        return false;
                    }
                };
                EncoderImpl.prototype.encodeAsBinary = function (obj, callback) {
                    //TODO
                };
                EncoderImpl.ERROR_PACKET = _emParser.ERROR + '"encode error"';
                return EncoderImpl;
            }(socketio.Emitter));
            __reflect(EncoderImpl.prototype, "EncoderImpl", ["egret.socketio.parser.Encoder"]);
            var DecoderImpl = (function (_super) {
                __extends(DecoderImpl, _super);
                function DecoderImpl() {
                    var _this = _super !== null && _super.apply(this, arguments) || this;
                    _this.reconstructor = null;
                    return _this;
                }
                DecoderImpl.prototype.add = function (obj) {
                    var packet;
                    if (typeof obj === 'string') {
                        packet = this.decodeString(obj);
                        if (_emParser.BINARY_EVENT === packet.type || _emParser.BINARY_ACK === packet.type) {
                            this.reconstructor = new socketio.BinaryReconstructor(packet);
                        }
                        else {
                            this.emit(socketio._emEvent.EVENT_DECODED, packet);
                        }
                    }
                };
                DecoderImpl.prototype.decodeString = function (str) {
                    var i = 0;
                    var p = {
                        type: Number(str.charAt(0))
                    };
                    if (!_emParser[p.type]) {
                        return this.error('unknown packet type ' + p.type);
                    }
                    if (p.type === _emParser.BINARY_EVENT || p.type === _emParser.BINARY_ACK) {
                        var buf = '';
                        while (str.charAt(++i) !== '-') {
                            buf += str.charAt(i);
                            if (i == str.length)
                                break;
                        }
                        if (buf != Number(buf).toString() || str.charAt(i) !== '-') {
                            throw new Error('Illegal attachments');
                        }
                        p.attachments = Number(buf);
                    }
                    if ('/' === str.charAt(i + 1)) {
                        p.nsp = '';
                        while (++i) {
                            var c = str.charAt(i);
                            if (',' === c)
                                break;
                            p.nsp += c;
                            if (i === str.length)
                                break;
                        }
                    }
                    else {
                        p.nsp = '/';
                    }
                    var next = str.charAt(i + 1);
                    if ('' !== next && Number(next).toString() == next) {
                        var id = '';
                        while (++i) {
                            var c = str.charAt(i);
                            if (null == c || Number(c).toString() != c) {
                                --i;
                                break;
                            }
                            id += str.charAt(i);
                            if (i === str.length)
                                break;
                        }
                        p.id = Number(id);
                    }
                    if (str.charAt(++i)) {
                        var payload = this.tryParse(str.substr(i));
                        var isPayloadValid = payload !== false && (p.type === _emParser.ERROR || socketio.isArray(payload));
                        if (isPayloadValid) {
                            p.data = payload;
                        }
                        else {
                            return this.error('invalid payload');
                        }
                    }
                    return p;
                };
                DecoderImpl.prototype.tryParse = function (str) {
                    try {
                        return JSON.parse(str);
                    }
                    catch (e) {
                        return false;
                    }
                };
                DecoderImpl.prototype.error = function (msg) {
                    return {
                        type: _emParser.ERROR,
                        data: 'parser error: ' + msg
                    };
                };
                DecoderImpl.prototype.destory = function () {
                };
                DecoderImpl.prototype.onDecoded = function (callback) {
                };
                return DecoderImpl;
            }(socketio.Emitter));
            __reflect(DecoderImpl.prototype, "DecoderImpl", ["egret.socketio.parser.Decoder"]);
            parser.Encoder = EncoderImpl;
            parser.Decoder = DecoderImpl;
        })(parser = socketio.parser || (socketio.parser = {}));
    })(socketio = egret.socketio || (egret.socketio = {}));
})(egret || (egret = {}));
var egret;
(function (egret) {
    var socketio;
    (function (socketio) {
        var events = {
            connect: 1,
            connect_error: 1,
            connect_timeout: 1,
            connecting: 1,
            disconnect: 1,
            error: 1,
            reconnect: 1,
            reconnect_attempt: 1,
            reconnect_failed: 1,
            reconnect_error: 1,
            reconnecting: 1,
            ping: 1,
            pong: 1
        };
        var Socket = (function (_super) {
            __extends(Socket, _super);
            function Socket(io, nsp, opts) {
                var _this = _super.call(this) || this;
                _this.receiveBuffer = [];
                _this.sendBuffer = [];
                _this.acks = {};
                _this.io = io;
                _this.nsp = nsp;
                _this.ids = 0;
                _this.connected = false;
                _this.disconnected = true;
                _this.flags = {};
                _this.uri = opts;
                if (_this.io.autoConnect)
                    _this.open();
                return _this;
            }
            Socket.prototype.subEvents = function () {
                if (this.subs)
                    return;
                var io = this.io;
                this.subs = [
                    socketio.on(io, socketio._emEvent.EVENT_OPEN, this.onopen, this),
                    socketio.on(io, socketio._emEvent.EVENT_PACKET, this.onpacket, this),
                    socketio.on(io, socketio._emEvent.EVENT_CLOSE, this.onclose, this)
                ];
            };
            Socket.prototype.open = function () {
                var _this = this;
                new Promise(function (resolve) {
                    if (_this.connected)
                        return;
                    _this.subEvents();
                    _this.io.open();
                    if (_this.io.readyState === socketio._emReadyState.OPEN)
                        _this.onopen();
                    _this.emit(socketio._emEvent.EVENT_CONNECTING);
                });
                return this;
            };
            Socket.prototype.send = function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                args.unshift(socketio._emEvent.EVENT_MESSAGE);
                this.emit.apply(this, args);
                return this;
            };
            Socket.prototype.emit = function (event) {
                var args = [];
                for (var _i = 1; _i < arguments.length; _i++) {
                    args[_i - 1] = arguments[_i];
                }
                if (events.hasOwnProperty(event)) {
                    _super.prototype.emit.call(this, event, args);
                    return this;
                }
                args.unshift(event);
                var data = socketio.toArray(args);
                var packet = {
                    type: /*(this.flags.binary !== undefined ? this.flags.binary : hasBin(args)) ? parser.BINARY_EVENT :*/ socketio._emParser.EVENT,
                    data: data
                };
                packet.options = {};
                packet.options.compress = !this.flags || false !== this.flags.compress;
                if (typeof data[data.length - 1] === 'function') {
                    console.debug('emitting packet with ack id ' + this.ids);
                    this.acks[this.ids] = data.pop();
                    packet.id = this.ids++;
                }
                if (this.connected) {
                    this.packet(packet);
                }
                else {
                    this.sendBuffer.push(packet);
                }
                return this;
            };
            Socket.prototype.connnect = function () {
                return this.open();
            };
            Socket.prototype.close = function () {
                return this.disconnect();
            };
            Socket.prototype.disconnect = function () {
                if (this.connected) {
                    console.debug('performing disconnect ' + this.nsp);
                    this.packet({ type: socketio._emParser.DISCONNECT });
                }
                this.destroy();
                if (this.connected) {
                    this.onclose('io client disconnect');
                }
                return this;
            };
            Socket.prototype.packet = function (packet) {
                packet.nsp = this.nsp;
                this.io.packet(packet);
            };
            Socket.prototype.ack = function (id) {
                var _this = this;
                var sent = false;
                return function () {
                    var args = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        args[_i] = arguments[_i];
                    }
                    if (sent)
                        return;
                    sent = true;
                    var _args = socketio.toArray(args);
                    _this.packet({
                        type: socketio._emParser.ACK,
                        id: id,
                        data: _args
                    });
                };
            };
            Socket.prototype.destroy = function () {
                if (this.subs) {
                    for (var i = 0; i < this.subs.length; i++) {
                        this.subs[i].destory();
                    }
                    this.subs = null;
                }
                this.io.destroy(this);
            };
            Socket.prototype.emitBuffered = function () {
                //TODO
                for (var k in this.receiveBuffer) {
                    _super.prototype.emit.apply(this, this.receiveBuffer[k]);
                }
                this.receiveBuffer = [];
                for (var k in this.sendBuffer) {
                    this.packet(this.sendBuffer[k]);
                }
                this.sendBuffer = [];
            };
            Socket.prototype.onopen = function () {
                console.debug('transport is open - connecting');
                if ('/' !== this.nsp) {
                    if (this.uri.query()) {
                        this.packet({ type: socketio._emParser.CONNECT, query: this.uri.query() });
                    }
                    else {
                        this.packet({ type: socketio._emParser.CONNECT });
                    }
                }
            };
            Socket.prototype.onpacket = function (packet) {
                var sameNamespace = packet.nsp === this.nsp;
                var rootNamespaceError = packet.type === socketio._emParser.ERROR && packet.nsp === '/';
                if (!sameNamespace && !rootNamespaceError)
                    return;
                switch (packet.type) {
                    case socketio._emParser.CONNECT:
                        this.onconnect();
                        break;
                    case socketio._emParser.EVENT:
                        this.onevent(packet);
                        break;
                    case socketio._emParser.BINARY_EVENT:
                        this.onevent(packet);
                        break;
                    case socketio._emParser.ACK:
                        this.onack(packet);
                        break;
                    case socketio._emParser.BINARY_ACK:
                        this.onack(packet);
                        break;
                    case socketio._emParser.DISCONNECT:
                        this.ondisconnect();
                        break;
                    case socketio._emParser.ERROR:
                        this.emit(socketio._emEvent.EVENT_ERROR, packet.data);
                        break;
                }
            };
            Socket.prototype.onconnect = function () {
                this.connected = true;
                this.emit(socketio._emEvent.EVENT_CONNECT);
                this.emitBuffered();
            };
            Socket.prototype.onevent = function (packet) {
                var args = packet.data || [];
                if (packet.id != null) {
                    args.push(this.ack(packet.id));
                }
                if (this.connected) {
                    _super.prototype.emit.apply(this, args);
                }
                else {
                    this.receiveBuffer.push(args);
                }
            };
            Socket.prototype.onack = function (packet) {
                var ack = this.acks[packet.id];
                if (typeof ack === 'function') {
                    ack.apply(this, packet.data);
                    delete (this.acks[packet.id]);
                }
                else {
                    console.warn('bad ack ' + packet.id);
                }
            };
            Socket.prototype.ondisconnect = function () {
                console.debug('server disconnect ' + this.nsp);
                this.destroy();
                this.onclose('io server disconnect');
            };
            Socket.prototype.onclose = function (reason) {
                console.debug("close");
                this.connected = false;
                this.disconnected = true;
                delete this.id;
                this.emit(socketio._emEvent.EVENT_DISCONNECT, reason);
            };
            return Socket;
        }(socketio.Emitter));
        socketio.Socket = Socket;
        __reflect(Socket.prototype, "egret.socketio.Socket");
    })(socketio = egret.socketio || (egret.socketio = {}));
})(egret || (egret = {}));
var egret;
(function (egret) {
    var socketio;
    (function (socketio) {
        var Backoff = (function () {
            function Backoff(opts) {
                this.ms = 100;
                this.max = 10000;
                this.factor = 2;
                this.attempts = 0;
                opts = opts || {};
                this.ms = opts.min || 100;
                this.max = opts.max || 10000;
                this.jitter = opts.jitter > 0 && opts.jitter <= 1 ? opts.jitter : 0;
                this.factor = opts.factor || 2;
                this.attempts = 0;
            }
            Backoff.prototype.setMin = function (v) {
                this.ms = v;
                return this;
            };
            Backoff.prototype.setMax = function (v) {
                this.max = v;
                return this;
            };
            Backoff.prototype.setJitter = function (v) {
                this.jitter = v;
                return this;
            };
            Backoff.prototype.setFactor = function (v) {
                this.factor = v;
                return this;
            };
            Backoff.prototype.reset = function () {
                this.attempts = 0;
            };
            Backoff.prototype.duration = function () {
                var ms = this.ms * Math.pow(this.factor, this.attempts++);
                if (this.jitter) {
                    var rand = Math.random();
                    var deviation = Math.floor(rand * this.jitter * ms);
                    ms = (Math.floor(rand * 10) & 1) == 0 ? ms - deviation : ms + deviation;
                }
                return Math.min(ms, this.max) | 0;
            };
            return Backoff;
        }());
        socketio.Backoff = Backoff;
        __reflect(Backoff.prototype, "egret.socketio.Backoff");
    })(socketio = egret.socketio || (egret.socketio = {}));
})(egret || (egret = {}));
var egret;
(function (egret) {
    var socketio;
    (function (socketio) {
        var BinaryReconstructor = (function () {
            function BinaryReconstructor(packet) {
                this.buffers = [];
                this.reconPack = packet;
            }
            BinaryReconstructor.prototype.takeBinaryData = function (binData) {
                // this.buffers.push(binData);
                // if (this.buffers.length ===this.reconPack.attachments) {
                //     let packet = binary.reconstructPacket(this.reconPack, this.buffers);
                //     this.finishedReconstruction();
                //     return packet;
                // }
                return null;
            };
            BinaryReconstructor.prototype.finishedReconstruction = function () {
                this.reconPack = null;
                this.buffers = [];
            };
            return BinaryReconstructor;
        }());
        socketio.BinaryReconstructor = BinaryReconstructor;
        __reflect(BinaryReconstructor.prototype, "egret.socketio.BinaryReconstructor");
    })(socketio = egret.socketio || (egret.socketio = {}));
})(egret || (egret = {}));
/// <reference path="./Uri.ts" />
/// <reference path="./engine/Transport.ts" />
var egret;
(function (egret) {
    var socketio;
    (function (socketio) {
        var IO = (function () {
            function IO() {
                this._cache = {};
            }
            IO.prototype.socket = function (uri, opts) {
                var uristr = typeof uri == 'string' ? uri : uri.toString();
                opts = opts || {};
                var parsed = new socketio.Uri(uristr);
                parsed.addTrailingSlash();
                var id = socketio.Url.extractId(uristr);
                var path = parsed.path;
                var sameNamespace = this._cache[id] && path in this._cache[id].nsps;
                var newConnection = opts.forceNew || opts['force new connection'] || false === opts.multiplex || sameNamespace;
                var io;
                if (newConnection) {
                    io = new socketio.Manager(parsed, opts);
                }
                else {
                    if (!this._cache[id]) {
                        this._cache[id] = new socketio.Manager(parsed, opts);
                    }
                    io = this._cache[id];
                }
                return io.socket(path, opts);
            };
            IO.getInstance = function () {
                if (!this.instance) {
                    this.instance = new IO();
                }
                return this.instance;
            };
            return IO;
        }());
        __reflect(IO.prototype, "IO");
        socketio.SocketIOClientStatic = function (uri, opts) {
            return IO.getInstance().socket(uri, opts);
        };
        socketio.SocketIOClientStatic.prototype.connect = function (uri, opts) {
            return IO.getInstance().socket(uri, opts);
        };
        socketio.io = socketio.SocketIOClientStatic;
    })(socketio = egret.socketio || (egret.socketio = {}));
})(egret || (egret = {}));
var egret;
(function (egret) {
    var socketio;
    (function (socketio) {
        var Url = (function () {
            function Url(uri) {
                if (typeof uri === 'string') {
                    uri = new socketio.Uri(uri);
                }
                this.uri = uri;
                this.protocol = uri.protocol;
                var path = uri.path;
                if (typeof path === 'undefined' || path.length == 0) {
                    path = '/';
                }
                this.path = path;
                this.host = uri.host;
                var port = uri.port;
                if (typeof port === 'undefined') {
                    if (Url.PATTERN_HTTP.test(this.protocol)) {
                        port = 80;
                    }
                    else {
                        port = 443;
                    }
                }
            }
            Url.prototype.toString = function () {
                var url;
                if (this.protocol === null || this.protocol.match(/^https?|wss?$/g)) {
                    url = 'https';
                }
                var path = this.path;
                if (typeof path === 'undefined' || path.length == 0) {
                    path = '/';
                }
                if (this.uri.userInfo !== null) {
                    url += this.uri.userInfo + "@";
                }
                url += this.uri.host;
                var port = this.port;
                if (typeof port === 'undefined') {
                    if (Url.PATTERN_HTTP.test(this.protocol)) {
                        port = 80;
                    }
                    else {
                        port = 443;
                    }
                }
                url += ':' + port.toString();
                url += path;
                if (this.uri.query) {
                    url += '?' + this.uri.query;
                }
                if (this.uri.anchor) {
                    if (this.uri.anchor.indexOf('#') !== 0) {
                        url += '#';
                    }
                    url += this.uri.anchor;
                }
                return url;
            };
            Url.parse = function (uri) {
                return new Url(uri);
            };
            Url.extractId = function (uri) {
                if (typeof uri === 'string') {
                    uri = new socketio.Uri(uri);
                }
                var protocol = uri.protocol;
                var port = uri.port;
                if (!port) {
                    if (this.PATTERN_HTTP.test(protocol)) {
                        port = 80;
                    }
                    else if (this.PATTERN_HTTPS.test(protocol)) {
                        port = 443;
                    }
                }
                return protocol + '://' + uri.host + ':' + port.toString();
            };
            Url.secure = function (uri) {
                if (typeof uri === 'string') {
                    uri = new socketio.Uri(uri);
                }
                return this.PATTERN_HTTPS.test(uri.protocol);
            };
            Url.PATTERN_HTTP = /^http|ws$/;
            Url.PATTERN_HTTPS = /^(http|ws)s$/;
            return Url;
        }());
        socketio.Url = Url;
        __reflect(Url.prototype, "egret.socketio.Url");
    })(socketio = egret.socketio || (egret.socketio = {}));
})(egret || (egret = {}));
var egret;
(function (egret) {
    var socketio;
    (function (socketio) {
        var engine;
        (function (engine) {
            var _emPacketType;
            (function (_emPacketType) {
                _emPacketType[_emPacketType["open"] = 0] = "open";
                _emPacketType[_emPacketType["close"] = 1] = "close";
                _emPacketType[_emPacketType["ping"] = 2] = "ping";
                _emPacketType[_emPacketType["pong"] = 3] = "pong";
                _emPacketType[_emPacketType["message"] = 4] = "message";
                _emPacketType[_emPacketType["upgrade"] = 5] = "upgrade";
                _emPacketType[_emPacketType["noop"] = 6] = "noop";
                _emPacketType[_emPacketType["error"] = 7] = "error";
            })(_emPacketType = engine._emPacketType || (engine._emPacketType = {}));
            var TransportUri = (function (_super) {
                __extends(TransportUri, _super);
                function TransportUri(str) {
                    var _this = _super.call(this, str) || this;
                    _this.secure = /^(http|ws)s$/.test(_this.protocol);
                    _this.timestampParam = 't';
                    var hostname = _this.host;
                    if (_this.ipv6) {
                        var start = hostname.indexOf('[');
                        if (start != -1)
                            hostname = hostname.substring(start + 1);
                        var end = hostname.lastIndexOf(']');
                        if (end != -1)
                            hostname = hostname.substring(0, end);
                    }
                    _this.hostname = hostname;
                    return _this;
                }
                Object.defineProperty(TransportUri.prototype, "ipv6", {
                    get: function () {
                        return this.host.split(":").length > 2;
                    },
                    enumerable: true,
                    configurable: true
                });
                TransportUri.prototype.clone = function () {
                    return new TransportUri(this.toString());
                };
                return TransportUri;
            }(socketio.Uri));
            engine.TransportUri = TransportUri;
            __reflect(TransportUri.prototype, "egret.socketio.engine.TransportUri");
            var SocketUri = (function (_super) {
                __extends(SocketUri, _super);
                function SocketUri(str) {
                    var _this = _super.call(this, str) || this;
                    _this.upgrade = true;
                    _this.transportOptions = {};
                    return _this;
                }
                SocketUri.prototype.clone = function () {
                    return new SocketUri(this.toString());
                };
                return SocketUri;
            }(TransportUri));
            engine.SocketUri = SocketUri;
            __reflect(SocketUri.prototype, "egret.socketio.engine.SocketUri");
        })(engine = socketio.engine || (socketio.engine = {}));
    })(socketio = egret.socketio || (egret.socketio = {}));
})(egret || (egret = {}));
var egret;
(function (egret) {
    var socketio;
    (function (socketio) {
        var engine;
        (function (engine) {
            var err = { type: "error", data: "parser error" };
            var Parser = (function () {
                function Parser() {
                }
                Parser.decodePacket = function (data, utf8decode) {
                    if (data === undefined) {
                        return err;
                    }
                    if (utf8decode) {
                        return err;
                    }
                    var type = Number(data.charAt(0));
                    if (!engine._emPacketType[type]) {
                        return err;
                    }
                    if (data.length > 1) {
                        return { type: engine._emPacketType[type], data: data.substring(1) };
                    }
                    else {
                        return { type: engine._emPacketType[type] };
                    }
                };
                Parser.decodePayload = function (data, fn) {
                    if (!data || data.length === 0) {
                        return fn(err, 0, 1);
                    }
                    var length = '', n, msg;
                    for (var i = 0, l = data.length; i < l; i++) {
                        var chr = data.charAt(i);
                        if (':' != chr) {
                            length += chr;
                            continue;
                        }
                        if (length === '' || (length != (n = Number(length)).toString())) {
                            return fn(err, 0, 1);
                        }
                        msg = data.substr(i + 1, n);
                        if (n != msg.length) {
                            return fn(err, 0, 1);
                        }
                        if (msg.length) {
                            var packet = this.decodePacket(msg, false);
                            if (err.type === packet.type && err.data === packet.data) {
                                return fn(err, 0, 1);
                            }
                            var ret = fn(packet, i + n, l);
                            if (false === ret)
                                return;
                        }
                        i += n;
                        length = '';
                    }
                    if (length != '') {
                        return fn(err, 0, 1);
                    }
                };
                Parser.encodePacket = function (packet, utf8decode, fn) {
                    var encoded = engine._emPacketType[packet.type].toString();
                    if (packet.data) {
                        encoded += packet.data;
                    }
                    fn(encoded);
                };
                Parser.encodePayload = function (packets, fn) {
                    /**
                     * TODO: 预留字节编码
                     */
                    var _this = this;
                    if (packets.length === 0) {
                        return fn('0:');
                    }
                    var result = '';
                    for (var idx in packets) {
                        this.encodePacket(packets[idx], false, function (message) {
                            result += _this.setLengthHeader(message);
                        });
                    }
                    fn(result);
                };
                Parser.setLengthHeader = function (message) {
                    return message.length.toString() + ':' + message;
                };
                return Parser;
            }());
            engine.Parser = Parser;
            __reflect(Parser.prototype, "egret.socketio.engine.Parser");
        })(engine = socketio.engine || (socketio.engine = {}));
    })(socketio = egret.socketio || (egret.socketio = {}));
})(egret || (egret = {}));
var egret;
(function (egret) {
    var socketio;
    (function (socketio) {
        var _emReadyState;
        (function (_emReadyState) {
            _emReadyState[_emReadyState["OPENING"] = 0] = "OPENING";
            _emReadyState[_emReadyState["OPEN"] = 1] = "OPEN";
            _emReadyState[_emReadyState["CLOSING"] = 2] = "CLOSING";
            _emReadyState[_emReadyState["CLOSED"] = 3] = "CLOSED";
            _emReadyState[_emReadyState["PAUSING"] = 4] = "PAUSING";
            _emReadyState[_emReadyState["PAUSED"] = 5] = "PAUSED";
        })(_emReadyState = socketio._emReadyState || (socketio._emReadyState = {}));
        var _emEvent;
        (function (_emEvent) {
            _emEvent["EVENT_OPEN"] = "open";
            _emEvent["EVENT_CLOSE"] = "close";
            _emEvent["EVENT_PACKET"] = "packet";
            _emEvent["EVENT_MESSAGE"] = "message";
            _emEvent["EVENT_ERROR"] = "error";
            _emEvent["EVENT_UPGRADE_ERROR"] = "upgradeError";
            _emEvent["EVENT_FLUSH"] = "flush";
            _emEvent["EVENT_DRAIN"] = "drain";
            _emEvent["EVENT_HANDSHAKE"] = "handshake";
            _emEvent["EVENT_UPGRADING"] = "upgrading";
            _emEvent["EVENT_UPGRADE"] = "upgrade";
            _emEvent["EVENT_PACKET_CREATE"] = "packetCreate";
            _emEvent["EVENT_HEARTBEAT"] = "heartbeat";
            _emEvent["EVENT_DATA"] = "data";
            _emEvent["EVENT_CONNECT"] = "connect";
            _emEvent["EVENT_CONNECTING"] = "connecting";
            _emEvent["EVENT_CONNECT_ERROR"] = "connect_error";
            _emEvent["EVENT_CONNECT_TIMEOUT"] = "connect_timeout";
            _emEvent["EVENT_DISCONNECT"] = "disconnect";
            _emEvent["EVENT_RECONNECT"] = "reconnect";
            _emEvent["EVENT_RECONNECT_ERROR"] = "reconnect_error";
            _emEvent["EVENT_RECONNECT_FAILED"] = "reconnect_failed";
            _emEvent["EVENT_RECONNECT_ATTEMPT"] = "reconnect_attempt";
            _emEvent["EVENT_RECONNECTING"] = "reconnecting";
            _emEvent["EVENT_PING"] = "ping";
            _emEvent["EVENT_PONG"] = "pong";
            _emEvent["EVENT_TRANSPORT"] = "transport";
            _emEvent["EVENT_REQUEST_HEADERS"] = "requestHeaders";
            _emEvent["EVENT_RESPONSE_HEADERS"] = "responseHeaders";
            _emEvent["EVENT_POLL"] = "poll";
            _emEvent["EVENT_POLL_COMPLETE"] = "pollComplete";
            _emEvent["EVENT_DECODED"] = "decoded";
        })(_emEvent = socketio._emEvent || (socketio._emEvent = {}));
        function toArray(list, index) {
            var array = [];
            index = index || 0;
            for (var i = index || 0; i < list.length; i++) {
                array[i - index] = list[i];
            }
            return array;
        }
        socketio.toArray = toArray;
        function isArray(arr) {
            return {}.toString.call(arr) == '[object Array]';
        }
        socketio.isArray = isArray;
    })(socketio = egret.socketio || (egret.socketio = {}));
})(egret || (egret = {}));
var egret;
(function (egret) {
    var socketio;
    (function (socketio) {
        var engine;
        (function (engine) {
            var PollingXHR = (function (_super) {
                __extends(PollingXHR, _super);
                function PollingXHR() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                PollingXHR.prototype.request = function (opts) {
                    opts = opts || { method: "GET" };
                    var req = new egret.HttpRequest();
                    req.open(this.uri(), opts.method);
                    req.response;
                    return req;
                };
                PollingXHR.prototype.doPoll = function () {
                    var _this = this;
                    console.debug("xhr poll");
                    var req = this.request();
                    req.addEventListener(egret.Event.COMPLETE, function () {
                        var data = req.response;
                        _this.onData(data);
                    }, this);
                    req.addEventListener(egret.IOErrorEvent.IO_ERROR, function () {
                        _this.onError("xhr poll error");
                    }, this);
                    req.responseType = egret.HttpResponseType.TEXT;
                    req.send();
                };
                PollingXHR.prototype.doWrite = function (data, fn) {
                    var _this = this;
                    var opts = {};
                    opts.method = "POST";
                    opts.data = data;
                    var req = this.request(opts);
                    req.addEventListener(egret.Event.COMPLETE, function () {
                        fn();
                    }, this);
                    req.addEventListener(egret.IOErrorEvent.IO_ERROR, function () {
                        _this.onError("xhr post error");
                    }, this);
                    req.send(opts.data);
                };
                return PollingXHR;
            }(engine.Polling));
            engine.PollingXHR = PollingXHR;
            __reflect(PollingXHR.prototype, "egret.socketio.engine.PollingXHR");
        })(engine = socketio.engine || (socketio.engine = {}));
    })(socketio = egret.socketio || (egret.socketio = {}));
})(egret || (egret = {}));
var egret;
(function (egret) {
    var socketio;
    (function (socketio) {
        var engine;
        (function (engine) {
            var Socket = (function (_super) {
                __extends(Socket, _super);
                function Socket(uri) {
                    var _this = _super.call(this) || this;
                    _this.id = null;
                    _this.upgrades = null;
                    _this.upgrading = false;
                    _this.pingInterval = null;
                    _this.pingTimeout = null;
                    _this.pingIntervalTimer = null;
                    _this.pingTimeoutTimer = null;
                    _this.writeBuffer = [];
                    _this.prevBufferLen = 0;
                    if (typeof uri === 'string') {
                        uri = new engine.SocketUri(uri);
                    }
                    _this.readyState = socketio._emReadyState.CLOSED;
                    _this.opts = uri.clone();
                    if (!uri.port) {
                        _this.opts.port = uri.secure ? 443 : 80;
                    }
                    _this.opts.transports = uri.transports || [engine.Polling.NAME, engine.WebSocket.NAME];
                    // this.secure = opts.secure;
                    // if (!opts.port) {
                    //     opts.port = this.secure ? 443 : 80;
                    // }
                    // this.hostname = opts.hostname || 'localhost';
                    // this.port = opts.port;
                    // this.query = parseQuery(opts.query);
                    // this.upgrade = opts.upgrade;
                    // this.path = (opts.path || '/engine.io').replace('/$', '') + '/';
                    // this.timestampParam = opts.timestampParam || 't';
                    // this.timestampRequests = opts.timestampRequests;
                    // this.transports = opts.transports || [Polling.NAME, WebSocket.NAME];
                    // this.transportOptions = opts.transportOptions || new Map();
                    // this.policyPort = opts.policyPort;
                    // this.rememberUpgrade = opts.rememberUpgrade;
                    _this.open();
                    return _this;
                }
                Socket.prototype.open = function () {
                    var _this = this;
                    new Promise(function (reslove, reject) {
                        var transportName;
                        if (_this.opts.rememberUpgrade && Socket.priorWebsocketSuccess && _this.opts.transports.indexOf(engine.WebSocket.NAME) !== -1) {
                            transportName = engine.WebSocket.NAME;
                        }
                        else if (0 === _this.opts.transports.length) {
                            _this.emit(socketio._emEvent.EVENT_ERROR, "No transports available");
                            return;
                        }
                        else {
                            transportName = _this.opts.transports[0];
                        }
                        _this.readyState = socketio._emReadyState.OPENING;
                        var transport = _this.createTransport(transportName);
                        _this.setTransport(transport);
                        transport.open();
                    });
                    return this;
                };
                Socket.prototype.flush = function () {
                    if (this.readyState !== socketio._emReadyState.CLOSED && this.transport.writable && !this.upgrading && this.writeBuffer.length) {
                        this.transport.send(this.writeBuffer);
                        this.prevBufferLen = this.writeBuffer.length;
                        this.emit(socketio._emEvent.EVENT_FLUSH);
                    }
                };
                Socket.prototype.probe = function (name) {
                    var _this = this;
                    var transport = this.createTransport(name, { probe: 1 });
                    var failed = false;
                    Socket.priorWebsocketSuccess = false;
                    var onTransportOpen = function () {
                        // if (self.onlyBinaryUpgrades) {
                        //     var upgradeLosesBinary = !this.supportsBinary && self.transport.supportsBinary;
                        //     failed = failed || upgradeLosesBinary;
                        //   }
                        if (failed)
                            return;
                        transport.send([{ type: engine._emPacketType[engine._emPacketType.ping], data: 'probe' }]);
                        transport.once(socketio._emEvent.EVENT_PACKET, function (msg) {
                            if (failed)
                                return;
                            if (engine._emPacketType[msg.type] === engine._emPacketType.pong && msg.data === 'probe') {
                                _this.upgrading = true;
                                _this.emit(socketio._emEvent.EVENT_UPGRADING, transport);
                                if (!transport)
                                    return;
                                Socket.priorWebsocketSuccess = engine.WebSocket.NAME === transport.name;
                                _this.transport.pause(function () {
                                    if (failed)
                                        return;
                                    if (_this.readyState === socketio._emReadyState.CLOSED)
                                        return;
                                    cleanup();
                                    _this.setTransport(transport);
                                    transport.send([{ type: engine._emPacketType[engine._emPacketType.upgrade] }]);
                                    _this.emit(socketio._emEvent.EVENT_UPGRADE, transport);
                                    transport = null;
                                    _this.upgrading = false;
                                    _this.flush();
                                });
                            }
                            else {
                                var err = new Error('probe error');
                                err.transport = transport.name;
                                _this.emit(socketio._emEvent.EVENT_UPGRADE_ERROR, err);
                            }
                        });
                    };
                    var freezeTransport = function () {
                        if (failed)
                            return;
                        failed = true;
                        cleanup();
                        transport && transport.close();
                        transport = null;
                    };
                    var onerror = function (err) {
                        var error = new Error('probe error: ' + err);
                        error.transport = transport && transport.name;
                        freezeTransport();
                        _this.emit(socketio._emEvent.EVENT_UPGRADE_ERROR, error);
                    };
                    var onTransportClose = function () {
                        onerror('transport closed');
                    };
                    var onclose = function () {
                        onerror('socket closed');
                    };
                    var onupgrade = function (to) {
                        if (transport && to.name != transport.name) {
                            freezeTransport();
                        }
                    };
                    var cleanup = function () {
                        transport && transport.off(socketio._emEvent.EVENT_OPEN, onTransportOpen);
                        transport && transport.off(socketio._emEvent.EVENT_ERROR, onerror);
                        transport && transport.off(socketio._emEvent.EVENT_CLOSE, onclose);
                        _this.off(socketio._emEvent.EVENT_CLOSE, onclose);
                        _this.off(socketio._emEvent.EVENT_UPGRADING, onupgrade);
                    };
                    transport.once(socketio._emEvent.EVENT_OPEN, onTransportOpen);
                    transport.once(socketio._emEvent.EVENT_ERROR, onerror);
                    transport.once(socketio._emEvent.EVENT_CLOSE, onclose);
                    this.once(socketio._emEvent.EVENT_CLOSE, onclose);
                    this.once(socketio._emEvent.EVENT_UPGRADING, onupgrade);
                    transport.open();
                };
                Socket.prototype.ping = function () {
                    var _this = this;
                    this.sendPacket(engine._emPacketType[engine._emPacketType.ping], function () {
                        _this.emit(socketio._emEvent.EVENT_PING);
                    });
                };
                Socket.prototype.createTransport = function (name, probe) {
                    var options = this.opts.transportOptions[name];
                    var opts = new engine.TransportUri(this.opts.toString());
                    opts.addQueryParam('EIO', 3);
                    opts.addQueryParam('transport', name);
                    if (this.id) {
                        opts.addQueryParam('sid', this.id);
                    }
                    opts.hostname = (options && options.hostname) || this.opts.hostname;
                    opts.port = (options && options.port) || this.opts.port;
                    opts.secure = (options && options.secure) || this.opts.secure;
                    opts.path = (options && options.path) || this.opts.path;
                    opts.timestampRequests = (options && options.timestampRequests) || this.opts.timestampRequests;
                    opts.timestampParam = (options && options.timestampParam) || this.opts.timestampParam;
                    opts.policyPort = (options && options.policyPort) || this.opts.policyPort;
                    var transport;
                    if (engine.WebSocket.NAME === name) {
                        transport = new engine.WebSocket(opts);
                    }
                    else if (engine.Polling.NAME === name) {
                        transport = new engine.PollingXHR(opts);
                    }
                    else {
                        return null;
                    }
                    this.emit(socketio._emEvent.EVENT_TRANSPORT, transport);
                    return transport;
                };
                Socket.prototype.setTransport = function (transport) {
                    if (this.transport) {
                        this.transport.off();
                    }
                    this.transport = transport;
                    transport.on(socketio._emEvent.EVENT_DRAIN, this.onDrain, this)
                        .on(socketio._emEvent.EVENT_PACKET, this.onPacket, this)
                        .on(socketio._emEvent.EVENT_ERROR, this.onError, this)
                        .on(socketio._emEvent.EVENT_CLOSE, this.onClose, this);
                };
                Socket.prototype.onDrain = function () {
                    this.writeBuffer.splice(0, this.prevBufferLen);
                    // setting prevBufferLen = 0 is very important
                    // for example, when upgrading, upgrade packet is sent over,
                    // and a nonzero prevBufferLen could cause problems on `drain`
                    this.prevBufferLen = 0;
                    if (0 === this.writeBuffer.length) {
                        this.emit('drain');
                    }
                    else {
                        this.flush();
                    }
                };
                Socket.prototype.onPacket = function (packet) {
                    if (this.readyState === socketio._emReadyState.OPENING ||
                        this.readyState === socketio._emReadyState.OPEN ||
                        this.readyState === socketio._emReadyState.CLOSING) {
                        this.emit(socketio._emEvent.EVENT_PACKET, packet);
                        this.emit(socketio._emEvent.EVENT_HEARTBEAT);
                        switch (engine._emPacketType[packet.type]) {
                            case engine._emPacketType.open: {
                                this.onHandshake(JSON.parse(packet.data));
                                break;
                            }
                            case engine._emPacketType.pong: {
                                this.setPing();
                                this.emit(socketio._emEvent.EVENT_PONG);
                                break;
                            }
                            case engine._emPacketType.error: {
                                var err = new Error('server error');
                                err.code = packet.data;
                                this.onError(err);
                                break;
                            }
                            case engine._emPacketType.message: {
                                this.emit(socketio._emEvent.EVENT_DATA, packet.data);
                                this.emit(socketio._emEvent.EVENT_MESSAGE, packet.data);
                                break;
                            }
                        }
                    }
                    else {
                        console.log('packet received with socket readyState ' + this.readyState);
                    }
                };
                Socket.prototype.onError = function (err) {
                    console.debug('socket error ' + err);
                    Socket.priorWebsocketSuccess = false;
                    this.emit('error', err);
                    this.onClose('transport error', err);
                };
                Socket.prototype.onOpen = function () {
                    console.debug('socket open');
                    this.readyState = socketio._emReadyState.OPEN;
                    Socket.priorWebsocketSuccess = this.transport.name === engine.WebSocket.NAME;
                    this.emit(socketio._emEvent.EVENT_OPEN);
                    this.flush();
                    if (this.readyState === socketio._emReadyState.OPEN && this.upgrades && this.transport.pause) {
                        console.debug('starting upgrade probes');
                        for (var i = 0, l = this.upgrades.length; i < l; i++) {
                            this.probe(this.upgrades[i]);
                        }
                    }
                };
                Socket.prototype.onClose = function (reason, desc) {
                    if (this.readyState === socketio._emReadyState.OPENING ||
                        this.readyState === socketio._emReadyState.OPEN ||
                        this.readyState === socketio._emReadyState.CLOSING) {
                        console.debug('socket close with reason: ' + reason);
                        egret.clearTimeout(this.pingIntervalTimer);
                        egret.clearTimeout(this.pingTimeoutTimer);
                        this.transport.off(socketio._emEvent.EVENT_CLOSE);
                        this.transport.close();
                        this.transport.off();
                        this.readyState = socketio._emReadyState.CLOSED;
                        this.id = null;
                        this.emit(socketio._emEvent.EVENT_CLOSE, reason, desc);
                    }
                };
                Socket.prototype.close = function () {
                    var _this = this;
                    var close = function () {
                        _this.onClose('forced close');
                        console.debug('socket closing - telling transport to close');
                        _this.transport.close();
                    };
                    var cleanupAndClose = function () {
                        _this.off(socketio._emEvent.EVENT_UPGRADE, cleanupAndClose);
                        _this.off(socketio._emEvent.EVENT_UPGRADE_ERROR, cleanupAndClose);
                    };
                    var waitForUpgrade = function () {
                        _this.once(socketio._emEvent.EVENT_UPGRADE, cleanupAndClose);
                        _this.once(socketio._emEvent.EVENT_UPGRADE_ERROR, cleanupAndClose);
                    };
                    if (this.readyState === socketio._emReadyState.OPENING || this.readyState === socketio._emReadyState.OPEN) {
                        this.readyState = socketio._emReadyState.CLOSING;
                        if (this.writeBuffer.length) {
                            this.once(socketio._emEvent.EVENT_DRAIN, function () {
                                if (_this.upgrading) {
                                    waitForUpgrade();
                                }
                                else {
                                    close();
                                }
                            });
                        }
                        else if (this.upgrading) {
                            waitForUpgrade();
                        }
                        else {
                            close();
                        }
                    }
                    return this;
                };
                Socket.prototype.onHandshake = function (data) {
                    this.emit(socketio._emEvent.EVENT_HANDSHAKE, data);
                    this.id = data.sid;
                    this.transport.opts.replaceQueryParam('sid', data.sid);
                    this.upgrades = this.filterUpgrades(data.upgrades);
                    this.pingInterval = data.pingInterval;
                    this.pingTimeout = data.pingTimeout;
                    this.onOpen();
                    if (this.readyState === socketio._emReadyState.CLOSED)
                        return;
                    this.setPing();
                    this.off(socketio._emEvent.EVENT_HEARTBEAT, this.onHeartbeat, this);
                    this.on(socketio._emEvent.EVENT_HEARTBEAT, this.onHeartbeat, this);
                };
                Socket.prototype.setPing = function () {
                    var _this = this;
                    egret.clearTimeout(this.pingIntervalTimer);
                    this.pingIntervalTimer = egret.setTimeout(function () {
                        console.debug('writing ping packet - expecting pong within ' + _this.pingTimeout + 'ms');
                        _this.ping();
                        _this.onHeartbeat(_this.pingTimeout);
                    }, this, this.pingInterval);
                };
                Socket.prototype.onHeartbeat = function (timeout) {
                    var _this = this;
                    egret.clearTimeout(this.pingTimeoutTimer);
                    this.pingTimeoutTimer = egret.setTimeout(function () {
                        if (_this.readyState === socketio._emReadyState.CLOSED)
                            return;
                        _this.onClose('ping timeout');
                    }, this, timeout || (this.pingInterval + this.pingTimeout));
                };
                Socket.prototype.write = function (msg, options, fn) {
                    return this.send(msg, options, fn);
                };
                Socket.prototype.send = function (msg, options, fn) {
                    this.sendPacket('message', msg, options, fn);
                    return this;
                };
                Socket.prototype.sendPacket = function (type, data, options, fn) {
                    if (typeof data === 'function') {
                        fn = data;
                        data = undefined;
                    }
                    if (typeof options === 'function') {
                        fn = options;
                        options = null;
                    }
                    if (this.readyState === socketio._emReadyState.CLOSING || this.readyState === socketio._emReadyState.CLOSED) {
                        return;
                    }
                    options = options || {};
                    var packet = {
                        type: type,
                        data: data,
                        options: options
                    };
                    this.emit(socketio._emEvent.EVENT_PACKET_CREATE, packet);
                    this.writeBuffer.push(packet);
                    if (fn)
                        this.once(socketio._emEvent.EVENT_FLUSH, fn);
                    this.flush();
                };
                Socket.prototype.filterUpgrades = function (upgrades) {
                    var filteredUpgrades = [];
                    for (var i = 0; i < upgrades.length; i++) {
                        if (this.opts.transports.indexOf(upgrades[i]))
                            filteredUpgrades.push(upgrades[i]);
                    }
                    return filteredUpgrades;
                };
                // private secure: boolean;
                // private hostname: string;
                // private port: number;
                // private query: Map<string, Primitive>;
                // private upgrade: boolean;
                // private path: string;
                // private timestampParam: string;
                // private timestampRequests: boolean;
                // private transports: Array<string>;
                // private policyPort: number;
                // private rememberUpgrade: boolean;
                // private transportOptions: Map<string, TransportOptions>;
                Socket.priorWebsocketSuccess = false;
                return Socket;
            }(socketio.Emitter));
            engine.Socket = Socket;
            __reflect(Socket.prototype, "egret.socketio.engine.Socket");
        })(engine = socketio.engine || (socketio.engine = {}));
    })(socketio = egret.socketio || (egret.socketio = {}));
})(egret || (egret = {}));
var egret;
(function (egret) {
    var socketio;
    (function (socketio) {
        var engine;
        (function (engine) {
            var WebSocket = (function (_super) {
                __extends(WebSocket, _super);
                function WebSocket(opts) {
                    var _this = _super.call(this, opts) || this;
                    _this.name = WebSocket.NAME;
                    return _this;
                }
                WebSocket.prototype.addEventListeners = function () {
                    //添加收到数据侦听，收到数据会调用此方法
                    this.ws.addEventListener(egret.ProgressEvent.SOCKET_DATA, this.onWsData, this);
                    //添加链接打开侦听，连接成功会调用此方法
                    this.ws.addEventListener(egret.Event.CONNECT, this.onWsOpen, this);
                    //添加链接关闭侦听，手动关闭或者服务器关闭连接会调用此方法
                    this.ws.addEventListener(egret.Event.CLOSE, this.onWsClose, this);
                    //添加异常侦听，出现异常会调用此方法
                    this.ws.addEventListener(egret.IOErrorEvent.IO_ERROR, this.onWsError, this);
                };
                WebSocket.prototype.write = function (packets) {
                    var _this = this;
                    this.writable = false;
                    var total = packets.length;
                    var done = function () {
                        new Promise(function (resolve, reject) {
                            _this.ws.flush();
                            _this.emit(socketio._emEvent.EVENT_FLUSH);
                            resolve(1);
                        }).then(function () {
                            _this.writable = true;
                            _this.emit(socketio._emEvent.EVENT_DRAIN);
                        });
                    };
                    for (var i = 0; i < total; i++) {
                        if (this.readyState !== socketio._emReadyState.OPENING && this.readyState !== socketio._emReadyState.OPEN) {
                            break;
                        }
                        engine.Parser.encodePacket(packets[i], false, function (message) {
                            _this.ws.writeUTF(message);
                            --total || done();
                        });
                    }
                };
                WebSocket.prototype.onWsOpen = function (evt) {
                    console.debug("onWsOpen");
                    _super.prototype.onOpen.call(this);
                };
                WebSocket.prototype.onWsData = function (evt) {
                    var msg = this.ws.readUTF();
                    _super.prototype.onData.call(this, msg);
                };
                WebSocket.prototype.onWsError = function (evt) {
                    _super.prototype.onError.call(this, evt.data);
                };
                WebSocket.prototype.onWsClose = function () {
                    _super.prototype.onClose.call(this);
                };
                WebSocket.prototype.doOpen = function () {
                    var uri = this.uri();
                    this.ws = new egret.WebSocket();
                    this.ws.type = egret.WebSocket.TYPE_STRING; //暂时只支持文本模式 
                    this.addEventListeners();
                    this.ws.connectByUrl(uri);
                };
                WebSocket.prototype.doClose = function () {
                    if (typeof this.ws !== 'undefined') {
                        this.ws.close();
                        this.ws = null;
                    }
                };
                WebSocket.prototype.uri = function () {
                    var uri = this.opts.clone();
                    uri.addTrailingSlash();
                    uri.replaceQueryParam('b64', 1);
                    var schema = uri.secure ? 'wss' : 'ws';
                    uri.protocol = schema;
                    if (uri.timestampRequests) {
                        uri.addQueryParam(uri.timestampParam, engine.Yeast.yeast());
                    }
                    return uri.toString();
                };
                WebSocket.NAME = 'websocket';
                return WebSocket;
            }(engine.Transport));
            engine.WebSocket = WebSocket;
            __reflect(WebSocket.prototype, "egret.socketio.engine.WebSocket");
        })(engine = socketio.engine || (socketio.engine = {}));
    })(socketio = egret.socketio || (egret.socketio = {}));
})(egret || (egret = {}));
var egret;
(function (egret) {
    var socketio;
    (function (socketio) {
        var engine;
        (function (engine) {
            var Yeast;
            (function (Yeast) {
                var alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_'.split('');
                var elength = 64;
                var map = {};
                var seed = 0;
                var prev = '';
                for (var i = 0; i < elength; i++) {
                    map[alphabet[i]] = i;
                }
                function encode(num) {
                    var encoded = '';
                    do {
                        encoded = alphabet[num % length] + encoded;
                        num = Math.floor(num / length);
                    } while (num > 0);
                    return encoded;
                }
                function decode(str) {
                    var decoded = 0;
                    for (var i = 0; i < str.length; i++) {
                        decoded = decoded * length + map[str.charAt(i)];
                    }
                    return decoded;
                }
                function yeast() {
                    var now = encode((new Date()).getDate());
                    if (now !== prev) {
                        return seed = 0, prev = now;
                    }
                    return now + '.' + encode(seed++);
                }
                Yeast.yeast = yeast;
            })(Yeast = engine.Yeast || (engine.Yeast = {}));
        })(engine = socketio.engine || (socketio.engine = {}));
    })(socketio = egret.socketio || (egret.socketio = {}));
})(egret || (egret = {}));
