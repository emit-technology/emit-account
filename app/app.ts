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

const bodyParser = require('body-parser');
const app: express.Application = express();

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
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header("Access-Control-Allow-Credentials", "true");
    if (req.method == 'OPTIONS') {
        res.sendStatus(200);
    } else {
        next();
    }
})

app.post('/', function (req, res) {
    const r: JsonParams = req.body;
    if(!r.method){
        console.log(JSON.stringify(req.body));
        sendError(r, res, "invalid request!");
        return;
    }
    let api: Api;
    const prefix = r.method.split("_")[0];
    const method = r.method.split("_")[1];
    if (prefix === "sero") {
        api = new SeroApi();
    } else if (prefix === "eth") {
        api = new EthApi();
    } else {
        sendError(r, res, `Api prefix=[${prefix}] not defined!`);
        return
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
        case "getTransactions":
            api.getBalanceRecords(r.params[0], r.params[1], r.params[2], r.params[3],r.params[4]).then(rest => {
                sendResult(r, res, rest)
            }).catch((e: any) => {
                sendError(r, res, typeof e == "string" ? e : e.message);
            })
            break;
        case "getTxs":
            api.getTxs(r.params[0], r.params[1], r.params[2], r.params[3]).then(rest => {
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
            api.commitTx(r.params[0],r.params[1]).then(rest => {
                sendResult(r, res, rest)
            }).catch((e: any) => {
                sendError(r, res, typeof e == "string" ? e : e.message);
            })
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
            api.getEvents(r.params[0],r.params[1]).then(rest => {
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
    console.log('Example app listening on port 7655!');
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
