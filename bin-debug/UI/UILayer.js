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
var UILayer = (function (_super) {
    __extends(UILayer, _super);
    function UILayer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return UILayer;
}(eui.UILayer));
__reflect(UILayer.prototype, "UILayer");
//# sourceMappingURL=UILayer.js.map