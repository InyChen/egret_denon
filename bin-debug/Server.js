var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var Server = (function () {
    function Server() {
        var _this = this;
        this.callbackPool = {};
        this.socket = egret.socketio.io(Config.serverURL);
        this.socket.on("CONNECTED", function (e) {
            console.log("已连接", e);
            _this.isConnected = true;
        });
        this.socket.on("disconnect", function () {
            _this.isConnected = false;
        });
        this.socket.on("API_CALLBACK", function (e) {
            console.log("api结果:", e);
            var callBackId = e.callBackId;
            if (_this.callbackPool[callBackId]) {
                _this.callbackPool[callBackId].resolve(e);
                delete _this.callbackPool[callBackId];
            }
        });
    }
    Server.prototype.call = function (evtName, data) {
        var _this = this;
        if (!this.isConnected) {
            return new Promise(function (resolve, reject) {
                reject({ code: -1, msg: "未连接" });
            });
        }
        var callBackId = Date.now + Math.random().toString();
        data.callBackId = callBackId;
        this.socket.emit(evtName, data);
        return new Promise(function (resolve, reject) {
            _this.callbackPool[callBackId] = {
                resolve: resolve, reject: reject
            };
            setTimeout(function () {
                if (_this.callbackPool[callBackId]) {
                    _this.callbackPool[callBackId].reject({
                        code: -1,
                        msg: "time out"
                    });
                }
            }, 5000);
        });
    };
    Server.get = function () {
        if (!this.$server) {
            Server.$server = new Server();
        }
        return Server.$server;
    };
    return Server;
}());
__reflect(Server.prototype, "Server");
//# sourceMappingURL=Server.js.map