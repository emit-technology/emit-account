import { EVENT_TYPE, EventStruct } from "../types";
interface configType {
    type: EVENT_TYPE;
    abi: any;
}
export declare const EVENT_ABI_CONFIG: Array<configType>;
declare class Event {
    constructor();
    decodeLog(num: number, txHash: string, contractAddress: string, topics: Array<string>, data: string): EventStruct | undefined;
}
declare const event: Event;
export default event;
