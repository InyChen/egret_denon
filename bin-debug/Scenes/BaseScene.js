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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var BaseScene = (function (_super) {
    __extends(BaseScene, _super);
    function BaseScene() {
        var _this = _super.call(this) || this;
        _this.bgmList = [];
        _this.addEventListener(egret.Event.ADDED_TO_STAGE, _this.onAddToStage, _this);
        return _this;
    }
    BaseScene.prototype.onAddToStage = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this.width = this.stage.width;
                this.height = this.stage.height;
                this.initBGM();
                return [2 /*return*/];
            });
        });
    };
    BaseScene.prototype.addBgm = function (sound) {
        this.bgmList.push(sound);
    };
    BaseScene.prototype.initBGM = function () {
        if (!this.currentBgm && this.bgmList.length > 0) {
            this.currentBgm = this.bgmList[0];
        }
        if (!this.currentBgm) {
            return;
        }
        this.playBgm(this.currentBgm);
    };
    BaseScene.prototype.playNextBGM = function () {
        var ind = this.bgmList.indexOf(this.currentBgm);
        ind++;
        if (ind > (this.bgmList.length - 1)) {
            ind = 0;
        }
        this.currentBgm = this.bgmList[ind];
        this.playBgm(this.currentBgm);
    };
    BaseScene.prototype.playBgm = function (sound) {
        var _this = this;
        sound.once(egret.Event.COMPLETE, function (event) {
            _this.playNextBGM();
        }, this);
        sound.once(egret.IOErrorEvent.IO_ERROR, function (event) {
            console.log("loaded error!");
        }, this);
        this.currentBgmChannel = sound.play();
    };
    BaseScene.prototype.exitScene = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        if (_this.currentBgm) {
                            egret.Tween.get(_this.currentBgmChannel).to({ volume: 0 }, 1000).call(function () {
                                _this.currentBgmChannel.stop();
                            });
                        }
                        egret.Tween.get(_this).to({ alpha: 0 }, 1000).call(function () {
                            _this.parent.removeChild(_this);
                            resolve();
                        });
                    })];
            });
        });
    };
    BaseScene.prototype.changeToScene = function (scene) {
        return __awaiter(this, void 0, void 0, function () {
            var stage, s;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        stage = this.parent;
                        return [4 /*yield*/, this.exitScene()];
                    case 1:
                        _a.sent();
                        s = new scene();
                        stage.addChild(s);
                        return [2 /*return*/];
                }
            });
        });
    };
    return BaseScene;
}(egret.DisplayObjectContainer));
__reflect(BaseScene.prototype, "BaseScene");
//# sourceMappingURL=BaseScene.js.map