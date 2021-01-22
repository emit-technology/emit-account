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
var constant = require("../common/constant");
var utils = require("../common/utils");
var db = require("../db");
var bignumber_js_1 = require("bignumber.js");
var index_1 = require("./index");
var types_1 = require("../../../emit-wallet/src/types");
var SeroRPC = /** @class */ (function (_super) {
    __extends(SeroRPC, _super);
    function SeroRPC() {
        var _this = _super.call(this, constant.SERO_RPC_HOST) || this;
        _this.pendingFilterId = "";
        _this.getTransactionReceipt = function (txHash) { return __awaiter(_this, void 0, void 0, function () {
            var rest;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.post("sero_getTransactionReceipt", [txHash])];
                    case 1:
                        rest = _a.sent();
                        return [2 /*return*/, Promise.resolve(rest)];
                }
            });
        }); };
        _this.getBlockTimestamp = function (num) { return __awaiter(_this, void 0, void 0, function () {
            var block;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.post("sero_getBlockByNumber", ["0x" + new bignumber_js_1.default(num).toString(16), false])];
                    case 1:
                        block = _a.sent();
                        return [2 /*return*/, new bignumber_js_1.default(block.timestamp).toNumber()];
                }
            });
        }); };
        _this.getBlocksInfo = function (fromBlock, limit) { return __awaiter(_this, void 0, void 0, function () {
            var datas, outInfos, nils, _i, datas_1, data, outs, rest;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.post("flight_getBlocksInfo", [fromBlock, limit])];
                    case 1:
                        datas = _a.sent();
                        if (!datas || datas.length == 0) {
                            return [2 /*return*/, []];
                        }
                        outInfos = [];
                        nils = [];
                        for (_i = 0, datas_1 = datas; _i < datas_1.length; _i++) {
                            data = datas_1[_i];
                            outs = data.Outs;
                            if (data.Nils && data.Nils.length > 0) {
                                nils = nils.concat(data.Nils);
                            }
                            rest = this.convertOuts(outs);
                            outInfos = outInfos.concat(rest);
                        }
                        return [2 /*return*/, [outInfos, nils]];
                }
            });
        }); };
        _this.getTxInfo = function (txHash, outs, selfOuts) { return __awaiter(_this, void 0, void 0, function () {
            var rest, Ins, insRootArr, outsRootArr, feeCy, tos, _i, Ins_1, In, _a, insRootArr_1, In, o, dbOuts, _b, outs_1, o, txInfo;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, this.post("sero_getTransactionByHash", [txHash])];
                    case 1:
                        rest = _c.sent();
                        if (!rest) {
                            return [2 /*return*/, null];
                        }
                        Ins = rest.stx.Tx1.Ins_P && rest.stx.Tx1.Ins_P.length > 0 ? rest.stx.Tx1.Ins_P : rest.stx.Tx1.Ins_P0;
                        insRootArr = [];
                        outsRootArr = [];
                        feeCy = utils.hexToCy(rest.stx.Fee.Currency);
                        tos = [];
                        for (_i = 0, Ins_1 = Ins; _i < Ins_1.length; _i++) {
                            In = Ins_1[_i];
                            insRootArr.push(In.Root);
                        }
                        _a = 0, insRootArr_1 = insRootArr;
                        _c.label = 2;
                    case 2:
                        if (!(_a < insRootArr_1.length)) return [3 /*break*/, 6];
                        In = insRootArr_1[_a];
                        o = selfOuts.get(In);
                        if (!!o) return [3 /*break*/, 4];
                        return [4 /*yield*/, db.sero.findOutsByRoots([In])];
                    case 3:
                        dbOuts = _c.sent();
                        if (dbOuts && dbOuts.length > 0) {
                            o = dbOuts[0];
                        }
                        _c.label = 4;
                    case 4:
                        if (!o) {
                            // console.error(`Con not find root:${In}`)
                            return [3 /*break*/, 5];
                            // throw new Error(`Con not find root:${In}`);
                        }
                        _c.label = 5;
                    case 5:
                        _a++;
                        return [3 /*break*/, 2];
                    case 6:
                        for (_b = 0, outs_1 = outs; _b < outs_1.length; _b++) {
                            o = outs_1[_b];
                            if (tos.indexOf(o.address) == -1) {
                                tos.push(o.address);
                            }
                            outsRootArr.push(o.root);
                        }
                        txInfo = {
                            fromAddress: rest.from,
                            toAddress: tos,
                            gas: rest.gas,
                            gasUsed: rest.gas,
                            gasPrice: rest.gasPrice,
                            fee: rest.stx.Fee.Value,
                            feeCy: feeCy,
                            txHash: txHash,
                            num: new bignumber_js_1.default(rest.blockNumber).toNumber(),
                            outs: outsRootArr,
                            ins: insRootArr,
                            // insAssets: insAssets,
                            // outsAssets: outsAssets,
                            transactionIndex: rest.transactionIndex,
                            contract: rest.stx.Desc_Cmd.Contract,
                            timestamp: 0,
                            contractAddress: rest.stx.Desc_Cmd.Contract && rest.stx.Desc_Cmd.Contract.To ? utils.addrToString(rest.stx.Desc_Cmd.Contract.To) : ""
                        };
                        return [2 /*return*/, txInfo];
                }
            });
        }); };
        _this.blockNumber = function () { return __awaiter(_this, void 0, void 0, function () {
            var rest;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.post("sero_blockNumber", ["latest"])];
                    case 1:
                        rest = _a.sent();
                        return [2 /*return*/, new bignumber_js_1.default(rest).toNumber()];
                }
            });
        }); };
        _this.getOut = function (root) { return __awaiter(_this, void 0, void 0, function () {
            var rest;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.post("flight_getOut", [root])];
                    case 1:
                        rest = _a.sent();
                        return [2 /*return*/, rest];
                }
            });
        }); };
        _this.getFilterChangesPending = function () { return __awaiter(_this, void 0, void 0, function () {
            var _a, data, txArray, _i, data_1, hash, tx, Ins_P0, inOutMap, _b, Ins_P0_1, InOut, dbOuts, out, cy, tmpAsset, key, asset, outMap, Outs_P, toAddr, _c, Outs_P_1, out, cy, to, key, tmpAsset, asset, inEntries, next, deleteKeys, key, asset, tmp, _d, deleteKeys_1, k, inEntries_1, next_1, currency, entries, next_2, key, cy, value, entries, next_3, key, asset, cy, addr;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        if (!!this.pendingFilterId) return [3 /*break*/, 2];
                        _a = this;
                        return [4 /*yield*/, this.post("sero_newPendingTransactionFilter", [])];
                    case 1:
                        _a.pendingFilterId = _e.sent();
                        _e.label = 2;
                    case 2:
                        console.log("pendingFilterId", this.pendingFilterId);
                        return [4 /*yield*/, this.filterChanges()];
                    case 3:
                        data = _e.sent();
                        console.log("filterChanges data: ", data);
                        txArray = [];
                        if (!(data && data.length > 0)) return [3 /*break*/, 11];
                        _i = 0, data_1 = data;
                        _e.label = 4;
                    case 4:
                        if (!(_i < data_1.length)) return [3 /*break*/, 11];
                        hash = data_1[_i];
                        return [4 /*yield*/, this.post("sero_getTransactionByHash", [hash])];
                    case 5:
                        tx = _e.sent();
                        Ins_P0 = tx.stx.Tx1.Ins_P0;
                        inOutMap = new Map();
                        if (!(Ins_P0 && Ins_P0.length > 0)) return [3 /*break*/, 9];
                        _b = 0, Ins_P0_1 = Ins_P0;
                        _e.label = 6;
                    case 6:
                        if (!(_b < Ins_P0_1.length)) return [3 /*break*/, 9];
                        InOut = Ins_P0_1[_b];
                        return [4 /*yield*/, db.sero.findOutsByRoots([InOut.Root])];
                    case 7:
                        dbOuts = _e.sent();
                        if (!dbOuts || dbOuts.length == 0) {
                            return [3 /*break*/, 9];
                        }
                        out = dbOuts[0];
                        cy = out.asset.currency;
                        tmpAsset = {
                            currency: cy,
                            value: new bignumber_js_1.default(out.asset.value).multipliedBy(-1).toString(10)
                        };
                        key = [tx.from, cy].join(":");
                        if (inOutMap.has(key)) {
                            asset = inOutMap.get(key);
                            tmpAsset.value = new bignumber_js_1.default(tmpAsset.value).plus(new bignumber_js_1.default(asset.value)).toString(10);
                            inOutMap.set(key, asset);
                        }
                        else {
                            inOutMap.set(key, tmpAsset);
                        }
                        _e.label = 8;
                    case 8:
                        _b++;
                        return [3 /*break*/, 6];
                    case 9:
                        outMap = new Map();
                        Outs_P = tx.stx.Tx1.Outs_P;
                        if (!Outs_P) {
                            return [3 /*break*/, 10];
                        }
                        toAddr = "";
                        for (_c = 0, Outs_P_1 = Outs_P; _c < Outs_P_1.length; _c++) {
                            out = Outs_P_1[_c];
                            cy = utils.hexToCy(out.Asset.Tkn.Currency);
                            to = utils.addrToString(out.PKr);
                            if (to != tx.from) {
                                toAddr = to;
                            }
                            key = [to, cy].join(":");
                            tmpAsset = {
                                currency: cy,
                                value: out.Asset.Tkn.Value
                            };
                            if (outMap.has(key)) {
                                asset = outMap.get(key);
                                tmpAsset.value = new bignumber_js_1.default(tmpAsset.value).plus(new bignumber_js_1.default(asset.value)).toString(10);
                                outMap.set(key, asset);
                            }
                            else {
                                outMap.set(key, tmpAsset);
                            }
                        }
                        inEntries = inOutMap.entries();
                        next = inEntries.next();
                        deleteKeys = [];
                        while (!next.done) {
                            key = next.value[0];
                            asset = next.value[1];
                            if (outMap.has(key)) {
                                tmp = outMap.get(key);
                                tmp.value = new bignumber_js_1.default(tmp.value).plus(new bignumber_js_1.default(asset.value)).toString(10);
                                outMap.set(key, tmp);
                                deleteKeys.push(key);
                            }
                            next = inEntries.next();
                        }
                        for (_d = 0, deleteKeys_1 = deleteKeys; _d < deleteKeys_1.length; _d++) {
                            k = deleteKeys_1[_d];
                            inOutMap.delete(k);
                        }
                        if (inOutMap.size > 0) {
                            inEntries_1 = inOutMap.entries();
                            next_1 = inEntries_1.next();
                            while (!next_1.done) {
                                outMap.set(next_1.value[0], next_1.value[1]);
                                next_1 = inEntries_1.next();
                            }
                        }
                        currency = "SERO";
                        if (outMap.size > 0) {
                            entries = outMap.entries();
                            next_2 = entries.next();
                            while (!next_2.done) {
                                key = next_2.value[0];
                                cy = key.split(":")[1];
                                if (cy !== "SERO") {
                                    currency = cy;
                                    break;
                                }
                                next_2 = entries.next();
                            }
                        }
                        value = "0";
                        if (outMap.size > 0) {
                            entries = outMap.entries();
                            next_3 = entries.next();
                            while (!next_3.done) {
                                key = next_3.value[0];
                                asset = next_3.value[1];
                                cy = key.split(":")[1];
                                addr = key.split(":")[0];
                                if (cy == currency && addr == toAddr) {
                                    value = asset.value;
                                    break;
                                }
                                next_3 = entries.next();
                            }
                        }
                        if (toAddr && utils.isV1(toAddr) || utils.isV1(tx.from)) {
                            txArray.push({
                                hash: tx.hash,
                                from: tx.from,
                                to: toAddr,
                                cy: currency,
                                value: value,
                                data: tx.input,
                                gas: tx.gas,
                                gasPrice: tx.gasPrice,
                                chain: types_1.ChainType.SERO,
                                nonce: tx.nonce,
                                amount: "0x0",
                                feeCy: utils.hexToCy(tx.stx.Fee.Currency),
                                feeValue: "0x" + new bignumber_js_1.default(tx.stx.Fee.Value).toString(16)
                            });
                        }
                        _e.label = 10;
                    case 10:
                        _i++;
                        return [3 /*break*/, 4];
                    case 11: return [2 /*return*/, txArray];
                }
            });
        }); };
        _this.filterChanges = function () { return __awaiter(_this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        _this.post("sero_getFilterChanges", [_this.pendingFilterId]).then(function (rest) {
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
    SeroRPC.prototype.convertOuts = function (outs) {
        var outInfos = [];
        for (var _i = 0, outs_2 = outs; _i < outs_2.length; _i++) {
            var out = outs_2[_i];
            if (out.State.OS.Out_O) {
                var outInfo = {
                    address: utils.addrToString(out.State.OS.Out_O.Addr),
                    asset: {
                        currency: utils.hexToCy(out.State.OS.Out_O.Asset.Tkn.Currency),
                        value: out.State.OS.Out_O.Asset.Tkn.Value
                    },
                    txHash: out.State.TxHash,
                    num: new bignumber_js_1.default(out.State.Num).toNumber(),
                    root: out.Root,
                    used: false,
                    utxo: {
                        Root: out.Root,
                        Asset: out.State.OS.Out_O.Asset,
                        State: out.State
                    }
                };
                if (utils.isV1(outInfo.address) &&
                    ["0x0000000000000000000000000000000000000000000000000000000000000000",
                        "0x0000000000000000000000000000000000000000000000000000000000000001",
                        "0x0000000000000000000000000000000000000000000000000000000000000002",
                        "0x0000000000000000000000000000000000000000000000000000000000000003"].indexOf(outInfo.txHash) == -1) {
                    outInfos.push(outInfo);
                }
            }
            if (out.State.OS.Out_P) {
                var outInfo = {
                    address: utils.addrToString(out.State.OS.Out_P.PKr),
                    asset: {
                        currency: utils.hexToCy(out.State.OS.Out_P.Asset.Tkn.Currency),
                        value: out.State.OS.Out_P.Asset.Tkn.Value
                    },
                    txHash: out.State.TxHash,
                    num: new bignumber_js_1.default(out.State.Num).toNumber(),
                    root: out.Root,
                    used: false,
                    utxo: {
                        Root: out.Root,
                        Asset: out.State.OS.Out_P.Asset,
                        State: out.State
                    }
                };
                if (["0x0000000000000000000000000000000000000000000000000000000000000000",
                    "0x0000000000000000000000000000000000000000000000000000000000000001",
                    "0x0000000000000000000000000000000000000000000000000000000000000002",
                    "0x0000000000000000000000000000000000000000000000000000000000000003"].indexOf(outInfo.txHash) == -1) {
                    outInfos.push(outInfo);
                }
            }
        }
        return outInfos;
    };
    return SeroRPC;
}(index_1.default));
var seroRPC = new SeroRPC();
exports.default = seroRPC;
