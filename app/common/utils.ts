import utils, {isNewVersion, hexToCy, addrToString} from 'jsuperzk/src/utils/utils'
import BigNumber from "bignumber.js";
import * as constant from "./constant";

export function isV1(pkr: string) {
    return !isNewVersion(utils.toBuffer(pkr));
}

export function toNum(v: string | BigNumber): number {
    return new BigNumber(v).toNumber()
}

export function isErc20Address(address: string) {
    const cKeys: any = Object.keys(constant.TOKEN_ADDRESS);
    for (let key of cKeys) {
        // @ts-ignore
        const addr: string = constant.TOKEN_ADDRESS[key];
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

export function isCrossAddress(address: string) {
    const cKeys: any = Object.keys(constant.CROSS_ADDRESS);
    for (let key of cKeys) {
        // @ts-ignore
        const addr: string = constant.CROSS_ADDRESS[key];
        if (address.toLowerCase() === addr.toLowerCase()) {
            return key;
        }
    }
    return "";
}

export function isCrossNftAddress(address: string) {
    const cKeys: any = Object.keys(constant.CROSS_NFT_ADDRESS);
    for (let key of cKeys) {
        // @ts-ignore
        const addr: string = constant.CROSS_NFT_ADDRESS[key];
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