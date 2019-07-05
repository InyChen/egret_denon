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
var LoginScene = (function (_super) {
    __extends(LoginScene, _super);
    function LoginScene() {
        return _super.call(this) || this;
    }
    LoginScene.prototype.onAddToStage = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this.createGameScene();
                _super.prototype.onAddToStage.call(this);
                return [2 /*return*/];
            });
        });
    };
    /**
     * 创建游戏场景
     * Create a game scene
     */
    LoginScene.prototype.createGameScene = function () {
        return __awaiter(this, void 0, void 0, function () {
            var sound, _a, stageW, stageH, texture, config, title, _b, desc;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        sound = RES.getRes("cangshan_mp3");
                        this.addBgm(sound);
                        //绘制天空背景
                        this.sky = new egret.Bitmap();
                        _a = this.sky;
                        return [4 /*yield*/, RES.getResAsync("long_bg_jpg")];
                    case 1:
                        _a.texture = _c.sent();
                        stageW = this.stage.stageWidth;
                        stageH = this.stage.stageHeight;
                        this.sky.height = stageH;
                        this.sky.width = this.sky.texture.textureWidth * stageW / this.sky.texture.textureHeight;
                        this.skyBox = new egret.Sprite();
                        this.skyBox.addChild(this.sky);
                        this.addChild(this.skyBox);
                        texture = RES.getRes("leaf_png");
                        config = RES.getRes("leaf_json");
                        //背景粒子
                        this.bgLeafs = new particle.GravityParticleSystem(texture, config);
                        this.addChild(this.bgLeafs);
                        title = this.title = new egret.Bitmap();
                        _b = title;
                        return [4 /*yield*/, RES.getResAsync("tlbblogo_png")];
                    case 2:
                        _b.texture = _c.sent();
                        title.width = this.width * 0.8;
                        title.height = this.width * title.texture.textureHeight / title.texture.textureWidth;
                        title.anchorOffsetX = title.width / 2;
                        title.anchorOffsetY = title.height / 2;
                        title.x = this.width * 0.5;
                        title.y = this.height / 2;
                        title.scaleX = 0.5;
                        title.scaleY = 0.5;
                        title.alpha = 0;
                        this.addChild(title);
                        desc = new ColorfullText("天山#ecc33cc#cff9966门下所穿素服，#u#b#eff99cc穿着后传说可得雪之护佑。#r#c00FF00天山派初级时装。#r#W可以在#G天山#W的#R梅剑#W处免费领取本门派时装。");
                        desc.y = this.height - 200;
                        desc.lineSpacing = 5;
                        desc.size = 24;
                        desc.width = this.width / 2;
                        desc.x = this.width / 4;
                        this.addChild(desc);
                        //前置粒子
                        this.leafs = new particle.GravityParticleSystem(texture, config);
                        this.addChild(this.leafs);
                        this.startAnimation();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * 描述文件加载成功，开始播放动画
     * Description file loading is successful, start to play the animation
     */
    LoginScene.prototype.startAnimation = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var move;
            return __generator(this, function (_a) {
                this.leafs.start();
                this.bgLeafs.start();
                move = function () {
                    var targetX = _this.sky.x == 0 ? (-_this.sky.width + _this.width) : 0;
                    egret.Tween.get(_this.sky).to({
                        x: targetX
                    }, 50000).call(move);
                    egret.Tween.get(_this.leafs).to({
                        x: targetX
                    }, 50000);
                };
                move();
                egret.Tween.get(this.title).to({
                    alpha: 1,
                    scaleX: 1,
                    scaleY: 1,
                    y: this.height / 2 - 100
                }, 2000, egret.Ease.backInOut).call(function () {
                    //出文字
                    var menu = new egret.TextField();
                    menu.textColor = 0xffffff;
                    menu.text = "开始游戏";
                    menu.width = 200;
                    menu.textAlign = "center";
                    menu.x = _this.width / 2 - 100;
                    menu.y = _this.height / 2 + 150;
                    menu.size = 30;
                    menu.stroke = 3;
                    menu.strokeColor = 0x000000;
                    _this.addChild(menu);
                    menu.touchEnabled = true;
                    menu.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
                        _this.changeToScene(LuoyangScene);
                    }, _this);
                    var change = function () {
                        var alpha = menu.alpha > 0 ? 0 : 1;
                        egret.Tween.get(menu).to({ alpha: alpha }, 1000).call(change);
                    };
                    change();
                });
                return [2 /*return*/];
            });
        });
    };
    return LoginScene;
}(BaseScene));
__reflect(LoginScene.prototype, "LoginScene");
//# sourceMappingURL=LoginScene.js.map