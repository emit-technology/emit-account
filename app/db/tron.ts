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
import Base from "./base";
import * as constant from "../common/constant";
import {EventStruct} from "../types";

const myPool = require('../db/mongodb');

class Tron extends Base{
    constructor() {
        super(constant.mongo.tron.name)
    }

    client = async () => {
        return await myPool.acquire();
    }

    release(client: any) {
        myPool.release(client);
    }

    protected eventBlockNum = async (client: any) => {
        return await client.db(this.dbName).collection('events');
    }

    updateEventOne = async (event: any) => {
        const client = await this.client();
        try{
            const db: any = await this.events(client);
            await db.updateOne(
                {txHash:event.txHash,eventName:event.eventName},
                {fingerprint:{"$set":event.fingerprint}}
            )
        }catch (e){
            console.error(e)
        }finally {
            this.release(client);
        }
    }
}

export default Tron