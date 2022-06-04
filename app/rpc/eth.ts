import RPC from "./index";
import * as constant from "../common/constant";
import BigNumber from "bignumber.js";
import {Block, Log, TransactionReceipt} from "../types/eth";
import * as utils from "../common/utils";
import Ierc20 from "../api/tokens/ierc20";
import {EVENT_ABI_CONFIG} from "../event";
import {ChainType, Transaction} from "../types";
import {tokenCache} from "../cache/tokens";

const Web3 = require('web3');
const provider = new Web3.providers.HttpProvider(constant.ETH_HOST,{
    timeout: constant.defaultHttpTimeout,
    keepAlive: false
})
const web3 = new Web3(provider);

class EthRpc extends RPC {

    protected pendingFilterId: any = "";

    constructor() {
        super(constant.ETH_HOST)
    }

    blockNumber = async (): Promise<number> => {
        const rest: any = await this.post("eth_blockNumber", [])
        return new BigNumber(rest).toNumber();
    }

    getBlockByNum = async (num: number): Promise<Block> => {
        const block: any = await this.post("eth_getBlockByNumber", [utils.toHex(num), true])
        return block
    }

    getBalance = async (address: string): Promise<BigNumber> => {
        const rest: any = await this.post("eth_getBalance", [address, "latest"])
        return new BigNumber(rest);
    }

    getTokenBalance = async (address: string, ierc20: Ierc20): Promise<BigNumber> => {
        return await ierc20.balanceOf(address);
    }

    getTransactionReceipt = async (txHash: string): Promise<TransactionReceipt> => {
        const rest: any = await this.post("eth_getTransactionReceipt", [txHash]);
        return rest
    }

    sendRawTransaction = async (data: any): Promise<string> => {
        const hash: any = await this.post("eth_sendRawTransaction", [data]);
        return hash
    }

    getLogs = async (from: number, to: number): Promise<Array<Log>> => {
        const keys = Object.keys(constant.TOKEN_ADDRESS);
        const addresses: Array<any> = [];
        const topics: Array<any> = [];
        for (let key of keys) {
            addresses.push(constant.TOKEN_ADDRESS[key]);
        }

        for(let token of tokenCache.all(ChainType.ETH)){
            addresses.push(token.address);
        }

        const keys2 = Object.keys(constant.ERC721_ADDRESS);
        for (let k of keys2) {
            addresses.push(constant.ERC721_ADDRESS[k]);
        }

        addresses.push(constant.CROSS_ADDRESS.ETH)
        addresses.push(constant.CROSS_NFT_ADDRESS.ETH)
        for (let conf of EVENT_ABI_CONFIG) {
            topics.push(web3.eth.abi.encodeEventSignature(conf.abi))
        }
        const params = [{
            fromBlock: utils.toHex(from),
            toBlock: utils.toHex(to),
            address: addresses,
            topics: [topics]
        }]
        const data: any = await this.post("eth_getLogs", params);
        return data
    }

    getFilterChangesPending = async (): Promise<Array<Transaction>> => {
        if (!this.pendingFilterId) {
            this.pendingFilterId = await this.post("eth_newPendingTransactionFilter", []);
        }
        const data: any = await this.filterChanges();
        const txArray: Array<Transaction> = [];
        const tmpMap:Map<string,number> = new Map<string,number>();
        if (data && data.length > 0) {
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
        }
        return txArray
    }


    //Array<string>
    protected filterChanges = async (): Promise<any> => {
        return new Promise((resolve, reject) => {
            this.post("eth_getFilterChanges", [this.pendingFilterId]).then((rest: any) => {
                resolve(rest)
            }).catch(e => {
                this.pendingFilterId = "";
                reject(e)
            })
        })
    }
}

const ethRpc = new EthRpc();

export default ethRpc
export {
    EthRpc
}