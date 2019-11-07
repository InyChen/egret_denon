class BaseScene extends egret.DisplayObjectContainer{

    /**
     * 研究热重载的支持
     */
    public static instances = [];
    public static reload(){
        if(BaseScene.instances&&BaseScene.instances.length>0){
            BaseScene.instances.forEach(scene=>{
                scene.onReload();
            })
        }
    }

    public currentBgm : egret.Sound;
    public currentBgmChannel : egret.SoundChannel;
    public bgmList : Array<egret.Sound> = []

    constructor(){
        super()
        BaseScene.instances.push(this);
        this.addEventListener(egret.Event.ADDED_TO_STAGE,this.onAddToStage,this)
    }

    public async onAddToStage(){
        this.width = this.stage.width;
        this.height = this.stage.height;
        this.initBGM()
    }

    public addBgm(sound:egret.Sound){
        this.bgmList.push(sound)
    }

    public initBGM(){
        if(!this.currentBgm && this.bgmList.length>0){
            this.currentBgm = this.bgmList[0]
        }
        if(!this.currentBgm){
            return
        }
        this.playBgm(this.currentBgm)
    }

    private playNextBGM(){
        let ind = this.bgmList.indexOf(this.currentBgm);
        ind ++;
        if(ind>(this.bgmList.length-1)){
            ind = 0;
        }
        this.currentBgm = this.bgmList[ind]
        this.playBgm(this.currentBgm)
    }

    private playBgm(sound:egret.Sound){
        sound.once(egret.Event.COMPLETE, (event:egret.Event)=> {
            this.playNextBGM()
        }, this);
        sound.once(egret.IOErrorEvent.IO_ERROR, (event:egret.IOErrorEvent)=>{
            console.log("loaded error!");
        }, this);
        this.currentBgmChannel = sound.play();
    }

    public async exitScene(){
        return new Promise((resolve,reject)=>{
            if(this.currentBgm){
                egret.Tween.get(this.currentBgmChannel).to({volume:0},1000).call(()=>{
                    this.currentBgmChannel.stop();
                })
            }
            egret.Tween.get(this).to({alpha:0},1000).call(()=>{
                this.parent.removeChild(this)
                BaseScene.instances.splice(BaseScene.instances.indexOf(this),1)
                resolve()
            })
        })
    }

    public async changeToScene(scene:any){
        let stage = this.parent;
        await this.exitScene()
        let s = new scene();
        
        stage.addChild(s);
    }
}