declare class RPC {
    messageId: number;
    host: string;
    constructor(host: string);
    post(method: any, params: any): Promise<unknown>;
    get: (path: string) => Promise<unknown>;
}
export default RPC;
