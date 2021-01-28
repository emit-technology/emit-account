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
var tron_1 = require("../../event/tron");
var constant = require("../../common/constant");
var constant_1 = require("../../common/constant");
var myPool = require('../../db/mongodb');
var TronEvent = /** @class */ (function () {
    function TronEvent() {
        var _this = this;
        this.runByEventApi = function () { return __awaiter(_this, void 0, void 0, function () {
            var client, session, rest_1, transactionResults, e_1;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, myPool.acquire()];
                    case 1:
                        client = _a.sent();
                        session = client.startSession();
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 5, 6, 8]);
                        return [4 /*yield*/, tron_1.default.queryByEventApi()];
                    case 3:
                        rest_1 = _a.sent();
                        console.log(rest_1, "restProposal");
                        return [4 /*yield*/, session.withTransaction(function () { return __awaiter(_this, void 0, void 0, function () {
                                var tmp, _i, rest_2, d, r;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            tmp = [];
                                            if (!(rest_1 && rest_1.length > 0)) return [3 /*break*/, 6];
                                            _i = 0, rest_2 = rest_1;
                                            _a.label = 1;
                                        case 1:
                                            if (!(_i < rest_2.length)) return [3 /*break*/, 4];
                                            d = rest_2[_i];
                                            return [4 /*yield*/, db.tron.eventExist(d.txHash)];
                                        case 2:
                                            r = _a.sent();
                                            if (!r) {
                                                tmp.push(d);
                                            }
                                            _a.label = 3;
                                        case 3:
                                            _i++;
                                            return [3 /*break*/, 1];
                                        case 4:
                                            console.log("tmp");
                                            if (!(tmp.length > 0)) return [3 /*break*/, 6];
                                            return [4 /*yield*/, db.tron.insertEvents(tmp, session, client)];
                                        case 5:
                                            _a.sent();
                                            _a.label = 6;
                                        case 6: return [2 /*return*/];
                                    }
                                });
                            }); }, constant.mongo.tron.transactionOptions)];
                    case 4:
                        transactionResults = _a.sent();
                        if (transactionResults) {
                            console.log("TRON>>> The reservation was successfully created.");
                        }
                        else {
                            console.log("TRON>>> The transaction was intentionally aborted.");
                        }
                        return [3 /*break*/, 8];
                    case 5:
                        e_1 = _a.sent();
                        console.error("The TRON was aborted due to an unexpected error: ", e_1);
                        return [3 /*break*/, 8];
                    case 6: return [4 /*yield*/, session.endSession()];
                    case 7:
                        _a.sent();
                        myPool.release(client);
                        return [7 /*endfinally*/];
                    case 8: return [2 /*return*/];
                }
            });
        }); };
        this.runByNum = function () { return __awaiter(_this, void 0, void 0, function () {
            var client, session, rest, num_1, restProposal_1, transactionResults, e_2;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, myPool.acquire()];
                    case 1:
                        client = _a.sent();
                        session = client.startSession();
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 6, 7, 9]);
                        return [4 /*yield*/, db.tron.latestBlock()];
                    case 3:
                        rest = _a.sent();
                        num_1 = rest ? rest + 1 : constant_1.THREAD_CONFIG.START_AT.TRON;
                        return [4 /*yield*/, tron_1.default.queryByNum(num_1)];
                    case 4:
                        restProposal_1 = _a.sent();
                        console.log(restProposal_1, "restProposal");
                        return [4 /*yield*/, session.withTransaction(function () { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            if (!(restProposal_1 && restProposal_1.length > 0)) return [3 /*break*/, 2];
                                            return [4 /*yield*/, db.tron.insertEvents(restProposal_1, session, client)];
                                        case 1:
                                            _a.sent();
                                            _a.label = 2;
                                        case 2: return [4 /*yield*/, db.tron.upsertLatestBlock(num_1, Date.now(), session, client)];
                                        case 3:
                                            _a.sent();
                                            return [2 /*return*/];
                                    }
                                });
                            }); }, constant.mongo.tron.transactionOptions)];
                    case 5:
                        transactionResults = _a.sent();
                        if (transactionResults) {
                            console.log("TRON>>> The reservation was successfully created.");
                        }
                        else {
                            console.log("TRON>>> The transaction was intentionally aborted.");
                        }
                        return [3 /*break*/, 9];
                    case 6:
                        e_2 = _a.sent();
                        console.error("The TRON was aborted due to an unexpected error: ", e_2);
                        return [3 /*break*/, 9];
                    case 7: return [4 /*yield*/, session.endSession()];
                    case 8:
                        _a.sent();
                        myPool.release(client);
                        return [7 /*endfinally*/];
                    case 9: return [2 /*return*/];
                }
            });
        }); };
    }
    return TronEvent;
}());
exports.default = TronEvent;
//# sourceMappingURL=event.js.map