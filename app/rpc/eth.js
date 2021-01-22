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
var index_1 = require("./index");
var constant = require("../common/constant");
var bignumber_js_1 = require("bignumber.js");
var utils = require("../common/utils");
var event_1 = require("../event");
var types_1 = require("../../../emit-wallet/src/types");
var Web3 = require('web3');
var web3 = new Web3(constant.ETH_HOST);
var EthRpc = /** @class */ (function (_super) {
    __extends(EthRpc, _super);
    function EthRpc() {
        var _this = _super.call(this, constant.ETH_HOST) || this;
        _this.pendingFilterId = "";
        _this.blockNumber = function () { return __awaiter(_this, void 0, void 0, function () {
            var rest;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.post("eth_blockNumber", [])];
                    case 1:
                        rest = _a.sent();
                        return [2 /*return*/, new bignumber_js_1.default(rest).toNumber()];
                }
            });
        }); };
        _this.getBlockByNum = function (num) { return __awaiter(_this, void 0, void 0, function () {
            var block;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.post("eth_getBlockByNumber", [utils.toHex(num), true])];
                    case 1:
                        block = _a.sent();
                        return [2 /*return*/, block];
                }
            });
        }); };
        _this.getBalance = function (address) { return __awaiter(_this, void 0, void 0, function () {
            var rest;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.post("eth_getBalance", [address, "latest"])];
                    case 1:
                        rest = _a.sent();
                        return [2 /*return*/, new bignumber_js_1.default(rest)];
                }
            });
        }); };
        _this.getTokenBalance = function (address, ierc20) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, ierc20.balanceOf(address)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        }); };
        _this.getTransactionReceipt = function (txHash) { return __awaiter(_this, void 0, void 0, function () {
            var rest;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.post("eth_getTransactionReceipt", [txHash])];
                    case 1:
                        rest = _a.sent();
                        return [2 /*return*/, Promise.resolve(rest)];
                }
            });
        }); };
        _this.sendRawTransaction = function (data) { return __awaiter(_this, void 0, void 0, function () {
            var hash;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.post("eth_sendRawTransaction", [data])];
                    case 1:
                        hash = _a.sent();
                        return [2 /*return*/, Promise.resolve(hash)];
                }
            });
        }); };
        _this.getLogs = function (from, to) { return __awaiter(_this, void 0, void 0, function () {
            var keys, addresses, topics, _i, keys_1, key, _a, EVENT_ABI_CONFIG_1, conf, params, data;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        keys = Object.keys(constant.TOKEN_ADDRESS);
                        addresses = [];
                        topics = [];
                        for (_i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
                            key = keys_1[_i];
                            addresses.push(constant.TOKEN_ADDRESS[key]);
                        }
                        addresses.push(constant.CROSS_ADDRESS.ETH);
                        for (_a = 0, EVENT_ABI_CONFIG_1 = event_1.EVENT_ABI_CONFIG; _a < EVENT_ABI_CONFIG_1.length; _a++) {
                            conf = EVENT_ABI_CONFIG_1[_a];
                            topics.push(web3.eth.abi.encodeEventSignature(conf.abi));
                        }
                        params = [{
                                fromBlock: utils.toHex(from),
                                toBlock: utils.toHex(to),
                                address: addresses,
                                topics: [topics]
                            }];
                        return [4 /*yield*/, this.post("eth_getLogs", params)];
                    case 1:
                        data = _b.sent();
                        return [2 /*return*/, Promise.resolve(data)];
                }
            });
        }); };
        _this.getFilterChangesPending = function () { return __awaiter(_this, void 0, void 0, function () {
            var _a, data, txArray, _i, data_1, hash, tx;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!!this.pendingFilterId) return [3 /*break*/, 2];
                        _a = this;
                        return [4 /*yield*/, this.post("eth_newPendingTransactionFilter", [])];
                    case 1:
                        _a.pendingFilterId = _b.sent();
                        _b.label = 2;
                    case 2:
                        console.log("pendingFilterId", this.pendingFilterId);
                        return [4 /*yield*/, this.filterChanges()];
                    case 3:
                        data = _b.sent();
                        console.log("filterChanges data: ", data);
                        txArray = [];
                        if (!(data && data.length > 0)) return [3 /*break*/, 7];
                        _i = 0, data_1 = data;
                        _b.label = 4;
                    case 4:
                        if (!(_i < data_1.length)) return [3 /*break*/, 7];
                        hash = data_1[_i];
                        return [4 /*yield*/, this.post("eth_getTransactionByHash", [hash])];
                    case 5:
                        tx = _b.sent();
                        txArray.push({
                            hash: tx.hash,
                            from: tx.from,
                            to: tx.to,
                            cy: "ETH",
                            value: tx.value,
                            data: tx.input,
                            gas: tx.gas,
                            gasPrice: tx.gasPrice,
                            chain: types_1.ChainType.ETH,
                            nonce: tx.nonce,
                            amount: "0x0",
                            feeCy: "ETH",
                            feeValue: "0x" + new bignumber_js_1.default(tx.gas).multipliedBy(new bignumber_js_1.default(tx.gasPrice)).toString(16)
                        });
                        _b.label = 6;
                    case 6:
                        _i++;
                        return [3 /*break*/, 4];
                    case 7: return [2 /*return*/, txArray];
                }
            });
        }); };
        _this.filterChanges = function () { return __awaiter(_this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        _this.post("eth_getFilterChanges", [_this.pendingFilterId]).then(function (rest) {
                            resolve(rest);
                        }).catch(function (e) {
                            _this.pendingFilterId = "";
                            reject(e);
                        });
                    })];
            });
        }); };
        return _this;
    }
    return EthRpc;
}(index_1.default));
var ethRpc = new EthRpc();
exports.default = ethRpc;
