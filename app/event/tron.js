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
var tron_1 = require("../api/tron");
var constant = require("../common/constant");
var constant_1 = require("../common/constant");
var Tron = /** @class */ (function () {
    function Tron() {
        var _this = this;
        this.queryByEventApi = function () { return __awaiter(_this, void 0, void 0, function () {
            var option, rests, result, _i, rests_1, rest, ret;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        option = {
                            // eventName:"ProposalEvent",
                            size: constant_1.THREAD_CONFIG.LIMIT.TRON,
                        };
                        return [4 /*yield*/, tron_1.tronWeb.getEventResult(constant.CROSS_ADDRESS.TRON, option)];
                    case 1:
                        rests = _a.sent();
                        result = [];
                        if (rests && rests.length > 0) {
                            for (_i = 0, rests_1 = rests; _i < rests_1.length; _i++) {
                                rest = rests_1[_i];
                                ret = {
                                    num: rest.block,
                                    txHash: rest.transaction,
                                    contractAddress: rest.contract,
                                    eventName: rest.name,
                                    event: rest.result,
                                    timestamp: rest.timestamp
                                };
                                result.push(ret);
                            }
                        }
                        return [2 /*return*/, result];
                }
            });
        }); };
        this.queryByNum = function (num) { return __awaiter(_this, void 0, void 0, function () {
            var option1, option2, rest1, rest2, result, rests, _i, rests_2, rest, ret;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        option1 = {
                            eventName: "Deposit",
                            blockNumber: num
                        };
                        option2 = {
                            eventName: "ProposalEvent",
                            blockNumber: num
                        };
                        console.log("option>>", option1, option2);
                        return [4 /*yield*/, tron_1.tronWeb.getEventResult(constant.CROSS_ADDRESS.TRON, option1)];
                    case 1:
                        rest1 = _a.sent();
                        return [4 /*yield*/, tron_1.tronWeb.getEventResult(constant.CROSS_ADDRESS.TRON, option2)];
                    case 2:
                        rest2 = _a.sent();
                        result = [];
                        rests = rest1.concat(rest2);
                        console.log("queryDeposit>>>> ", rests);
                        if (rest1 && rests.length > 0) {
                            for (_i = 0, rests_2 = rests; _i < rests_2.length; _i++) {
                                rest = rests_2[_i];
                                ret = {
                                    num: rest.block,
                                    txHash: rest.transaction,
                                    contractAddress: rest.contract,
                                    eventName: rest.name,
                                    event: rest.result,
                                    timestamp: rest.timestamp
                                };
                                result.push(ret);
                            }
                        }
                        return [2 /*return*/, result];
                }
            });
        }); };
    }
    return Tron;
}());
var tronEvent = new Tron();
exports.default = tronEvent;
//# sourceMappingURL=tron.js.map