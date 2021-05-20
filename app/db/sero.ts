import {OutInfo} from "../types/sero";
import Base from "./base";
import * as constant from '../common/constant'

const myPool = require('../db/mongodb');

const outTimeout = 10*60*1000;

class Sero extends Base{

    constructor() {
        super(constant.mongo.sero.name)
    }

    protected outs = async (client: any) => {
        return await client.db(this.dbName).collection('outs');
    }

    findOutsByRoots = async (roots: Array<string>) => {
        const client = await this.client();
        try{

            const dbOuts: any = await this.outs(client);
            const rest = await dbOuts.find({"root": {'$in': roots}}).toArray();
            return rest;
        }catch (e){
            console.error(e)
        }finally {
            myPool.release(client);
        }
        return []
    }

    findUnusedOutsByRoots = async (roots: Array<string>) => {
        const client = await this.client();
        try{
            const dbOuts: any = await this.outs(client);
            const rest = await dbOuts.find({
                "root": {'$in': roots},
                "used": false,
                "$or":[{timeout:{"$lt":Date.now()}},{timeout:{"$eq":0}},{timeout:{"$exists":false}}]
            }).toArray();
            return rest;
        }catch (e){
            console.error(e)
        }finally {
            myPool.release(client);
        }
        return []
    }

    findUnusedOutsByAddress = async (address:string,currency:string):Promise<Array<OutInfo>> => {
        const client = await this.client();
        try{
            const dbOuts: any = await this.outs(client);
            const rest = await dbOuts.find({
                "address": {'$eq': address},
                "asset.currency":{"$eq":currency},"asset.value":{"$ne":"0"},
                "used": {"$eq":false},
                "$or":[{timeout:{"$lt":Date.now()}},{timeout:{"$eq":0}},{timeout:{"$exists":false}}]
            }).toArray();
            return rest;
        }catch (e){
            console.error(e)
        }finally {
            myPool.release(client);
        }
        return []
    }

    updateOutUsed = async (roots: Array<string>, session: any, client: any) => {
        const dbOuts: any = await this.outs(client);
        await dbOuts.updateMany({"root": {'$in': roots}}, {"$set":{"used": true}}, {session});
    }

    updateOutLocked = async (roots: Array<string>) => {
        const client = await this.client();
        try{
            const dbOuts: any = await this.outs(client);
            await dbOuts.updateMany({"root": {'$in': roots}}, {"$set":{"timeout": Date.now()+outTimeout}});
            return
        }catch (e){
            console.error(e)
        }finally {
            myPool.release(client);
        }
        return
    }

    insertOuts = async (outs: Array<OutInfo>, session: any, client: any) => {
        const dbOuts: any = await this.outs(client);
        return await dbOuts.insertMany(outs, {session})
    }

    findTickets = async (address:string,tickets?:Array<string>):Promise<any> =>{
        const client = await this.client();
        try{
            const connection: any = await this.outs(client);
            const query:any = {}
            query.address = address;
            query.used = false;
            if(tickets && tickets.length>0){
                query["ticket.Value"] = {"$in":tickets}
            }
            const rest = await connection.find(query).toArray()
            return rest;
        }catch (e){
            console.error(e)
        }finally {
            myPool.release(client);
        }
        return []
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

export default Sero