import utils, {isNewVersion, hexToCy, addrToString, toHex} from 'jsuperzk/src/utils/utils'
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

export {
    hexToCy, addrToString, toHex
}