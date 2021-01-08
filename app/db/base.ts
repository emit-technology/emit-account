import {AddressTx, Balance, BalanceRecord, EventStruct, TxInfo, TxsView, TxType} from "../types";
import BigNumber from "bignumber.js";

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

    //balance
    insertBalanceRecord = async (records: Array<BalanceRecord>, session: any, client: any) => {
        const db: any = await this.balanceRecords(client);
        return await db.insertMany(records, {session})
    }

    insertEvents = async (events: Array<EventStruct>, session: any, client: any) => {
        const db: any = await this.events(client);
        return await db.insertMany(events, {session})
    }

    queryEvents = async (txHash: string, depositNonce: string) => {
        const client = await this.client();
        const db: any = await this.events(client);
        const query: any = {};
        if (txHash) {
            query.txHash = txHash
        }
        if (depositNonce) {
            query["event.depositNonce"] = depositNonce
        }
        const cursor = await db.find(query);
        const rests = await cursor.toArray();
        this.release(client);
        return rests;
    }

    queryBalanceRecords = async (address: string, currency: string, hash: string, pageSize: number, pageNo: number) => {

        const client = await this.client();
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
        this.release(client);
        return {total: count, data: rests, pageSize: pageSize, pageNo: pageNo};
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
        const self = this;
        const client = await this.client();
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
        // return await db.find(query,options).toArray();
        const cursor = await db.find(query, options);
        // const count = await cursor.count()
        return new Promise((resolve, reject) => {
            cursor.toArray((err: any, res: any) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(res)
                }
            });
            self.release(client);
        })
    }

    // tx
    insertAddressTx = async (addressTxs: Array<AddressTx>, session: any, client: any) => {
        const db: any = await this.addressTx(client);
        return await db.insertMany(addressTxs, {session})
    }

    queryTxByAddress = async (address: string, currency: string, pageSize: number, pageNo: number) => {
        const client = await this.client();
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
        console.debug("queryTxByAddress>>", rests);
        const txHashArr: Array<string> = [];
        for (let d of rests) {
            txHashArr.push(d.txHash)
        }
        if (txHashArr.length > 0) {
            const db: any = await this.txInfo(client);
            datas.txs = await db.find({"txHash": {"$in": txHashArr}}, {sort: {num: -1}}).toArray()
        }
        this.release(client);
        return datas
    }

    queryTxByHash = async (txHash: string) => {
        console.debug(txHash, "queryTxByHash")
        const client = await this.client();
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
        txInfo.records = records;
        this.release(client);
        return txInfo;
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
        const db: any = await this.blockNum(client);
        const rest = await db.findOne({"tag": "latest"});
        this.release(client);
        return rest ? rest.num : 0;
    }

    removePendingTxByHash = async (hashArray: Array<string>, session: any, client: any) => {
        const db: any = await this.txInfo(client);
        const dbRecord: any = await this.balanceRecords(client);

        await db.deleteMany({txHash: {"$in": hashArray}, num: 0}, {session})
        await dbRecord.deleteMany({txHash: {"$in": hashArray}, num: 0}, {session})
        return;
    }

    getAppVersion = async (tag: string, versionNum?: number): Promise<any> => {
        const client = await this.client();
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
        this.release(client);
        return results;
    }
}

export default Base