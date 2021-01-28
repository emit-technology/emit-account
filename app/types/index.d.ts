import { ChainType } from "../../../emit-wallet/src/types";
export interface Balance {
    address: string;
    currency: string;
    totalIn: string;
    totalOut: string;
    totalFrozen: string;
}
export declare enum TxType {
    _ = 0,
    IN = 1,
    OUT = 2
}
export interface BalanceRecord {
    address: string;
    currency: string;
    amount: string;
    type: TxType;
    txHash: string;
    num: number;
    timestamp: number | undefined;
}
export interface Asset {
    currency: string;
    value: string;
}
export interface AddressTx {
    address: string;
    txHash: string;
    num: number;
    currency: string;
}
export interface TxInfo {
    txHash: string;
    fromAddress: string;
    toAddress: Array<string>;
    gas: string;
    gasUsed: string;
    gasPrice: string;
    feeCy: string;
    fee: string;
    num: number;
    contract?: any;
    outs: Array<string>;
    ins: Array<string>;
    transactionIndex: string;
    timestamp: number | undefined;
    extra?: any;
    contractAddress?: string;
}
export interface Transaction {
    hash: string;
    from: string;
    to: string;
    cy: string;
    value: string;
    data?: string;
    gas: string;
    gasPrice: string;
    chain: ChainType;
    nonce: string;
    chainId?: any;
    amount: any;
    feeCy?: string;
    feeValue?: string;
}
export interface LatestBlock {
    tag: string;
    num: number;
}
export interface TxsView {
    txs?: Array<TxInfo>;
    total?: number;
    pageSize?: number;
    pageNo?: number;
}
export interface EventType {
    topics: Array<string>;
    data: string;
}
export declare enum EVENT_TYPE {
    _ = 0,
    ERC20_Transfer = 1,
    ERC20_Approve = 2,
    CROSS_DEPOSIT = 3,
    CROSS_PROPOSAL = 4,
    WETH_DEPOSIT = 5,
    WETH_WITHDRAW = 6
}
export interface EventStruct {
    num: number;
    txHash: string;
    contractAddress: string;
    eventName: EVENT_TYPE;
    topic: string;
    event: any;
}
export interface Version {
    version: string;
    num: number;
    date: string;
    info: string;
    tag: string;
}
