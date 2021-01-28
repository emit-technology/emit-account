import RPC from "../../rpc";
declare class GasTracker {
    gasPriceLevel: gasPriceLevel;
    rpc: RPC;
    constructor();
    gasTrackerCache: () => Promise<void>;
    private gasEstimate;
}
declare const gasTracker: GasTracker;
export default gasTracker;
interface gasPriceLevel {
    SafeGasPrice?: costTime;
    ProposeGasPrice?: costTime;
    FastGasPrice?: costTime;
    AvgGasPrice?: costTime;
}
interface costTime {
    gasPrice: string;
    second: number;
}
