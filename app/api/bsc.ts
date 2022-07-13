import {Api} from "./index";
import {bsc} from "../db";
import bscRpc from "../rpc/bsc";
import {Balance, BalanceRecord, ChainType, Token} from "../types";
import BigNumber from "bignumber.js";
import * as constant from "../common/constant";
import {BSC_HOST, ETH_HOST} from "../common/constant";
import Ierc20 from "./tokens/ierc20";
import {tokenCache} from "../cache/tokens";
import {ZERO_ADDRESS} from "../common/utils";

const myPool = require('../db/mongodb');
const scanRatioSec = 1;
class BscApi extends Api {
    getChainConfig(): Promise<any> {
        throw new Error("Method not implemented.");
    }
    addressMap: Map<string,boolean>=new Map<string, boolean>();

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

    getBalanceWithAddress = async (address: string): Promise<any> => {
        const balances: Array<Balance> = await this.db.queryBalance(address,"","")
        const assets: Array<any> = [];
        for (let b of balances) {
            const value = new BigNumber(b.totalIn).minus(b.totalOut).minus(b.totalFrozen);
            if(value.toNumber() <= 0){
                continue
            }
            assets.push({
                value: value.toString(10),
                symbol: b.currency,
                tokenAddress: b.tokenAddress
            })
        }
        this.handleBalance(address);
        return Promise.resolve(assets);
    }

    private handleBalance = (address:string)=>{
        if(!this.addressMap.has(address)){
            this.addressMap.set(address,true);
            //init for next query
            this.initBalance(address).then(()=>{
                setTimeout(()=>{
                    this.addressMap.delete(address)
                },scanRatioSec*1000)
            }).catch(e=>{
                setTimeout(()=>{
                    this.addressMap.delete(address)
                },scanRatioSec*1000)
            })
        }
    }
    getBalance = async (address: string,cy:string,tokenAddress?:string): Promise<any> => {
        const balances: Array<Balance> = await this.db.queryBalance(address,cy,tokenAddress)
        const assets: any = {};
        for (let b of balances) {
            assets[b.currency] = new BigNumber(b.totalIn).minus(b.totalOut).minus(b.totalFrozen).toString(10)
        }
        this.handleBalance(address);
        return Promise.resolve(assets);
    }

    initBalance = async (address:string) => {
        const hasNew = await this.hasNewTx(address);
        if(!hasNew){
            return;
        }

        const balanceArr:Array<Balance> = [];
        const tokens = constant.TOKEN_ADDRESS_BSC;
        const tokenKeys:Array<string> = Object.keys(tokens);
        for(let cy of tokenKeys){
            const addressContract:any = tokens[cy];
            if (addressContract == ZERO_ADDRESS){
                continue
            }
            const ierc20: Ierc20 = new Ierc20(addressContract,BSC_HOST);
            // console.log(address,cy,"initBalance ERC20")
            const balance = await ierc20.balanceOf(address);

            balanceArr.push({
                address: address.toLowerCase(),
                currency: cy,
                totalIn: balance.toString(10),
                totalOut: "0",
                totalFrozen: "0",
                tokenAddress: addressContract,

                timestamp: Math.floor(Date.now() /1000)
            })
        }

        const tokens_cache:Array<Token> = tokenCache.all(ChainType.BSC);
        for(let t of tokens_cache){
            const ierc20: Ierc20 = new Ierc20(t.address,BSC_HOST);
            // console.log(address,cy,"initBalance ERC20")
            const balance = await ierc20.balanceOf(address);

            balanceArr.push({
                address: address.toLowerCase(),
                currency: t.symbol,
                totalIn: balance.toString(10),
                totalOut: "0",
                totalFrozen: "0",
                tokenAddress:t.address,

                timestamp: Math.floor(Date.now() /1000)
            })
        }

        const balance = await bscRpc.getBalance(address)
        balanceArr.push( {
            address: address.toLowerCase(),
            currency: "BNB",
            totalIn: balance.toString(10),
            totalOut: "0",
            totalFrozen: "0",
            tokenAddress: ZERO_ADDRESS,

            timestamp: Math.floor(Date.now() /1000)
        })
        const client: any = await myPool.acquire();
        const session = client.startSession();
        try {
            const transactionResults = await session.withTransaction(async () => {
                for(let balance of balanceArr){
                    // if(new BigNumber(balance.totalIn).toNumber() != 0){
                        await this.db.updateBalance(balance,session,client)
                    // }
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

    tokenAction = async (action: string, tokenAddress: string): Promise<any> => {
        const erc20: Ierc20 = new Ierc20(tokenAddress, BSC_HOST)
        if (action == "totalSupply") {
            const rest = await erc20.totalSupply();
            return rest.dividedBy(1e18).toFixed(0,1);
        } else if (action == "symbol") {
            const rest = await erc20.symbol();
            return rest;
        }
        return Promise.reject("Invalid action")
    }


    hasNewTx =async (address:string):Promise<boolean>=>{
        const blcRcrd:BalanceRecord = await this.db.getLatestTxRecord(address.toLowerCase());
        const blc:Balance = await this.db.getLatestBalance(address.toLowerCase());
        if(!blc || !blc.timestamp || blc.timestamp == 0){
            return true;
        }
        return blcRcrd && blc && blc.timestamp  < blcRcrd.timestamp + 180;
    }

}

export default BscApi;