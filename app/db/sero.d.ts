import { OutInfo } from "../types/sero";
import Base from "./base";
declare class Sero extends Base {
    constructor();
    protected outs: (client: any) => Promise<any>;
    findOutsByRoots: (roots: Array<string>) => Promise<any>;
    findUnusedOutsByRoots: (roots: Array<string>) => Promise<any>;
    findUnusedOutsByAddress: (address: string, currency: string) => Promise<Array<OutInfo>>;
    updateOutUsed: (roots: Array<string>, session: any, client: any) => Promise<void>;
    insertOuts: (outs: Array<OutInfo>, session: any, client: any) => Promise<any>;
}
export default Sero;
