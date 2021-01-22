"use strict";
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
var db = require("../../db");
var sero_1 = require("../../rpc/sero");
var types_1 = require("../../types/");
var constant = require("../../common/constant");
var bignumber_js_1 = require("bignumber.js");
var event_1 = require("../../event");
var utils = require("../../common/utils");
var myPool = require('../../db/mongodb');
var Index = /** @class */ (function () {
    function Index() {
        var _this = this;
        this.syncPendingTransactions = function () { return __awaiter(_this, void 0, void 0, function () {
            var txInfos, _i, txInfos_1, tx;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, sero_1.default.getFilterChangesPending()];
                    case 1:
                        txInfos = _a.sent();
                        _i = 0, txInfos_1 = txInfos;
                        _a.label = 2;
                    case 2:
                        if (!(_i < txInfos_1.length)) return [3 /*break*/, 5];
                        tx = txInfos_1[_i];
                        return [4 /*yield*/, db.sero.insertTxInfo(tx.hash, tx)];
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
    }
    Index.prototype.run = function (startNum, maxNum, repairBlockNumber) {
        return __awaiter(this, void 0, void 0, function () {
            var client, session, limit, dbNum, remoteNum, chainNum, timestampMap, start, endLimit, rest, outs_2, nils_1, updateNum, timestamp, txHashOuts, addressIns, addressOuts, addressAndTxMap, removeTxHashArray_1, addressTxs_1, txInfos_2, balanceRecords, outsMap, usedRoots_1, events_1, _i, outs_1, o, timestamp, key, tmp, Ins, entries, data, txHash, outsArr, txInfo, txReceipt, logs, _a, logs_1, log, logRet, aEntries, aNext, addressTx, txRecords, _b, balanceRecords_1, record, key, tmp, groupBalanceRecords_1, gEntries, gNext, transactionResults, e_1;
            var _this = this;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, myPool.acquire()];
                    case 1:
                        client = _c.sent();
                        session = client.startSession();
                        limit = 1;
                        _c.label = 2;
                    case 2:
                        _c.trys.push([2, 21, 22, 24]);
                        return [4 /*yield*/, db.sero.latestBlock()];
                    case 3:
                        dbNum = _c.sent();
                        return [4 /*yield*/, sero_1.default.blockNumber()];
                    case 4:
                        remoteNum = _c.sent();
                        chainNum = remoteNum - constant.THREAD_CONFIG.CONFIRM_BLOCK_NUM;
                        console.debug("SERO>>> Latest Block, remote=[" + remoteNum + "], start=[" + chainNum + "], db= [" + dbNum + "]");
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
                        // {
                        //     dbNum = 99487;
                        //     limit = 1;
                        // }
                        console.info("fetch from : " + (dbNum + 1) + ", limit: " + limit);
                        timestampMap = new Map();
                        start = dbNum + 1;
                        endLimit = limit;
                        if (repairBlockNumber) {
                            start = repairBlockNumber;
                            endLimit = 1;
                        }
                        return [4 /*yield*/, sero_1.default.getBlocksInfo(start, endLimit)];
                    case 5:
                        rest = _c.sent();
                        outs_2 = rest[0];
                        nils_1 = rest[1];
                        if (!!(outs_2 && outs_2.length > 0)) return [3 /*break*/, 8];
                        updateNum = start + endLimit > chainNum ? chainNum : start + endLimit;
                        console.log("outs is nil, update latest block num: ", updateNum);
                        return [4 /*yield*/, sero_1.default.getBlockTimestamp(updateNum)];
                    case 6:
                        timestamp = _c.sent();
                        return [4 /*yield*/, db.sero.upsertLatestBlock(updateNum, timestamp, session, client)];
                    case 7:
                        _c.sent();
                        return [2 /*return*/];
                    case 8:
                        txHashOuts = new Map();
                        addressIns = new Map();
                        addressOuts = new Map();
                        addressAndTxMap = new Map();
                        removeTxHashArray_1 = [];
                        addressTxs_1 = [];
                        txInfos_2 = [];
                        balanceRecords = [];
                        outsMap = new Map();
                        usedRoots_1 = [];
                        events_1 = [];
                        _i = 0, outs_1 = outs_2;
                        _c.label = 9;
                    case 9:
                        if (!(_i < outs_1.length)) return [3 /*break*/, 13];
                        o = outs_1[_i];
                        if (!!timestampMap.has(o.num)) return [3 /*break*/, 11];
                        return [4 /*yield*/, sero_1.default.getBlockTimestamp(o.num)];
                    case 10:
                        timestamp = _c.sent();
                        timestampMap.set(o.num, timestamp);
                        _c.label = 11;
                    case 11:
                        key = [o.address, o.txHash, o.asset.currency, o.num].join(":");
                        if (txHashOuts.has(o.txHash)) {
                            tmp = txHashOuts.get(o.txHash);
                            tmp.push(o);
                            txHashOuts.set(o.txHash, tmp);
                        }
                        else {
                            txHashOuts.set(o.txHash, [o]);
                        }
                        if (addressIns.has(key)) {
                            Ins = addressIns.get(key);
                            Ins.push(o);
                        }
                        else {
                            addressIns.set(key, [o]);
                        }
                        outsMap.set(o.root, o);
                        if (!addressAndTxMap.has(key)) {
                            addressAndTxMap.set(key, { address: o.address, txHash: o.txHash, num: o.num, currency: o.asset.currency });
                        }
                        _c.label = 12;
                    case 12:
                        _i++;
                        return [3 /*break*/, 9];
                    case 13:
                        entries = txHashOuts.entries();
                        data = entries.next();
                        _c.label = 14;
                    case 14:
                        if (!!data.done) return [3 /*break*/, 19];
                        txHash = data.value[0];
                        outsArr = data.value[1];
                        removeTxHashArray_1.push(txHash);
                        return [4 /*yield*/, sero_1.default.getTxInfo(txHash, outsArr, outsMap)];
                    case 15:
                        txInfo = _c.sent();
                        if (!txInfo) return [3 /*break*/, 18];
                        txInfo.timestamp = timestampMap.get(txInfo.num);
                        txInfo.ins && usedRoots_1.concat(txInfo.ins);
                        return [4 /*yield*/, this.pickOuts(txInfo, outsMap, addressOuts, addressAndTxMap)];
                    case 16:
                        _c.sent();
                        return [4 /*yield*/, sero_1.default.getTransactionReceipt(txInfo.txHash)];
                    case 17:
                        txReceipt = _c.sent();
                        // txInfo.fee = new BigNumber(txReceipt.gasUsed).multipliedBy(new BigNumber(txInfo.gasPrice)).toString(10)
                        txInfo.gasUsed = txReceipt.gasUsed;
                        txInfos_2.push(txInfo);
                        logs = txReceipt.logs;
                        if (logs && logs.length > 0) {
                            for (_a = 0, logs_1 = logs; _a < logs_1.length; _a++) {
                                log = logs_1[_a];
                                if (!utils.isCrossAddress(log.address)) {
                                }
                                else {
                                    logRet = event_1.default.decodeLog(txInfo.num, txInfo.txHash, log.address, log.topics, log.data);
                                    if (logRet) {
                                        events_1.push(logRet);
                                    }
                                }
                            }
                        }
                        _c.label = 18;
                    case 18:
                        data = entries.next();
                        return [3 /*break*/, 14];
                    case 19:
                        aEntries = addressAndTxMap.entries();
                        aNext = aEntries.next();
                        while (!aNext.done) {
                            addressTx = aNext.value[1];
                            addressTxs_1.push(addressTx);
                            aNext = aEntries.next();
                        }
                        //build balance records of ins
                        this.convertToBRS(addressIns, balanceRecords, types_1.TxType.IN, timestampMap);
                        //build balance records of outs
                        this.convertToBRS(addressOuts, balanceRecords, types_1.TxType.OUT, timestampMap);
                        console.log("balanceRecords", balanceRecords);
                        txRecords = new Map();
                        for (_b = 0, balanceRecords_1 = balanceRecords; _b < balanceRecords_1.length; _b++) {
                            record = balanceRecords_1[_b];
                            key = [record.address, record.txHash, record.currency, record.num].join(":");
                            if (txRecords.has(key)) {
                                tmp = txRecords.get(key);
                                tmp.amount = record.type == types_1.TxType.IN ?
                                    new bignumber_js_1.default(tmp.amount).plus(record.amount).toString(10) :
                                    new bignumber_js_1.default(tmp.amount).minus(record.amount).toString(10);
                                txRecords.set(key, tmp);
                            }
                            else {
                                txRecords.set(key, record);
                            }
                        }
                        groupBalanceRecords_1 = [];
                        gEntries = txRecords.entries();
                        gNext = gEntries.next();
                        while (!gNext.done) {
                            groupBalanceRecords_1.push(gNext.value[1]);
                            gNext = gEntries.next();
                        }
                        if (outs_2.length == 0 || addressTxs_1.length == 0 || txInfos_2.length == 0 || groupBalanceRecords_1.length == 0) {
                            throw new Error("Invalid Data ,outs = [" + outs_2.length + "] , address txs=[" + addressTxs_1.length + "], tx infos=[" + txInfos_2.length + "]  balance records=[" + balanceRecords.length + "]");
                        }
                        console.log("SERO Address txs=[" + addressTxs_1.length + "], tx infos=[" + txInfos_2.length + "]  balance records=[" + balanceRecords.length + "]");
                        return [4 /*yield*/, session.withTransaction(function () { return __awaiter(_this, void 0, void 0, function () {
                                var _i, groupBalanceRecords_2, record, updateNum, timestamp;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, db.sero.removePendingTxByHash(removeTxHashArray_1, session, client)];
                                        case 1:
                                            _a.sent();
                                            return [4 /*yield*/, db.sero.insertOuts(outs_2, session, client)];
                                        case 2:
                                            _a.sent();
                                            return [4 /*yield*/, db.sero.insertAddressTx(addressTxs_1, session, client)];
                                        case 3:
                                            _a.sent();
                                            return [4 /*yield*/, db.sero.insertTxInfos(txInfos_2, session, client)];
                                        case 4:
                                            _a.sent();
                                            return [4 /*yield*/, db.sero.insertBalanceRecord(groupBalanceRecords_1, session, client)];
                                        case 5:
                                            _a.sent();
                                            if (!(events_1 && events_1.length > 0)) return [3 /*break*/, 7];
                                            return [4 /*yield*/, db.sero.insertEvents(events_1, session, client)];
                                        case 6:
                                            _a.sent();
                                            _a.label = 7;
                                        case 7:
                                            _i = 0, groupBalanceRecords_2 = groupBalanceRecords_1;
                                            _a.label = 8;
                                        case 8:
                                            if (!(_i < groupBalanceRecords_2.length)) return [3 /*break*/, 11];
                                            record = groupBalanceRecords_2[_i];
                                            return [4 /*yield*/, db.sero.upsertBalance(record, session, client)];
                                        case 9:
                                            _a.sent();
                                            _a.label = 10;
                                        case 10:
                                            _i++;
                                            return [3 /*break*/, 8];
                                        case 11: return [4 /*yield*/, db.sero.updateOutUsed(usedRoots_1.concat(nils_1), session, client)
                                            // await db.sero.updateOutUsed(nils, session, client);
                                        ];
                                        case 12:
                                            _a.sent();
                                            updateNum = outs_2[outs_2.length - 1].num;
                                            return [4 /*yield*/, sero_1.default.getBlockTimestamp(updateNum)];
                                        case 13:
                                            timestamp = _a.sent();
                                            if (!timestamp) return [3 /*break*/, 15];
                                            return [4 /*yield*/, db.sero.upsertLatestBlock(updateNum, timestamp, session, client)];
                                        case 14:
                                            _a.sent();
                                            return [3 /*break*/, 16];
                                        case 15: throw new Error("No valid timestamp");
                                        case 16: return [2 /*return*/];
                                    }
                                });
                            }); }, constant.mongo.sero.transactionOptions)];
                    case 20:
                        transactionResults = _c.sent();
                        if (transactionResults) {
                            console.log("The sero reservation was successfully created.");
                        }
                        else {
                            console.log("The sero transaction was intentionally aborted.");
                        }
                        return [3 /*break*/, 24];
                    case 21:
                        e_1 = _c.sent();
                        console.error("The sero transaction was aborted due to an unexpected error: ", e_1);
                        return [3 /*break*/, 24];
                    case 22: return [4 /*yield*/, session.endSession()];
                    case 23:
                        _c.sent();
                        myPool.release(client);
                        return [7 /*endfinally*/];
                    case 24: return [2 /*return*/];
                }
            });
        });
    };
    Index.prototype.pickOuts = function (txInfo, outsMap, addressOuts, addressAndTxMap) {
        return __awaiter(this, void 0, void 0, function () {
            var _i, _a, d, out, dbOuts, key, tmp;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _i = 0, _a = txInfo.ins;
                        _b.label = 1;
                    case 1:
                        if (!(_i < _a.length)) return [3 /*break*/, 5];
                        d = _a[_i];
                        out = outsMap.get(d);
                        if (!!out) return [3 /*break*/, 3];
                        return [4 /*yield*/, db.sero.findOutsByRoots([d])];
                    case 2:
                        dbOuts = _b.sent();
                        if (dbOuts && dbOuts.length > 0) {
                            out = dbOuts[0];
                        }
                        _b.label = 3;
                    case 3:
                        if (out) {
                            key = [txInfo.fromAddress, txInfo.txHash, out.asset.currency, txInfo.num].join(":");
                            if (addressOuts.has(key)) {
                                tmp = addressOuts.get(key);
                                tmp.push(out);
                                addressOuts.set(key, tmp);
                            }
                            else {
                                addressOuts.set(key, [out]);
                            }
                            if (!addressAndTxMap.has(key)) {
                                addressAndTxMap.set(key, {
                                    address: txInfo.fromAddress,
                                    txHash: txInfo.txHash,
                                    num: txInfo.num,
                                    currency: out.asset.currency
                                });
                            }
                        }
                        _b.label = 4;
                    case 4:
                        _i++;
                        return [3 /*break*/, 1];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    Index.prototype.convertToBRS = function (outMap, balanceRecords, type, timestampMap) {
        var bEntries = outMap.entries();
        var bNext = bEntries.next();
        while (!bNext.done) {
            var key = bNext.value[0];
            var address = key.split(":")[0];
            var txHash = key.split(":")[1];
            var currency = key.split(":")[2];
            var num = key.split(":")[3];
            var datas = bNext.value[1];
            var insMap = new Map();
            for (var _i = 0, datas_1 = datas; _i < datas_1.length; _i++) {
                var o = datas_1[_i];
                var k = [o.txHash, o.address, o.asset.currency].join(":");
                if (insMap.has(k)) {
                    var tmp = insMap.get(k);
                    tmp.push(o);
                    insMap.set(k, tmp);
                }
                else {
                    insMap.set(k, [o]);
                }
            }
            var iEntries = insMap.entries();
            var iNext = iEntries.next();
            while (!iNext.done) {
                var outInfo = iNext.value[1];
                var amountIn = new bignumber_js_1.default(0);
                for (var _a = 0, outInfo_1 = outInfo; _a < outInfo_1.length; _a++) {
                    var o = outInfo_1[_a];
                    if (!o.asset) {
                        console.debug("for error outInfo>>>", outInfo);
                    }
                    amountIn = amountIn.plus(new bignumber_js_1.default(o.asset.value));
                }
                balanceRecords.push({
                    address: address,
                    currency: currency,
                    amount: amountIn.toString(10),
                    type: type,
                    txHash: txHash,
                    num: parseInt(num),
                    timestamp: timestampMap.get(parseInt(num))
                });
                iNext = iEntries.next();
            }
            bNext = bEntries.next();
        }
    };
    return Index;
}());
exports.default = Index;
