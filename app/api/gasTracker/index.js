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
var constant = require("../../common/constant");
var rpc_1 = require("../../rpc");
var bignumber_js_1 = require("bignumber.js");
var eth_1 = require("../../rpc/eth");
var GasTracker = /** @class */ (function () {
    function GasTracker() {
        var _this = this;
        this.gasPriceLevel = {};
        this.gasTrackerCache = function () { return __awaiter(_this, void 0, void 0, function () {
            var gasPrice, data, tracker, safeData, proposeData, fastData, avgData, gasTemp;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, eth_1.default.post("eth_gasPrice", [])];
                    case 1:
                        gasPrice = _a.sent();
                        return [4 /*yield*/, this.rpc.get(constant.GAS_TRACKER)];
                    case 2:
                        data = _a.sent();
                        tracker = data.result;
                        console.log("tracker>>> ", tracker);
                        return [4 /*yield*/, this.rpc.get(this.gasEstimate(tracker.SafeGasPrice))];
                    case 3:
                        safeData = _a.sent();
                        return [4 /*yield*/, this.rpc.get(this.gasEstimate(tracker.ProposeGasPrice))];
                    case 4:
                        proposeData = _a.sent();
                        return [4 /*yield*/, this.rpc.get(this.gasEstimate(tracker.FastGasPrice))];
                    case 5:
                        fastData = _a.sent();
                        return [4 /*yield*/, this.rpc.get(this.gasEstimate(new bignumber_js_1.default(gasPrice).dividedBy(1e9).toString(10)))];
                    case 6:
                        avgData = _a.sent();
                        gasTemp = {};
                        gasTemp.SafeGasPrice = {
                            gasPrice: tracker.SafeGasPrice,
                            second: safeData.result
                        };
                        gasTemp.ProposeGasPrice = {
                            gasPrice: tracker.ProposeGasPrice,
                            second: proposeData.result
                        };
                        gasTemp.FastGasPrice = {
                            gasPrice: tracker.FastGasPrice,
                            second: fastData.result
                        };
                        gasTemp.AvgGasPrice = {
                            gasPrice: new bignumber_js_1.default(gasPrice).dividedBy(1e9).toFixed(0, 1),
                            second: avgData.result
                        };
                        this.gasPriceLevel = JSON.parse(JSON.stringify(gasTemp));
                        return [2 /*return*/];
                }
            });
        }); };
        this.rpc = new rpc_1.default(constant.API_ETHERSCAN);
    }
    GasTracker.prototype.gasEstimate = function (gWei) {
        return constant.GAS_ESTIMATE + new bignumber_js_1.default(gWei).multipliedBy(1e9).toString(10);
    };
    return GasTracker;
}());
var gasTracker = new GasTracker();
exports.default = gasTracker;
//# sourceMappingURL=index.js.map