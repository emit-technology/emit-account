import {TxPrams} from "../types/sero";
import {TxInfo, TxsView, EventStruct} from "../types/index";

export abstract class Api {

    protected db: any

    protected constructor(db: any) {
        this.db = db;
    }

    abstract genParams(txPrams: TxPrams): Promise<any>;

    abstract commitTx(tx: any,txInfo:any): Promise<any>;

    abstract proxyPost(method:string,params:any):Promise<any>;

    abstract getBalance(address: string,cy:string): Promise<any>;

    getTxInfo = async (txHash: string): Promise<TxInfo> => {
        const txInfo: TxInfo = await this.db.queryTxByHash(txHash);
        return Promise.resolve(txInfo);
    }

    getTxs = async (address: string,currency: string, pageSize: number, pageNo: number): Promise<TxsView> => {
        const retn: TxsView = await this.db.queryTxByAddress(address,currency, pageSize, pageNo)
        return Promise.resolve(retn);
    }

    countPendingTx = async (address:string,currency:string)=>{
        const rest:any = await this.db.countPendingTx(address,currency);
        return Promise.resolve(rest);
    }

    getBalanceRecords = async (address: string,currency: string, hash:string,pageSize: number, pageNo: number): Promise<TxsView> => {
        console.log("default")
        const retn: TxsView = await this.db.queryBalanceRecords(address,currency,hash, pageSize, pageNo)
        return Promise.resolve(retn);
    }

    getEvents = async (txHash: string,depositNonce: string): Promise<Array<EventStruct>> => {
        const retn: Array<EventStruct> = await this.db.queryEvents(txHash,depositNonce)
        return Promise.resolve(retn);
    }

    getAppVersion = async (tag:string,versionNum:number):Promise<any>=>{
        return await this.db.getAppVersion(tag,versionNum)
    }

    protected insertTxInfo = async (hash: string, t: any) => {
        this.db.insertTxInfo(hash,t);
    }
}
