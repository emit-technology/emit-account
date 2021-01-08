import SeroThread from "./sero";
import EthThread from "./eth"
import gasTracker from "../api/gasTracker";
import * as constant from "../common/constant"

class Threads {

    protected timeSyncBlock: number

    sero:SeroThread;
    eth:EthThread;

    constructor() {
        this.timeSyncBlock = 1000 * 5;
        this.sero = new SeroThread();
        this.eth = new EthThread();
    }

    run = ()=>{
        this.startSero();
        this.startEth();
        this.startGasTracker();
    }

    startGasTracker = () => {
        gasTracker.gasTrackerCache().then(()=>{
            console.info("gasTracker, sleep 5s...")
            setTimeout(()=>{
                this.startGasTracker();
            },this.timeSyncBlock*2)
        }).catch(e=>{
            console.error("gasTracker err: ",e," restart 5s later...")
            setTimeout(()=>{
                this.startGasTracker();
            },this.timeSyncBlock*2)
        });
    }

    startSero = () => {
        this.sero.syncBlock(constant.THREAD_CONFIG.START_AT.SERO,constant.THREAD_CONFIG.LIMIT.SERO).then(()=>{
            console.info("sero sync end, sleep 5s...")
            setTimeout(()=>{
                this.startSero();
            },this.timeSyncBlock)
        }).catch(e=>{
            console.error("sero sync err: ",e," restart 5s later...")
            setTimeout(()=>{
                this.startSero();
            },this.timeSyncBlock)
        });
    }

    startEth = () => {
        const begin = Date.now();
        this.eth.syncBlock(constant.THREAD_CONFIG.START_AT.ETH,constant.THREAD_CONFIG.LIMIT.ETH).then(()=>{
            console.info(`eth sync end, cost: ${Math.floor((Date.now()-begin)/1000)} seconds, sleep 5s`)
            setTimeout(()=>{
                this.startEth();
            },1000)
        }).catch(e=>{
            console.error("eth sync err: ",e," restart 5s later...")
            setTimeout(()=>{
                this.startEth();
            },this.timeSyncBlock)
        });
    }

}

export default Threads