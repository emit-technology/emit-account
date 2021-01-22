export interface Transaction {
    r: string
    s: string
    blockHash: string
    from: string
    hash: string
    input: string
    to: string
    v: string
    blockNumber: string
    gas: string
    gasPrice: string
    nonce: string
    transactionIndex: string
    value: string
    timestamp?: number
}

export interface Block {
    extraData: string
    hash: string
    logsBloom: string
    miner: string
    nonce: string
    parentHash: string
    receiptsRoot: string
    sha3Uncles: string
    stateRoot: string
    transactionsRoot: string
    difficulty: string
    gasLimit: string
    gasUsed: string
    number: string
    size: string
    timestamp: string
    totalDifficulty: string
    transactions: Array<Transaction>
}

export interface TransactionReceipt {
    blockHash: string
    contractAddress: string
    from: string
    logsBloom: string
    to: string
    transactionHash: string
    blockNumber: string
    cumulativeGasUsed: string
    gasUsed: string
    status: string
    transactionIndex: string
    logs: Array<Log>
}

export interface Log {
    address: string
    blockHash: string
    blockNumber: string
    data: string
    logIndex: string
    topics: Array<string>
    transactionHash: string
    transactionIndex: string
}

export interface TransferEvent {
    from: string
    to: string
    value: string
}

export interface ApprovalEvent {
    owner: string
    spender: string
    value: string
}

export enum ProposalStatus {Inactive, Active, Passed, Executed, Cancelled}

export interface DepositEvent {
    destinationChainID: string
    resourceID: string
    depositNonce: string
}

export interface ProposalEvent {
    originChainID: string
    depositNonce: string
    status: ProposalStatus
    resourceID: string
    dataHash: string
}

export interface WETH_Deposit_Event {
    dst: string
    wad: string
}

export interface WETH_Withdrawal_Event {
    src: string
    wad: string
}
