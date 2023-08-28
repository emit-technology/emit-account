import {
    AddressTx,
    Balance,
    BalanceRecord,
    ChainType,
    EventStruct,
    Token,
    Transaction,
    TxInfo,
    TxsView,
    TxType
} from "../types";
import BigNumber from "bignumber.js";
import * as constant from "../common/constant";
import {tokenCache} from "../cache/tokens";
import {TOKEN_ADDRESS, TOKEN_ADDRESS_BSC} from "../common/constant";
import {ZERO_ADDRESS} from "../common/utils";

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

    protected  useV2 = ()=>{
        return this.dbName == constant.mongo.bsc.name || this.dbName == constant.mongo.eth.name
    }

    protected balanceRecords = async (client: any) => {
        if(this.useV2()){
            return await client.db(this.dbName).collection('balanceRecordsV2');
        }
        return await client.db(this.dbName).collection('balanceRecords');
    }

    protected txInfo = async (client: any) => {
        if(this.useV2()){
            return await client.db(this.dbName).collection('txInfoV2');
        }
        return await client.db(this.dbName).collection('txInfo');
    }

    protected addressTx = async (client: any) => {
        if(this.useV2()){
            return await client.db(this.dbName).collection('addressTxV2');
        }
        return await client.db(this.dbName).collection('addressTx');
    }

    protected blockNum = async (client: any) => {
        // if (!client) {
        //     client = await this.client();
        // }
        return await client.db(this.dbName).collection('blockNum');
    }

    protected tokens = async (client: any) => {
        // if (!client) {
        //     client = await this.client();
        // }
        return await client.db(this.dbName).collection('tokens');
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
                nonce:t.nonce?new BigNumber(t.nonce).toNumber():0,
                createdAt:new Date()
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
                        timestamp: timestamp,
                        createdAt:new Date()
                    })
                    records.push({
                        address: t.to,
                        currency: t.cy,
                        amount: new BigNumber(value).toString(10),
                        type: TxType.IN,
                        txHash: info.txHash,
                        num: 0,
                        timestamp: timestamp,
                        createdAt:new Date()
                    })
                // }
            })
            let option = constant.mongo.eth.transactionOptions;
            if(this.dbName == constant.mongo.eth.name){
                option = constant.mongo.eth.transactionOptions;
            }else if(this.dbName == constant.mongo.bsc.name){
                option = constant.mongo.bsc.transactionOptions;
            }else if(this.dbName == constant.mongo.sero.name){
                option = constant.mongo.sero.transactionOptions;
            }
            const transactionResults = await session.withTransaction(async () => {
                await this.insertTxInfos([info], session, client)
                await this.insertBalanceRecord(records, session, client)
            }, option)

            if (transactionResults) {
                // console.log("The pending tx was successfully created.");
            } else {
                console.log("The pending tx was intentionally aborted.");
            }
        } catch (e) {
            err = e;
            console.error("The pending transaction was aborted due to an unexpected error: ", e);
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
        const rest:Array<BalanceRecord> = [];
        for(let adx of records){
            if(rest.findIndex(
                v=>v.address == adx.address
                    && v.currency==adx.currency
                    && v.txHash == adx.txHash
            ) == -1){
                rest.push(adx)
            }
        }

        const db: any = await this.balanceRecords(client);
        return await db.insertMany(rest, {session})
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

    queryBalanceRecords = async (address: string, currency: string, hash: string, pageSize: number, pageNo: number,tokenAddress?:string) => {
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
            if(tokenAddress){
                tokenAddress = tokenAddress.toLowerCase();
                if(tokenAddress == ZERO_ADDRESS){
                    query["$or"] = [{tokenAddress:{"$eq":tokenAddress}},{tokenAddress:{"$eq":""}},{tokenAddress:{"$exists":false}}]
                }else {
                    query["tokenAddress"] = tokenAddress
                }
            }else{
                let tokenAddress = ZERO_ADDRESS;
                if(this.dbName == constant.mongo.bsc.name){
                    tokenAddress = TOKEN_ADDRESS_BSC[currency];
                }else if (this.dbName == constant.mongo.eth.name){
                    tokenAddress = TOKEN_ADDRESS[currency];
                }
                if(tokenAddress){
                    tokenAddress = tokenAddress.toLowerCase();
                }
                query["$or"] = [{tokenAddress:{"$eq":tokenAddress}},{tokenAddress:{"$eq":""}},{tokenAddress:{"$exists":false}}]
                // query["tokenAddress"] = {"$or":[{tokenAddress:tokenAddress},{"$exists":false}]};
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
            currency: record.currency,
            tokenAddress: record.tokenAddress
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
        if(new BigNumber(balance.totalIn).toNumber() != 0){
            return await db.insertOne(balance, {session})
        }
        return true
    }

    queryBalance = async (address: string, cy: string,tokenAddress?:string): Promise<Array<Balance>> => {
        const client = await this.client();
        try{
            const db: any = await this.balance(client);
            const query: any = {address: address}
            if (cy) {
                query.currency = cy;
                if(tokenAddress){
                    query["tokenAddress"] = {"$eq":tokenAddress};
                }else{
                    let tokenAddress = ZERO_ADDRESS;
                    if(this.dbName == constant.mongo.bsc.name){
                        tokenAddress = TOKEN_ADDRESS_BSC[cy];
                    }else if (this.dbName == constant.mongo.eth.name){
                        tokenAddress = TOKEN_ADDRESS[cy];
                    }
                    query["$or"] = [{tokenAddress:{"$eq":tokenAddress}},{tokenAddress:{"$eq":""}},{tokenAddress:{"$exists":false}}]
                    // query["tokenAddress"] = {"$or":[{tokenAddress:tokenAddress},{"$exists":false}]};
                }
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
        const rest:Array<AddressTx> = [];
        for(let adx of addressTxs){
            if(rest.findIndex(
                v=>v.address == adx.address
                && v.currency==adx.currency
                && v.txHash == adx.txHash
                && v.tokenAddress == adx.tokenAddress
            ) == -1){
                rest.push(adx)
            }
        }
        const db: any = await this.addressTx(client);
        return await db.insertMany(rest, {session})
    }

    queryTxByAddress = async (address: string, currency: string, pageSize: number, pageNo: number,tokenAddress?:string) => {
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
            if(tokenAddress){
                query["tokenAddress"] = {"$eq":tokenAddress};
            }else{
                let tokenAddress = ZERO_ADDRESS;
                if(this.dbName == constant.mongo.bsc.name){
                    tokenAddress = TOKEN_ADDRESS_BSC[currency];
                }else if (this.dbName == constant.mongo.eth.name){
                    tokenAddress = TOKEN_ADDRESS[currency];
                }
                query["$or"] = [{tokenAddress:{"$eq":tokenAddress}},{tokenAddress:{"$eq":""}},{tokenAddress:{"$exists":false}}]
                // query["tokenAddress"] = {"$or":[{tokenAddress:tokenAddress},{"$exists":false}]};
            }
            console.log(query)
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
            let txInfo: any = await db.findOne({"txHash": txHash},
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
            if(!txInfo){
                txInfo = {txHash:txHash}
            }
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
    //block num
    insertBlock = async (num: number, tag: string, session: any, client: any) => {
        const db: any = await this.blockNum(client);
        const data: any = await db.findOne({"tag": tag}, {session});
        if (data) {
            return await db.updateOne({"tag": tag}, {"$set": {num: num}}, {session})
        } else {
            return await db.insertOne({"tag": tag, num: num}, {session})
        }
    }

    latestBlock = async (tag?:string) => {
        const client = await this.client();
        try{
            if(!tag){
                tag = "latest"
            }
            const db: any = await this.blockNum(client);
            const rest = await db.findOne({"tag": tag});
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

        await db.deleteMany({txHash: {"$in": hashArray}, num: 0}, {session})
        await dbRecord.deleteMany({txHash: {"$in": hashArray}, num: 0}, {session})
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

    // tx
    insertTokens = async (token: Token):Promise<boolean> => {
        const client = await this.client();
        try{
            const db: any = await this.tokens(client);
            await db.insertMany([token]);
            await tokenCache.init();
            return true
        }catch (e){
            console.error(e)
        }finally {
            this.release(client);
        }
        return false;
    }

    getToken = async (address: string): Promise<Token> => {
        const client = await this.client();
        let err ;
        try{
            if (!address){
                throw new Error("address is required!")
            }
            const db: any = await this.tokens(client);
            const query: any = {address: address};
            const results = await db.find(query).toArray();
            if(results && results.length>0){
                return results[0]
            }else{
               return null
            }
        }catch (e){
            err = typeof e == 'string'?e:e.message;
        }finally {
            this.release(client);
        }
        if(err){
            return Promise.reject(err);
        }
        return
    }

    getTokens = async (): Promise<Array<Token>> => {
        const client = await this.client();
        let err ;
        try{
            const db: any = await this.tokens(client);
            const results = await db.find({}).toArray();
            return results
        }catch (e){
            err = typeof e == 'string'?e:e.message;
        }finally {
            this.release(client);
        }
        if(err){
            return Promise.reject(err);
        }
        return
    }


    getLatestTxRecord = async (address: string): Promise<any> => {
        const client = await this.client();
        const db: any = await this.balanceRecords(client);
        let err ;
        try{
            const cursor = await db.find({address: address}, {
                limit: 1,
                sort: {timestamp: -1}
            });
            const count = await cursor.count();
            if(count > 0){
                const rests = await cursor.toArray();
                return rests[0]
            }
        }catch (e){
            err = typeof e == 'string'?e:e.message;
        }finally {
            this.release(client);
        }
        if(err){
            return Promise.reject(err);
        }
        return null;
    }

    getLatestBalance = async (address: string): Promise<any> => {
        const client = await this.client();
        const db: any = await this.balance(client);
        let err ;
        try{
            const cy = this.dbName == constant.mongo.bsc.name ?"BNB":this.dbName == constant.mongo.eth.name?"ETH":""
            const cursor = await db.find({address: address,currency:cy});
            const count = await cursor.count();
            if(count > 0){
                const rests = await cursor.toArray();
                return rests[0]
            }
        }catch (e){
            err = typeof e == 'string'?e:e.message;
        }finally {
            this.release(client);
        }
        if(err){
            return Promise.reject(err);
        }
        return null;
    }

}
export default Base