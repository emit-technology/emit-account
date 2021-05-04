import {AddressTx, Balance, BalanceRecord, EventStruct, Transaction, TxInfo, TxsView, TxType} from "../types";
import BigNumber from "bignumber.js";
import * as constant from "../common/constant";

const myPool = require('../db/mongodb');

class Base {

    protected dbName: string

    constructor(dbName: string) {
        this.dbName = dbName;
    }

    client = async () => {
        return await myPool.acquire();
    }

    release(client: any) {
        myPool.release(client);
    }

    protected balance = async (client: any) => {
        // if (!client) {
        //     client = await this.client();
        // }
        return await client.db(this.dbName).collection('balance');
    }

    protected balanceRecords = async (client: any) => {
        // if (!client) {
        //     client = await this.client();
        // }
        return await client.db(this.dbName).collection('balanceRecords');
    }

    protected txInfo = async (client: any) => {
        // if (!client) {
        //     client = await this.client();
        // }
        return await client.db(this.dbName).collection('txInfo');
    }

    protected addressTx = async (client: any) => {
        // if (!client) {
        //     client = await this.client();
        // }
        return await client.db(this.dbName).collection('addressTx');
    }

    protected blockNum = async (client: any) => {
        // if (!client) {
        //     client = await this.client();
        // }
        return await client.db(this.dbName).collection('blockNum');
    }

    protected versions = async (client: any) => {
        // if (!client) {
        //     client = await this.client();
        // }
        return await client.db(this.dbName).collection('versions');
    }

    protected events = async (client: any) => {
        // if (!client) {
        //     client = await this.client();
        // }
        return await client.db(this.dbName).collection('events');
    }

    insertTxInfos = async (txInfos: Array<TxInfo>, session: any, client: any) => {
        const db: any = await this.txInfo(client);
        return await db.insertMany(txInfos, {session})
    }

    insertTxInfo = async (hash: string, t: Transaction) => {
        const client: any = await myPool.acquire();
        const session = client.startSession();
        let err: any = null;
        try {
            const timestamp: number = Math.ceil(Date.now() / 1000);
            const info: TxInfo = {
                fromAddress: t.from,
                toAddress: [t.to],
                gas: t.gas ? t.gas : "21000",
                gasUsed: t.gas ? t.gas : "21000",
                gasPrice: t.gasPrice ? t.gasPrice : "0x3b9aca00",
                fee: t.feeValue ? t.feeValue : "0x" + new BigNumber(t.gas ? t.gas : "21000").multipliedBy(new BigNumber(t.gasPrice ? t.gasPrice : "0x3b9aca00")).toString(16),     //gas * gasPrice
                feeCy: t.feeCy ? t.feeCy : "",
                txHash: hash,
                num: 0,
                outs: [],
                ins: [],
                transactionIndex: "0x0",
                contract: null,
                timestamp: timestamp,
                nonce:t.nonce?new BigNumber(t.nonce).toNumber():0
            };
            const records: Array<any> = [];
            [t.value].forEach(value => {
                // if (value && new BigNumber(value).toNumber() > 0) {
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
                // }
            })
            const transactionResults = await session.withTransaction(async () => {
                await this.insertTxInfos([info], session, client)
                await this.insertBalanceRecord(records, session, client)
            }, constant.mongo.eth.transactionOptions)

            if (transactionResults) {
                // console.log("The pending tx was successfully created.");
            } else {
                console.log("The pending tx was intentionally aborted.");
            }
        } catch (e) {
            err = e;
            // console.error("The pending transaction was aborted due to an unexpected error: ", e);
        } finally {
            await session.endSession();
            myPool.release(client);
        }
        if (err) {
            return Promise.reject(err);
        }
    }

    //balance
    insertBalanceRecord = async (records: Array<BalanceRecord>, session: any, client: any) => {
        const db: any = await this.balanceRecords(client);
        return await db.insertMany(records, {session})
    }

    insertEvents = async (events: Array<EventStruct>, session: any, client: any) => {
        const db: any = await this.events(client);
        return await db.insertMany(events, {session})
    }

    insertEventOne = async (event: EventStruct) => {
        const client = await this.client();
        try{
            const db: any = await this.events(client);
            await db.insertOne(event)
        }catch (e){
            console.error(e)
        }finally {
            this.release(client);
        }
    }

    queryEvents = async (txHash: string, depositNonce: string,originChainID:string,resourceID:string,eventName?:string) => {
        const client = await this.client();
        try{
            const db: any = await this.events(client);
            const query: any = {};
            if (txHash) {
                query.txHash = txHash
            }
            if (depositNonce) {
                query["event.depositNonce"] = depositNonce
            }
            if (originChainID) {
                query["event.originChainID"] = originChainID
            }
            if (resourceID) {
                query["event.resourceID"] = resourceID
            }
            if (eventName) {
                query.eventName = eventName
            }
            const cursor = await db.find(query);
            const rests = await cursor.toArray();
            return rests;
        }catch (e){
            console.error(e)
        }finally {
            this.release(client);
        }
    }

    eventExist = async (txHash: string):Promise<boolean> => {
        const client = await this.client();
        try{
            const db: any = await this.events(client);
            const query: any = {};
            if (txHash) {
                query.txHash = txHash
            }
            const cursor = await db.find(query);
            const count = await cursor.count();
            return count>0;
        }catch (e){
            console.error(e)
        }finally {
            this.release(client);
        }
        return false
    }

    queryBalanceRecords = async (address: string, currency: string, hash: string, pageSize: number, pageNo: number) => {
        const client = await this.client();
        try{
            const db: any = await this.balanceRecords(client);
            const query: any = {};
            if (address) {
                query.address = address
            }
            if (currency) {
                query.currency = currency
            }
            if (hash) {
                query.txHash = {"$regex": hash}
            }

            const cursor = await db.find(query, {
                limit: pageSize,
                skip: (pageNo - 1) * pageSize,
                sort: {timestamp: -1}
            });
            const count = await cursor.count();
            const rests = await cursor.toArray();
            return {total: count, data: rests, pageSize: pageSize, pageNo: pageNo};
        }catch (e){
            console.error(e)
        }finally {
            this.release(client);
        }
        return {total: 0, data: [], pageSize: pageSize, pageNo: pageNo};
    }

    upsertBalance = async (record: BalanceRecord, session: any, client: any) => {
        const db: any = await this.balance(client);
        const query: any = {"address": record.address, "currency": record.currency};
        let balance: Balance = await db.findOne(query, {session});
        if (balance) {
            if (record.type == TxType.IN) {
                balance.totalIn = new BigNumber(balance.totalIn).plus(record.amount).toString(10)
            } else if (record.type == TxType.OUT) {
                balance.totalOut = new BigNumber(balance.totalOut).plus(record.amount).toString(10)
            }
            return await db.updateOne(query, {"$set": balance}, {session})
        }
        balance = {
            address: record.address,
            totalIn: record.type == TxType.IN ? record.amount : "0",
            totalOut: record.type == TxType.OUT ? record.amount : "0",
            totalFrozen: "0",
            currency: record.currency
        }
        return await db.insertOne(balance, {session})
    }

    updateBalance = async (balance: Balance, session: any, client: any) => {
        const db: any = await this.balance(client);
        const query: any = {"address": balance.address, "currency": balance.currency};
        let balanceDB: Balance = await db.findOne(query, {session});
        if (balanceDB) {
            return await db.updateOne(query, {"$set": balance}, {session})
        }
        return await db.insertOne(balance, {session})
    }

    queryBalance = async (address: string, cy: string): Promise<Array<Balance>> => {
        const client = await this.client();
        try{
            const db: any = await this.balance(client);
            const query: any = {address: address}
            if (cy) {
                query.currency = cy;
            }
            const options = {
                // "limit": 1,
                // "skip": 0,
                "sort": "address"
            }
            return await db.find(query,options).toArray();
            // const cursor = await db.find(query, options);
            // // const count = await cursor.count()
            // return new Promise((resolve, reject) => {
            //     cursor.toArray((err: any, res: any) => {
            //         if (err) {
            //             reject(err)
            //         } else {
            //             resolve(res)
            //         }
            //     });
            // })
        }catch (e){
            console.error(e)
        }finally {
            this.release(client);
        }
        return []
    }

    // tx
    insertAddressTx = async (addressTxs: Array<AddressTx>, session: any, client: any) => {
        const db: any = await this.addressTx(client);
        return await db.insertMany(addressTxs, {session})
    }

    queryTxByAddress = async (address: string, currency: string, pageSize: number, pageNo: number) => {
        const client = await this.client();
        try{
            const db1: any = await this.addressTx(client);
            let datas: TxsView = {};
            const query: any = {};
            if (address) {
                query.address = address;
            }
            if (currency) {
                query.currency = currency;
            }
            const cursor = await db1.find(query, {
                limit: pageSize,
                skip: (pageNo - 1) * pageSize,
                sort: {num: 1}
            });
            datas.total = await cursor.count()
            datas.pageSize = pageSize;
            datas.pageNo = pageNo;
            const rests: Array<AddressTx> = await cursor.toArray();
            // console.debug("queryTxByAddress>>", rests);
            const txHashArr: Array<string> = [];
            for (let d of rests) {
                txHashArr.push(d.txHash)
            }
            if (txHashArr.length > 0) {
                const db: any = await this.txInfo(client);
                datas.txs = await db.find({"txHash": {"$in": txHashArr}}, {sort: {num: -1}}).toArray()
            }
            return datas
        }catch (e){
            console.error(e)
        }finally {
            this.release(client);
        }
        return []
    }

    queryTxByHash = async (txHash: string) => {
        const client = await this.client();
        try{
            const db: any = await this.txInfo(client);
            const dbRecord: any = await this.balanceRecords(client);
            const txInfo: any = await db.findOne({"txHash": txHash},
                {
                    projection: {
                        ins: 0,
                        outs: 0,
                        _id: 0
                    }
                })
            const records: any = await dbRecord.find({
                    txHash: txHash
                }, {
                    projection: {
                        num: 0,
                        timestamp: 0,
                        txHash: 0,
                        type: 0,
                        _id: 0
                    }
                }
            ).toArray();
            if (txInfo && records) {
                txInfo.records = records;
            }
            return txInfo;
        }catch (e){
            console.error(e)
        }finally {
            this.release(client);
        }
        return
    }

    //block num
    upsertLatestBlock = async (num: number, timestamp: number, session: any, client: any) => {
        const db: any = await this.blockNum(client);
        const data: any = await db.findOne({"tag": "latest"}, {session});
        if (data) {
            return await db.updateOne({"tag": "latest"}, {"$set": {num: num}}, {session})
        } else {
            return await db.insertOne({"tag": "latest", num: num}, {session})
        }
    }

    latestBlock = async () => {
        const client = await this.client();
        try{
            const db: any = await this.blockNum(client);
            const rest = await db.findOne({"tag": "latest"});
            return rest ? rest.num : 0;
        }catch (e){
            console.error(e)
        }finally {
            this.release(client);
        }
        return 0
    }

    removePendingTxByHash = async (hashArray: Array<string>, session: any, client: any) => {
        const db: any = await this.txInfo(client);
        const dbRecord: any = await this.balanceRecords(client);

        await db.deleteMany({txHash: {"$in": hashArray}}, {session})
        await dbRecord.deleteMany({txHash: {"$in": hashArray}}, {session})
        return;
    }

    getAppVersion = async (tag: string, versionNum?: number): Promise<any> => {
        const client = await this.client();
        try{
            const db: any = await this.versions(client);
            const query: any = {};
            if (tag) {
                query.tag = tag;
            }
            if (versionNum) {
                query.num = versionNum;
            }
            const results = await db.find(query, {
                sort: {num: -1}
            }).toArray();
            return results;
        }catch (e){
            console.error(e)
        }finally {
            this.release(client);
        }
        return
    }

    countPendingTx = async (address:string,currency:string) => {
        const client = await this.client();
        try{
            const db: any = await this.balanceRecords(client);
            const query: any = {
                address:address,
                num:0,
                currency:currency
            };
            const count = await db.find(query).count();
            return count;
        }catch (e){
            console.error(e)
        }finally {
            this.release(client);
        }
        return
    }

}
export default Base