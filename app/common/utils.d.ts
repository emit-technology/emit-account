import { hexToCy, addrToString } from 'jsuperzk/src/utils/utils';
import BigNumber from "bignumber.js";
export declare function isV1(pkr: string): boolean;
export declare function toNum(v: string | BigNumber): number;
export declare function isErc20Address(address: string): any;
export declare function isWETHAddress(address: string): "" | "WETH";
export declare function isCrossAddress(address: string): any;
declare function toHex(value: string | BigNumber | number): string;
export { hexToCy, addrToString, toHex };
