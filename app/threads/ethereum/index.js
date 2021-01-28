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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var db = require("../../db");
var eth_1 = require("../../rpc/eth");
var types_1 = require("../../types");
var constant = require("../../common/constant");
var utils = require("../../common/utils");
var bignumber_js_1 = require("bignumber.js");
var ierc20_1 = require("../../api/tokens/ierc20");
var event_1 = require("../../event");
var Web3 = require('web3');
var myPool = require('../../db/mongodb');
var Index = /** @class */ (function () {
    function Index() {
        var _this = this;
        this.syncPendingTransactions = function () { return __awaiter(_this, void 0, void 0, function () {
            var txInfos, _i, txInfos_1, tx;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, eth_1.default.getFilterChangesPending()];
                    case 1:
                        txInfos = _a.sent();
                        _i = 0, txInfos_1 = txInfos;
                        _a.label = 2;
                    case 2:
                        if (!(_i < txInfos_1.length)) return [3 /*break*/, 5];
                        tx = txInfos_1[_i];
                        return [4 /*yield*/, db.eth.insertTxInfo(tx.hash, tx)];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4:
                        _i++;
                        return [3 /*break*/, 2];
                    case 5: return [2 /*return*/];
                }
            });
        }); };
        this.syncTransactions = function (startNum, maxNum) { return __awaiter(_this, void 0, void 0, function () {
            var client, session, limit, dbNum, remoteNum, chainNum, start, end, addressTxs_1, txInfoMap, txInfos_2, balanceRecords_1, balanceMap_1, removeTxHashArray_1, events_1, i, block, transactions, _i, transactions_1, t, txInfo, txReceipt, logs, _a, logs_1, log, index, txInfo, token, logRet, updateNum, t, transactionResults, e_1;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, myPool.acquire()];
                    case 1:
                        client = _b.sent();
                        session = client.startSession();
                        limit = 1;
                        _b.label = 2;
                    case 2:
                        _b.trys.push([2, 26, 27, 29]);
                        return [4 /*yield*/, db.eth.latestBlock()];
                    case 3:
                        dbNum = _b.sent();
                        return [4 /*yield*/, eth_1.default.blockNumber()];
                    case 4:
                        remoteNum = _b.sent();
                        chainNum = remoteNum - constant.THREAD_CONFIG.CONFIRM_BLOCK_NUM;
                        console.info("ETH Thread>>> remote=[" + remoteNum + "], start=[" + chainNum + "], db=[" + dbNum + "]");
                        if (!dbNum) {
                            dbNum = startNum;
                        }
                        else {
                            if (!chainNum) {
                                return [2 /*return*/];
                            }
                            if (dbNum >= chainNum) {
                                return [2 /*return*/];
                            }
                        }
                        limit = chainNum - dbNum + 1;
                        if (limit > maxNum) {
                            limit = maxNum;
                        }
                        start = dbNum + 1;
                        end = dbNum + limit;
                        console.info("ETH Thread>>> limit=[" + limit + "], start=[" + start + "], end=[" + end + "]");
                        addressTxs_1 = [];
                        txInfoMap = new Map();
                        txInfos_2 = [];
                        balanceRecords_1 = [];
                        balanceMap_1 = new Map();
                        removeTxHashArray_1 = [];
                        events_1 = [];
                        i = start;
                        _b.label = 5;
                    case 5:
                        if (!(i <= end)) return [3 /*break*/, 13];
                        return [4 /*yield*/, eth_1.default.getBlockByNum(i)];
                    case 6:
                        block = _b.sent();
                        if (!block) {
                            return [3 /*break*/, 12];
                        }
                        transactions = block.transactions;
                        _i = 0, transactions_1 = transactions;
                        _b.label = 7;
                    case 7:
                        if (!(_i < transactions_1.length)) return [3 /*break*/, 12];
                        t = transactions_1[_i];
                        removeTxHashArray_1.push(t.hash);
                        this.addTxAddress(t, addressTxs_1);
                        txInfo = this.genTxInfo(t, block);
                        return [4 /*yield*/, this.setBalanceMap(t.from, balanceMap_1, "ETH")];
                    case 8:
                        _b.sent();
                        return [4 /*yield*/, this.setBalanceMap(t.to, balanceMap_1, "ETH")];
                    case 9:
                        _b.sent();
                        this.setBalanceRecords(t, balanceRecords_1, txInfo);
                        return [4 /*yield*/, eth_1.default.getTransactionReceipt(t.hash)
                            // console.log("eth block sync>>> ",t.hash)
                            // const logs: Array<Log> = txReceipt.logs;
                        ];
                    case 10:
                        txReceipt = _b.sent();
                        // console.log("eth block sync>>> ",t.hash)
                        // const logs: Array<Log> = txReceipt.logs;
                        txInfo.fee = new bignumber_js_1.default(txReceipt.gasUsed).multipliedBy(new bignumber_js_1.default(t.gasPrice)).toString(10);
                        txInfo.gasUsed = txReceipt.gasUsed;
                        txInfos_2.push(txInfo);
                        txInfoMap.set(txInfo.txHash, txInfos_2.length - 1);
                        if (balanceRecords_1.length == 0) {
                            this.setBalanceRecordDefault(t, balanceRecords_1, txInfo);
                        }
                        _b.label = 11;
                    case 11:
                        _i++;
                        return [3 /*break*/, 7];
                    case 12:
                        i++;
                        return [3 /*break*/, 5];
                    case 13: return [4 /*yield*/, eth_1.default.getLogs(start, end)];
                    case 14:
                        logs = _b.sent();
                        console.log("listener event>> ", logs && logs.length);
                        if (!(logs && logs.length > 0)) return [3 /*break*/, 20];
                        _a = 0, logs_1 = logs;
                        _b.label = 15;
                    case 15:
                        if (!(_a < logs_1.length)) return [3 /*break*/, 20];
                        log = logs_1[_a];
                        index = txInfoMap.get(log.transactionHash);
                        txInfo = txInfos_2[index];
                        token = utils.isErc20Address(log.address);
                        if (!!token) return [3 /*break*/, 16];
                        return [3 /*break*/, 18];
                    case 16: return [4 /*yield*/, this.handelErc20Event(log, balanceMap_1, token, addressTxs_1, balanceRecords_1, txInfo)];
                    case 17:
                        _b.sent();
                        _b.label = 18;
                    case 18:
                        if (!utils.isCrossAddress(log.address)) {
                        }
                        else {
                            logRet = event_1.default.decodeLog(txInfo.num, txInfo.txHash, log.address, log.topics, log.data);
                            if (logRet) {
                                events_1.push(logRet);
                            }
                        }
                        _b.label = 19;
                    case 19:
                        _a++;
                        return [3 /*break*/, 15];
                    case 20:
                        console.log("Address txs=[" + addressTxs_1.length + "], tx infos=[" + txInfoMap.size + "]  balance records=[" + balanceRecords_1.length + "]");
                        if (!(addressTxs_1.length == 0 || txInfoMap.size == 0 || balanceRecords_1.length == 0)) return [3 /*break*/, 24];
                        updateNum = limit + dbNum > chainNum ? chainNum : limit + dbNum;
                        return [4 /*yield*/, eth_1.default.getBlockByNum(updateNum)];
                    case 21:
                        t = _b.sent();
                        if (!t) return [3 /*break*/, 23];
                        return [4 /*yield*/, db.eth.upsertLatestBlock(updateNum, utils.toNum(t.timestamp), session, client)];
                    case 22:
                        _b.sent();
                        _b.label = 23;
                    case 23: return [2 /*return*/];
                    case 24: return [4 /*yield*/, session.withTransaction(function () { return __awaiter(_this, void 0, void 0, function () {
                            var blEntries, blNext, updateNum, timestamp, t;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, db.eth.removePendingTxByHash(removeTxHashArray_1, session, client)];
                                    case 1:
                                        _a.sent();
                                        return [4 /*yield*/, db.eth.insertAddressTx(addressTxs_1, session, client)];
                                    case 2:
                                        _a.sent();
                                        return [4 /*yield*/, db.eth.insertTxInfos(txInfos_2, session, client)];
                                    case 3:
                                        _a.sent();
                                        return [4 /*yield*/, db.eth.insertBalanceRecord(balanceRecords_1, session, client)];
                                    case 4:
                                        _a.sent();
                                        if (!(events_1 && events_1.length > 0)) return [3 /*break*/, 6];
                                        return [4 /*yield*/, db.eth.insertEvents(events_1, session, client)];
                                    case 5:
                                        _a.sent();
                                        _a.label = 6;
                                    case 6:
                                        blEntries = balanceMap_1.entries();
                                        blNext = blEntries.next();
                                        _a.label = 7;
                                    case 7:
                                        if (!!blNext.done) return [3 /*break*/, 9];
                                        return [4 /*yield*/, db.eth.updateBalance(blNext.value[1], session, client)];
                                    case 8:
                                        _a.sent();
                                        blNext = blEntries.next();
                                        return [3 /*break*/, 7];
                                    case 9:
                                        updateNum = txInfos_2[txInfos_2.length - 1];
                                        ;
                                        if (!updateNum) return [3 /*break*/, 13];
                                        timestamp = updateNum.timestamp;
                                        if (!!timestamp) return [3 /*break*/, 11];
                                        return [4 /*yield*/, eth_1.default.getBlockByNum(updateNum.num)];
                                    case 10:
                                        t = _a.sent();
                                        timestamp = t.timestamp;
                                        _a.label = 11;
                                    case 11: return [4 /*yield*/, db.eth.upsertLatestBlock(updateNum.num, timestamp, session, client)];
                                    case 12:
                                        _a.sent();
                                        _a.label = 13;
                                    case 13: return [2 /*return*/];
                                }
                            });
                        }); }, constant.mongo.eth.transactionOptions)];
                    case 25:
                        transactionResults = _b.sent();
                        if (transactionResults) {
                            console.log("ETH>>> The reservation was successfully created.");
                        }
                        else {
                            console.log("ETH>>> The transaction was intentionally aborted.");
                        }
                        return [3 /*break*/, 29];
                    case 26:
                        e_1 = _b.sent();
                        console.error("ETH>>> The transaction was aborted due to an unexpected error: ", e_1);
                        return [3 /*break*/, 29];
                    case 27: return [4 /*yield*/, session.endSession()];
                    case 28:
                        _b.sent();
                        myPool.release(client);
                        return [7 /*endfinally*/];
                    case 29: return [2 /*return*/];
                }
            });
        }); };
        this.ethWeb3 = new Web3(constant.ETH_HOST);
    }
    Index.prototype.genTxInfo = function (t, block) {
        var txInfo = {
            fromAddress: t.from.toLowerCase(),
            toAddress: [t.to && t.to.toLowerCase()],
            gas: t.gas,
            gasUsed: t.gas,
            gasPrice: t.gasPrice,
            fee: new bignumber_js_1.default(t.gas).multipliedBy(new bignumber_js_1.default(t.gasPrice)).toString(10),
            feeCy: "ETH",
            txHash: t.hash,
            num: utils.toNum(t.blockNumber),
            outs: [],
            ins: [],
            transactionIndex: t.transactionIndex,
            contract: null,
            timestamp: parseInt(block.timestamp),
        };
        return txInfo;
    };
    Index.prototype.addTxAddress = function (t, addressTxs) {
        t.from && addressTxs.push({
            address: t.from.toLowerCase(),
            txHash: t.hash,
            num: utils.toNum(t.blockNumber),
            currency: "ETH"
        });
        t.to && addressTxs.push({
            address: t.to.toLowerCase(),
            txHash: t.hash,
            num: utils.toNum(t.blockNumber),
            currency: "ETH"
        });
    };
    Index.prototype.setBalanceRecordDefault = function (t, balanceRecords, txInfo) {
        if (t.from) {
            balanceRecords.push({
                address: t.from.toLowerCase(),
                currency: "ETH",
                amount: new bignumber_js_1.default(t.value).multipliedBy(-1).toString(10),
                type: types_1.TxType.OUT,
                txHash: txInfo.txHash,
                num: txInfo.num,
                timestamp: txInfo.timestamp
            });
        }
        if (t.to) {
            balanceRecords.push({
                address: t.to.toLowerCase(),
                currency: "ETH",
                amount: t.value,
                type: types_1.TxType.IN,
                txHash: txInfo.txHash,
                num: txInfo.num,
                timestamp: txInfo.timestamp
            });
        }
    };
    Index.prototype.setBalanceRecords = function (t, balanceRecords, txInfo) {
        if (t.from) {
            balanceRecords.push({
                address: t.from.toLowerCase(),
                currency: "ETH",
                amount: new bignumber_js_1.default(t.value).multipliedBy(-1).toString(10),
                type: types_1.TxType.OUT,
                txHash: txInfo.txHash,
                num: txInfo.num,
                timestamp: txInfo.timestamp
            });
        }
        if (t.to) {
            balanceRecords.push({
                address: t.to.toLowerCase(),
                currency: "ETH",
                amount: new bignumber_js_1.default(t.value).toString(10),
                type: types_1.TxType.IN,
                txHash: txInfo.txHash,
                num: txInfo.num,
                timestamp: txInfo.timestamp
            });
        }
    };
    Index.prototype.handelErc20Event = function (log, balanceMap, key, addressTxs, balanceRecords, txInfo) {
        return __awaiter(this, void 0, void 0, function () {
            var ierc20, e, e, logRet, i, record;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        ierc20 = new ierc20_1.default(log.address);
                        return [4 /*yield*/, this.setBalanceMap(txInfo.fromAddress, balanceMap, key, ierc20)];
                    case 1:
                        _a.sent();
                        if (!(ierc20.encodeEventSignature("Transfer") === log.topics[0])) return [3 /*break*/, 4];
                        e = ierc20.decodeTransferLog(log.data, log.topics);
                        e.from && addressTxs.push({
                            address: e.from.toLowerCase(),
                            txHash: txInfo.txHash,
                            num: txInfo.num,
                            currency: key
                        });
                        e.to && addressTxs.push({
                            address: e.to.toLowerCase(),
                            txHash: txInfo.txHash,
                            num: txInfo.num,
                            currency: key
                        });
                        return [4 /*yield*/, this.setBalanceMap(e.from.toLowerCase(), balanceMap, key, ierc20)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.setBalanceMap(e.to.toLowerCase(), balanceMap, key, ierc20)];
                    case 3:
                        _a.sent();
                        if (e.from) {
                            balanceRecords.push({
                                address: e.from.toLowerCase(),
                                currency: key,
                                amount: new bignumber_js_1.default(e.value).multipliedBy(-1).toString(10),
                                type: types_1.TxType.OUT,
                                txHash: txInfo.txHash,
                                num: txInfo.num,
                                timestamp: txInfo.timestamp
                            });
                        }
                        if (e.to) {
                            balanceRecords.push({
                                address: e.to.toLowerCase(),
                                currency: key,
                                amount: e.value,
                                type: types_1.TxType.IN,
                                txHash: txInfo.txHash,
                                num: txInfo.num,
                                timestamp: txInfo.timestamp
                            });
                        }
                        return [3 /*break*/, 8];
                    case 4:
                        if (!(ierc20.encodeEventSignature("Approval") === log.topics[0])) return [3 /*break*/, 7];
                        e = ierc20.decodeApprovalLog(log.data, log.topics);
                        return [4 /*yield*/, this.setBalanceMap(e.owner, balanceMap, key, ierc20)];
                    case 5:
                        _a.sent();
                        return [4 /*yield*/, this.setBalanceMap(e.spender, balanceMap, key, ierc20)];
                    case 6:
                        _a.sent();
                        return [3 /*break*/, 8];
                    case 7:
                        if (key == "WETH") {
                            logRet = event_1.default.decodeLog(txInfo.num, txInfo.txHash, log.address, log.topics, log.data);
                            console.log("logRet>> ", logRet);
                            if (logRet.eventName == types_1.EVENT_TYPE.WETH_DEPOSIT) {
                                balanceRecords.push({
                                    address: logRet.event.dst.toLowerCase(),
                                    currency: key,
                                    amount: new bignumber_js_1.default(logRet.event.wad).toString(10),
                                    type: types_1.TxType.IN,
                                    txHash: txInfo.txHash,
                                    num: txInfo.num,
                                    timestamp: txInfo.timestamp
                                });
                            }
                            else if (logRet.eventName == types_1.EVENT_TYPE.WETH_WITHDRAW) {
                                // balanceRecords.splice()
                                for (i = 0; i < balanceRecords.length; i++) {
                                    record = balanceRecords[i];
                                    if (record.address == logRet.event.src.toLowerCase()) {
                                        balanceRecords.splice(i, 1, {
                                            address: logRet.event.src.toLowerCase(),
                                            currency: "ETH",
                                            amount: new bignumber_js_1.default(logRet.event.wad).toString(10),
                                            type: types_1.TxType.IN,
                                            txHash: txInfo.txHash,
                                            num: txInfo.num,
                                            timestamp: txInfo.timestamp
                                        });
                                        break;
                                    }
                                }
                                balanceRecords.push({
                                    address: logRet.event.src.toLowerCase(),
                                    currency: key,
                                    amount: new bignumber_js_1.default(logRet.event.wad).multipliedBy(-1).toString(10),
                                    type: types_1.TxType.OUT,
                                    txHash: txInfo.txHash,
                                    num: txInfo.num,
                                    timestamp: txInfo.timestamp
                                });
                            }
                        }
                        _a.label = 8;
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    Index.prototype.setBalanceMap = function (address, balanceMap, cy, ierc20) {
        return __awaiter(this, void 0, void 0, function () {
            var balance;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!address) {
                            return [2 /*return*/];
                        }
                        if (!ierc20) return [3 /*break*/, 2];
                        return [4 /*yield*/, ierc20.balanceOf(address)];
                    case 1:
                        balance = _a.sent();
                        return [3 /*break*/, 4];
                    case 2: return [4 /*yield*/, eth_1.default.getBalance(address)];
                    case 3:
                        balance = _a.sent();
                        cy = "ETH";
                        _a.label = 4;
                    case 4:
                        balanceMap.set([address, cy].join(":"), {
                            address: address.toLowerCase(),
                            currency: cy,
                            totalIn: balance.toString(10),
                            totalOut: "0",
                            totalFrozen: "0"
                        });
                        return [2 /*return*/];
                }
            });
        });
    };
    return Index;
}());
exports.default = Index;
//# sourceMappingURL=index.js.map