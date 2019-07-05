class ColorfullText extends egret.TextField{

    private colorMap = {
        "W":0xffffff,
        "R":0xff0000,
        "G":0x00ff00,
        "B":0x0000ff
    }

    constructor(text:string){
        super()
        this.general(text)
    }

    private general(text:string){
        let flow = [];
        let arr = text.split("#")
        let currentColor = 0xffffff;
        let currentShadow = null;
        let isUnderline = false;
        let isBlink = false;
        for(let i=0;i<arr.length;i++){
            let t = arr[i];
            if(t.length==0){
                continue;
            }
            let e = {text:null,style:null};
            if(t.charAt(0)=="r"){
                e.text = "\n";
            }else if(t.charAt(0)=="u"){
                //下划线
                e.text = t.substring(1);
                e.style = {}
                isUnderline = true
            }else if(t.charAt(0)=="b"){
                //闪烁
                e.text = t.substring(1);
                e.style = {}
                isBlink = true
            }else if(t.charAt(0)=="e"){
                //描边颜色
                let color = t.substr(1,6);
                e.text = t.substring(7);
                e.style = {}
                currentShadow = "0x"+color
            }else if(t.charAt(0)=="c"){
                //字体hex颜色
                let color = t.substr(1,6);
                e.text = t.substring(7);
                e.style = {
                    "textColor":"0x"+color
                }
            }else if(t.charAt(0)=="W" ||t.charAt(0)=="R"||t.charAt(0)=="G"||t.charAt(0)=="B"){
                //字体三原色
                e.text = t.substring(1);
                e.style = {
                    "textColor":this.colorMap[t.charAt(0)]
                }
            }else{
                e.text = t
                e.style = {
                     "textColor":currentColor
                }
            }
            if(e.style){
                if(currentShadow){
                    e.style.strokeColor = currentShadow
                    e.style.stroke = 2
                }
                if(isUnderline){
                    //似乎并不支持
                    e.style.u = true
                }
                if(isBlink){
                    //似乎并不支持
                    e.style.b = true
                }
            }
            if(e.text){
                isUnderline = false;
                isBlink = false;
                currentColor = null;
                currentShadow = null;
            }
            flow.push(e);
        }
        this.textFlow = flow;
    }
}