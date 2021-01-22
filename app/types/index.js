"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EVENT_TYPE = exports.TxType = void 0;
var TxType;
(function (TxType) {
    TxType[TxType["_"] = 0] = "_";
    TxType[TxType["IN"] = 1] = "IN";
    TxType[TxType["OUT"] = 2] = "OUT";
})(TxType = exports.TxType || (exports.TxType = {}));
var EVENT_TYPE;
(function (EVENT_TYPE) {
    EVENT_TYPE[EVENT_TYPE["_"] = 0] = "_";
    EVENT_TYPE[EVENT_TYPE["ERC20_Transfer"] = 1] = "ERC20_Transfer";
    EVENT_TYPE[EVENT_TYPE["ERC20_Approve"] = 2] = "ERC20_Approve";
    EVENT_TYPE[EVENT_TYPE["CROSS_DEPOSIT"] = 3] = "CROSS_DEPOSIT";
    EVENT_TYPE[EVENT_TYPE["CROSS_PROPOSAL"] = 4] = "CROSS_PROPOSAL";
    EVENT_TYPE[EVENT_TYPE["WETH_DEPOSIT"] = 5] = "WETH_DEPOSIT";
    EVENT_TYPE[EVENT_TYPE["WETH_WITHDRAW"] = 6] = "WETH_WITHDRAW";
})(EVENT_TYPE = exports.EVENT_TYPE || (exports.EVENT_TYPE = {}));
