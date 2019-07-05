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
var ColorfullText = (function (_super) {
    __extends(ColorfullText, _super);
    function ColorfullText(text) {
        var _this = _super.call(this) || this;
        _this.colorMap = {
            "W": 0xffffff,
            "R": 0xff0000,
            "G": 0x00ff00,
            "B": 0x0000ff
        };
        _this.general(text);
        return _this;
    }
    ColorfullText.prototype.general = function (text) {
        var flow = [];
        var arr = text.split("#");
        var currentColor = 0xffffff;
        var currentShadow = null;
        var isUnderline = false;
        var isBlink = false;
        for (var i = 0; i < arr.length; i++) {
            var t = arr[i];
            if (t.length == 0) {
                continue;
            }
            var e = { text: null, style: null };
            if (t.charAt(0) == "r") {
                e.text = "\n";
            }
            else if (t.charAt(0) == "u") {
                //下划线
                e.text = t.substring(1);
                e.style = {};
                isUnderline = true;
            }
            else if (t.charAt(0) == "b") {
                //闪烁
                e.text = t.substring(1);
                e.style = {};
                isBlink = true;
            }
            else if (t.charAt(0) == "e") {
                //描边颜色
                var color = t.substr(1, 6);
                e.text = t.substring(7);
                e.style = {};
                currentShadow = "0x" + color;
            }
            else if (t.charAt(0) == "c") {
                //字体hex颜色
                var color = t.substr(1, 6);
                e.text = t.substring(7);
                e.style = {
                    "textColor": "0x" + color
                };
            }
            else if (t.charAt(0) == "W" || t.charAt(0) == "R" || t.charAt(0) == "G" || t.charAt(0) == "B") {
                //字体三原色
                e.text = t.substring(1);
                e.style = {
                    "textColor": this.colorMap[t.charAt(0)]
                };
            }
            else {
                e.text = t;
                e.style = {
                    "textColor": currentColor
                };
            }
            if (e.style) {
                if (currentShadow) {
                    e.style.strokeColor = currentShadow;
                    e.style.stroke = 2;
                }
                if (isUnderline) {
                    //似乎并不支持
                    e.style.u = true;
                }
                if (isBlink) {
                    //似乎并不支持
                    e.style.b = true;
                }
            }
            if (e.text) {
                isUnderline = false;
                isBlink = false;
                currentColor = null;
                currentShadow = null;
            }
            flow.push(e);
        }
        this.textFlow = flow;
    };
    return ColorfullText;
}(egret.TextField));
__reflect(ColorfullText.prototype, "ColorfullText");
//# sourceMappingURL=ColorfulText.js.map