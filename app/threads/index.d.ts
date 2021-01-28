import SyncThreadEth from "./ethereum/";
import SyncThreadSero from "./sero/";
import TronEvent from "./tron/event";
declare class Threads {
    protected timeSyncBlock: number;
    syncSero: SyncThreadSero;
    syncEth: SyncThreadEth;
    tronEvent: TronEvent;
    constructor();
    run: () => void;
    startGasTracker: () => void;
    startSero: () => void;
    startEth: () => void;
    startSyncPendingEth: () => void;
    startSyncPendingSero: () => void;
    startTronEvent: () => void;
    startTronEventApi: () => void;
}
export default Threads;
