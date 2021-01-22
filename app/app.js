"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var threads_1 = require("./threads");
var eth_1 = require("./api/eth");
var sero_1 = require("./api/sero");
var gasTracker_1 = require("./api/gasTracker");
var tron_1 = require("./api/tron");
var bodyParser = require('body-parser');
var app = express();
app.use(bodyParser.json({ limit: '1mb' }));
app.use(bodyParser.urlencoded({
    extended: true
}));
var threads = new threads_1.default();
threads.run();
function sendError(reqJson, res, error) {
    var rest = {
        id: reqJson.id,
        jsonrpc: reqJson.jsonrpc,
        method: reqJson.method
    };
    rest.error = error;
    res.send(rest);
}
function sendResult(reqJson, res, result) {
    var rest = {
        id: reqJson.id,
        jsonrpc: reqJson.jsonrpc,
        method: reqJson.method
    };
    rest.result = result;
    res.send(rest);
}
app.all("*", function (req, res, next) {
    res.header("Access-Control-Allow-Origin", req.headers.origin || '*');
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header("Access-Control-Allow-Credentials", "true");
    if (req.method == 'OPTIONS') {
        res.sendStatus(200);
    }
    else {
        next();
    }
});
app.post('/', function (req, res) {
    var r = req.body;
    if (!r.method) {
        console.log(JSON.stringify(req.body));
        sendError(r, res, "invalid request!");
        return;
    }
    var api = new eth_1.default();
    ;
    var prefix = r.method.split("_")[0];
    var method = r.method.split("_")[1];
    if (prefix === "sero") {
        api = new sero_1.default();
    }
    else if (prefix === "eth") {
        api = new eth_1.default();
    }
    else if (prefix === "tron") {
        api = new tron_1.default();
    }
    switch (method) {
        case "getBalance":
            var cy = r.params.length > 1 ? r.params[1] : "";
            api.getBalance(r.params[0], cy).then(function (rest) {
                sendResult(r, res, rest);
            }).catch(function (e) {
                sendError(r, res, typeof e == "string" ? e : e.message);
            });
            break;
        case "getTransactions":
            api.getBalanceRecords(r.params[0], r.params[1], r.params[2], r.params[3], r.params[4]).then(function (rest) {
                sendResult(r, res, rest);
            }).catch(function (e) {
                sendError(r, res, typeof e == "string" ? e : e.message);
            });
            break;
        case "getTxs":
            api.getTxs(r.params[0], r.params[1], r.params[2], r.params[3]).then(function (rest) {
                sendResult(r, res, rest);
            }).catch(function (e) {
                sendError(r, res, typeof e == "string" ? e : e.message);
            });
            break;
        case "getTxInfo":
            api.getTxInfo(r.params[0]).then(function (rest) {
                sendResult(r, res, rest);
            }).catch(function (e) {
                sendError(r, res, typeof e == "string" ? e : e.message);
            });
            break;
        case "commitTx":
            api.commitTx(r.params[0], r.params[1]).then(function (rest) {
                sendResult(r, res, rest);
            }).catch(function (e) {
                sendError(r, res, typeof e == "string" ? e : e.message);
            });
            break;
        case "genParams":
            api.genParams(r.params[0]).then(function (rest) {
                sendResult(r, res, rest);
            }).catch(function (e) {
                sendError(r, res, typeof e == "string" ? e : e.message);
            });
            break;
        case "gasTracker":
            sendResult(r, res, gasTracker_1.default.gasPriceLevel);
            break;
        case "getEvents":
            api.getEvents(r.params[0], r.params[1]).then(function (rest) {
                sendResult(r, res, rest);
            }).catch(function (e) {
                sendError(r, res, typeof e == "string" ? e : e.message);
            });
            break;
        case "getAppVersion":
            api.getAppVersion(r.params[0], r.params[1]).then(function (rest) {
                sendResult(r, res, rest);
            }).catch(function (e) {
                sendError(r, res, typeof e == "string" ? e : e.message);
            });
            break;
        case "countPendingTx":
            api.countPendingTx(r.params[0], r.params[1]).then(function (rest) {
                sendResult(r, res, rest);
            }).catch(function (e) {
                sendError(r, res, typeof e == "string" ? e : e.message);
            });
            break;
        default:
            api.proxyPost([prefix, method].join("_"), r.params).then(function (rest) {
                sendResult(r, res, rest);
            }).catch(function (e) {
                sendError(r, res, typeof e == "string" ? e : e.message);
            });
            break;
    }
});
app.listen(7655, function () {
    console.log('Example app listening on port 7655!');
});
