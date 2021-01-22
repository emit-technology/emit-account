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
var constant = require("../common/constant");
var TronWeb = require('tronweb');
var HttpProvider = TronWeb.providers.HttpProvider;
var fullNode = new HttpProvider(constant.TRON_API_HOST.fullNode);
var solidityNode = new HttpProvider(constant.TRON_API_HOST.fullNode);
var eventServer = new HttpProvider(constant.TRON_API_HOST.fullNode);
var privateKey = "3481E79956D4BD95F358AC96D151C976392FC4E3FC132F78A847906DE588C145";
var tronWeb = new TronWeb(fullNode, solidityNode, eventServer, privateKey);
var TronGrid = require('trongrid');
// const TronWeb = require('tronweb');
// const tronWeb = new TronWeb({
//     fullHost: constant.TRON_API_HOST.fullNode
// });
var tronGrid = new TronGrid(tronWeb);
function queryToken() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/];
        });
    });
}
// queryToken().catch(e=>{
//     console.error(e)
// })
// async function getContract(){
//     let contract = await tronWeb.contract().at("TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t");
//     const balance = await contract.totalSupply().call();
//     console.log(balance);
// }
// tronWeb.trx.getTokenListByName("TetherToken").then(result => {console.log(result)});
//111
// async function triggercontract(){
//     let instance = await tronWeb.contract().at(constant.TRC20_ADDRESS.USDT);
//     let totalSupply = await instance.totalSupply().call();
//     console.log("totalSupply::",new BigNumber(totalSupply._hex).toString(10));
//     let balanceOf = await instance.balanceOf("TSaJqQ1AZ2bEYyqBwBmJqCBSPv8KPRTAdv").call();
//     console.log("balanceOf::",new BigNumber(balanceOf._hex).toString(10));
// }
// triggercontract();
// tronWeb.trx.getTokenListByName("USDT");
// const accountAddress = "TTaiQ6eWoEwUnNz4SmcnZbzdf1fTmVnqVT";
// //
tronGrid.account.getTrc20Transactions("TYdRxvWxSBRmm76tKX73rULihnpxi5aGjG", { limit: 10 }).then(function (e) {
    console.log(JSON.stringify(e));
});
// tronGrid.account.getTransactions("TEg5pgd2uBst9d4mWfnAjJYqBnUTJWawDA", {limit:10}).then(e=>{
//     console.log(JSON.stringify(e))
// })
// tronWeb.trx.getTransactionInfo("818c9c2f1f3b91545b77cf3395b194945c23f8b816ebb27cc5258e55febd3e6d").then(v=>{
//     console.log(JSON.stringify(v))
// });
//
// tronWeb.trx.getTransaction("818c9c2f1f3b91545b77cf3395b194945c23f8b816ebb27cc5258e55febd3e6d").then(v=>{
//     console.log(JSON.stringify(v))
// });
//
//
// tronWeb.trx.getTransaction("818c9c2f1f3b91545b77cf3395b194945c23f8b816ebb27cc5258e55febd3e6d").then(v=>{
//     console.log(JSON.stringify(v))
// });
