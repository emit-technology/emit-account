import {Api} from "./index";
import * as db from "../db";
import ethRpc from "../rpc/eth";
import {Balance} from "../types";
import BigNumber from "bignumber.js";
import * as constant from "../common/constant";
import Ierc20 from "./tokens/ierc20";

const myPool = require('../db/mongodb');

class EthApi extends Api {

    constructor() {
        super(db.eth);
    }

    commitTx = async (data: any, t: any): Promise<any> => {
        const hash = await ethRpc.sendRawTransaction(data);
        t.feeCy = "ETH";
        t.feeValue = new BigNumber(t.gas).multipliedBy(new BigNumber(t.gasPrice)).toString(10)
        await this.insertTxInfo(hash, t)
        return Promise.resolve(hash);
    }

    genParams(txPrams: any): Promise<any> {
        return Promise.resolve(undefined);
    }

    proxyPost = async (method: string, params: any): Promise<any> => {
        return await ethRpc.post(method, params)
    }

    getBalance = async (address: string,cy:string): Promise<any> => {
        const balances: Array<Balance> = await this.db.queryBalance(address,cy)
        const assets: any = {};
        for (let b of balances) {
            assets[b.currency] = new BigNumber(b.totalIn).minus(b.totalOut).minus(b.totalFrozen).toString(10)
        }
        //init for next query
        this.initBalance(address).catch(e=>{
            console.log(e,"initBalance")
        })
        return Promise.resolve(assets);
    }

    initBalance = async (address:string) => {
        const balanceArr:Array<any> = [];
        const tokens:any = Object.keys(constant.TOKEN_ADDRESS);
        for(let cy of tokens){
            const addressContract:any = constant.TOKEN_ADDRESS[cy];
            const ierc20: Ierc20 = new Ierc20(addressContract);
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
        const balance = await ethRpc.getBalance(address)
        balanceArr.push( {
            address: address.toLowerCase(),
            currency: "ETH",
            totalIn: balance.toString(10),
            totalOut: "0",
            totalFrozen: "0"
        })
        const client: any = await myPool.acquire();
        const session = client.startSession();
        try {
            const transactionResults = await session.withTransaction(async () => {
                for(let balance of balanceArr){
                    await db.eth.updateBalance(balance,session,client)
                }
            }, constant.mongo.eth.transactionOptions)

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

export default EthApi;