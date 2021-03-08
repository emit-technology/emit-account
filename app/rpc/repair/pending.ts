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