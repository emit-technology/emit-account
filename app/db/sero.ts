import {OutInfo} from "../types/sero";
import Base from "./base";
import * as constant from '../common/constant'

const myPool = require('../db/mongodb');

class Sero extends Base{

    constructor() {
        super(constant.mongo.sero.name)
    }

    protected outs = async (client: any) => {
        return await client.db(this.dbName).collection('outs');
    }

    findOutsByRoots = async (roots: Array<string>) => {
        const client = await this.client();
        const dbOuts: any = await this.outs(client);
        const rest = await dbOuts.find({"root": {'$in': roots}}).toArray();
        myPool.release(client);
        return rest;
    }

    findUnusedOutsByRoots = async (roots: Array<string>) => {
        const client = await this.client();
        const dbOuts: any = await this.outs(client);
        const rest = await dbOuts.find({"root": {'$in': roots}, "used": false}).toArray();
        myPool.release(client);
        return rest;
    }

    findUnusedOutsByAddress = async (address:string,currency:string):Promise<Array<OutInfo>> => {
        const client = await this.client();
        const dbOuts: any = await this.outs(client);
        const rest = await dbOuts.find({"address": {'$eq': address},"asset.currency":{"$eq":currency}, "used": {"$eq":false}}).toArray();
        myPool.release(client);
        return rest;
    }

    updateOutUsed = async (roots: Array<string>, session: any, client: any) => {
        const dbOuts: any = await this.outs(client);
        await dbOuts.updateMany({"root": {'$in': roots}}, {"$set":{"used": true}}, {session});
    }

    insertOuts = async (outs: Array<OutInfo>, session: any, client: any) => {
        const dbOuts: any = await this.outs(client);
        return await dbOuts.insertMany(outs, {session})
    }

}

export default Sero