import SyncThreadEth from "./ethereum/";
import SyncThreadSero from "./sero/"
import gasTracker from "../api/gasTracker";
import * as constant from "../common/constant"

class Threads {

    protected timeSyncBlock: number

    syncSero:SyncThreadSero;
    syncEth:SyncThreadEth;

    constructor() {
        this.timeSyncBlock = 1000 * 5;
        this.syncSero = new SyncThreadSero();
        this.syncEth = new SyncThreadEth();
    }

    run = ()=>{

        this.startSero();
        this.startEth();
        this.startGasTracker();

        this.startSyncPendingEth();
        this.startSyncPendingSero();
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
        // this.syncSero.run(constant.THREAD_CONFIG.START_AT.SERO,constant.THREAD_CONFIG.LIMIT.SERO,177128)

        console.info("sero sync start...")
        this.syncSero.run(constant.THREAD_CONFIG.START_AT.SERO,constant.THREAD_CONFIG.LIMIT.SERO).then(()=>{
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
        console.info("eth sync start...")
        const begin = Date.now();
        this.syncEth.syncTransactions(constant.THREAD_CONFIG.START_AT.ETH,constant.THREAD_CONFIG.LIMIT.ETH).then(()=>{
            console.info(`eth sync end, cost: ${Math.floor((Date.now()-begin)/1000)} seconds, sleep 5s`)
            setTimeout(()=>{
                this.startEth();
            },this.timeSyncBlock)
        }).catch(e=>{
            console.error("eth sync err: ",e," restart 5s later...")
            setTimeout(()=>{
                this.startEth();
            },this.timeSyncBlock)
        });
    }

    startSyncPendingEth = () => {
        this.syncEth.syncPendingTransactions().then(()=>{
            setTimeout(()=>{
                this.startSyncPendingEth();
            },this.timeSyncBlock)
        }).catch(e=>{
            console.error("eth sync pending err: ",e," restart 5s later...")
            setTimeout(()=>{
                this.startSyncPendingEth();
            },this.timeSyncBlock)
        });
    }

    startSyncPendingSero = () => {
        this.syncSero.syncPendingTransactions().then(()=>{
            setTimeout(()=>{
                this.startSyncPendingSero();
            },this.timeSyncBlock)
        }).catch(e=>{
            console.error("sero sync pending err: ",e," restart 5s later...")
            setTimeout(()=>{
                this.startSyncPendingSero();
            },this.timeSyncBlock)
        });
    }

}

export default Threads