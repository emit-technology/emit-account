import axios from "axios";

class RPC {

    messageId: number;
    host: string;

    constructor(host: string) {
        this.messageId = 0;
        this.host = host;
    }

    async post(method: any, params: any,host?:string) {
        const data: any = {
            id: this.messageId++,
            jsonrpc: '2.0',
            method: method,
            params: params,
        };
        return new Promise((resolve, reject) => {
            axios.post(host?host:this.host, data).then((resp: any) => {
                if (resp.data.error) {
                    reject(resp.data.error.message);
                } else {
                    resolve(resp.data.result);
                }
            }).catch((e: any) => {
                reject(e)
            })
        })
    }

    get = async (path: string) => {
        return new Promise((resolve,reject)=>{
            axios.get(this.host + path).then((resp: any) => {
                resolve(resp.data)
            }).catch((e: any) => {
                console.error(e,"promise get")
                reject(e);
            })
        })
    }
}

export default RPC