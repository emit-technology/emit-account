import { OutInfo } from '../types/sero';
import { Transaction, TxInfo } from "../types/";
import RPC from "./index";
import { TransactionReceipt } from "../types/eth";
declare class SeroRPC extends RPC {
    protected pendingFilterId: any;
    constructor();
    getTransactionReceipt: (txHash: string) => Promise<TransactionReceipt>;
    getBlockTimestamp: (num: number) => Promise<number>;
    getBlocksInfo: (fromBlock: number, limit: number) => Promise<Array<any>>;
    private convertOuts;
    getTxInfo: (txHash: string, outs: Array<OutInfo>, selfOuts: Map<string, OutInfo>) => Promise<TxInfo | null>;
    blockNumber: () => Promise<number>;
    getOut: (root: string) => Promise<any>;
    getFilterChangesPending: () => Promise<Array<Transaction>>;
    protected filterChanges: () => Promise<Array<string>>;
}
declare const seroRPC: SeroRPC;
export default seroRPC;
