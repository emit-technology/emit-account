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
import BigNumber from "bignumber.js";


import * as constant from "../common/constant";

const TronWeb = require('tronweb')
const HttpProvider = TronWeb.providers.HttpProvider;
const fullNode = new HttpProvider(constant.TRON_API_HOST.fullNode);
const solidityNode = new HttpProvider(constant.TRON_API_HOST.fullNode);
const eventServer = new HttpProvider(constant.TRON_API_HOST.fullNode);
const  privateKey = "3481E79956D4BD95F358AC96D151C976392FC4E3FC132F78A847906DE588C145";
const tronWeb = new TronWeb(fullNode,solidityNode,eventServer,privateKey);
const TronGrid = require('trongrid');
// const TronWeb = require('tronweb');

// const tronWeb = new TronWeb({
//     fullHost: constant.TRON_API_HOST.fullNode
// });

const tronGrid = new TronGrid(tronWeb);


async function queryToken(){
    // const assets = await tronWeb.trx.getAccount('TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t')
    // console.log(assets);
    // for(let t of assets.assetV2){
    //     const token = await tronWeb.trx.getTokenByID(t.key);
    //     console.log(`>>>>>>>>> key=[${t.key}] ,value=[${t.value}], token=[${JSON.stringify(token)}] `)
    // }
    // tronWeb.trx.getBalance('TTSFjEG3Lu9WkHdp4JrWYhbGP6K1REqnGQ').then(result => console.log(result))

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
tronGrid.account.getTrc20Transactions("TYdRxvWxSBRmm76tKX73rULihnpxi5aGjG", {limit:10}).then(e=>{
    console.log(JSON.stringify(e))
})

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
