import Base from "./base";
import * as constant from "../common/constant";

class Eth extends Base {

    // protected dbName: string = "eth";

    constructor() {
        super(constant.mongo.eth.name)
    }

    removeUnPendingTxByHash = async (address: string, nonce: number|undefined) => {
        if(!nonce){
            return
        }
        const client = await this.client();
        try{
            const txInfoClient: any = await this.txInfo(client);
            const query = {
                fromAddress: address,
                nonce: {"$lte": nonce},
                num: 0
            }
            const cursor = await txInfoClient.find(query)
            const txInfos: Array<any> = await cursor.toArray();
            if(txInfos && txInfos.length>0){
                const recordClient: any = await this.balanceRecords(client);
                for (let tx of txInfos) {
                    await recordClient.deleteMany({txHash: tx.txHash, num: 0})
                }
                await txInfoClient.deleteMany(query)
            }
        }catch (e){
            console.error(e)
        }finally {
            this.release(client);
        }

    }

    removeUnPendingTxTimeout = async ()=>{
        const client = await this.client();
        try{
            const txInfoClient: any = await this.txInfo(client);
            const recordClient: any = await this.balanceRecords(client);
            const timestamp = Math.floor(Date.now()/1000) - 60 * 60 * 24 * 3;
            const query = {
                timestamp: {"$lte": timestamp},
                num: 0
            }
            const option = {
                limit: 100
            }
            const cursor = await txInfoClient.find(query,option)
            const txInfos: Array<any> = await cursor.toArray();
            if (txInfos && txInfos.length > 0) {
                for (let tx of txInfos) {
                    const dOption = {txHash: tx.txHash, num: 0};
                    await recordClient.deleteMany(dOption);
                    await txInfoClient.deleteMany(dOption);
                }
            }
        }catch (e){
            console.error(e)
        }finally {
            this.release(client);
        }
    }
}

export default Eth