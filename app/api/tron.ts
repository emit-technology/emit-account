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
import {Api} from "./index";
import {Balance, BalanceRecord, EventStruct, TxInfo, TxsView, TxType} from "../types";
import * as constant from "../common/constant"
import BigNumber from "bignumber.js";
import * as db from '../db'

const TronWeb = require('tronweb')
const TronGrid = require('trongrid');

const HttpProvider = TronWeb.providers.HttpProvider;
const fullNode = new HttpProvider(constant.TRON_API_HOST.fullNode);
const solidityNode = new HttpProvider(constant.TRON_API_HOST.fullNode);
const eventServer = new HttpProvider(constant.TRON_API_HOST.fullNode);
const  privateKey = "3481E79956D4BD95F358AC96D151C976392FC4E3FC132F78A847906DE588C145";
const tronWeb = new TronWeb(fullNode,solidityNode,eventServer,privateKey);

const tronGrid = new TronGrid(tronWeb);

class TronApi extends Api{

    constructor() {
        super(db.eth);
    }

    commitTx(tx: any, txInfo: any): Promise<any> {
        return Promise.resolve(undefined);
    }

    genParams(txPrams: any): Promise<any> {
        return Promise.resolve(undefined);
    }

    getBalance = async (address: string, cy: string): Promise<any>=> {
        const rest:any = await tronWeb.trx.getAccount(address);
        const balance:any = {};
        balance["TRON"] = rest.balance;
        let instance = await tronWeb.contract().at(constant.TRC20_ADDRESS.USDT);
        let balanceUSDT = await instance.balanceOf(address).call();
        balance["USDT"] = new BigNumber(balanceUSDT._hex).toString(10);
        return Promise.resolve(balance);
    }

    proxyPost(method: string, params: any): Promise<any> {
        return Promise.resolve(undefined);
    }

    getTxInfo = async (txHash: string): Promise<TxInfo> => {
        const t:any = await tronWeb.trx.getTransactionInfo(txHash)
        const tx:TxInfo={
            txHash: t.transaction_id,
            fromAddress: t.from,
            toAddress: [t.to],
            gas: "0x0",
            gasUsed: "0x0",
            gasPrice: "0x0",
            feeCy: "TRX",
            fee: "0x0",
            num: 0,
            outs:[],
            ins:[],
            transactionIndex: "0x0",
            timestamp: t.block_timestamp,
        }
        return Promise.resolve(tx);
    }

    getTxs = async (address: string,currency: string, pageSize: number, pageNo: number,fingerprint?:string): Promise<TxsView> => {
        const txArr:Array<BalanceRecord> = [];
        if (currency == "USDT"){
            const rest:any = await tronGrid.account.getTrc20Transactions(address, {
                limit:pageSize,
                fingerprint:fingerprint,
                contract_address:constant.TRC20_ADDRESS.USDT
            })
            console.log("USDT>>",rest)
            for(let t of rest){
                // const tx:BalanceRecord={
                //     txHash: t.transaction_id,
                //     fromAddress: t.from,
                //     toAddress: [t.to],
                //     gas: "0x0",
                //     gasUsed: "0x0",
                //     gasPrice: "0x0",
                //     feeCy: "TRX",
                //     fee: "0x0",
                //     num: 0,
                //     outs:[],
                //     ins:[],
                //     transactionIndex: "0x0",
                //     timestamp: t.block_timestamp,
                // }

                const balanceRecord = {
                    address: t.from,
                    currency: "USDT",
                    amount: address == t.from ? new BigNumber(t.value).multipliedBy(-1).toString(10):t.value,
                    type: address == t.from ?TxType.OUT:TxType.IN,
                    txHash: t.transaction_id,
                    num: 0,
                    timestamp:t.block_timestamp,
                }

                txArr.push(balanceRecord);
            }
        }else{
            const rest:any = await tronGrid.account.getTransactions(address, {
                limit:pageSize,
                fingerprint:fingerprint
            })
            console.log("TRON>>",rest)
            /**
             * TransferContract
             ● TransferAssetContract
             ● CreateSmartContract
             ● TriggerSmartContract
             */
            for(let t of rest){
                let from = "";
                let to = "";
                let value = "";
                const c = t.raw_data.contract;
                if("TransferContract" == c.type){
                    from = c.parameter.value.owner_address;
                    to = c.parameter.value.to_address;
                    value =  c.parameter.value.amount;
                }else if("TransferAssetContract" == c.type){
                    from = c.parameter.value.owner_address;
                    to = c.parameter.value.to_address;
                    value =  c.parameter.value.amount;
                    //Currency
                }else if("CreateSmartContract" == c.type){

                }else if("TriggerSmartContract" == c.type){
                    from = c.parameter.value.owner_address;
                    to = c.parameter.value.contract_address;
                    value = "0x0";
                }
                // const tx:TxInfo={
                //     txHash: t.txID,
                //     fromAddress: from,
                //     toAddress: [to],
                //     gas: "0x0",
                //     gasUsed: "0x0",
                //     gasPrice: "0x0",
                //     feeCy: "TRX",
                //     fee: "0x0",
                //     num: t.blockNumber,
                //     outs:[],
                //     ins:[],
                //     transactionIndex: "0x0",
                //     timestamp: t.block_timestamp,
                // }
                const balanceRecord = {
                    address: address,
                    currency: "TRX",
                    amount: address == from ? new BigNumber(t.value).multipliedBy(-1).toString(10):t.value,
                    type: address == from ?TxType.OUT:TxType.IN,
                    txHash: t.txID,
                    num: t.blockNumber,
                    timestamp:t.block_timestamp,
                }
                txArr.push(balanceRecord);
            }
        }
        const ret:any = {
            txs:txArr,
            pageNo:pageNo,
            pageSize:pageSize
        }
        return Promise.resolve(ret);
    }

    countPendingTx = async (address:string,currency:string)=>{
        const rest:any = await this.db.countPendingTx(address,currency);
        return Promise.resolve(rest);
    }

    getBalanceRecords = async (address: string,currency: string, hash:string,pageSize: number, pageNo: number): Promise<any> => {
        return await this.getTxs(address,currency,pageSize,pageNo);
    }

    getEvents = async (txHash: string,depositNonce: string): Promise<Array<EventStruct>> => {
        const retn: Array<EventStruct> = await this.db.queryEvents(txHash,depositNonce)
        return Promise.resolve(retn);
    }

    getAppVersion = async (tag:string,versionNum:number):Promise<any>=>{
        return await this.db.getAppVersion(tag,versionNum)
    }

}

export default TronApi