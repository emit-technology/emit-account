import {Api} from "./index";
import BigNumber from "bignumber.js";
// @ts-ignore
import BN from "bn.js";
import {OutInfo, TxPrams} from "../types/sero";
import {genTxParam} from "jsuperzk/src/tx/tx";
import {PreTxParam, utxo} from "jsuperzk/src/tx/prepare";
import {Token, Witness, ZPkg} from "jsuperzk/src/types/types";
import utils from "jsuperzk/src/utils/utils";
import seroRPC from "../rpc/sero";
import * as db from '../db'
import {Balance, BalanceRecord, TxInfo, TxType} from "../types";
import * as constant from "../common/constant";

const myPool = require('../db/mongodb');

class SeroApi extends Api {

    constructor() {
        super(db.sero);
    }

    proxyPost = async (method:string,params: any): Promise<any> => {
        return await seroRPC.post(method,params)
    }

    getBalance = async (address: string,cy:string): Promise<any> => {
        const balances: Array<Balance> = await this.db.queryBalance(address,cy)
        const assets: any = {};
        for (let b of balances) {
            assets[b.currency] = new BigNumber(b.totalIn).minus(b.totalOut).minus(b.totalFrozen).toString(10)
        }
        return Promise.resolve(assets);
    }

    commitTx = async (signTx: any,t:any): Promise<any> => {
        const resp = await seroRPC.post('sero_commitTx', [signTx])
        // await this.insertTxInfo(signTx.Hash,t);
        return Promise.resolve(resp);
    }

    genParams = async (txPrams: TxPrams): Promise<any> => {
        const preTxParam = await this.genPreParams(txPrams);
        let rest: any = await genTxParam(preTxParam, new TxGenerator(), new TxState());
        // rest.Gas=txPrams.gas?txPrams.gas:"25000";
        return Promise.resolve(rest);
    }

    genPreParams = async (txPrams: TxPrams): Promise<PreTxParam> => {
        return new Promise((resolve, reject) => {
            try {
                let {from, to, value, cy, data, gas, gasPrice} = txPrams;
                if(!gas) {
                    gas = "25000";
                }
                const tkn = {
                    Currency: utils.cyToHex(cy),
                    Value: new BigNumber(value).toString(10)
                }
                const fee = {
                    Currency: utils.cyToHex("SERO"),
                    Value: new BigNumber(gasPrice, 16).multipliedBy(new BigNumber(gas, 16)).toString(10)
                }
                if(txPrams.feeCy){
                    fee.Currency = utils.cyToHex(txPrams.feeCy);
                }
                if(txPrams.feeValue){
                    fee.Value = txPrams.feeValue;
                }

                const asset = {
                    Tkn: tkn,
                }
                const reception = {
                    Addr: to,
                    Asset: asset
                }
                const preTxParam: PreTxParam = {
                    From: from,
                    RefundTo: from,
                    Fee: fee,
                    GasPrice: utils.toBN(gasPrice).toString(10),
                    Cmds: null,
                    Receptions: [reception],
                }
                // contract
                if (data) {
                    preTxParam.Receptions = []
                    preTxParam.RefundTo = from
                    preTxParam.Cmds = {
                        Contract: {
                            Data: data,
                            Asset: asset,
                        }
                    }
                    if (to) {
                        // @ts-ignore
                        preTxParam.Cmds.Contract.To = utils.bs58ToHex(to) + "0000000000000000000000000000000000000000000000000000000000000000";
                    }
                }
                resolve(preTxParam)
            } catch (e) {
                console.error(e);
                reject(e)
            }
        })
    }
}


class TxGenerator {

    async findRoots(pkr: string, currency: string, remain: BN): Promise<{ utxos: Array<utxo>; remain: BN }> {
        const outs: Array<OutInfo> = await db.sero.findUnusedOutsByAddress(pkr, currency);
        return new Promise<{ utxos: Array<utxo>, remain: BN }>(resolve => {
            const utxos = new Array<utxo>();
            for (let out of outs) {
                if (out.asset && out.asset.currency) {
                    if (remain.isNeg() || remain.isZero()) {
                        break;
                    }
                    utxos.push(out.utxo)
                    remain = remain.sub(utils.toBN(out.asset.value));
                }
            }
            resolve({utxos, remain})
        })
    }

    async findRootsByTicket(address: string, tickets: Map<string, string>): Promise<{ utxos: Array<utxo>; remain: Map<string, string> }> {
        return {utxos: [], remain: new Map<string, string>()}
    }

    async getRoot(root: string): Promise<any> {
        const outs: Array<OutInfo> = await db.sero.findOutsByRoots([root]);
        if (outs && outs.length > 0) {
            return outs[0].utxo
        }
        return
    }

    defaultRefundTo(address: string): string {
        return ''
    }

}


class TxState {
    async getAnchor(roots: Array<string>): Promise<Array<Witness> | null> {
        return new Promise<Array<Witness> | null>(resolve => {
            seroRPC.post('sero_getAnchor', [roots]).then((resp:any)=>{
                resolve(resp)
            }).catch((e:any)=>{
                console.log("getAnchor",e);
                resolve(null)
            })
        })
    }

    getPkgById(id: string): Promise<ZPkg | null> {
        return Promise.resolve(null)
    }

    getSeroGasLimit(to: string, tfee: Token, gasPrice: BN): number {
        return utils.toBN(tfee.Value).div(gasPrice).toNumber();
    }
}

export default SeroApi