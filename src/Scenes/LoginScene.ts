class LoginScene extends BaseScene {

    private textfield: egret.TextField;

    private sky : egret.Bitmap;

    private leafs : particle.GravityParticleSystem;
    private bgLeafs : particle.GravityParticleSystem;

    private skyBox : egret.Sprite;

    private title :egret.Bitmap;

    constructor(){
        super()
    }

    public async onAddToStage(){
        this.createGameScene()
        super.onAddToStage()
    }

    /**
     * 创建游戏场景
     * Create a game scene
     */
    private async createGameScene() {
        var sound:egret.Sound = RES.getRes("cangshan_mp3");
        this.addBgm(sound)

        //绘制天空背景
        this.sky = new egret.Bitmap();
        this.sky.texture = await RES.getResAsync("long_bg_jpg");
        let stageW = this.stage.stageWidth;
        let stageH = this.stage.stageHeight;
        this.sky.height = stageH;
        this.sky.width = this.sky.texture.textureWidth*stageW/this.sky.texture.textureHeight

        this.skyBox = new egret.Sprite();
        this.skyBox.addChild(this.sky);
        this.addChild(this.skyBox);

        //生成叶子粒子
        var texture = RES.getRes("leaf_png");
        var config = RES.getRes("leaf_json");

        //背景粒子
        this.bgLeafs = new particle.GravityParticleSystem(texture, config);
        this.addChild(this.bgLeafs);

        //绘制标题
        let title = this.title = new egret.Bitmap();
        title.texture = await RES.getResAsync("tlbblogo_png")
        title.width = this.width*0.8;
        title.height = this.width*title.texture.textureHeight/title.texture.textureWidth
        title.anchorOffsetX = title.width/2;
        title.anchorOffsetY = title.height/2;
        title.x = this.width*0.5;
        title.y = this.height/2;
        title.scaleX = 0.5;
        title.scaleY = 0.5;
        title.alpha = 0
        this.addChild(title)

        //测试文字渲染
        let desc = new ColorfullText("天山#ecc33cc#cff9966门下所穿素服，#u#b#eff99cc穿着后传说可得雪之护佑。#r#c00FF00天山派初级时装。#r#W可以在#G天山#W的#R梅剑#W处免费领取本门派时装。");
        desc.y = this.height-200;
        desc.lineSpacing = 5
        desc.size = 24
        desc.width = this.width/2;
        desc.x = this.width/4
        this.addChild(desc);

        //前置粒子
        this.leafs = new particle.GravityParticleSystem(texture, config);
        this.addChild(this.leafs);

        this.startAnimation()
    }

    /**
     * 描述文件加载成功，开始播放动画
     * Description file loading is successful, start to play the animation
     */
    private async startAnimation() {

        this.leafs.start()
        this.bgLeafs.start()

        let move = ()=>{
            let targetX = this.sky.x==0?(-this.sky.width+this.width):0;
            egret.Tween.get(this.sky).to({
                x:targetX
            },50000).call(move)
            egret.Tween.get(this.leafs).to({
                x:targetX
            },50000)
        }
        move()

        egret.Tween.get(this.title).to({
            alpha:1,
            scaleX:1,
            scaleY:1,
            y:this.height/2-100
        },2000,egret.Ease.backInOut).call(()=>{
            //出文字
            let menu = new egret.TextField()
            menu.textColor = 0xffffff;
            menu.text = "开始游戏";
            menu.width = 200;
            menu.textAlign = "center";
            menu.x = this.width/2 - 100;
            menu.y = this.height/2+150;
            menu.size = 30;
            menu.stroke = 3;
            menu.strokeColor = 0x000000;
            this.addChild(menu)
            menu.touchEnabled = true
            menu.addEventListener(egret.TouchEvent.TOUCH_TAP,()=>{
                this.changeToScene(LuoyangScene)
            },this)
            let change = ()=>{
                let alpha = menu.alpha>0?0:1;
                egret.Tween.get(menu).to({alpha},1000).call(change)
            }
            change()
        })
    }
}