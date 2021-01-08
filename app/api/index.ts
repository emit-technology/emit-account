import {TxPrams} from "../types/sero";
import {TxInfo, TxsView, Asset, Balance, EventStruct, Version, TxType} from "../types/index";
import BigNumber from "bignumber.js";
import * as db from "../db";
import * as constant from "../common/constant";
const myPool = require('../db/mongodb');

export abstract class Api {

    protected db: any

    protected constructor(db: any) {
        this.db = db;
    }

    abstract genParams(txPrams: TxPrams): Promise<any>;

    abstract commitTx(tx: any,txInfo:any): Promise<any>;

    abstract proxyPost(method:string,params:any):Promise<any>;

    abstract getBalance(address: string,cy:string): Promise<any>;

    getTxInfo = async (txHash: string): Promise<TxInfo> => {
        const txInfo: TxInfo = await this.db.queryTxByHash(txHash);
        return Promise.resolve(txInfo);
    }

    getTxs = async (address: string,currency: string, pageSize: number, pageNo: number): Promise<TxsView> => {
        const retn: TxsView = await this.db.queryTxByAddress(address,currency, pageSize, pageNo)
        return Promise.resolve(retn);
    }

    getBalanceRecords = async (address: string,currency: string, hash:string,pageSize: number, pageNo: number): Promise<TxsView> => {
        const retn: TxsView = await this.db.queryBalanceRecords(address,currency,hash, pageSize, pageNo)
        return Promise.resolve(retn);
    }

    getEvents = async (txHash: string,depositNonce: string): Promise<Array<EventStruct>> => {
        const retn: Array<EventStruct> = await this.db.queryEvents(txHash,depositNonce)
        return Promise.resolve(retn);
    }

    getAppVersion = async (tag:string,versionNum:number):Promise<any>=>{
        return await this.db.getAppVersion(tag,versionNum)
    }

    insertTxInfo = async (hash: string, t: any,feeCy:string) => {
        const client: any = await myPool.acquire();
        const session = client.startSession();
        let err: any = null;
        try {
            const timestamp: number = Math.ceil(Date.now() / 1000);
            const info: TxInfo = {
                fromAddress: t.from,
                toAddress: [t.to],
                gas: t.gas,
                gasUsed: t.gasUsed,
                gasPrice: t.gasPrice,
                fee: new BigNumber(t.gas).multipliedBy(new BigNumber(t.gasPrice)).toString(10),     //gas * gasPrice
                feeCy: feeCy,
                txHash: hash,
                num: 0,
                outs: [],
                ins: [],
                transactionIndex: "0x0",
                contract: null,
                timestamp: timestamp
            };
            const records:Array<any> = [];
            [t.value,t.amount].forEach(value => {
                if(value && new BigNumber(value).toNumber()>0){
                    records.push({
                        address: t.from,
                        currency: t.cy,
                        amount: new BigNumber(value).multipliedBy(-1).toString(10),
                        type: TxType.OUT,
                        txHash: info.txHash,
                        num: 0,
                        timestamp: timestamp
                    })
                    records.push({
                        address: t.to,
                        currency: t.cy,
                        amount: new BigNumber(value).toString(10),
                        type: TxType.IN,
                        txHash: info.txHash,
                        num: 0,
                        timestamp: timestamp
                    })
                }
            })
            const transactionResults = await session.withTransaction(async () => {
                await this.db.insertTxInfos([info], session, client)
                await this.db.insertBalanceRecord(records, session, client)
            }, constant.mongo.eth.transactionOptions)

            if (transactionResults) {
                console.log("The reservation was successfully created.");
            } else {
                console.log("The transaction was intentionally aborted.");
            }
        } catch (e) {
            err = e;
            console.error("The transaction was aborted due to an unexpected error: ", e);
        } finally {
            await session.endSession();
            myPool.release(client);
        }
        if (err) {
            return Promise.reject(err);
        }
    }
}
