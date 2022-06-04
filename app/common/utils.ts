import utils, {addrToString, hexToCy, isNewVersion} from 'jsuperzk/dist/utils/utils'
import BigNumber from "bignumber.js";
import * as constant from "./constant";
import {ChainType, Token} from "../types";
import {tokenCache} from "../cache/tokens";

export function isV1(pkr: string) {
    return !isNewVersion(utils.toBuffer(pkr));
}

export function toNum(v: string | BigNumber): number {
    return new BigNumber(v).toNumber()
}

export function isContractAddress(address: string,chain:ChainType){
    if(address){
        if(isErc20Address(address,chain)){
            return true
        }else if(isErc721Address(address,chain)){
            return true
        }else if(isCrossAddress(address,chain)){
            return true
        }else if(isCrossNftAddress(address,chain)){
            return true
        }else if(isEMITAddress(address, chain)){
            return true
        }
    }
    return false
}

export function isEMITAddress(address:string, chain: ChainType){
    const arr:Array<string>|undefined = constant.EMIT_ADDRESS[ChainType[chain]];
    if(arr && arr.length>0){
        const addr = arr.find(v=> v.toLowerCase() == address.toLowerCase());
        if(addr){
           return true
        }
    }
    return false;
}

export function isErc20Address(address: string,chain:ChainType) {
    const obj = chain == ChainType.BSC?constant.TOKEN_ADDRESS_BSC:constant.TOKEN_ADDRESS;

    const symbols = Object.keys(obj);
    if(symbols && symbols.length>0){
        for (let symbol of symbols) {
            // @ts-ignore
            const addr: string = obj[symbol];
            if (address.toLowerCase() === addr.toLowerCase()) {
                return symbol;
            }
        }
    }
    const cacheToken:Array<Token> = tokenCache.all(chain);
    for(let token of cacheToken){
        if(token.address.toLowerCase() == address.toLowerCase()){
            return token.symbol;
        }
    }
    return "";
}

export function isErc721Address(address: string,chain:ChainType) {
    const obj = chain == ChainType.BSC?constant.ERC721_ADDRESS_BSC:constant.ERC721_ADDRESS;
    const cKeys: any = Object.keys(obj);
    for (let key of cKeys) {
        // @ts-ignore
        const addr: string = obj[key];
        if (address.toLowerCase() === addr.toLowerCase()) {
            return key;
        }
    }
    return "";
}

export function isWETHAddress(address: string) {
    if (address.toLowerCase() === constant.TOKEN_ADDRESS.WETH.toLowerCase()) {
        return "WETH";
    }
    return "";
}

export function isCrossAddress(address: string,chain:ChainType) {
    const obj = chain == ChainType.BSC?constant.CROSS_ADDRESS_BSC:constant.CROSS_ADDRESS;
    const cKeys: any = Object.keys(obj);
    for (let key of cKeys) {
        // @ts-ignore
        const addr: string = obj[key];
        if (address.toLowerCase() === addr.toLowerCase()) {
            return key;
        }
    }
    return "";
}

export function isCrossNftAddress(address: string,chain:ChainType) {
    const obj = chain == ChainType.BSC?constant.CROSS_NFT_ADDRESS_BSC:constant.CROSS_NFT_ADDRESS;
    const cKeys: any = Object.keys(obj);
    for (let key of cKeys) {
        // @ts-ignore
        const addr: string = obj[key];
        if (address.toLowerCase() === addr.toLowerCase()) {
            return key;
        }
    }
    return "";
}

function toHex(value: string | BigNumber | number) {
    if(!value){
        return "0x0";
    }
    return `0x${new BigNumber(value).toString(16)}`
}

export const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";
export {
    hexToCy, addrToString, toHex
}