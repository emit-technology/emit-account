import utils, {addrToString, hexToCy, isNewVersion} from 'jsuperzk/src/utils/utils'
import BigNumber from "bignumber.js";
import * as constant from "./constant";
import {ChainType} from "../types";

export function isV1(pkr: string) {
    return !isNewVersion(utils.toBuffer(pkr));
}

export function toNum(v: string | BigNumber): number {
    return new BigNumber(v).toNumber()
}

export function isErc20Address(address: string,chain:ChainType) {
    const obj = chain == ChainType.BSC?constant.TOKEN_ADDRESS_BSC:constant.TOKEN_ADDRESS;

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

export {
    hexToCy, addrToString, toHex
}