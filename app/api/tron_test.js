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
exports.__esModule = true;
var constant = require("../common/constant");
var TronWeb = require('tronweb');
var HttpProvider = TronWeb.providers.HttpProvider;
var fullNode = new HttpProvider(constant.TRON_API_HOST.fullNode);
var solidityNode = new HttpProvider(constant.TRON_API_HOST.fullNode);
var eventServer = new HttpProvider(constant.TRON_API_HOST.fullNode);
var privateKey = "67cf7062cc23b5165d5b47578e2afcfab8eeb3e906d92fc5ea7ea816e7b51831";
var tronWeb = new TronWeb(fullNode, solidityNode, eventServer, privateKey);
var TronGrid = require('trongrid');
// const TronWeb = require('tronweb');
// const tronWeb = new TronWeb({
//     fullHost: constant.TRON_API_HOST.fullNode
// });
var tronGrid = new TronGrid(tronWeb);
function queryToken() {
    return __awaiter(this, void 0, void 0, function () {
        var assets;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, tronWeb.trx.getAccount('TYdRxvWxSBRmm76tKX73rULihnpxi5aGjG')
                    // console.log(assets);
                    // for(let t of assets.assetV2){
                    //     const token = await tronWeb.trx.getTokenByID(t.key);
                    //     console.log(`>>>>>>>>> key=[${t.key}] ,value=[${t.value}], token=[${JSON.stringify(token)}] `)
                    // }
                    // tronWeb.trx.getBalance('TTSFjEG3Lu9WkHdp4JrWYhbGP6K1REqnGQ').then(result => console.log(result))
                ];
                case 1:
                    assets = _a.sent();
                    return [2 /*return*/];
            }
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
function triggercontract() {
    return __awaiter(this, void 0, void 0, function () {
        var parameter1, transaction, signedtxn, receipt;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    // let instance = await tronWeb.contract().at(constant.TRC20_ADDRESS.USDT);
                    console.log(tronWeb.address.toHex("TYdRxvWxSBRmm76tKX73rULihnpxi5aGjG"));
                    parameter1 = [{ type: 'address', value: tronWeb.address.toHex("TGUVVWjYpsFj5o5okydLncEXk8xitq9LTu") }, { type: 'uint256', value: 100 }];
                    return [4 /*yield*/, tronWeb.transactionBuilder.triggerSmartContract(constant.TRC20_ADDRESS.USDT, "transfer(address,uint256)", {}, parameter1, tronWeb.address.toHex("TYdRxvWxSBRmm76tKX73rULihnpxi5aGjG"))];
                case 1:
                    transaction = _a.sent();
                    // const transaction = await tronWeb.transactionBuilder.sendTrx("TGUVVWjYpsFj5o5okydLncEXk8xitq9LTu", 10,"TYdRxvWxSBRmm76tKX73rULihnpxi5aGjG",1);
                    console.log(transaction, "transaction1>>");
                    return [4 /*yield*/, tronWeb.trx.sign(transaction.transaction, privateKey)];
                case 2:
                    signedtxn = _a.sent();
                    console.log(signedtxn, "transaction2>>");
                    return [4 /*yield*/, tronWeb.trx.sendRawTransaction(signedtxn)];
                case 3:
                    receipt = _a.sent();
                    console.log(receipt);
                    return [2 /*return*/];
            }
        });
    });
}
triggercontract()["catch"](function (e) {
    console.error(e);
});
// tronWeb.trx.getTokenListByName("USDT");
// const accountAddress = "TTaiQ6eWoEwUnNz4SmcnZbzdf1fTmVnqVT";
// //
// tronGrid.account.getTrc20Transactions("TGUVVWjYpsFj5o5okydLncEXk8xitq9LTu", {limit:10}).then(e=>{
//     console.log("test>",JSON.stringify(e))
// })
// tronWeb.getEventByTransactionID("91525b2e6f949f0b73880b359e517e75d5efa85b3a12396e0dfb1094c80b48ce").then((result:any) => {console.log(result)})
// tronWeb.getEventResult("TUPz3wD356e3iV337s4cnjQS2weUdhX5ci",{eventName:"RNGIterated",size:2})
// tronGrid.account.getTransactions("TGUVVWjYpsFj5o5okydLncEXk8xitq9LTu", {limit:10}).then((e:any)=>{
//     console.log(JSON.stringify(e))
// })
// tronWeb.trx.getTransaction("c3a9f885ac26adec9e98bcbe886012e253441d0fdf70c64b8a45ba8d70d02472").then((v:any)=>{
//     console.log(JSON.stringify(v))
// });
//
// tronWeb.trx.getTransactionInfo("c3a9f885ac26adec9e98bcbe886012e253441d0fdf70c64b8a45ba8d70d02472").then((v:any)=>{
//     console.log("info::: ",JSON.stringify(v))
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
tronWeb.getEventResult("TAo46rvXgYorCL1xfWEQ1MqRqwnZxuCp8P", {
    // eventName:"Deposit",
    size: 50
}).then(function (rest) {
    console.log(rest);
})["catch"](function (e) {
    console.log(">>>>", e);
});
