/**
 * Copyright 2020 EMIT Foundation.
 This file is part of E.M.I.T. .

 E.M.I.T. is free software: you can redistribute it and/or modify
 it under the terms of the GNU General Public License as published by
 the Free Software Foundation, either version 3 of the License, or
 (at your option) any later version.

 E.M.I.T. is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 GNU General Public License for more details.

 You should have received a copy of the GNU General Public License
 along with E.M.I.T. . If not, see <http://www.gnu.org/licenses/>.
 */

import * as db from "../../db";
import bsc from "../../rpc/bsc";
import {AddressTx, Balance, BalanceRecord, ChainType, EVENT_TYPE, EventStruct, TxInfo, TxType} from "../../types";
import * as constant from "../../common/constant";
import {BSC_HOST} from "../../common/constant";
import * as utils from '../../common/utils'
import {ApprovalEvent, Block, Log, Transaction, TransactionReceipt, TransferEvent} from "../../types/eth";
import BigNumber from "bignumber.js";
import Ierc20 from "../../api/tokens/ierc20";
import event from "../../event";

const Web3 = require('web3');

const myPool = require('../../db/mongodb');

const defaultCurrency = "BNB";

class Index {

    web3: any;

    txInfos: Array<any>

    constructor() {
        this.web3 = new Web3(constant.BSC_HOST);
        this.txInfos = [];
    }

    syncPendingTransactions = async () => {
        const rests:any = await bsc.getFilterChangesPending();
        const c:any = this.txInfos.concat(rests);
        this.txInfos = c;
        console.info(`bsc syncPendingTransactions,len[${this.txInfos.length}]`)
        return Promise.resolve();
    }

    dealPending = async ()=>{
        if(this.txInfos && this.txInfos.length>0){
            const tx:any = this.txInfos.pop();
            await db.bsc.insertTxInfo(tx.hash,tx)
        }
        return Promise.resolve();
    }

    removeUnPendingTxTimeout = async () => {
        await db.bsc.removeUnPendingTxTimeout();
    }

    //tag = thread-1
    syncTransactions = async (startNum:number,tag:string) => {
        const step = 10;
        const threadTag = parseInt(tag.split("-")[1]);
        const client: any = await myPool.acquire();
        const session = client.startSession();
        // let limit = 1;
        try {
            const beginF = Date.now();
            let dbNum: any = await db.bsc.latestBlock(tag);
            const remoteNum = await bsc.blockNumber()
            const chainNum = remoteNum - constant.THREAD_CONFIG.CONFIRM_BLOCK_NUM;
            console.info(`BSC Thread[${tag}]>>> remote=[${remoteNum}], start=[${chainNum}], db=[${dbNum}]`);
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
            // limit = chainNum - dbNum + 1;
            // if (limit > step) {
            //     limit = step;
            // }
            const start =  dbNum + 1;
            let syncNum = 0;
            for(let i=0;i<step;i++){
                if((start+i)%step == threadTag){
                    syncNum = start+i
                }
            }
            console.info(`BSC Thread[${tag}]>>> syncNum=[${syncNum}], start=[${start}], step=[${step}]`);
            if(!syncNum || syncNum>remoteNum){
                console.info(`BSC Thread[${tag}]>>> syncNum=[${syncNum}] invalid return`);
                return
            }
            // const end = dbNum + limit;
            const addressTxs: Array<AddressTx> = [];
            // const txInfos: Array<TxInfo> = [];
            const txInfoMap: Map<string,number> = new Map<string, number>();
            const txInfos:Array<TxInfo> = [];
            const balanceRecords: Array<BalanceRecord> = [];
            // const transactionReceipts: Array<TransactionReceipt> = [];
            const balanceMap: Map<string, Balance> = new Map<string, Balance>()
            const removeTxHashArray: Array<string> = [];
            const events: Array<EventStruct> = [];
            // for (let i = start; i <= end; i++) {
            //
            // }

            let begin = Date.now()
            const block: Block = await bsc.getBlockByNum(syncNum);
            if(!block){
                return
            }
            console.log(`bsc getBlock cost:[${(Date.now()-begin)/1000}]`)

            begin = Date.now();
            const transactions: Array<Transaction> = block.transactions;
            for (let t of transactions) {
                removeTxHashArray.push(t.hash);

                this.addTxAddress(t, addressTxs);
                const txInfo = this.genTxInfo(t, block);
                this.setBalanceRecords(t, balanceRecords, txInfo);
                // const txReceipt: TransactionReceipt = await bsc.getTransactionReceipt(t.hash)
                // console.log("eth block sync>>> ",t.hash)
                // const logs: Array<Log> = txReceipt.logs;
                // txInfo.fee = new BigNumber(txReceipt.gasUsed).multipliedBy(new BigNumber(t.gasPrice)).toString(10)
                // txInfo.gasUsed = txReceipt.gasUsed;
                txInfos.push(txInfo);
                txInfoMap.set(txInfo.txHash,txInfos.length-1)
                if (balanceRecords.length == 0) {
                    this.setBalanceRecordDefault(t, balanceRecords, txInfo);
                }

                // db.bsc.removeUnPendingTxByHash(txInfo.fromAddress,txInfo.nonce).catch(e=>{
                //     console.error("remove unpending tx, err: ", e);
                // })
            }
            console.log(`bsc transaction cost:[${(Date.now()-begin)/1000}]`)

            const logBegin = Date.now();
            const logs:Array<Log> = await bsc.getLogs(syncNum,syncNum)
            console.info(`log cost:[${Math.floor((Date.now()-logBegin)/1000)}]`)
            if (logs && logs.length > 0) {
                for (let log of logs) {
                    const index:any = txInfoMap.get(log.transactionHash)
                    const txInfo = txInfos[index];
                    const token = utils.isErc20Address(log.address,ChainType.BSC);
                    if (!token) {
                    } else {
                        await this.handelErc20Event(log, balanceMap, token, addressTxs, balanceRecords, txInfo);
                    }

                    if(utils.isErc721Address(log.address,ChainType.BSC)){
                        this.handleERC721Event(log, addressTxs, txInfo, balanceRecords);
                    }

                    if (utils.isCrossAddress(log.address,ChainType.BSC)  || utils.isCrossNftAddress(log.address,ChainType.BSC)) {
                        const logRet = event.decodeLog(txInfo.num, txInfo.txHash, log.address, log.topics, log.data)
                        if (logRet) {
                            events.push(logRet)
                        }
                    }
                    // if(token || utils.isCrossAddress(log.address) || utils.isCrossNftAddress(log.address)){
                    //     if(txInfo.num>0){
                    //         db.bsc.removeUnPendingTxByHash(txInfo.fromAddress,txInfo.nonce).catch(e=>{
                    //             console.error("remove unpending tx, err: ", e);
                    //         })
                    //     }
                    // }
                }
            }

            console.log(`Address txs=[${addressTxs.length}], tx infos=[${txInfoMap.size}]  balance records=[${balanceRecords.length}]`)
            if (addressTxs.length == 0 || txInfoMap.size == 0 || balanceRecords.length == 0) {
                // const updateNum = limit + dbNum > chainNum ? chainNum : limit + dbNum;
                const t = await bsc.getBlockByNum(syncNum);
                if (t) {
                    await db.bsc.insertBlock(syncNum, tag, session, client);
                }
                return
            }

            //==== insert mongo
            const transactionResults = await session.withTransaction(async () => {

                begin = Date.now();
                await db.bsc.removePendingTxByHash(removeTxHashArray, session, client);
                console.log(`db.bsc.removePendingTxByHash cost:[${Math.floor((Date.now()-begin)/1000)}]s`)
                begin = Date.now();
                await db.bsc.insertAddressTx(addressTxs, session, client)
                console.log(`db.bsc.insertAddressTx cost:[${Math.floor((Date.now()-begin)/1000)}]s`)
                begin = Date.now();
                await db.bsc.insertTxInfos(txInfos, session, client)
                console.log(`db.bsc.insertTxInfos cost:[${Math.floor((Date.now()-begin)/1000)}]s`)
                begin = Date.now();
                await db.bsc.insertBalanceRecord(balanceRecords, session, client)
                console.log(`db.bsc.insertBalanceRecord cost:[${Math.floor((Date.now()-begin)/1000)}]s`)
                begin = Date.now();
                if (events && events.length > 0) {
                    await db.bsc.insertEvents(events, session, client)
                }
                console.log(`db.bsc.insertEvents cost:[${Math.floor((Date.now()-begin)/1000)}]s`)
                begin = Date.now();
                // const blEntries = balanceMap.entries();
                // let blNext = blEntries.next();
                // while (!blNext.done) {
                //     await db.bsc.updateBalance(blNext.value[1], session, client)
                //     blNext = blEntries.next();
                // }
                await db.bsc.insertBlock(syncNum,tag, session, client);
                console.log(`db.bsc.insertBlock cost:[${Math.floor((Date.now()-begin)/1000)}]s`)

            }, constant.mongo.bsc.transactionOptions);

            // console.log(`bsc store data cost:[${Math.floor((Date.now()-begin)/1000)}]s`)
            if (transactionResults) {
                console.log("BSC>>> The reservation was successfully created.",`cost:[${Math.floor((Date.now()-beginF)/1000)}]s`);
            } else {
                console.log("BSC>>> The transaction was intentionally aborted.");
            }
        } catch (e) {
            console.error("BSC>>> The transaction was aborted due to an unexpected error: ", e);
        } finally {
            await session.endSession();
            myPool.release(client);
        }
    }

    private handleERC721Event(log: Log, addressTxs: Array<AddressTx>, txInfo:TxInfo, balanceRecords: Array<BalanceRecord>) {
        const key = defaultCurrency;
        const txEvent: TransferEvent = event.decodeERC721_Transfer(log.topics, log.data);
        txEvent.from && addressTxs.push({
            address: txEvent.from.toLowerCase(),
            txHash: txInfo.txHash,
            num: txInfo.num,
            currency: key
        })
        txEvent.to && addressTxs.push({
            address: txEvent.to.toLowerCase(),
            txHash: txInfo.txHash,
            num: txInfo.num,
            currency: key
        })
        if (txEvent.from) {
            balanceRecords.push({
                address: txEvent.from.toLowerCase(),
                currency: key,
                amount: "0",
                type: TxType.OUT,
                txHash: txInfo.txHash,
                num: txInfo.num,
                timestamp: txInfo.timestamp
            })
        }
        if (txEvent.to) {
            balanceRecords.push({
                address: txEvent.to.toLowerCase(),
                currency: key,
                amount: "0",
                type: TxType.IN,
                txHash: txInfo.txHash,
                num: txInfo.num,
                timestamp: txInfo.timestamp
            })
        }
    }

    private genTxInfo(t: Transaction, block: Block) {
        const txInfo: TxInfo = {
            fromAddress: t.from.toLowerCase(),
            toAddress: [t.to && t.to.toLowerCase()],
            gas: t.gas,
            gasUsed: t.gas,
            gasPrice: t.gasPrice,
            fee: new BigNumber(t.gas).multipliedBy(new BigNumber(t.gasPrice)).toString(10),     //gas * gasPrice
            feeCy: defaultCurrency,
            txHash: t.hash,
            num: utils.toNum(t.blockNumber),
            outs: [],
            ins: [],
            transactionIndex: t.transactionIndex,
            contract: null,
            timestamp: parseInt(block.timestamp),
            nonce:t.nonce?new BigNumber(t.nonce).toNumber():0
        };
        return txInfo;
    }

    private addTxAddress(t: Transaction, addressTxs: Array<AddressTx>) {
        t.from && addressTxs.push({
            address: t.from.toLowerCase(),
            txHash: t.hash,
            num: utils.toNum(t.blockNumber),
            currency: defaultCurrency
        })
        t.to && addressTxs.push({
            address: t.to.toLowerCase(),
            txHash: t.hash,
            num: utils.toNum(t.blockNumber),
            currency: defaultCurrency
        })
    }

    private setBalanceRecordDefault(t: Transaction, balanceRecords: Array<BalanceRecord>, txInfo: TxInfo) {
        if (t.from) {
            balanceRecords.push({
                address: t.from.toLowerCase(),
                currency: defaultCurrency,
                amount: new BigNumber(t.value).multipliedBy(-1).toString(10),
                type: TxType.OUT,
                txHash: txInfo.txHash,
                num: txInfo.num,
                timestamp: txInfo.timestamp
            })
        }
        if (t.to) {
            balanceRecords.push({
                address: t.to.toLowerCase(),
                currency: defaultCurrency,
                amount: t.value,
                type: TxType.IN,
                txHash: txInfo.txHash,
                num: txInfo.num,
                timestamp: txInfo.timestamp
            })
        }
    }

    private setBalanceRecords(t: Transaction, balanceRecords: Array<BalanceRecord>, txInfo: TxInfo) {
        if (t.from) {
            balanceRecords.push({
                address: t.from.toLowerCase(),
                currency: defaultCurrency,
                amount: new BigNumber(t.value).multipliedBy(-1).toString(10),
                type: TxType.OUT,
                txHash: txInfo.txHash,
                num: txInfo.num,
                timestamp: txInfo.timestamp
            })
        }
        if (t.to) {
            balanceRecords.push({
                address: t.to.toLowerCase(),
                currency: defaultCurrency,
                amount: new BigNumber(t.value).toString(10),
                type: TxType.IN,
                txHash: txInfo.txHash,
                num: txInfo.num,
                timestamp: txInfo.timestamp
            })
        }
    }

    private async handelErc20Event(log: Log, balanceMap: Map<string, Balance>, key: string, addressTxs: Array<AddressTx>, balanceRecords: Array<BalanceRecord>, txInfo: TxInfo) {
        const ierc20: Ierc20 = new Ierc20(log.address,BSC_HOST);
        // await this.setBalanceMap(txInfo.fromAddress, balanceMap, key, ierc20);

        if (ierc20.encodeEventSignature("Transfer") === log.topics[0]) {
            const e: TransferEvent = ierc20.decodeTransferLog(log.data, log.topics)
            e.from && addressTxs.push({
                address: e.from.toLowerCase(),
                txHash: txInfo.txHash,
                num: txInfo.num,
                currency: key
            })
            e.to && addressTxs.push({
                address: e.to.toLowerCase(),
                txHash: txInfo.txHash,
                num: txInfo.num,
                currency: key
            })

            // await this.setBalanceMap(e.from.toLowerCase(), balanceMap, key, ierc20);
            // await this.setBalanceMap(e.to.toLowerCase(), balanceMap, key, ierc20);

            if (e.from) {
                balanceRecords.push({
                    address: e.from.toLowerCase(),
                    currency: key,
                    amount: new BigNumber(e.value).multipliedBy(-1).toString(10),
                    type: TxType.OUT,
                    txHash: txInfo.txHash,
                    num: txInfo.num,
                    timestamp: txInfo.timestamp
                })
            }
            if (e.to) {
                balanceRecords.push({
                    address: e.to.toLowerCase(),
                    currency: key,
                    amount: e.value,
                    type: TxType.IN,
                    txHash: txInfo.txHash,
                    num: txInfo.num,
                    timestamp: txInfo.timestamp
                })
            }
        } else if (ierc20.encodeEventSignature("Approval") === log.topics[0]) {
            // const e: ApprovalEvent = ierc20.decodeApprovalLog(log.data, log.topics)

            // await this.setBalanceMap(e.owner, balanceMap, key, ierc20);
            // await this.setBalanceMap(e.spender, balanceMap, key, ierc20);
        }
        //WETH Deposit
        else if (key=="WETH") {
            const logRet:any = event.decodeLog(txInfo.num, txInfo.txHash, log.address, log.topics, log.data)
            // console.log("logRet>> ",logRet)
            if(logRet.eventName == EVENT_TYPE.WETH_DEPOSIT){
                balanceRecords.push({
                    address: logRet.event.dst.toLowerCase(),
                    currency: key,
                    amount: new BigNumber(logRet.event.wad).toString(10),
                    type: TxType.IN,
                    txHash: txInfo.txHash,
                    num: txInfo.num,
                    timestamp: txInfo.timestamp
                })
            }else if(logRet.eventName == EVENT_TYPE.WETH_WITHDRAW){
                // balanceRecords.splice()
                for(let i=0;i<balanceRecords.length;i++){
                    const record = balanceRecords[i];
                    if(record.address == logRet.event.src.toLowerCase()){
                        balanceRecords.splice(i,1,{
                            address: logRet.event.src.toLowerCase(),
                            currency: defaultCurrency,
                            amount: new BigNumber(logRet.event.wad).toString(10),
                            type: TxType.IN,
                            txHash: txInfo.txHash,
                            num: txInfo.num,
                            timestamp: txInfo.timestamp
                        })
                        break
                    }
                }
                balanceRecords.push({
                    address: logRet.event.src.toLowerCase(),
                    currency: key,
                    amount: new BigNumber(logRet.event.wad).multipliedBy(-1).toString(10),
                    type: TxType.OUT,
                    txHash: txInfo.txHash,
                    num: txInfo.num,
                    timestamp: txInfo.timestamp
                })
            }
        }
    }

    private async setBalanceMap(address: string, balanceMap: Map<string, Balance>, cy: string, ierc20?: Ierc20) {
        if (!address) {
            return
        }
        let balance;
        if (ierc20) {
            balance = await ierc20.balanceOf(address)
        } else {
            balance = await bsc.getBalance(address)
            cy = defaultCurrency
        }
        balanceMap.set([address, cy].join(":"), {
            address: address.toLowerCase(),
            currency: cy,
            totalIn: balance.toString(10),
            totalOut: "0",
            totalFrozen: "0"
        })
    }
}


export default Index