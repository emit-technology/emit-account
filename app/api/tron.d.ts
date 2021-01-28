/**
 * Copyright 2020 EMIT Foundation.
 This file is part of E.M.I.T. .

 E.M.I.T. is free software: you can redistribute it and/or modify
 it under the terms of the GNU General Public License as published by
 the Free Software Foundation, either version 3 of the License, or
 (at your option) any later version.

 E.M.I.T. is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 GNU General Public License for more details.

 You should have received a copy of the GNU General Public License
 along with E.M.I.T. . If not, see <http://www.gnu.org/licenses/>.
 */
import { Api } from "./index";
import { TxInfo } from "../types";
declare const tronWeb: any;
declare const tronGrid: any;
declare class TronApi extends Api {
    constructor();
    commitTx: (tx: any, txInfo: any) => Promise<any>;
    genParams: (txPrams: any) => Promise<any>;
    getBalance: (address: string, cy: string) => Promise<any>;
    proxyPost(method: string, params: any): Promise<any>;
    getTxInfo: (txHash: string) => Promise<TxInfo>;
    getTxs: (address: string, currency: string, pageSize: number, pageNo: number, fingerprint?: string | undefined) => Promise<any>;
    getBalanceRecords: (address: string, currency: string, hash: string, pageSize: number, pageNo: number, fingerprint?: string | undefined) => Promise<any>;
}
export default TronApi;
export { tronWeb, tronGrid };
