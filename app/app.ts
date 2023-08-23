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

import express = require('express');
import Threads from './threads';
import {Api} from "./api";
import EthApi from "./api/eth";
import SeroApi from "./api/sero";
import gasTracker from "./api/gasTracker";
import TronApi from "./api/tron";
import BscApi from "./api/bsc";
import {ChainType} from "./types";
import {checkCommit} from "./common/constant";
import {tokenCache} from "./cache/tokens";
import ethRpc from "./rpc/eth";
const log4js = require("log4js");
const logger = log4js.getLogger();
logger.level = "debug";

const bodyParser = require('body-parser');
const app: express.Application = express();

const seroApi = new SeroApi();
const bscApi = new BscApi();
const ethApi = new EthApi();
const tronApi = new TronApi();

app.use(bodyParser.json({limit: '1mb'}));
app.use(bodyParser.urlencoded({
    extended: true
}));

const threads = new Threads();

threads.run();

function sendError(reqJson: JsonParams, res: any, error: string) {
    const rest: JsonResult = {
        id: reqJson.id,
        jsonrpc: reqJson.jsonrpc,
        method: reqJson.method
    }
    rest.error = error;
    res.send(rest)
}

function sendResult(reqJson: JsonParams, res: any, result: any) {
    const rest: JsonResult = {
        id: reqJson.id,
        jsonrpc: reqJson.jsonrpc,
        method: reqJson.method
    }
    rest.result = result;
    res.send(rest)
}

app.all("*", function (req, res, next) {
    res.header("Access-Control-Allow-Origin", req.headers.origin || '*');
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With,chain");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header("Access-Control-Allow-Credentials", "true");
    if (req.method == 'OPTIONS') {
        res.sendStatus(200);
    } else {
        next();
    }
})

app.get('/api/stats/:chain/:action/:tokenAddress',function (req,res){
    const action = req.params.action;
    const chain = req.params.chain;
    const tokenAddress = req.params.tokenAddress;
    let api: Api;
    if(chain == "bsc"){
       api = bscApi;
    }else if(chain == "eth"){
       api = ethApi;
    }else{
        res.status(200).send("Invalid address!");
        return
    }
    api.tokenAction(action,tokenAddress).then(rest=>{
        res.status(200).send(rest);
    }).catch(e=>{
        const err = typeof e == 'string'?e:e.message;
        res.status(200).send(err);
    })
    return;
})

app.post('/', function (req, res) {
    let chain:any = req.header("chain");
    if(!chain){
        chain = req.query["chain"];
    }
    const r: JsonParams = req.body;
    if(!r.method){
        console.log("req.body=",JSON.stringify(req.body));
        sendError(r, res, "invalid request!");
        return;
    }
    let api: Api = ethApi;
    const prefix = r.method.split("_")[0];
    const method = r.method.split("_")[1];
    if(chain){
        if(chain == ChainType.ETH){
            api = ethApi
        }else if(chain == ChainType.SERO){
            api = seroApi
        }else if(chain == ChainType.TRON){
            api = tronApi
        }else if(chain == ChainType.BSC){
            api = bscApi
        }
    }else {
        if (prefix === "sero") {
            api = seroApi;
        } else if (prefix === "eth") {
            api = ethApi;
        } else if (prefix === "tron") {
            api = tronApi;
        }
    }

    switch (method) {
        case "getBalance":
            const cy = r.params.length>1?r.params[1]:""
            api.getBalance(r.params[0],cy).then(rest => {
                sendResult(r, res, rest)
            }).catch((e: any) => {
                sendError(r, res, typeof e == "string" ? e : e.message);
            })

            break;
        case "getBalanceWithAddress":
            api.getBalanceWithAddress(r.params[0]).then(rest => {
                sendResult(r, res, rest)
            }).catch((e: any) => {
                sendError(r, res, typeof e == "string" ? e : e.message);
            })

            break;
        case "getTransactions":
            const tkAddress = r.params.length>6?r.params[6]:""
            api.getBalanceRecords(r.params[0], r.params[1], r.params[2], r.params[3],r.params[4],r.params[5],tkAddress.toLowerCase()).then(rest => {
                sendResult(r, res, rest)
            }).catch((e: any) => {
                sendError(r, res, typeof e == "string" ? e : e.message);
            })
            break;
        case "getTxs":
            const tAddress = r.params.length>4?r.params[4]:""
            api.getTxs(r.params[0], r.params[1], r.params[2], r.params[3],tAddress.toLowerCase()).then(rest => {
                sendResult(r, res, rest)
            }).catch((e: any) => {
                sendError(r, res, typeof e == "string" ? e : e.message);
            })
            break;
        case "getTxInfo":
            api.getTxInfo(r.params[0]).then(rest => {
                sendResult(r, res, rest)
            }).catch((e: any) => {
                sendError(r, res, typeof e == "string" ? e : e.message);
            })
            break;
        case "commitTx":
            if(prefix != "sero" || checkCommit(r.params[1],req)){
                api.commitTx(r.params[0],r.params[1]).then(rest => {
                    sendResult(r, res, rest)
                }).catch((e: any) => {
                    sendError(r, res, typeof e == "string" ? e : e.message);
                })
            }else{
                sendError(r, res, "Sorry, this content is not available in your location.");

            }
            break;
        case "genParams":
            api.genParams(r.params[0]).then(rest => {
                sendResult(r, res, rest)
            }).catch((e: any) => {
                sendError(r, res, typeof e == "string" ? e : e.message);
            })
            break;
        case "gasTracker":
            sendResult(r, res, gasTracker.gasPriceLevel)
            break;
        case "getEvents":
            // console.log("getEvents>>>")
            api.getEvents(r.params[0],r.params[1],r.params[2],r.params[3]).then(rest => {
                sendResult(r, res, rest)
            }).catch((e: any) => {
                sendError(r, res, typeof e == "string" ? e : e.message);
            })
            break;
        case "getAppVersion":
            api.getAppVersion(r.params[0],r.params[1]).then(rest => {
                sendResult(r, res, rest)
            }).catch((e: any) => {
                sendError(r, res, typeof e == "string" ? e : e.message);
            })
            break;
        case "countPendingTx":
            api.countPendingTx(r.params[0],r.params[1]).then(rest => {
                sendResult(r, res, rest)
            }).catch((e: any) => {
                sendError(r, res, typeof e == "string" ? e : e.message);
            })
            break;
        case "getTicket":
            api.getTicket(r.params[0]).then(rest => {
                sendResult(r, res, rest)
            }).catch((e: any) => {
                sendError(r, res, typeof e == "string" ? e : e.message);
            })
            break;
        case "getChainConfig":
            api.getChainConfig().then(rest => {
                sendResult(r, res, rest)
            }).catch((e: any) => {
                sendError(r, res, typeof e == "string" ? e : e.message);
            })
            break;
        case "addToken":
            api.addToken(r.params[0]).then(rest => {
                sendResult(r, res, rest)
            }).catch((e: any) => {
                sendError(r, res, typeof e == "string" ? e : e.message);
            })
            break;
        case "getToken":
            api.getToken(r.params[0]).then(rest => {
                sendResult(r, res, rest)
            }).catch((e: any) => {
                sendError(r, res, typeof e == "string" ? e : e.message);
            })
            break;
        default:
            api.proxyPost([prefix,method].join("_"),r.params).then(rest => {
                sendResult(r, res, rest)
            }).catch((e: any) => {
                sendError(r, res, typeof e == "string" ? e : e.message);
            })
            break;
    }
});

app.listen(7655, function () {
    console.log('App listening on port 7655!',"started!");

    //init app/
    tokenCache.init().catch(e=>{console.error(e)});
})

interface JsonParams {
    id: number
    jsonrpc: string
    method: string
    params: Array<any>
}

interface JsonResult {
    id: number
    jsonrpc: string
    method: string
    result?: any
    error?: any
}

console.log = function (message?: any, ...optionalParams: any[]){
    logger.info(message,...optionalParams);
}

console.info = function (message?: any, ...optionalParams: any[]){
    logger.info(message,...optionalParams);
}

console.debug = function (message?: any, ...optionalParams: any[]){
    logger.debug(message,...optionalParams);
}