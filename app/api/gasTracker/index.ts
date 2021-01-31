import * as constant from '../../common/constant'
import RPC from "../../rpc";
import BigNumber from "bignumber.js";
import ethRpc from "../../rpc/eth";


class GasTracker {

    gasPriceLevel:gasPriceLevel = {};
    rpc:RPC

    constructor() {
        this.rpc = new RPC(constant.API_ETHERSCAN)
    }

    gasTrackerCache = async ()=>{
        const gasPrice:any = await ethRpc.post("eth_gasPrice",[]);
        const data:any = await this.rpc.get(constant.GAS_TRACKER)
        const tracker:any = data.result;
        // console.log("tracker>>> ",tracker)
        const safeData:any = await this.rpc.get(this.gasEstimate(tracker.SafeGasPrice))
        const proposeData:any = await this.rpc.get(this.gasEstimate(tracker.ProposeGasPrice))
        const fastData:any = await this.rpc.get(this.gasEstimate(tracker.FastGasPrice))
        const avgData:any = await this.rpc.get(this.gasEstimate(new BigNumber(gasPrice).dividedBy(1e9).toString(10)))
        const gasTemp:gasPriceLevel = {};
        gasTemp.SafeGasPrice={
            gasPrice:tracker.SafeGasPrice,
            second:safeData.result
        }
        gasTemp.ProposeGasPrice={
            gasPrice:tracker.ProposeGasPrice,
            second:proposeData.result
        }
        gasTemp.FastGasPrice={
            gasPrice:tracker.FastGasPrice,
            second:fastData.result
        }
        gasTemp.AvgGasPrice={
            gasPrice:new BigNumber(gasPrice).dividedBy(1e9).toFixed(0,1),
            second:avgData.result
        }
        this.gasPriceLevel = JSON.parse(JSON.stringify(gasTemp))
    }

    private gasEstimate(gWei:string):string{
        return constant.GAS_ESTIMATE + new BigNumber(gWei).multipliedBy(1e9).toString(10);
    }
}
const gasTracker = new GasTracker();
export default gasTracker;

interface gasPriceLevel {
    SafeGasPrice?:costTime
    ProposeGasPrice?:costTime
    FastGasPrice?:costTime
    AvgGasPrice?:costTime
}

interface costTime{
    gasPrice:string
    second:number
}