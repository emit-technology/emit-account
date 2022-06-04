import axios from 'axios';
import * as constant from '../common/constant'
import {OutInfo} from '../types/sero'
import {Asset, Transaction, TxInfo} from "../types/";
import * as utils from '../common/utils'
import * as db from '../db'
import BigNumber from "bignumber.js";
import RPC from "./index";
import {TransactionReceipt} from "../types/eth";
import {ChainType} from "../types/";
import Cache from "../cache";

class SeroRPC extends RPC {

    protected pendingFilterId:any = "";

    constructor() {
        super(constant.SERO_RPC_HOST)
    }

    getTransactionReceipt = async (txHash: string): Promise<TransactionReceipt> => {
        const rest: any = await this.post("sero_getTransactionReceipt", [txHash]);
        return rest
    }

    getBlockTimestamp = async (num: number): Promise<number> => {
        const block: any = await this.post("sero_getBlockByNumber", ["0x" + new BigNumber(num).toString(16), false])
        return new BigNumber(block.timestamp).toNumber()
    }

    getBlocksInfo = async (fromBlock: number, limit: number): Promise<Array<any>> => {
        const datas: any = await this.post("flight_getBlocksInfo", [fromBlock, limit])
        if (!datas || datas.length == 0) {
            return []
        }
        let outInfos: Array<OutInfo> = [];
        let nils: Array<any> = [];
        for (let data of datas) {
            const outs: Array<any> = data.Outs;
            if(data.Nils && data.Nils.length>0){
                nils = nils.concat(data.Nils);
            }
            const rest = this.convertOuts(outs);
            outInfos = outInfos.concat(rest)
        }
        return [outInfos,nils]
    }


    private convertOuts(outs: Array<any>):Array<OutInfo> {
        const outInfos: Array<OutInfo> = [];
        for (let out of outs) {
            if (out.State.OS.Out_O && out.State.OS.Out_O.Asset) {
                const asset = out.State.OS.Out_O.Asset;
                const outInfo: OutInfo = {
                    address: utils.addrToString(out.State.OS.Out_O.Addr),
                    asset: {
                        currency: asset.Tkn?utils.hexToCy(asset.Tkn.Currency):"SERO",
                        value: asset.Tkn?asset.Tkn.Value:"0"
                    },
                    txHash: out.State.TxHash,
                    num: new BigNumber(out.State.Num).toNumber(),
                    root: out.Root,
                    used: false,
                    utxo: {
                        Root: out.Root,
                        Asset: asset,
                        State: out.State
                    }
                };
                if(asset.Tkt){
                    outInfo.ticket = asset.Tkt
                }

                if (utils.isV1(outInfo.address) &&
                    ["0x0000000000000000000000000000000000000000000000000000000000000000",
                        "0x0000000000000000000000000000000000000000000000000000000000000001",
                        "0x0000000000000000000000000000000000000000000000000000000000000002",
                        "0x0000000000000000000000000000000000000000000000000000000000000003"].indexOf(outInfo.txHash) == -1
                ) {
                    outInfos.push(outInfo);
                }
            }
            if (out.State.OS.Out_P && out.State.OS.Out_P.Asset) {
                const asset = out.State.OS.Out_P.Asset;
                const outInfo: OutInfo = {
                    address: utils.addrToString(out.State.OS.Out_P.PKr),
                    asset: {
                        currency: asset.Tkn?utils.hexToCy(asset.Tkn.Currency):"SERO",
                        value: asset.Tkn?asset.Tkn.Value:"0"
                    },
                    txHash: out.State.TxHash,
                    num: new BigNumber(out.State.Num).toNumber(),
                    root: out.Root,
                    used: false,
                    utxo: {
                        Root: out.Root,
                        Asset: asset,
                        State: out.State
                    }
                };
                if(asset.Tkt){
                    outInfo.ticket = asset.Tkt
                }
                if (["0x0000000000000000000000000000000000000000000000000000000000000000",
                        "0x0000000000000000000000000000000000000000000000000000000000000001",
                        "0x0000000000000000000000000000000000000000000000000000000000000002",
                        "0x0000000000000000000000000000000000000000000000000000000000000003"].indexOf(outInfo.txHash) == -1
                ) {
                    outInfos.push(outInfo);
                }
            }
        }
        return outInfos;
    }

    getTxInfo = async (txHash: string, outs: Array<OutInfo>, selfOuts:Map<string,OutInfo>): Promise<TxInfo | null> => {
        const rest: any = await this.post("sero_getTransactionByHash", [txHash])
        if (!rest) {
            return null
        }
        const Ins: Array<any> = rest.stx.Tx1.Ins_P&&rest.stx.Tx1.Ins_P.length>0 ? rest.stx.Tx1.Ins_P : rest.stx.Tx1.Ins_P0;
        const insRootArr: Array<string> = [];
        const outsRootArr: Array<string> = [];
        const feeCy: string = utils.hexToCy(rest.stx.Fee.Currency);
        const tos: Array<string> = [];
        for (let In of Ins) {
            insRootArr.push(In.Root);
        }
        for (let In of insRootArr) {
            let o:any = selfOuts.get(In);
            if(!o){
                const dbOuts: Array<OutInfo> = await db.sero.findOutsByRoots([In]);
                if(dbOuts && dbOuts.length>0){
                    o = dbOuts[0]
                }
            }
            if(!o){
                // console.error(`Con not find root:${In}`)
                continue;
                // throw new Error(`Con not find root:${In}`);
            }
        }
        for (let o of outs) {
            if (tos.indexOf(o.address) == -1) {
                tos.push(o.address)
            }
            outsRootArr.push(o.root)
        }

        const txInfo: TxInfo = {
            fromAddress: rest.from,
            toAddress: tos,
            gas: rest.gas,
            gasUsed:rest.gas,
            gasPrice: rest.gasPrice,
            fee: rest.stx.Fee.Value,     //gas * gasPrice
            feeCy: feeCy,
            txHash: txHash,
            num: new BigNumber(rest.blockNumber).toNumber(),
            outs: outsRootArr,
            ins: insRootArr,
            // insAssets: insAssets,
            // outsAssets: outsAssets,
            transactionIndex: rest.transactionIndex,
            contract: rest.stx.Desc_Cmd.Contract,
            timestamp: 0,
            contractAddress: rest.stx.Desc_Cmd.Contract&&rest.stx.Desc_Cmd.Contract.To ? utils.addrToString(rest.stx.Desc_Cmd.Contract.To) : ""
        }
        return txInfo;
    }

    blockNumber = async (): Promise<number> => {
        const rest: any = await this.post("sero_blockNumber", ["latest"])
        return new BigNumber(rest).toNumber();
    }

    getOut = async (root:string) =>{
        const rest: any = await this.post("flight_getOut", [root])
        return rest;
    }

    getFilterChangesPending = async ():Promise<Array<Transaction>> =>{
        if(!this.pendingFilterId){
            this.pendingFilterId = await this.post("sero_newPendingTransactionFilter", []);
        }
        // console.log("pendingFilterId",this.pendingFilterId)
        const data:any = await this.filterChanges();
        // console.log("filterChanges data: ",data)
        const txArray:Array<Transaction> = [];
        if(data && data.length > 0){
            for(let hash of data){
                const tx:any = await this.post("sero_getTransactionByHash",[hash]);
                const Ins_P0: any = tx.stx.Tx1.Ins_P0;
                const inOutMap:Map<string,Asset> = new Map<string, Asset>()
                if(Ins_P0 && Ins_P0.length>0){
                    for (let InOut of Ins_P0) {
                        // const out:any = await this.getOut(InOut.Root)
                        const dbOuts: Array<OutInfo> = await db.sero.findOutsByRoots([InOut.Root]);
                        if(!dbOuts || dbOuts.length == 0){
                            break;
                        }
                        const out = dbOuts[0];
                        const cy = out.asset.currency;
                        const tmpAsset:Asset = {
                            currency: cy,
                            value: new BigNumber(out.asset.value).multipliedBy(-1).toString(10)
                        };
                        const key = [tx.from,cy].join(":");
                        if(inOutMap.has(key)){
                            const asset:any = inOutMap.get(key);
                            tmpAsset.value = new BigNumber(tmpAsset.value).plus(new BigNumber(asset.value)).toString(10)
                            inOutMap.set(key,asset)
                        }else{
                            inOutMap.set(key,tmpAsset)
                        }
                    }
                }
                const outMap:Map<string,Asset> = new Map<string, Asset>()
                const Outs_P: any = tx.stx.Tx1.Outs_P;
                if(!Outs_P){
                    continue;
                }
                let toAddr:string = "";
                for(let out of Outs_P){
                    let cy = "SERO"
                    let value = "0x0";
                    if(out.Asset.Tkn){
                        cy = utils.hexToCy(out.Asset.Tkn.Currency);
                        value = out.Asset.Tkn.Value;
                    }
                    const to = utils.addrToString(out.PKr);
                    if(to != tx.from){
                        toAddr = to;
                    }
                    const key = [to,cy].join(":");
                    const tmpAsset:Asset = {
                        currency:cy,
                        value:value
                    };
                    if(outMap.has(key)){
                        const asset:any = outMap.get(key);
                        tmpAsset.value = new BigNumber(tmpAsset.value).plus(new BigNumber(asset.value)).toString(10)
                        outMap.set(key,asset)
                    }else{
                        outMap.set(key,tmpAsset)
                    }
                }
                const inEntries = inOutMap.entries();
                let next = inEntries.next();
                const deleteKeys:Array<string> = [];
                while (!next.done){
                    const key:any = next.value[0]
                    const asset:any = next.value[1]
                    if(outMap.has(key)){
                        const tmp:any = outMap.get(key);
                        tmp.value = new BigNumber(tmp.value).plus(new BigNumber(asset.value)).toString(10)
                        outMap.set(key,tmp)
                        deleteKeys.push(key)
                    }
                    next = inEntries.next();
                }
                for(let k of deleteKeys){
                    inOutMap.delete(k);
                }

                if(inOutMap.size>0){
                    const inEntries = inOutMap.entries();
                    let next = inEntries.next();
                    while (!next.done){
                        outMap.set(next.value[0],next.value[1])
                        next = inEntries.next();
                    }
                }
                let currency = "SERO";
                if(outMap.size>0){
                    const entries = outMap.entries();
                    let next = entries.next();
                    while (!next.done){
                        const key = next.value[0];
                        // const value = next.value[1];
                        const cy = key.split(":")[1];
                        if(cy !== "SERO"){
                            currency = cy;
                            break
                        }
                        next = entries.next();
                    }
                }
                let value = "0"
                if(outMap.size>0){
                    const entries = outMap.entries();
                    let next = entries.next();
                    while (!next.done){
                        const key = next.value[0];
                        const asset = next.value[1];
                        const cy = key.split(":")[1];
                        const addr = key.split(":")[0];
                        if(cy == currency && addr == toAddr){
                            value = asset.value;
                            break;
                        }
                        next = entries.next();
                    }
                }

                if (toAddr && utils.isV1(toAddr) || utils.isV1(tx.from)){
                    txArray.push({
                        hash:tx.hash,
                        from: tx.from,
                        to: toAddr,
                        cy: currency,
                        value:value,
                        data: tx.input,
                        gas: tx.gas,
                        gasPrice: tx.gasPrice,
                        chain: ChainType.SERO,
                        nonce: tx.nonce,
                        amount:"0x0",
                        feeCy: utils.hexToCy(tx.stx.Fee.Currency),
                        feeValue:`0x${new BigNumber(tx.stx.Fee.Value).toString(16)}`
                    })
                }
            }
        }
        return txArray
    }

    //Array<string>
    protected filterChanges = async ():Promise<any> =>{
        return new Promise((resolve,reject)=>{
            this.post("sero_getFilterChanges", [this.pendingFilterId]).then((rest:any)=>{
                resolve(rest)
            }).catch(e=>{
                this.pendingFilterId="";
                reject(e)
            })
        })
    }
}


const seroRPC = new SeroRPC();

export default seroRPC