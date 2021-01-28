"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toHex = exports.addrToString = exports.hexToCy = exports.isCrossAddress = exports.isWETHAddress = exports.isErc20Address = exports.toNum = exports.isV1 = void 0;
var utils_1 = require("jsuperzk/src/utils/utils");
Object.defineProperty(exports, "hexToCy", { enumerable: true, get: function () { return utils_1.hexToCy; } });
Object.defineProperty(exports, "addrToString", { enumerable: true, get: function () { return utils_1.addrToString; } });
var bignumber_js_1 = require("bignumber.js");
var constant = require("./constant");
function isV1(pkr) {
    return !utils_1.isNewVersion(utils_1.default.toBuffer(pkr));
}
exports.isV1 = isV1;
function toNum(v) {
    return new bignumber_js_1.default(v).toNumber();
}
exports.toNum = toNum;
function isErc20Address(address) {
    var cKeys = Object.keys(constant.TOKEN_ADDRESS);
    for (var _i = 0, cKeys_1 = cKeys; _i < cKeys_1.length; _i++) {
        var key = cKeys_1[_i];
        // @ts-ignore
        var addr = constant.TOKEN_ADDRESS[key];
        if (address.toLowerCase() === addr.toLowerCase()) {
            return key;
        }
    }
    return "";
}
exports.isErc20Address = isErc20Address;
function isWETHAddress(address) {
    if (address.toLowerCase() === constant.TOKEN_ADDRESS.WETH.toLowerCase()) {
        return "WETH";
    }
    return "";
}
exports.isWETHAddress = isWETHAddress;
function isCrossAddress(address) {
    var cKeys = Object.keys(constant.CROSS_ADDRESS);
    for (var _i = 0, cKeys_2 = cKeys; _i < cKeys_2.length; _i++) {
        var key = cKeys_2[_i];
        // @ts-ignore
        var addr = constant.CROSS_ADDRESS[key];
        if (address.toLowerCase() === addr.toLowerCase()) {
            return key;
        }
    }
    return "";
}
exports.isCrossAddress = isCrossAddress;
function toHex(value) {
    if (!value) {
        return "0x0";
    }
    return "0x" + new bignumber_js_1.default(value).toString(16);
}
exports.toHex = toHex;
//# sourceMappingURL=utils.js.map