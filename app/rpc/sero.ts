import axios from 'axios';
import * as constant from '../common/constant'
import {OutInfo} from '../types/sero'
import {TxInfo} from "../types/";
import * as utils from '../common/utils'
import * as db from '../db'
import BigNumber from "bignumber.js";
import RPC from "./index";
import {TransactionReceipt} from "../types/eth";

class SeroRPC extends RPC {

    constructor() {
        super(constant.SERO_RPC_HOST)
    }

    getTransactionReceipt = async (txHash: string): Promise<TransactionReceipt> => {
        const rest: any = await this.post("sero_getTransactionReceipt", [txHash]);
        return Promise.resolve(rest)
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
        const outInfos: Array<OutInfo> = [];
        let nils: Array<any> = [];
        for (let data of datas) {
            const outs: Array<any> = data.Outs;
            if(data.Nils && data.Nils.length>0){
                nils = nils.concat(data.Nils);
            }
            for (let out of outs) {
                if (out.State.OS.Out_O) {
                    const outInfo: OutInfo = {
                        address: utils.addrToString(out.State.OS.Out_O.Addr),
                        asset: {
                            currency: utils.hexToCy(out.State.OS.Out_O.Asset.Tkn.Currency),
                            value: out.State.OS.Out_O.Asset.Tkn.Value
                        },
                        txHash: out.State.TxHash,
                        num: new BigNumber(out.State.Num).toNumber(),
                        root: out.Root,
                        used: false,
                        utxo: {
                            Root: out.Root,
                            Asset: out.State.OS.Out_O.Asset,
                            State: out.State
                        }
                    };
                    if (utils.isV1(outInfo.address) &&
                        ["0x0000000000000000000000000000000000000000000000000000000000000000",
                            "0x0000000000000000000000000000000000000000000000000000000000000001",
                            "0x0000000000000000000000000000000000000000000000000000000000000002",
                            "0x0000000000000000000000000000000000000000000000000000000000000003"].indexOf(outInfo.txHash) == -1
                    ) {
                        outInfos.push(outInfo);
                    }
                }
            }
        }
        return [outInfos,nils]
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
}


const seroRPC = new SeroRPC();

export default seroRPC