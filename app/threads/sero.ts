import * as db from "../db";
import seroRPC from "../rpc/sero";
import {OutInfo} from "../types/sero";
import {AddressTx, BalanceRecord, EventStruct, TxInfo, TxType} from "../types/";
import * as constant from "../common/constant";
import BigNumber from "bignumber.js";
import event from "../event";
import {Log, TransactionReceipt} from "../types/eth";
import * as utils from "../common/utils";

const myPool = require('../db/mongodb');

class SeroThread {

    async syncBlock(startNum:number,maxNum:number) {
        const client: any = await myPool.acquire();
        const session = client.startSession();
        let limit = 1;
        try {
            let dbNum: any = await db.sero.latestBlock();
            const remoteNum = await seroRPC.blockNumber() ;
            const chainNum = remoteNum - constant.THREAD_CONFIG.CONFIRM_BLOCK_NUM;
            console.debug(`SERO>>> Latest Block, remote=[${remoteNum}], start=[${chainNum}], db= [${dbNum}]`);
            if (!dbNum) {
                dbNum = startNum;
            } else {
                if (!chainNum) {
                    return;
                }
                if (dbNum >= chainNum) {
                    return
                }
            }
            limit = chainNum - dbNum + 1 ;
            if (limit > maxNum) {
                limit = maxNum;
            }
            // {
            //     dbNum = 99487;
            //     limit = 1;
            // }
            console.info(`fetch from : ${dbNum+1}, limit: ${limit}`);
            const timestampMap: Map<number, number> = new Map<number, number>();

            const rest:Array<any> = await seroRPC.getBlocksInfo(dbNum+1, limit);
            const outs: Array<OutInfo> = rest[0];
            const nils:Array<string> = rest[1];

            if (!(outs && outs.length > 0)) {
                const updateNum = limit + dbNum + 1 > chainNum ? chainNum : limit + dbNum + 1;
                const timestamp: number = await seroRPC.getBlockTimestamp(updateNum)
                await db.sero.upsertLatestBlock(updateNum, timestamp, session, client);
                return
            }
            const txHashOuts: Map<string, Array<OutInfo>> = new Map<string, Array<OutInfo>>();
            const addressIns: Map<string, Array<OutInfo>> = new Map<string, Array<OutInfo>>();
            const addressOuts: Map<string, Array<OutInfo>> = new Map<string, Array<OutInfo>>();
            const addressAndTxMap: Map<string, AddressTx> = new Map<string, AddressTx>();
            const removeTxHashArray:Array<string>= [];
            const addressTxs: Array<AddressTx> = [];
            const txInfos: Array<TxInfo> = [];
            const balanceRecords: Array<BalanceRecord> = [];
            const outsMap: Map<string, OutInfo> = new Map<string, OutInfo>()
            const usedRoots: Array<string> = [];
            const events: Array<EventStruct> = [];
            // rebuild data struct
            for (let o of outs) {
                if (!timestampMap.has(o.num)) {
                    const timestamp: number = await seroRPC.getBlockTimestamp(o.num)
                    timestampMap.set(o.num, timestamp)
                }
                // group by txHash and address
                const key = [o.address, o.txHash, o.asset.currency,o.num].join(":");
                if (txHashOuts.has(o.txHash)) {
                    const tmp: any = txHashOuts.get(o.txHash)
                    tmp.push(o)
                    txHashOuts.set(o.txHash, tmp);
                } else {
                    txHashOuts.set(o.txHash, [o])
                }

                if (addressIns.has(key)) {
                    const Ins: any = addressIns.get(key)
                    Ins.push(o)
                } else {
                    addressIns.set(key, [o])
                }

                outsMap.set(o.root, o)

                if (!addressAndTxMap.has(key)) {
                    addressAndTxMap.set(key, {address: o.address, txHash: o.txHash, num: o.num,currency: o.asset.currency})
                }
            }

            const entries = txHashOuts.entries();
            let data = entries.next();
            while (!data.done) {
                const txHash = data.value[0];
                const outsArr = data.value[1];
                removeTxHashArray.push(txHash)
                const txInfo: TxInfo | null = await seroRPC.getTxInfo(txHash, outsArr,outsMap)
                if (txInfo) {
                    txInfo.timestamp = timestampMap.get(txInfo.num)
                    txInfo.ins && usedRoots.concat(txInfo.ins)
                    await this.pickOuts(txInfo, outsMap, addressOuts, addressAndTxMap);

                    const txReceipt: TransactionReceipt = await seroRPC.getTransactionReceipt(txInfo.txHash);
                    txInfo.fee = new BigNumber(txReceipt.gasUsed).multipliedBy(new BigNumber(txInfo.gasPrice)).toString(10)
                    txInfo.gasUsed = txReceipt.gasUsed;
                    txInfos.push(txInfo)
                    const logs: Array<Log> = txReceipt.logs;
                    console.log(logs)
                    if (logs && logs.length > 0) {
                        for (let log of logs) {
                            if (!utils.isCrossAddress(log.address)) {
                            } else {
                                const logRet = event.decodeLog(txInfo.num,txInfo.txHash,log.address,log.topics,log.data)
                                if(logRet){
                                    events.push(logRet)
                                }
                            }
                        }
                    }
                }
                data = entries.next();
            }

            const aEntries = addressAndTxMap.entries();
            let aNext = aEntries.next();
            while (!aNext.done) {
                const addressTx: AddressTx = aNext.value[1];
                addressTxs.push(addressTx)
                aNext = aEntries.next();
            }

            //build balance records of ins
            this.convertToBRS(addressIns, balanceRecords, TxType.IN, timestampMap);

            //build balance records of outs
            this.convertToBRS(addressOuts, balanceRecords, TxType.OUT, timestampMap);


            if (outs.length == 0 || addressTxs.length == 0 || txInfos.length == 0 || balanceRecords.length == 0) {
                throw new Error(`Invalid Data ,outs = [${outs.length}] , address txs=[${addressTxs.length}], tx infos=[${txInfos.length}]  balance records=[${balanceRecords.length}]`)
            }

            const txRecords:Map<string,BalanceRecord> = new Map<string, BalanceRecord>();
            for(let record of balanceRecords){
                const key = [record.address,record.txHash,record.currency,record.num].join(":");
                if(txRecords.has(key)){
                    const tmp:any = txRecords.get(key);
                    tmp.amount = record.type == TxType.IN?
                        new BigNumber(tmp.amount).plus(record.amount).toString(10):
                        new BigNumber(tmp.amount).minus(record.amount).toString(10)
                    txRecords.set(key,tmp);
                }else{
                    txRecords.set(key,record)
                }
            }

            const groupBalanceRecords:Array<BalanceRecord> = [];
            const gEntries = txRecords.entries();
            let gNext = gEntries.next();
            while(!gNext.done){
                groupBalanceRecords.push(gNext.value[1]);
                gNext = gEntries.next();
            }

            //==== insert mongo
            const transactionResults = await session.withTransaction(async () => {

                await db.sero.removePendingTxByHash(removeTxHashArray,session,client);
                await db.sero.insertOuts(outs, session, client)
                await db.sero.insertAddressTx(addressTxs, session, client)
                await db.sero.insertTxInfos(txInfos, session, client)
                await db.sero.insertBalanceRecord(groupBalanceRecords, session, client)
                if(events && events.length>0){
                    await db.sero.insertEvents(events, session, client)
                }
                for (let record of groupBalanceRecords) {
                    await db.sero.upsertBalance(record, session, client)
                }
                await db.sero.updateOutUsed(usedRoots.concat(nils), session, client)
                // await db.sero.updateOutUsed(nils, session, client);
                const updateNum = outs[outs.length-1].num;
                const timestamp: number = await seroRPC.getBlockTimestamp(updateNum)
                if (timestamp) {
                    await db.sero.upsertLatestBlock(updateNum, timestamp, session, client);
                }else{
                    throw new Error("No valid timestamp")
                }
            }, constant.mongo.sero.transactionOptions);

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

    private async pickOuts(txInfo: TxInfo, outsMap: Map<string, OutInfo>, addressOuts: Map<string, Array<OutInfo>>, addressAndTxMap: Map<string, AddressTx>) {
        for (let d of txInfo.ins) {
            let out: OutInfo | undefined = outsMap.get(d);
            if (!out) {
                const dbOuts: any = await db.sero.findOutsByRoots([d])
                if (dbOuts && dbOuts.length > 0) {
                    out = dbOuts[0]
                }
            }
            if (out) {
                const key = [txInfo.fromAddress, txInfo.txHash, out.asset.currency, txInfo.num].join(":");
                if (addressOuts.has(key)) {
                    const tmp: any = addressOuts.get(key);
                    tmp.push(out)
                    addressOuts.set(key, tmp);

                } else {
                    addressOuts.set(key, [out])
                }
                if (!addressAndTxMap.has(key)) {
                    addressAndTxMap.set(key, {
                        address: txInfo.fromAddress,
                        txHash: txInfo.txHash,
                        num: txInfo.num,
                        currency: out.asset.currency
                    })
                }
            }
        }
        return;
    }

    private convertToBRS(outMap: Map<string, Array<OutInfo>>, balanceRecords: Array<BalanceRecord>, type: TxType, timestampMap: Map<number, number>) {
        const bEntries = outMap.entries();
        let bNext = bEntries.next();
        while (!bNext.done) {
            const key = bNext.value[0];
            const address:string = key.split(":")[0]
            const txHash:string = key.split(":")[1]
            const currency:string = key.split(":")[2]
            const num:string = key.split(":")[3]

            const datas: Array<OutInfo> = bNext.value[1];

            const insMap: Map<string, Array<OutInfo>> = new Map<string, Array<OutInfo>>()
            for (let o of datas) {
                const k: string = [o.txHash, o.address, o.asset.currency].join(":")
                if (insMap.has(k)) {
                    const tmp: any = insMap.get(k)
                    tmp.push(o);
                    insMap.set(k, tmp)
                } else {
                    insMap.set(k, [o])
                }
            }
            const iEntries = insMap.entries();
            let iNext = iEntries.next();
            while (!iNext.done) {
                const outInfo: Array<OutInfo> = iNext.value[1];
                let amountIn = new BigNumber(0);
                for (let o of outInfo) {
                    if (!o.asset) {
                        console.debug("for error outInfo>>>", outInfo)
                    }
                    amountIn = amountIn.plus(new BigNumber(o.asset.value))
                }
                balanceRecords.push({
                    address: address,
                    currency: currency,
                    amount: amountIn.toString(10),
                    type: type,
                    txHash: txHash,
                    num: parseInt(num),
                    timestamp: timestampMap.get(parseInt(num))
                })
                iNext = iEntries.next();
            }
            bNext = bEntries.next();
        }
    }
}

export default SeroThread