
export interface Balance {
    address: string
    currency: string
    totalIn: string
    totalOut: string
    totalFrozen: string

    tokenAddress: string

    timestamp?: number
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
    createdAt?:any

    tokenAddress: string
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
    createdAt?:any

    tokenAddress: string
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
    nonce?:number
    createdAt?:any
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
    chain: any
    nonce: any
    chainId?: any
    amount:any
    feeCy?:string
    feeValue?:string
}

export enum ChainType {
    _,
    SERO,
    ETH,
    TRON,
    BSC
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
    WETH_WITHDRAW,

    ERC721_Transfer,
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

export interface Token {
    name: string;
    symbol: string;
    decimal: number;
    totalSupply?: string;
    address: string;
    image?: string;
    protocol: string; //ERC20 , ERC721
    chain: ChainType;
}