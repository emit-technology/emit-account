import {utxo} from "jsuperzk/dist/tx/prepare";
import {Asset} from "./index";

export interface OutInfo {
    address: string
    txHash: string
    num: number
    root: string //unique
    asset: Asset
    used: boolean
    utxo: utxo
    ticket?:TicketInfo
}


//out of Blocks Info

export interface TxPrams {
    from: string
    to: string
    cy: string
    value: string
    data: string
    gas: string
    gasPrice: string
    feeCy?: string
    feeValue?: string
    tickets?:Array<TicketInfo>
}

export interface TicketInfo {
    Value:string
    Category:string
}
