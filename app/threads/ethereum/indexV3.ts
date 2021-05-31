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
import ethRpc from "../../rpc/eth";
import {ChainType} from "../../types";
import {ETH_HOST} from "../../common/constant";
import EthThreadBase from "../ethBase";
import * as constant from "../../common/constant";

class Index extends EthThreadBase{
    constructor(startNum:number,tag:string) {
        super(startNum,tag,"ETH",ethRpc,ETH_HOST,ChainType.ETH,db.eth,constant.mongo.eth.transactionOptions,5)
    }
}


export default Index