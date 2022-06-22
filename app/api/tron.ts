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
import {BalanceRecord, TxInfo, TxType} from "../types";
import * as constant from "../common/constant"
import BigNumber from "bignumber.js";
import * as db from '../db'

const TronWeb = require('tronweb')
const TronGrid = require('trongrid');

const HttpProvider = TronWeb.providers.HttpProvider;
const fullNode = new HttpProvider(constant.TRON_API_HOST.fullNode);
const solidityNode = new HttpProvider(constant.TRON_API_HOST.fullNode);
const eventServer = new HttpProvider(constant.TRON_API_HOST.fullNode);
const privateKey = "3481E79956D4BD95F358AC96D151C976392FC4E3FC132F78A847906DE588C145";
const tronWeb = new TronWeb(fullNode,solidityNode,eventServer,privateKey);

const tronGrid = new TronGrid(tronWeb);

class TronApi extends Api{

    getTicket(address: string): Promise<any> {
        throw new Error("Method not implemented.");
    }

    constructor() {
        super(db.tron);
    }

    commitTx = async (tx: any, txInfo: any): Promise<any> => {
        return new Promise((resolve,reject)=>{
            tronWeb.trx.sendRawTransaction(tx).then((receipt:any)=>{
                resolve(receipt)
            }).catch((e:any)=>{
                console.log(tx,e,txInfo,"TRON commitTx Error")
                reject(e)
            })
        })
    }

    genParams = async (txPrams: any): Promise<any> =>{

    }

    getBalance = async (address: string, cy: string): Promise<any>=> {
        const rest:any = await tronWeb.trx.getAccount(address);
        const balance:any = {};
        balance["TRX"] = rest.balance;
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
        return t
    }

    getTxs = async (address: string,currency: string, pageSize: number, pageNo: number,fingerprint?:string): Promise<any> => {
        const txArr:Array<BalanceRecord> = [];
        let meta:any;
        if (currency == "USDT"){
            const rest:any = await tronGrid.account.getTrc20Transactions(address, {
                limit:pageSize,
                fingerprint:fingerprint,
                contract_address:constant.TRC20_ADDRESS.USDT
            })
            pageSize = rest.meta.page_size;
            for(let t of rest.data){
                const balanceRecord:any = {
                    address: address,
                    currency: "TRX",
                    amount: "0x0",
                    type: address == t.from ?TxType.OUT:TxType.IN,
                    txHash: t.transaction_id,
                    num: 0,
                    timestamp:t.block_timestamp/1000,
                }
                balanceRecord.from = t.from;
                balanceRecord.to = t.to;
                if(t.type == "Transfer" || t.type=="TransferFrom"){
                    balanceRecord.amount = address == t.from ? new BigNumber(t.value).multipliedBy(-1).toString(10):t.value
                    balanceRecord.currency = "USDT";
                }
                txArr.push(balanceRecord);
            }
            meta = rest.meta;
        }else{
            const rest:any = await tronGrid.account.getTransactions(address, {
                limit:pageSize,
                fingerprint:fingerprint
            })
            pageSize = rest.meta.page_size;
            /**
             * TransferContract
             ● TransferAssetContract
             ● CreateSmartContract
             ● TriggerSmartContract
             */
            for(let t of rest.data){
                let from = "";
                let to = "";
                let value = "0";
                const c = t.raw_data.contract[0];
                // console.log(c)
                if("TransferContract" == c.type){
                    from = c.parameter.value.owner_address;
                    to = c.parameter.value.to_address;
                    value =  c.parameter.value.amount;
                }else if("TransferAssetContract" == c.type){
                    // from = c.parameter.value.owner_address;
                    // to = c.parameter.value.to_address;
                    // value =  c.parameter.value.amount;
                    //Currency
                    continue
                }else if("CreateSmartContract" == c.type){

                }else if("TriggerSmartContract" == c.type){
                    from = c.parameter.value.owner_address;
                    to = c.parameter.value.contract_address;
                    value = "0x0";
                }
                from = tronWeb.address.fromHex(from);
                to = tronWeb.address.fromHex(to);
                const balanceRecord:any = {
                    address: address,
                    currency: "TRX",
                    amount: address == from ? new BigNumber(value).multipliedBy(-1).toString(10):value,
                    type: address == from ?TxType.OUT:TxType.IN,
                    txHash: t.txID,
                    num: t.blockNumber,
                    timestamp:t.block_timestamp/1000,
                }
                balanceRecord.from = from;
                balanceRecord.to = to;
                txArr.push(balanceRecord);
            }
            meta = rest.meta;
        }
        const ret:any = {
            total:txArr.length,
            data:txArr,
            pageNo:pageNo,
            pageSize:pageSize,
            meta:meta
        }
        return Promise.resolve(ret);
    }

    getBalanceRecords = async (address: string,currency: string, hash:string,pageSize: number, pageNo: number,fingerprint?:string): Promise<any> => {
        return await this.getTxs(address,currency,pageSize,pageNo,fingerprint);
    }

    getChainConfig = async(): Promise<any>=> {
        const config:any = {
            feeLimit:  150000000
        }
        return config;
    }

    getBalanceWithAddress(address: string): Promise<any> {
        return Promise.resolve(undefined);
    }

    tokenAction(action: string, tokenAddress: string): Promise<any> {
        return Promise.resolve(undefined);
    }

}

export default TronApi

export {
    tronWeb,tronGrid
}