import {ChainType, Transaction} from "../../types";
import BigNumber from "bignumber.js";
import RPC from "../index";
import * as db from "../../db";
import * as constant from "../../common/constant";

class Pending extends RPC{

    constructor() {
        super(constant.ETH_HOST)
    }

    repair = async () =>{
        const data:Array<string> = [
            "0xbc8717cb7d05a1c76361aa1d57490fb48eb83cd39c00a61908fe9202cd068025",
            "0x0294660c52fd28b48f82f5ee97ba0c8eb42eb4fcd78a8e73b51f93982792c1cc",
            "0x537d7ccd2fe1ba38b716b3cf952b7c3f7a0bbec4c8502fd2c0b3ac63d36e1592",
            "0xc9cf510fbf901453644ee3e150d669729ca1b341bacf75f1bc81306d278fa83c",
            "0x91d55211f5f4763293ac5ad8058886de6eb61f0e9629edb0af03eee6601336a7",
            "0x0ff9e7d114af7dd445d9a1aae6980502d59df936397a7521937d8e28196d0cf6",
            "0x11108c24868ce385bf3307acd8db1cf58a93fae5044a06c609892d6fc2a79be7",
        ];
        const txArray: Array<Transaction> = [];
        const tmpMap:Map<string,number> = new Map<string,number>();
        for (let hash of data) {
            if(tmpMap.has(hash)){
                continue;
            }
            const tx: any = await this.post("eth_getTransactionByHash", [hash]);
            if(tx){
                tmpMap.set(hash,1)
                txArray.push({
                    hash: tx.hash,
                    from: tx.from,
                    to: tx.to,
                    cy: "ETH",
                    value: tx.value,
                    data: tx.input,
                    gas: tx.gas,
                    gasPrice: tx.gasPrice,
                    chain: ChainType.ETH,
                    nonce: tx.nonce,
                    amount: "0x0",
                    feeCy: "ETH",
                    feeValue: "0x" + new BigNumber(tx.gas).multipliedBy(new BigNumber(tx.gasPrice)).toString(16)
                })
            }
        }

        for(let tx of txArray){
            db.eth.insertTxInfo(tx.hash,tx).catch(e=>{
                const err = typeof e == "string"?e:e.message;
                console.error("syncPendingTransactions",err)
            });
        }
    }
}

export default Pending