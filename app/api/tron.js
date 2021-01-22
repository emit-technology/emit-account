"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
var index_1 = require("./index");
var types_1 = require("../types");
var constant = require("../common/constant");
var bignumber_js_1 = require("bignumber.js");
var db = require("../db");
var TronWeb = require('tronweb');
var TronGrid = require('trongrid');
var HttpProvider = TronWeb.providers.HttpProvider;
var fullNode = new HttpProvider(constant.TRON_API_HOST.fullNode);
var solidityNode = new HttpProvider(constant.TRON_API_HOST.fullNode);
var eventServer = new HttpProvider(constant.TRON_API_HOST.fullNode);
var privateKey = "3481E79956D4BD95F358AC96D151C976392FC4E3FC132F78A847906DE588C145";
var tronWeb = new TronWeb(fullNode, solidityNode, eventServer, privateKey);
var tronGrid = new TronGrid(tronWeb);
var TronApi = /** @class */ (function (_super) {
    __extends(TronApi, _super);
    function TronApi() {
        var _this = _super.call(this, db.eth) || this;
        _this.getBalance = function (address, cy) { return __awaiter(_this, void 0, void 0, function () {
            var rest, balance, instance, balanceUSDT;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, tronWeb.trx.getAccount(address)];
                    case 1:
                        rest = _a.sent();
                        balance = {};
                        balance["TRON"] = rest.balance;
                        return [4 /*yield*/, tronWeb.contract().at(constant.TRC20_ADDRESS.USDT)];
                    case 2:
                        instance = _a.sent();
                        return [4 /*yield*/, instance.balanceOf(address).call()];
                    case 3:
                        balanceUSDT = _a.sent();
                        balance["USDT"] = new bignumber_js_1.default(balanceUSDT._hex).toString(10);
                        return [2 /*return*/, Promise.resolve(balance)];
                }
            });
        }); };
        _this.getTxInfo = function (txHash) { return __awaiter(_this, void 0, void 0, function () {
            var t, tx;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, tronWeb.trx.getTransactionInfo(txHash)];
                    case 1:
                        t = _a.sent();
                        tx = {
                            txHash: t.transaction_id,
                            fromAddress: t.from,
                            toAddress: [t.to],
                            gas: "0x0",
                            gasUsed: "0x0",
                            gasPrice: "0x0",
                            feeCy: "TRX",
                            fee: "0x0",
                            num: 0,
                            outs: [],
                            ins: [],
                            transactionIndex: "0x0",
                            timestamp: t.block_timestamp,
                        };
                        return [2 /*return*/, Promise.resolve(tx)];
                }
            });
        }); };
        _this.getTxs = function (address, currency, pageSize, pageNo, fingerprint) { return __awaiter(_this, void 0, void 0, function () {
            var txArr, rest, _i, rest_1, t, balanceRecord, rest, _a, rest_2, t, from, to, value, c, balanceRecord, ret;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        txArr = [];
                        if (!(currency == "USDT")) return [3 /*break*/, 2];
                        return [4 /*yield*/, tronGrid.account.getTrc20Transactions(address, {
                                limit: pageSize,
                                fingerprint: fingerprint,
                                contract_address: constant.TRC20_ADDRESS.USDT
                            })];
                    case 1:
                        rest = _b.sent();
                        for (_i = 0, rest_1 = rest; _i < rest_1.length; _i++) {
                            t = rest_1[_i];
                            balanceRecord = {
                                address: t.from,
                                currency: "USDT",
                                amount: address == t.from ? new bignumber_js_1.default(t.value).multipliedBy(-1).toString(10) : t.value,
                                type: address == t.from ? types_1.TxType.OUT : types_1.TxType.IN,
                                txHash: t.transaction_id,
                                num: 0,
                                timestamp: t.block_timestamp,
                            };
                            txArr.push(balanceRecord);
                        }
                        return [3 /*break*/, 4];
                    case 2: return [4 /*yield*/, tronGrid.account.getTransactions(address, {
                            limit: pageSize,
                            fingerprint: fingerprint
                        })
                        /**
                         * TransferContract
                         ● TransferAssetContract
                         ● CreateSmartContract
                         ● TriggerSmartContract
                         */
                    ];
                    case 3:
                        rest = _b.sent();
                        /**
                         * TransferContract
                         ● TransferAssetContract
                         ● CreateSmartContract
                         ● TriggerSmartContract
                         */
                        for (_a = 0, rest_2 = rest; _a < rest_2.length; _a++) {
                            t = rest_2[_a];
                            from = "";
                            to = "";
                            value = "";
                            c = t.raw_data.contract;
                            if ("TransferContract" == c.type) {
                                from = c.parameter.value.owner_address;
                                to = c.parameter.value.to_address;
                                value = c.parameter.value.amount;
                            }
                            else if ("TransferAssetContract" == c.type) {
                                from = c.parameter.value.owner_address;
                                to = c.parameter.value.to_address;
                                value = c.parameter.value.amount;
                                //Currency
                            }
                            else if ("CreateSmartContract" == c.type) {
                            }
                            else if ("TriggerSmartContract" == c.type) {
                                from = c.parameter.value.owner_address;
                                to = c.parameter.value.contract_address;
                                value = "0x0";
                            }
                            balanceRecord = {
                                address: address,
                                currency: "TRX",
                                amount: address == from ? new bignumber_js_1.default(t.value).multipliedBy(-1).toString(10) : t.value,
                                type: address == from ? types_1.TxType.OUT : types_1.TxType.IN,
                                txHash: t.txID,
                                num: t.blockNumber,
                                timestamp: t.block_timestamp,
                            };
                            txArr.push(balanceRecord);
                        }
                        _b.label = 4;
                    case 4:
                        ret = {
                            txs: txArr,
                            pageNo: pageNo,
                            pageSize: pageSize
                        };
                        return [2 /*return*/, Promise.resolve(ret)];
                }
            });
        }); };
        _this.countPendingTx = function (address, currency) { return __awaiter(_this, void 0, void 0, function () {
            var rest;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.db.countPendingTx(address, currency)];
                    case 1:
                        rest = _a.sent();
                        return [2 /*return*/, Promise.resolve(rest)];
                }
            });
        }); };
        _this.getBalanceRecords = function (address, currency, hash, pageSize, pageNo) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getTxs(address, currency, pageSize, pageNo)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        }); };
        _this.getEvents = function (txHash, depositNonce) { return __awaiter(_this, void 0, void 0, function () {
            var retn;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.db.queryEvents(txHash, depositNonce)];
                    case 1:
                        retn = _a.sent();
                        return [2 /*return*/, Promise.resolve(retn)];
                }
            });
        }); };
        _this.getAppVersion = function (tag, versionNum) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.db.getAppVersion(tag, versionNum)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        }); };
        return _this;
    }
    TronApi.prototype.commitTx = function (tx, txInfo) {
        return Promise.resolve(undefined);
    };
    TronApi.prototype.genParams = function (txPrams) {
        return Promise.resolve(undefined);
    };
    TronApi.prototype.proxyPost = function (method, params) {
        return Promise.resolve(undefined);
    };
    return TronApi;
}(index_1.Api));
exports.default = TronApi;
