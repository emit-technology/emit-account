import {utxo} from "jsuperzk/src/tx/prepare";
import {Asset} from "./index";

export interface OutInfo {
    address: string
    txHash: string
    num: number
    root: string //unique
    asset: Asset
    used: boolean
    utxo:utxo
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
    feeCy?:string
    feeValue?:string
}


