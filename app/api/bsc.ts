import {Api} from "./index";
import {bsc} from "../db";
import bscRpc from "../rpc/bsc";
import {Balance} from "../types";
import BigNumber from "bignumber.js";
import * as constant from "../common/constant";
import Ierc20 from "./tokens/ierc20";
import {BSC_HOST} from "../common/constant";

const myPool = require('../db/mongodb');

class BscApi extends Api {
    getChainConfig(): Promise<any> {
        throw new Error("Method not implemented.");
    }
    addressMap:Map<string,boolean>=new Map<string, boolean>();

    constructor() {
        super(bsc);
    }

    commitTx = async (data: any, t: any): Promise<any> => {
        const hash = await bscRpc.sendRawTransaction(data);
        t.feeCy = "BNB";
        t.feeValue = new BigNumber(t.gas).multipliedBy(new BigNumber(t.gasPrice)).toString(10)
        await this.insertTxInfo(hash, t)
        return Promise.resolve(hash);
    }

    genParams(txPrams: any): Promise<any> {
        return Promise.resolve(undefined);
    }

    proxyPost = async (method: string, params: any): Promise<any> => {
        let rest:any = await bscRpc.post(method, params)
        if(method == "eth_gasPrice"){
            rest ="0x"+ new BigNumber(new BigNumber(rest).multipliedBy(1.001).toFixed(0)).toString(16)
        }
        console.log("BSC proxy post:",method,params,rest)
        return rest
    }

    getBalance = async (address: string,cy:string): Promise<any> => {

        const balances: Array<Balance> = await this.db.queryBalance(address,cy)
        const assets: any = {};
        for (let b of balances) {
            assets[b.currency] = new BigNumber(b.totalIn).minus(b.totalOut).minus(b.totalFrozen).toString(10)
        }
        //init for next query
        if(!this.addressMap.has(address)){
            console.log("bsc...getbalance>>",address)
            this.addressMap.set(address,true);
            //init for next query
            this.initBalance(address).then(()=>{
                setTimeout(()=>{
                    this.addressMap.delete(address)
                },60*1000)
            }).catch(e=>{
                setTimeout(()=>{
                    this.addressMap.delete(address)
                },60*1000)
                console.log(e,"initBalance")
            })
        }
        return Promise.resolve(assets);
    }

    initBalance = async (address:string) => {
        const balanceArr:Array<any> = [];
        const tokens:any = Object.keys(constant.TOKEN_ADDRESS_BSC);
        for(let cy of tokens){
            const addressContract:any = constant.TOKEN_ADDRESS_BSC[cy];
            const ierc20: Ierc20 = new Ierc20(addressContract,BSC_HOST);
            // console.log(address,cy,"initBalance ERC20")
            const balance = await ierc20.balanceOf(address);

            balanceArr.push({
                address: address.toLowerCase(),
                currency: cy,
                totalIn: balance.toString(10),
                totalOut: "0",
                totalFrozen: "0"
            })
        }
        const balance = await bscRpc.getBalance(address)
        balanceArr.push( {
            address: address.toLowerCase(),
            currency: "BNB",
            totalIn: balance.toString(10),
            totalOut: "0",
            totalFrozen: "0"
        })
        const client: any = await myPool.acquire();
        const session = client.startSession();
        try {
            const transactionResults = await session.withTransaction(async () => {
                for(let balance of balanceArr){
                    await this.db.updateBalance(balance,session,client)
                }
            }, constant.mongo.bsc.transactionOptions)

            if (transactionResults) {
                console.log("The reservation was successfully created.");
            } else {
                console.log("The transaction was intentionally aborted.");
            }
        } catch (e) {
            console.error("The transaction was aborted due to an unexpected error: ", e);
        } finally {
            await session.endSession();
            myPool.release(client);
        }
    }

    getTicket(address: string): Promise<any> {
        return Promise.resolve(undefined);
    }
}

export default BscApi;