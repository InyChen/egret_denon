class LuoyangScene extends BaseScene {

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


        let menu = new egret.TextField()
        menu.textColor = 0xffffff;
        menu.text = "洛阳";
        menu.width = 200;
        menu.textAlign = "center";
        menu.x = this.width/2;
        menu.y = this.height/2+150;
        menu.size = 30;
        menu.stroke = 3;
        menu.strokeColor = 0x000000;
        this.addChild(menu)
    }
}