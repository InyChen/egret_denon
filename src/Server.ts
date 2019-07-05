
class Server {

    private static $server:Server;

    private socket : egret.socketio.Socket

    private callbackPool : Object = {}

    private isConnected : boolean

    constructor(){
        this.socket = egret.socketio.io(Config.serverURL)

        this.socket.on("CONNECTED",(e)=>{
            console.log("已连接",e)
            this.isConnected = true
        })

        this.socket.on("disconnect",()=>{
            this.isConnected = false
        })

        this.socket.on("API_CALLBACK",(e)=>{
            console.log("api结果:",e)
            let callBackId = e.callBackId;
            if(this.callbackPool[callBackId]){
                this.callbackPool[callBackId].resolve(e)
                delete this.callbackPool[callBackId]
            }
        })
    }

    public call(evtName:string,data:any):Promise<any>{
        if(!this.isConnected){
            return new Promise((resolve,reject)=>{
                reject({code:-1,msg:"未连接"})
            })
        }
        let callBackId = Date.now + Math.random().toString();
        data.callBackId = callBackId;
        this.socket.emit(evtName,data);
        return new Promise((resolve,reject)=>{
            this.callbackPool[callBackId] = {
                resolve,reject
            }
            setTimeout(()=>{
                if(this.callbackPool[callBackId]){
                    this.callbackPool[callBackId].reject({
                        code:-1,
                        msg:"time out"
                    })
                }
            },5000)
        })
    }


    public static get(){
        if(!this.$server){
            Server.$server = new Server();
        }
        return Server.$server
    }
}