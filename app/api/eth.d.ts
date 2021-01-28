import { Api } from "./index";
declare class EthApi extends Api {
    constructor();
    commitTx: (data: any, t: any) => Promise<any>;
    genParams(txPrams: any): Promise<any>;
    proxyPost: (method: string, params: any) => Promise<any>;
    getBalance: (address: string, cy: string) => Promise<any>;
    initBalance: (address: string) => Promise<void>;
}
export default EthApi;
