import SyncThreadEth from "./ethereum/indexV3";
import SyncThreadBsc from "./bsc/indexV3";
import SyncThreadSero from "./sero/"
import TronEvent from "./tron/event";
import gasTracker from "../api/gasTracker";
import * as constant from "../common/constant"

class Threads {

    protected timeSyncBlock: number

    syncSero:SyncThreadSero;
    syncEth:SyncThreadEth;
    tronEvent:TronEvent;
    syncBsc:SyncThreadBsc;

    constructor() {
        this.timeSyncBlock = constant.SYNC_TIME;
        this.syncSero = new SyncThreadSero();
        this.syncEth = new SyncThreadEth(0,"pending");
        this.tronEvent = new TronEvent();
        this.syncBsc = new SyncThreadBsc(0,"pending");
    }

    run = ()=>{

        this.startGasTracker();

        if(constant.IS_MASTER_NODE){
            {
                this.startSero();
                this.startSyncPendingSero();
                this.removeSeroUnPendingTx();

                this.startEth();
                this.removeEthUnPendingTx();

                this.startTronEventApi()
            }
            //bsc
            this.startBsc();
            // this.removeBscUnPendingTx();
        }
    }

    startGasTracker = () => {
        gasTracker.gasTrackerCache().then(()=>{
            console.info("gasTracker, sleep 5s...")
            setTimeout(()=>{
                this.startGasTracker();
            },this.timeSyncBlock)
        }).catch(e=>{
            console.error("gasTracker err: ",e," restart 5s later...")
            setTimeout(()=>{
                this.startGasTracker();
            },this.timeSyncBlock)
        });
    }

    startSero = () => {
        // this.syncSero.run(constant.THREAD_CONFIG.START_AT.SERO,constant.THREAD_CONFIG.LIMIT.SERO,384180)

        console.info("sero sync start...")
        this.syncSero.run(constant.THREAD_CONFIG.START_AT.SERO,constant.THREAD_CONFIG.LIMIT.SERO).then(()=>{
            console.info("sero sync end, sleep 5s...")
            setTimeout(()=>{
                this.startSero();
            },this.timeSyncBlock/10)
        }).catch(e=>{
            console.error("sero sync err: ",e," restart 5s later...")
            setTimeout(()=>{
                this.startSero();
            },this.timeSyncBlock)
        });
    }

    startEth = () => {
        console.info("eth sync start...")

        const step = 5;

        for(let i=0;i<step;i++){
            const tag = `thread-${i}`
            const syncThread = new SyncThreadEth(constant.THREAD_CONFIG.START_AT.ETH,tag)
            syncThread.run();
        }

        // const begin = Date.now();
        // this.syncEth.syncTransactions(constant.THREAD_CONFIG.START_AT.ETH,constant.THREAD_CONFIG.LIMIT.ETH).then(()=>{
        //     console.info(`eth sync end, cost: ${Math.floor((Date.now()-begin)/1000)} seconds, sleep 5s`)
        //     setTimeout(()=>{
        //         this.startEth();
        //     },this.timeSyncBlock/10)
        // }).catch(e=>{
        //     console.error("eth sync err: ",e," restart 5s later...")
        //     setTimeout(()=>{
        //         this.startEth();
        //     },this.timeSyncBlock)
        // });
    }

    startSyncPendingEth = () => {
        this.syncEth.syncPendingTransactions().then(()=>{
            setTimeout(()=>{
                this.startSyncPendingEth();
            },1000)
        }).catch(e=>{
            const err = typeof e == "string"?e:e.message;
            console.log("eth sync pending err: ",err," restart 5s later...")
            setTimeout(()=>{
                this.startSyncPendingEth();
            },1000)
        });
    }

    dealSyncPendingEth = () =>{
        this.syncEth.dealPending().then(()=>{
            setTimeout(()=>{
                this.dealSyncPendingEth();
            },1)
        }).catch(e=>{
            const err = typeof e == "string"?e:e.message;
            // console.log("dealSyncPendingEth err: ",err)
            setTimeout(()=>{
                this.dealSyncPendingEth();
            },1)
        });
    }

    startSyncPendingSero = () => {
        this.syncSero.syncPendingTransactions().then(()=>{
            setTimeout(()=>{
                this.startSyncPendingSero();
            },this.timeSyncBlock)
        }).catch(e=>{
            const err = typeof e == "string"?e:e.message;
            console.error("sero sync pending err: ",err," restart 5s later...")
            setTimeout(()=>{
                this.startSyncPendingSero();
            },this.timeSyncBlock)
        });
    }

    startTronEvent = () => {
        this.tronEvent.runByNum().then(()=>{
            console.info("startTronEvent, sleep 5s...")
            setTimeout(()=>{
                this.startTronEvent();
            },this.timeSyncBlock / 5)
        }).catch(e=>{
            console.error("startTronEvent err: ",e," restart 5s later...")
            setTimeout(()=>{
                this.startTronEvent();
            },this.timeSyncBlock / 5)
        });
    }

    startTronEventApi = () => {
        this.tronEvent.runByEventApi().then(()=>{
            console.info("startTronEventApi, sleep 5s...")
            setTimeout(()=>{
                this.startTronEventApi();
            },this.timeSyncBlock * 2)
        }).catch(e=>{
            console.error("startTronEventApi err: ",e," restart 5s later...")
            setTimeout(()=>{
                this.startTronEventApi();
            },this.timeSyncBlock)
        });
    }

    removeEthUnPendingTx = () => {
        this.syncEth.removeUnPendingTxTimeout().then(()=>{
            console.info("removeEthUnPendingTx, sleep 5s...")
            setTimeout(()=>{
                this.removeEthUnPendingTx();
            },this.timeSyncBlock * 5)
        }).catch(e=>{
            console.error("removeEthUnPendingTx err: ",e," restart 5s later...")
            setTimeout(()=>{
                this.removeEthUnPendingTx();
            },this.timeSyncBlock * 5)
        });
    }

    //
    startBsc = () => {
        console.info("bsc sync start...")
        const step = 10;

        for(let i=0;i<step;i++){
            const tag = `thread-${i}`
            const syncBscThread = new SyncThreadBsc(constant.THREAD_CONFIG.START_AT.BSC,tag)
            syncBscThread.run();
        }
        // const begin = Date.now();
        // this.syncBsc.syncTransactions(constant.THREAD_CONFIG.START_AT.BSC,constant.THREAD_CONFIG.LIMIT.BSC).then(()=>{
        //     console.info(`bsc sync end, cost: ${Math.floor((Date.now()-begin)/1000)} seconds, sleep 5s`)
        //     setTimeout(()=>{
        //         this.startBsc();
        //     },this.timeSyncBlock/100)
        // }).catch(e=>{
        //     console.error("bsc sync err: ",e," restart 5s later...")
        //     setTimeout(()=>{
        //         this.startBsc();
        //     },this.timeSyncBlock)
        // });
    }

    startSyncPendingBsc = () => {
        this.syncBsc.syncPendingTransactions().then(()=>{
            setTimeout(()=>{
                this.startSyncPendingBsc();
            },1000)
        }).catch(e=>{
            const err = typeof e == "string"?e:e.message;
            console.log("startSyncPendingBsc err: ",err," restart 5s later...")
            setTimeout(()=>{
                this.startSyncPendingBsc();
            },1000)
        });
    }

    dealSyncPendingBsc = () =>{
        this.syncBsc.dealPending().then(()=>{
            setTimeout(()=>{
                this.dealSyncPendingBsc();
            },1)
        }).catch(e=>{
            const err = typeof e == "string"?e:e.message;
            console.log("dealSyncPendingBsc err: ",err)
            setTimeout(()=>{
                this.dealSyncPendingBsc();
            },1)
        });
    }

    removeBscUnPendingTx = () => {
        this.syncBsc.removeUnPendingTxTimeout().then(()=>{
            console.info("removeBscUnPendingTx, sleep 5s...")
            setTimeout(()=>{
                this.removeBscUnPendingTx();
            },this.timeSyncBlock * 5)
        }).catch(e=>{
            console.error("removeBscUnPendingTx err: ",e," restart 5s later...")
            setTimeout(()=>{
                this.removeBscUnPendingTx();
            },this.timeSyncBlock * 5)
        });
    }

    removeSeroUnPendingTx = () => {
        this.syncSero.removeUnPendingTxTimeout().then(()=>{
            console.info("removeSeroUnPendingTx, sleep 5s...")
            setTimeout(()=>{
                this.removeSeroUnPendingTx();
            },this.timeSyncBlock * 5)
        }).catch((e:any)=>{
            console.error("removeSeroUnPendingTx err: ",e," restart 5s later...")
            setTimeout(()=>{
                this.removeSeroUnPendingTx();
            },this.timeSyncBlock * 5)
        });
    }

}

export default Threads