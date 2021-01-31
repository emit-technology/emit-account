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

import {tronWeb} from "../api/tron"
import * as constant from "../common/constant"
import {THREAD_CONFIG} from "../common/constant";
class Tron{

    queryByEventApi = async ()=>{
        const option:any = {
            // eventName:"ProposalEvent",
            size:THREAD_CONFIG.LIMIT.TRON,
            // sort:"block_timestamp",
            // blockNumber: num
        }
        const rests = await tronWeb.getEventResult(constant.CROSS_ADDRESS.TRON,option)
        const result:Array<any> = [];
        if(rests && rests.length>0){
            for(let rest of rests){
                const ret:any= {
                    num: rest.block,
                    txHash: rest.transaction,
                    contractAddress: rest.contract,
                    eventName: rest.name,
                    event: rest.result,
                    timestamp:rest.timestamp
                }
                result.push(ret);
            }
        }
        return result

    }

    queryByNum = async (num:number)=>{
        const option1:any = {
            eventName:"Deposit",
            blockNumber: num
        }
        const option2:any = {
            eventName:"ProposalEvent",
            blockNumber: num
        }
        const rest1 = await tronWeb.getEventResult(constant.CROSS_ADDRESS.TRON,option1)
        const rest2 = await tronWeb.getEventResult(constant.CROSS_ADDRESS.TRON,option2)
        const result:Array<any> = [];
        const rests= rest1.concat(rest2);
        if(rest1 && rests.length>0){
            for(let rest of rests){
                const ret:any = {
                    num: rest.block,
                    txHash: rest.transaction,
                    contractAddress: rest.contract,
                    eventName: rest.name,
                    event: rest.result,
                    timestamp: rest.timestamp
                }
                result.push(ret);
            }
        }
        return result
    }
}

const tronEvent = new Tron();

export default tronEvent