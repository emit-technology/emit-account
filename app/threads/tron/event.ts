/**
 * Copyright 2020 EMIT Foundation.
 This file is part of E.M.I.T. .

 E.M.I.T. is free software: you can redistribute it and/or modify
 it under the terms of the GNU General Public License as published by
 the Free Software Foundation, either version 3 of the License, or
 (at your option) any later version.

 E.M.I.T. is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 GNU General Public License for more details.

 You should have received a copy of the GNU General Public License
 along with E.M.I.T. . If not, see <http://www.gnu.org/licenses/>.
 */
import * as db from "../../db";
import tronEvent from "../../event/tron"
import * as constant from "../../common/constant";
import {THREAD_CONFIG} from "../../common/constant";

const myPool = require('../../db/mongodb');

class TronEvent {

    runByEventApi = async ()=>{
        const client: any = await myPool.acquire();
        const session = client.startSession();
        try{
            const rest:Array<any> = await tronEvent.queryByEventApi();
            const transactionResults = await session.withTransaction(async () => {
                const tmp :Array<any> = [];
                if(rest && rest.length>0){
                    for(let d of rest){
                        const r = await db.tron.eventExist(d.txHash)
                        if(!r){
                            tmp.push(d)
                        }
                    }
                    if(tmp.length>0){
                        await db.tron.insertEvents(tmp,session,client)
                    }
                }
            }, constant.mongo.tron.transactionOptions);

            if (transactionResults) {
                console.log("TRON>>> The reservation was successfully created.");
            } else {
                console.log("TRON>>> The transaction was intentionally aborted.");
            }
        } catch (e) {
            console.error("The TRON was aborted due to an unexpected error: ", e);
        } finally {
            await session.endSession();
            myPool.release(client);
        }
    }

    runByNum = async ()=>{
        const client: any = await myPool.acquire();
        const session = client.startSession();
        try{
            const rest:any = await db.tron.latestBlock()
            const num = rest ? rest+1:THREAD_CONFIG.START_AT.TRON;
            const restProposal:Array<any> = await tronEvent.queryByNum(num);
            const transactionResults = await session.withTransaction(async () => {
                if(restProposal && restProposal.length>0){
                    await db.tron.insertEvents(restProposal,session,client)
                }
                await db.tron.upsertLatestBlock(num,Date.now(),session,client);
            }, constant.mongo.tron.transactionOptions);

            if (transactionResults) {
                console.log("TRON>>> The reservation was successfully created.");
            } else {
                console.log("TRON>>> The transaction was intentionally aborted.");
            }
        } catch (e) {
            console.error("The TRON was aborted due to an unexpected error: ", e);
        } finally {
            await session.endSession();
            myPool.release(client);
        }
    }

}

export default TronEvent