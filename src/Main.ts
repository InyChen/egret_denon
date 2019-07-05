class Main extends egret.DisplayObjectContainer {

    private uiLayer:UILayer;

    /**
     * 构造函数
     */
    public constructor() {
        super();
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
    }

    private async login(){
        let rs = await Server.get().call("LOGIN",{msg:"hehe"})
        console.log("rs:",rs)
    }

    /**
     * 添加到舞台后执行
     */
    private onAddToStage(event: egret.Event) {
        let sw = egret.Capabilities.boundingClientWidth
        let sh = egret.Capabilities.boundingClientHeight
        this.stage.width = this.width = 750;
        this.stage.height = this.height = 750*sh/sw;

        egret.lifecycle.addLifecycleListener((context) => {
            // custom lifecycle plugin

            context.onUpdate = () => {
            }
        })

        egret.lifecycle.onPause = () => {
            egret.ticker.pause();
        }

        egret.lifecycle.onResume = () => {
            egret.ticker.resume();
        }

        /**
         * 开始游戏
         */
        this.runGame().catch(e => {
            console.log(e);
        })
    }

    private async runGame() {
        //添加场景容器

        //添加UI容器
        this.uiLayer = new UILayer();
        this.stage.addChild(this.uiLayer)

        //加载资源
        await this.loadResource()
        let loginScene = new LoginScene();
        this.stage.addChild(loginScene);
    }

    private async loadResource() {
        try {
            const loadingView = new LoadingUI();
            loadingView.verticalCenter = 0
            loadingView.horizontalCenter = 0
            this.uiLayer.addChild(loadingView);
            await RES.loadConfig("resource/default.res.json", "resource/");
            await RES.loadGroup("preload", 0, loadingView);
            await new Promise((resolve,reject)=>{
                loadingView.text = "加载完成,正在进入游戏..."
                setTimeout(()=>{
                    this.uiLayer.removeChild(loadingView);
                    resolve()
                },1000)
            })
        }
        catch (e) {
            console.error(e);
        }
    }
}