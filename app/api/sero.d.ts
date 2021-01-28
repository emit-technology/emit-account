import { Api } from "./index";
import { TxPrams } from "../types/sero";
import { PreTxParam } from "jsuperzk/src/tx/prepare";
declare class SeroApi extends Api {
    constructor();
    proxyPost: (method: string, params: any) => Promise<any>;
    getBalance: (address: string, cy: string) => Promise<any>;
    commitTx: (signTx: any, t: any) => Promise<any>;
    genParams: (txPrams: TxPrams) => Promise<any>;
    genPreParams: (txPrams: TxPrams) => Promise<PreTxParam>;
}
export default SeroApi;
