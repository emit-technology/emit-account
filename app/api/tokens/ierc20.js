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
exports.Ierc20 = void 0;
var bignumber_js_1 = require("bignumber.js");
var constant = require("../../common/constant");
var Web3 = require('web3');
var Ierc20 = /** @class */ (function () {
    function Ierc20(address) {
        var _this = this;
        this.abi = [{
                "constant": false,
                "inputs": [{ "name": "_spender", "type": "address" }, { "name": "_value", "type": "uint256" }],
                "name": "approve",
                "outputs": [{ "name": "success", "type": "bool" }],
                "payable": false,
                "type": "function"
            }, {
                "constant": true,
                "inputs": [],
                "name": "totalSupply",
                "outputs": [{ "name": "totalSupply", "type": "uint256" }],
                "payable": false,
                "type": "function"
            }, {
                "constant": false,
                "inputs": [{ "name": "_from", "type": "address" }, { "name": "_to", "type": "address" }, {
                        "name": "_value",
                        "type": "uint256"
                    }],
                "name": "transferFrom",
                "outputs": [{ "name": "success", "type": "bool" }],
                "payable": false,
                "type": "function"
            }, {
                "constant": true,
                "inputs": [{ "name": "_owner", "type": "address" }],
                "name": "balanceOf",
                "outputs": [{ "name": "balance", "type": "uint256" }],
                "payable": false,
                "type": "function"
            }, {
                "constant": false,
                "inputs": [{ "name": "_to", "type": "address" }, { "name": "_value", "type": "uint256" }],
                "name": "transfer",
                "outputs": [{ "name": "success", "type": "bool" }],
                "payable": false,
                "type": "function"
            }, {
                "constant": true,
                "inputs": [{ "name": "_owner", "type": "address" }, { "name": "_spender", "type": "address" }],
                "name": "allowance",
                "outputs": [{ "name": "remaining", "type": "uint256" }],
                "payable": false,
                "type": "function"
            }, {
                "anonymous": false,
                "inputs": [{ "indexed": true, "name": "_from", "type": "address" }, {
                        "indexed": true,
                        "name": "_to",
                        "type": "address"
                    }, { "indexed": false, "name": "_value", "type": "uint256" }],
                "name": "Transfer",
                "type": "event"
            }, {
                "anonymous": false,
                "inputs": [{ "indexed": true, "name": "_owner", "type": "address" }, {
                        "indexed": true,
                        "name": "_spender",
                        "type": "address"
                    }, { "indexed": false, "name": "_value", "type": "uint256" }],
                "name": "Approval",
                "type": "event"
            }];
        this.totalSupply = function () { return __awaiter(_this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        _this.contract.methods.totalSupply().call({}).then(function (rest) {
                            resolve(new bignumber_js_1.default(rest));
                        }).catch(function (e) {
                            reject(e);
                        });
                    })];
            });
        }); };
        this.balanceOf = function (who) { return __awaiter(_this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        _this.contract.methods.balanceOf(who).call({ from: who }).then(function (rest) {
                            resolve(new bignumber_js_1.default(rest));
                        }).catch(function (e) {
                            reject(e);
                        });
                    })];
            });
        }); };
        this.allowance = function (owner, spender) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/];
            });
        }); };
        this.transfer = function (to, value) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/];
            });
        }); };
        this.approve = function (spender, value) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/];
            });
        }); };
        this.transferFrom = function (from, to, value) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/];
            });
        }); };
        this.decodeTransferLog = function (data, topics) {
            var rest = _this.web3.eth.abi.decodeLog([
                {
                    "indexed": true,
                    "name": "from",
                    "type": "address"
                },
                {
                    "indexed": true,
                    "name": "to",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "name": "value",
                    "type": "uint256"
                }
            ], data, topics.slice(1));
            return {
                from: rest[0],
                to: rest[1],
                value: rest[2]
            };
        };
        this.decodeApprovalLog = function (data, topics) {
            var rest = _this.web3.eth.abi.decodeLog([
                {
                    "indexed": true,
                    "name": "owner",
                    "type": "address"
                },
                {
                    "indexed": true,
                    "name": "spender",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "name": "value",
                    "type": "uint256"
                }
            ], data, topics.slice(1));
            return {
                owner: rest[0],
                spender: rest[1],
                value: rest[2]
            };
        };
        this.encodeEventSignature = function (name) {
            if (name === "Transfer") {
                return _this.web3.eth.abi.encodeEventSignature({
                    "anonymous": false,
                    "inputs": [
                        {
                            "indexed": true,
                            "name": "from",
                            "type": "address"
                        },
                        {
                            "indexed": true,
                            "name": "to",
                            "type": "address"
                        },
                        {
                            "indexed": false,
                            "name": "value",
                            "type": "uint256"
                        }
                    ],
                    "name": "Transfer",
                    "type": "event"
                });
            }
            else if (name === "Approval") {
                return _this.web3.eth.abi.encodeEventSignature({
                    "anonymous": false,
                    "inputs": [
                        {
                            "indexed": true,
                            "name": "owner",
                            "type": "address"
                        },
                        {
                            "indexed": true,
                            "name": "spender",
                            "type": "address"
                        },
                        {
                            "indexed": false,
                            "name": "value",
                            "type": "uint256"
                        }
                    ],
                    "name": "Approval",
                    "type": "event"
                });
            }
            return "";
        };
        this.web3 = new Web3(constant.ETH_HOST);
        this.contract = new this.web3.eth.Contract(this.abi, address);
    }
    return Ierc20;
}());
exports.Ierc20 = Ierc20;
exports.default = Ierc20;
//# sourceMappingURL=ierc20.js.map