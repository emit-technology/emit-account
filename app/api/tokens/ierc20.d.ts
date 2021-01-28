import BigNumber from "bignumber.js";
import { ApprovalEvent, TransferEvent } from "../../types/eth";
export declare class Ierc20 {
    protected abi: any;
    protected contract: any;
    protected web3: any;
    constructor(address: string);
    totalSupply: () => Promise<BigNumber>;
    balanceOf: (who: string) => Promise<BigNumber>;
    allowance: (owner: string, spender: string) => Promise<void>;
    transfer: (to: string, value: BigNumber) => Promise<void>;
    approve: (spender: string, value: BigNumber) => Promise<void>;
    transferFrom: (from: string, to: string, value: BigNumber) => Promise<void>;
    decodeTransferLog: (data: string, topics: Array<string>) => TransferEvent;
    decodeApprovalLog: (data: string, topics: Array<string>) => ApprovalEvent;
    encodeEventSignature: (name: string) => any;
}
export default Ierc20;
