import { AddressTx, Balance, BalanceRecord, EventStruct, Transaction, TxInfo, TxsView } from "../types";
declare class Base {
    protected dbName: string;
    constructor(dbName: string);
    client: () => Promise<any>;
    release(client: any): void;
    protected balance: (client: any) => Promise<any>;
    protected balanceRecords: (client: any) => Promise<any>;
    protected txInfo: (client: any) => Promise<any>;
    protected addressTx: (client: any) => Promise<any>;
    protected blockNum: (client: any) => Promise<any>;
    protected versions: (client: any) => Promise<any>;
    protected events: (client: any) => Promise<any>;
    insertTxInfos: (txInfos: Array<TxInfo>, session: any, client: any) => Promise<any>;
    insertTxInfo: (hash: string, t: Transaction) => Promise<undefined>;
    insertBalanceRecord: (records: Array<BalanceRecord>, session: any, client: any) => Promise<any>;
    insertEvents: (events: Array<EventStruct>, session: any, client: any) => Promise<any>;
    insertEventOne: (event: EventStruct) => Promise<void>;
    queryEvents: (txHash: string, depositNonce: string, originChainID: string, resourceID: string, eventName?: string | undefined) => Promise<any>;
    eventExist: (txHash: string) => Promise<boolean>;
    queryBalanceRecords: (address: string, currency: string, hash: string, pageSize: number, pageNo: number) => Promise<{
        total: any;
        data: any;
        pageSize: number;
        pageNo: number;
    }>;
    upsertBalance: (record: BalanceRecord, session: any, client: any) => Promise<any>;
    updateBalance: (balance: Balance, session: any, client: any) => Promise<any>;
    queryBalance: (address: string, cy: string) => Promise<Array<Balance>>;
    insertAddressTx: (addressTxs: Array<AddressTx>, session: any, client: any) => Promise<any>;
    queryTxByAddress: (address: string, currency: string, pageSize: number, pageNo: number) => Promise<TxsView>;
    queryTxByHash: (txHash: string) => Promise<any>;
    upsertLatestBlock: (num: number, timestamp: number, session: any, client: any) => Promise<any>;
    latestBlock: () => Promise<any>;
    removePendingTxByHash: (hashArray: Array<string>, session: any, client: any) => Promise<void>;
    getAppVersion: (tag: string, versionNum?: number | undefined) => Promise<any>;
    countPendingTx: (address: string, currency: string) => Promise<any>;
}
export default Base;
