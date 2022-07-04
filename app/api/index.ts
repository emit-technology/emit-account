import {TxPrams} from "../types/sero";
import {Balance, BalanceRecord, ChainType, EventStruct, Token, TxInfo, TxsView} from "../types";
import Ierc20 from "./tokens/ierc20";
import {BSC_HOST, ETH_HOST} from "../common/constant";

export abstract class Api {

    protected db: any

    protected constructor(db: any) {
        this.db = db;
    }

    abstract genParams(txPrams: TxPrams): Promise<any>;

    abstract commitTx(tx: any,txInfo:any): Promise<any>;

    abstract proxyPost(method:string,params:any):Promise<any>;

    abstract getBalance(address: string,cy:string): Promise<any>;

    abstract getBalanceWithAddress(address: string): Promise<any>;

    abstract getTicket(address: string): Promise<any>;

    abstract getChainConfig(): Promise<any>;

    abstract tokenAction(action:string,tokenAddress:string): Promise<any>;

    getTxInfo = async (txHash: string): Promise<TxInfo> => {
        const txInfo: TxInfo = await this.db.queryTxByHash(txHash);
        return Promise.resolve(txInfo);
    }

    getTxs = async (address: string,currency: string, pageSize: number, pageNo: number,tokenAddress?:string): Promise<TxsView> => {
        const retn: TxsView = await this.db.queryTxByAddress(address,currency, pageSize, pageNo,tokenAddress)
        return Promise.resolve(retn);
    }

    countPendingTx = async (address:string,currency:string)=>{
        const rest:any = await this.db.countPendingTx(address,currency);
        return Promise.resolve(rest);
    }

    getBalanceRecords = async (address: string,currency: string, hash:string,pageSize: number, pageNo: number,finger?:string,tokenAddress?:string): Promise<TxsView> => {
        const ret: any = await this.db.queryBalanceRecords(address,currency,hash, pageSize, pageNo,tokenAddress)
        return ret
    }

    getEvents = async (txHash: string,depositNonce: string,originChainID:string,resourceID:string): Promise<Array<EventStruct>> => {
        // console.log("getEvent::",txHash)
        const retn: Array<EventStruct> = await this.db.queryEvents(txHash,depositNonce,originChainID,resourceID)
        return Promise.resolve(retn);
    }

    getAppVersion = async (tag:string,versionNum:number):Promise<any>=>{
        return await this.db.getAppVersion(tag,versionNum)
    }

    addToken = async (token:Token):Promise<boolean>=>{
        if(token["contractAddress"]){
            token.address = token["contractAddress"];
        }
        const _token = await this.db.getToken(token.address);
        if(!_token){
            const ierc20: Ierc20 = new Ierc20(token.address,token.chain == ChainType.BSC?BSC_HOST:ETH_HOST);
            const symbol = await ierc20.symbol()
            if(symbol){
                return await this.db.insertTokens(token)
            }
        }else{
            return true
        }
    }

    getToken = async (address:string):Promise<any>=>{
        return await this.db.getToken(address)
    }

    tokens = async ():Promise<any>=>{
        return await this.db.getTokens()
    }

    protected insertTxInfo = async (hash: string, t: any) => {
        this.db.insertTxInfo(hash,t);
    }

}
