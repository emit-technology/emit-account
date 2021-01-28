import RPC from "./index";
import BigNumber from "bignumber.js";
import { Block, Log, TransactionReceipt } from "../types/eth";
import Ierc20 from "../api/tokens/ierc20";
import { Transaction } from "../types";
declare class EthRpc extends RPC {
    protected pendingFilterId: any;
    constructor();
    blockNumber: () => Promise<number>;
    getBlockByNum: (num: number) => Promise<Block>;
    getBalance: (address: string) => Promise<BigNumber>;
    getTokenBalance: (address: string, ierc20: Ierc20) => Promise<BigNumber>;
    getTransactionReceipt: (txHash: string) => Promise<TransactionReceipt>;
    sendRawTransaction: (data: any) => Promise<string>;
    getLogs: (from: number, to: number) => Promise<Array<Log>>;
    getFilterChangesPending: () => Promise<Array<Transaction>>;
    protected filterChanges: () => Promise<Array<string>>;
}
declare const ethRpc: EthRpc;
export default ethRpc;
