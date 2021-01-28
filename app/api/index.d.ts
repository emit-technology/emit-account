import { TxPrams } from "../types/sero";
import { TxInfo, TxsView, EventStruct } from "../types/index";
export declare abstract class Api {
    protected db: any;
    protected constructor(db: any);
    abstract genParams(txPrams: TxPrams): Promise<any>;
    abstract commitTx(tx: any, txInfo: any): Promise<any>;
    abstract proxyPost(method: string, params: any): Promise<any>;
    abstract getBalance(address: string, cy: string): Promise<any>;
    getTxInfo: (txHash: string) => Promise<TxInfo>;
    getTxs: (address: string, currency: string, pageSize: number, pageNo: number) => Promise<TxsView>;
    countPendingTx: (address: string, currency: string) => Promise<any>;
    getBalanceRecords: (address: string, currency: string, hash: string, pageSize: number, pageNo: number, fingerprint?: string | undefined) => Promise<TxsView>;
    getEvents: (txHash: string, depositNonce: string, originChainID: string, resourceID: string) => Promise<Array<EventStruct>>;
    getAppVersion: (tag: string, versionNum: number) => Promise<any>;
    protected insertTxInfo: (hash: string, t: any) => Promise<void>;
}
