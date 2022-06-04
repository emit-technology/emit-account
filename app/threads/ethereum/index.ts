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
import ethRpc from "../../rpc/eth";
import {AddressTx, Balance, BalanceRecord, ChainType, EVENT_TYPE, EventStruct, TxInfo, TxType} from "../../types";
import * as constant from "../../common/constant";
import * as utils from '../../common/utils'
import {ApprovalEvent, Block, Log, TransactionReceipt,Transaction, TransferEvent} from "../../types/eth";
import BigNumber from "bignumber.js";
import Ierc20 from "../../api/tokens/ierc20";
import event from "../../event";
import {ETH_HOST} from "../../common/constant";
import {ZERO_ADDRESS} from "../../common/utils";

const Web3 = require('web3');

const myPool = require('../../db/mongodb');

const defaultCurrency = "ETH";

class Index {

    ethWeb3: any;

    txInfos: Array<any>

    constructor() {
        const provider = new Web3.providers.HttpProvider(constant.ETH_HOST,{
            timeout: constant.defaultHttpTimeout,
            keepAlive: false
        })
        this.ethWeb3 = new Web3(provider);
        this.txInfos = [];
    }

    syncPendingTransactions = async () => {
        const rests:any = await ethRpc.getFilterChangesPending();
        const c:any = this.txInfos.concat(rests);
        this.txInfos = c;
        console.info(`ethereum syncPendingTransactions,len[${this.txInfos.length}]`)
        return Promise.resolve();
    }

    dealPending = async ()=>{
        if(this.txInfos && this.txInfos.length>0){
            const tx:any = this.txInfos.pop();
            await db.eth.insertTxInfo(tx.hash,tx)
        }
        return Promise.resolve();
    }

    removeUnPendingTxTimeout = async () => {
        await db.eth.removeUnPendingTxTimeout();
    }

    syncTransactions = async (startNum:number, maxNum:number) => {
        const client: any = await myPool.acquire();
        const session = client.startSession();
        let limit = 1;
        try {
            let dbNum: any = await db.eth.latestBlock();
            const remoteNum = await ethRpc.blockNumber()
            const chainNum = remoteNum - constant.THREAD_CONFIG.CONFIRM_BLOCK_NUM;
            console.info(`ETH Thread>>> remote=[${remoteNum}], start=[${chainNum}], db=[${dbNum}]`);
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
            limit = chainNum - dbNum + 1;
            if (limit > maxNum) {
                limit = maxNum;
            }
            const start =  dbNum + 1;
            const end = dbNum + limit;
            console.info(`ETH Thread>>> limit=[${limit}], start=[${start}], end=[${end}]`);
            const addressTxs: Array<AddressTx> = [];
            // const txInfos: Array<TxInfo> = [];
            const txInfoMap: Map<string,number> = new Map<string, number>();
            const txInfos:Array<TxInfo> = [];
            const balanceRecords: Array<BalanceRecord> = [];
            // const transactionReceipts: Array<TransactionReceipt> = [];
            const balanceMap: Map<string, Balance> = new Map<string, Balance>()
            const removeTxHashArray: Array<string> = [];
            const events: Array<EventStruct> = [];
            for (let i = start; i <= end; i++) {
                const block: Block = await ethRpc.getBlockByNum(i);
                if(!block){
                    continue
                }
                const transactions: Array<Transaction> = block.transactions;
                for (let t of transactions) {
                    const txInfo = this.genTxInfo(t, block);
                    txInfos.push(txInfo);
                    txInfoMap.set(txInfo.txHash,txInfos.length-1)
                    removeTxHashArray.push(t.hash);
                    if(new BigNumber(t.value).toNumber()>0 || utils.isContractAddress(t.to,ChainType.ETH) ) {

                        this.addTxAddress(t, addressTxs);
                        this.setBalanceRecords(t, balanceRecords, txInfo);
                        if (balanceRecords.length == 0) {
                            this.setBalanceRecordDefault(t, balanceRecords, txInfo);
                        }
                    }
                }
            }

            const logs:Array<Log> = await ethRpc.getLogs(start,end)
            if (logs && logs.length > 0) {
                for (let log of logs) {
                    const index:any = txInfoMap.get(log.transactionHash)
                    const txInfo = txInfos[index];
                    const token = utils.isErc20Address(log.address,ChainType.ETH);
                    if (!token) {
                    } else {
                        await this.handelErc20Event(log, balanceMap, token, addressTxs, balanceRecords, txInfo);
                    }

                    if(utils.isErc721Address(log.address,ChainType.ETH)){
                        this.handleERC721Event(log, addressTxs, txInfo, balanceRecords);
                    }

                    if (utils.isCrossAddress(log.address,ChainType.ETH)  || utils.isCrossNftAddress(log.address,ChainType.ETH)) {
                        const logRet = event.decodeLog(txInfo.num, txInfo.txHash, log.address, log.topics, log.data)
                        if (logRet) {
                            events.push(logRet)
                        }
                    }
                    if(token || utils.isContractAddress(log.address,ChainType.ETH)){
                        if(txInfo.num>0){
                            await db.eth.removeUnPendingTxByHash(txInfo.fromAddress,txInfo.nonce)
                        }
                    }
                }
            }

            console.log(`Address txs=[${addressTxs.length}], tx infos=[${txInfoMap.size}]  balance records=[${balanceRecords.length}]`)
            if (addressTxs.length == 0 || txInfoMap.size == 0 || balanceRecords.length == 0) {
                const updateNum = limit + dbNum > chainNum ? chainNum : limit + dbNum;
                const t = await ethRpc.getBlockByNum(updateNum);
                if (t) {
                    await db.eth.upsertLatestBlock(updateNum, utils.toNum(t.timestamp), session, client);
                }
                return
            }

            //==== insert mongo
            const transactionResults = await session.withTransaction(async () => {
                await db.eth.removePendingTxByHash(removeTxHashArray, session, client);
                await db.eth.insertAddressTx(addressTxs, session, client)
                await db.eth.insertTxInfos(txInfos, session, client)
                await db.eth.insertBalanceRecord(balanceRecords, session, client)
                if (events && events.length > 0) {
                    await db.eth.insertEvents(events, session, client)
                }
                // const blEntries = balanceMap.entries();
                // let blNext = blEntries.next();
                // while (!blNext.done) {
                //     await db.eth.updateBalance(blNext.value[1], session, client)
                //     blNext = blEntries.next();
                // }
                const updateNum = txInfos[txInfos.length-1];;
                // const t = await ethRpc.getBlockByNum(updateNum);
                if (updateNum) {
                    let timestamp:any = updateNum.timestamp;
                    if(!timestamp){
                        const t:any = await ethRpc.getBlockByNum(updateNum.num);
                        timestamp = t.timestamp;
                    }
                    await db.eth.upsertLatestBlock(updateNum.num, timestamp, session, client);
                }
            }, constant.mongo.eth.transactionOptions);

            if (transactionResults) {
                console.log("ETH>>> The reservation was successfully created.");
            } else {
                console.log("ETH>>> The transaction was intentionally aborted.");
            }
        } catch (e) {
            console.error("ETH>>> The transaction was aborted due to an unexpected error: ", e);
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
            currency: key,
            tokenAddress: ZERO_ADDRESS
        })
        txEvent.to && addressTxs.push({
            address: txEvent.to.toLowerCase(),
            txHash: txInfo.txHash,
            num: txInfo.num,
            currency: key,

            tokenAddress: ZERO_ADDRESS
        })
        if (txEvent.from) {
            balanceRecords.push({
                address: txEvent.from.toLowerCase(),
                currency: key,
                amount: "0",
                type: TxType.OUT,
                txHash: txInfo.txHash,
                num: txInfo.num,
                timestamp: txInfo.timestamp,

                tokenAddress: ZERO_ADDRESS
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
                timestamp: txInfo.timestamp,

                tokenAddress: ZERO_ADDRESS
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
            currency: defaultCurrency,

            tokenAddress: ZERO_ADDRESS
        })
        t.to && addressTxs.push({
            address: t.to.toLowerCase(),
            txHash: t.hash,
            num: utils.toNum(t.blockNumber),
            currency: defaultCurrency,

            tokenAddress: ZERO_ADDRESS
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
                timestamp: txInfo.timestamp,

                tokenAddress: ZERO_ADDRESS
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
                timestamp: txInfo.timestamp,

                tokenAddress: ZERO_ADDRESS
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
                timestamp: txInfo.timestamp,

                tokenAddress: ZERO_ADDRESS
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
                timestamp: txInfo.timestamp,

                tokenAddress: ZERO_ADDRESS
            })
        }
    }

    private async handelErc20Event(log: Log, balanceMap: Map<string, Balance>, key: string, addressTxs: Array<AddressTx>, balanceRecords: Array<BalanceRecord>, txInfo: TxInfo) {
        const ierc20: Ierc20 = new Ierc20(log.address,ETH_HOST);
        // await this.setBalanceMap(txInfo.fromAddress, balanceMap, key, ierc20);

        if (ierc20.encodeEventSignature("Transfer") === log.topics[0]) {
            const e: TransferEvent = ierc20.decodeTransferLog(log.data, log.topics)
            e.from && addressTxs.push({
                address: e.from.toLowerCase(),
                txHash: txInfo.txHash,
                num: txInfo.num,
                currency: key,

                tokenAddress: log.address
            })
            e.to && addressTxs.push({
                address: e.to.toLowerCase(),
                txHash: txInfo.txHash,
                num: txInfo.num,
                currency: key,
                tokenAddress: log.address
            })
            //
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
                    timestamp: txInfo.timestamp,
                    tokenAddress: log.address
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
                    timestamp: txInfo.timestamp,
                    tokenAddress: log.address
                })
            }
        } else if (ierc20.encodeEventSignature("Approval") === log.topics[0]) {
            // const e: ApprovalEvent = ierc20.decodeApprovalLog(log.data, log.topics)
            //
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
                    timestamp: txInfo.timestamp,
                    tokenAddress: log.address
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
                            timestamp: txInfo.timestamp,
                            tokenAddress: ZERO_ADDRESS
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
                    timestamp: txInfo.timestamp,
                    tokenAddress: log.address
                })
            }
        }
    }
}


export default Index