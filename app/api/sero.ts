import {Api} from "./index";
import BigNumber from "bignumber.js";
// @ts-ignore
import BN from "bn.js";
import {OutInfo, TxPrams} from "../types/sero";
import {genTxParam} from "jsuperzk/dist/tx/tx";
import {PreTxParam, utxo} from "jsuperzk/src/tx/prepare";
import {Token, Witness, ZPkg} from "jsuperzk/dist/types/types";
import utils from "jsuperzk/src/utils/utils";
import seroRPC from "../rpc/sero";
import * as db from '../db'
import {Balance} from "../types";

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
        if(t && t.gasPrice && t.gas){
            this.multiGasPrice(t);
        }
        // await this.insertTxInfo(signTx.Hash,t);
        const rootArr:Array<string> = [];
        const ins = signTx.Tx && signTx.Tx.Tx1 && signTx.Tx.Tx1.Ins_P0;
        if(ins){
            for(let o of ins){
                rootArr.push(o.Root)
            }
            console.log(`commitTx,locked:[${JSON.stringify(rootArr)}]`)
            if(rootArr && rootArr.length>0){
                await this.db.updateOutLocked(rootArr)
            }
        }
        return Promise.resolve(resp);
    }

    multiGasPrice = (txPrams: TxPrams)=>{
        const times = 1;
        const seroFeeValue =  new BigNumber(txPrams.gas).multipliedBy(txPrams.gasPrice)
        txPrams.gasPrice = "0x"+ new BigNumber(txPrams.gasPrice).plus(times).toString(16);
        const feeValue = new BigNumber(txPrams.gas).multipliedBy(txPrams.gasPrice);
        txPrams.feeValue = new BigNumber(txPrams.feeValue?txPrams.feeValue:seroFeeValue).multipliedBy(feeValue).dividedBy(seroFeeValue).toFixed(0)
    }

    genParams = async (txPrams: TxPrams): Promise<any> => {

        this.multiGasPrice(txPrams);

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

                const asset:any = {
                    Tkn: tkn,
                }


                // const tktReceptions = []

                if(txPrams.tickets && txPrams.tickets.length>0){
                    const tktArray = txPrams.tickets;
                    for(let d of tktArray){
                        const tkt:any = {
                            Category:utils.cyToHex(d.Category),
                            Value:d.Value
                        }
                        asset.Tkt = tkt
                        // tktReceptions.push({
                        //     Addr: to,
                        //     Asset: assetTkt
                        // })
                    }
                }
                const reception = {
                    Addr: to,
                    Asset: asset
                }
                const receptions = [reception]
                // const receptions = tknReceptions.concat(tktReceptions)

                const preTxParam: PreTxParam = {
                    From: from,
                    RefundTo: from,
                    Fee: fee,
                    GasPrice: utils.toBN(gasPrice).toString(10),
                    Cmds: null,
                    Receptions: receptions,
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

    getTicket = async (address: string): Promise<any>=> {
        const rest:Array<OutInfo> = await db.sero.findTickets(address)
        const ret:any = {};
        for (let out of rest){
            if(out.ticket){
                const key = utils.hexToCy(out.ticket.Category)
                if(ret[key]){
                    const arr = ret[key];
                    arr.push(out.ticket.Value);
                    ret[key] = arr;
                }else{
                    ret[key] = [out.ticket.Value];
                }
            }
        }
        return Promise.resolve(ret);
    }

    getChainConfig(): Promise<any> {
        return Promise.resolve(undefined);
    }

    getBalanceWithAddress(address: string): Promise<any> {
        return Promise.resolve(undefined);
    }

    tokenAction(action: string, tokenAddress: string): Promise<any> {
        return Promise.resolve(undefined);
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
        const utxos:Array<utxo> = new Array<utxo>();
        if(tickets && tickets.size>0){
            let entries = tickets.entries();
            let res = entries.next();
            while (!res.done) {
                let value = res.value[0]
                const rests:Array<OutInfo> = await db.sero.findTickets(address,[value])
                if(rests && rests.length>0){
                    const out = rests[0];
                    utxos.push(out.utxo)
                }
                res = entries.next()
            }
        }
        return {utxos: utxos, remain: new Map<string, string>()}
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