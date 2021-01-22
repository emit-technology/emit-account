import {ChainType} from "../../../emit-wallet/src/types";

export interface Balance {
    address: string
    currency: string
    totalIn: string
    totalOut: string
    totalFrozen: string
}

export enum TxType {
    _,
    IN,
    OUT
}

export interface BalanceRecord {
    address: string
    currency: string
    amount: string
    type: TxType
    txHash: string
    num: number
    timestamp: number | undefined
}

export interface Asset {
    currency: string
    value: string
}


export interface AddressTx {
    address: string
    txHash: string
    num: number
    currency: string
}

export interface TxInfo {
    txHash: string
    fromAddress: string
    toAddress: Array<string>
    gas: string
    gasUsed: string
    gasPrice: string
    feeCy: string
    fee: string     //gas * gasPrice
    // insAssets: any
    // outsAssets: any
    num: number
    contract?: any
    outs: Array<string>
    ins: Array<string>
    transactionIndex: string
    timestamp: number | undefined
    extra?: any
    contractAddress?: string
}

export interface Transaction {
    hash: string
    from: string
    to: string
    cy: string
    value: string
    data?: string
    gas: string
    gasPrice: string
    chain: ChainType
    nonce: string
    chainId?: any
    amount:any
    feeCy?:string
    feeValue?:string
}

export interface LatestBlock {
    tag: string
    num: number
}

export interface TxsView {
    txs?: Array<TxInfo>
    total?: number
    pageSize?: number
    pageNo?: number
}

export interface EventType {
    topics: Array<string>
    data: string
}

export enum EVENT_TYPE {
    _,
    ERC20_Transfer,
    ERC20_Approve,

    CROSS_DEPOSIT,
    CROSS_PROPOSAL,

    WETH_DEPOSIT,
    WETH_WITHDRAW
}

export interface EventStruct {
    num: number
    txHash: string
    contractAddress: string
    eventName: EVENT_TYPE
    topic: string
    event: any
}

export interface Version {
    version: string
    num: number
    date: string
    info: string
    tag: string
}