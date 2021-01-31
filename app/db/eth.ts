import Base from "./base";
import * as constant from "../common/constant";

class Eth extends Base {

    protected dbName: string = "eth";

    constructor() {
        super(constant.mongo.eth.name)
    }

    removeUnPendingTxByHash = async (address: string, nonce: number|undefined) => {
        if(!nonce){
            return;
        }
        const client = await this.client();
        const txInfoClient: any = await this.txInfo(client);
        const recordClient: any = await this.balanceRecords(client);
        const cursor = await txInfoClient.find({
            fromAddress: address,
            nonce: {"$lte": nonce},
            num: 0
        })
        const txInfos: Array<any> = await cursor.toArray();
        if (txInfos && txInfos.length > 0) {
            for (let tx of txInfos) {
                await recordClient.deleteMany({txHash: tx.txHash, num: 0})
            }
            await txInfoClient.deleteMany({
                fromAddress: address,
                nonce: {"$lte": nonce},
                num: 0
            })
        }
        this.release(client);
        return;
    }
}

export default Eth