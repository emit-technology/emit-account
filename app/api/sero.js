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
var bignumber_js_1 = require("bignumber.js");
var tx_1 = require("jsuperzk/src/tx/tx");
var utils_1 = require("jsuperzk/src/utils/utils");
var sero_1 = require("../rpc/sero");
var db = require("../db");
var SeroApi = /** @class */ (function (_super) {
    __extends(SeroApi, _super);
    function SeroApi() {
        var _this = _super.call(this, db.sero) || this;
        _this.proxyPost = function (method, params) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, sero_1.default.post(method, params)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        }); };
        _this.getBalance = function (address, cy) { return __awaiter(_this, void 0, void 0, function () {
            var balances, assets, _i, balances_1, b;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.db.queryBalance(address, cy)];
                    case 1:
                        balances = _a.sent();
                        assets = {};
                        for (_i = 0, balances_1 = balances; _i < balances_1.length; _i++) {
                            b = balances_1[_i];
                            assets[b.currency] = new bignumber_js_1.default(b.totalIn).minus(b.totalOut).minus(b.totalFrozen).toString(10);
                        }
                        return [2 /*return*/, Promise.resolve(assets)];
                }
            });
        }); };
        _this.commitTx = function (signTx, t) { return __awaiter(_this, void 0, void 0, function () {
            var resp;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, sero_1.default.post('sero_commitTx', [signTx])
                        // await this.insertTxInfo(signTx.Hash,t);
                    ];
                    case 1:
                        resp = _a.sent();
                        // await this.insertTxInfo(signTx.Hash,t);
                        return [2 /*return*/, Promise.resolve(resp)];
                }
            });
        }); };
        _this.genParams = function (txPrams) { return __awaiter(_this, void 0, void 0, function () {
            var preTxParam, rest;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.genPreParams(txPrams)];
                    case 1:
                        preTxParam = _a.sent();
                        return [4 /*yield*/, tx_1.genTxParam(preTxParam, new TxGenerator(), new TxState())];
                    case 2:
                        rest = _a.sent();
                        // rest.Gas=txPrams.gas?txPrams.gas:"25000";
                        return [2 /*return*/, Promise.resolve(rest)];
                }
            });
        }); };
        _this.genPreParams = function (txPrams) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        try {
                            var from = txPrams.from, to = txPrams.to, value = txPrams.value, cy = txPrams.cy, data = txPrams.data, gas = txPrams.gas, gasPrice = txPrams.gasPrice;
                            if (!gas) {
                                gas = "25000";
                            }
                            var tkn = {
                                Currency: utils_1.default.cyToHex(cy),
                                Value: new bignumber_js_1.default(value).toString(10)
                            };
                            var fee = {
                                Currency: utils_1.default.cyToHex("SERO"),
                                Value: new bignumber_js_1.default(gasPrice, 16).multipliedBy(new bignumber_js_1.default(gas, 16)).toString(10)
                            };
                            if (txPrams.feeCy) {
                                fee.Currency = utils_1.default.cyToHex(txPrams.feeCy);
                            }
                            if (txPrams.feeValue) {
                                fee.Value = txPrams.feeValue;
                            }
                            var asset = {
                                Tkn: tkn,
                            };
                            var reception = {
                                Addr: to,
                                Asset: asset
                            };
                            var preTxParam = {
                                From: from,
                                RefundTo: from,
                                Fee: fee,
                                GasPrice: utils_1.default.toBN(gasPrice).toString(10),
                                Cmds: null,
                                Receptions: [reception],
                            };
                            // contract
                            if (data) {
                                preTxParam.Receptions = [];
                                preTxParam.RefundTo = from;
                                preTxParam.Cmds = {
                                    Contract: {
                                        Data: data,
                                        Asset: asset,
                                    }
                                };
                                if (to) {
                                    // @ts-ignore
                                    preTxParam.Cmds.Contract.To = utils_1.default.bs58ToHex(to) + "0000000000000000000000000000000000000000000000000000000000000000";
                                }
                            }
                            resolve(preTxParam);
                        }
                        catch (e) {
                            console.error(e);
                            reject(e);
                        }
                    })];
            });
        }); };
        return _this;
    }
    return SeroApi;
}(index_1.Api));
var TxGenerator = /** @class */ (function () {
    function TxGenerator() {
    }
    TxGenerator.prototype.findRoots = function (pkr, currency, remain) {
        return __awaiter(this, void 0, void 0, function () {
            var outs;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db.sero.findUnusedOutsByAddress(pkr, currency)];
                    case 1:
                        outs = _a.sent();
                        return [2 /*return*/, new Promise(function (resolve) {
                                var utxos = new Array();
                                for (var _i = 0, outs_1 = outs; _i < outs_1.length; _i++) {
                                    var out = outs_1[_i];
                                    if (out.asset && out.asset.currency) {
                                        if (remain.isNeg() || remain.isZero()) {
                                            break;
                                        }
                                        utxos.push(out.utxo);
                                        remain = remain.sub(utils_1.default.toBN(out.asset.value));
                                    }
                                }
                                resolve({ utxos: utxos, remain: remain });
                            })];
                }
            });
        });
    };
    TxGenerator.prototype.findRootsByTicket = function (address, tickets) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, { utxos: [], remain: new Map() }];
            });
        });
    };
    TxGenerator.prototype.getRoot = function (root) {
        return __awaiter(this, void 0, void 0, function () {
            var outs;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db.sero.findOutsByRoots([root])];
                    case 1:
                        outs = _a.sent();
                        if (outs && outs.length > 0) {
                            return [2 /*return*/, outs[0].utxo];
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    TxGenerator.prototype.defaultRefundTo = function (address) {
        return '';
    };
    return TxGenerator;
}());
var TxState = /** @class */ (function () {
    function TxState() {
    }
    TxState.prototype.getAnchor = function (roots) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve) {
                        sero_1.default.post('sero_getAnchor', [roots]).then(function (resp) {
                            resolve(resp);
                        }).catch(function (e) {
                            console.log("getAnchor", e);
                            resolve(null);
                        });
                    })];
            });
        });
    };
    TxState.prototype.getPkgById = function (id) {
        return Promise.resolve(null);
    };
    TxState.prototype.getSeroGasLimit = function (to, tfee, gasPrice) {
        return utils_1.default.toBN(tfee.Value).div(gasPrice).toNumber();
    };
    return TxState;
}());
exports.default = SeroApi;
//# sourceMappingURL=sero.js.map