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
exports.Api = void 0;
var Api = /** @class */ (function () {
    function Api(db) {
        var _this = this;
        this.getTxInfo = function (txHash) { return __awaiter(_this, void 0, void 0, function () {
            var txInfo;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.db.queryTxByHash(txHash)];
                    case 1:
                        txInfo = _a.sent();
                        return [2 /*return*/, Promise.resolve(txInfo)];
                }
            });
        }); };
        this.getTxs = function (address, currency, pageSize, pageNo) { return __awaiter(_this, void 0, void 0, function () {
            var retn;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.db.queryTxByAddress(address, currency, pageSize, pageNo)];
                    case 1:
                        retn = _a.sent();
                        return [2 /*return*/, Promise.resolve(retn)];
                }
            });
        }); };
        this.countPendingTx = function (address, currency) { return __awaiter(_this, void 0, void 0, function () {
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
        this.getBalanceRecords = function (address, currency, hash, pageSize, pageNo, fingerprint) { return __awaiter(_this, void 0, void 0, function () {
            var retn;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.db.queryBalanceRecords(address, currency, hash, pageSize, pageNo)];
                    case 1:
                        retn = _a.sent();
                        return [2 /*return*/, Promise.resolve(retn)];
                }
            });
        }); };
        this.getEvents = function (txHash, depositNonce, originChainID, resourceID) { return __awaiter(_this, void 0, void 0, function () {
            var retn;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log("getEvent::", txHash);
                        return [4 /*yield*/, this.db.queryEvents(txHash, depositNonce, originChainID, resourceID)];
                    case 1:
                        retn = _a.sent();
                        return [2 /*return*/, Promise.resolve(retn)];
                }
            });
        }); };
        this.getAppVersion = function (tag, versionNum) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.db.getAppVersion(tag, versionNum)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        }); };
        this.insertTxInfo = function (hash, t) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this.db.insertTxInfo(hash, t);
                return [2 /*return*/];
            });
        }); };
        this.db = db;
    }
    return Api;
}());
exports.Api = Api;
//# sourceMappingURL=index.js.map