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

import * as constant from "../common/constant";

const TronWeb = require('tronweb')
const HttpProvider = TronWeb.providers.HttpProvider;
const fullNode = new HttpProvider(constant.TRON_API_HOST.fullNode);
const solidityNode = new HttpProvider(constant.TRON_API_HOST.fullNode);
const eventServer = new HttpProvider(constant.TRON_API_HOST.fullNode);
const  privateKey = "67cf7062cc23b5165d5b47578e2afcfab8eeb3e906d92fc5ea7ea816e7b51831";
const tronWeb = new TronWeb(fullNode,solidityNode,eventServer,privateKey);
const TronGrid = require('trongrid');
// const TronWeb = require('tronweb');

// const tronWeb = new TronWeb({
//     fullHost: constant.TRON_API_HOST.fullNode
// });

const tronGrid = new TronGrid(tronWeb);


async function queryToken(){
    const assets = await tronWeb.trx.getAccount('TYdRxvWxSBRmm76tKX73rULihnpxi5aGjG')
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
async function triggercontract(){
    // let instance = await tronWeb.contract().at(constant.TRC20_ADDRESS.USDT);

    console.log(tronWeb.address.toHex("TYdRxvWxSBRmm76tKX73rULihnpxi5aGjG"));

    const parameter1 = [{type:'address',value:tronWeb.address.toHex("TGUVVWjYpsFj5o5okydLncEXk8xitq9LTu")},{type:'uint256',value:100}]
    const transaction = await tronWeb.transactionBuilder.triggerSmartContract(constant.TRC20_ADDRESS.USDT, "transfer(address,uint256)", {},
        parameter1,tronWeb.address.toHex("TYdRxvWxSBRmm76tKX73rULihnpxi5aGjG"));

    // const transaction = await tronWeb.transactionBuilder.sendTrx("TGUVVWjYpsFj5o5okydLncEXk8xitq9LTu", 10,"TYdRxvWxSBRmm76tKX73rULihnpxi5aGjG",1);

    console.log(transaction,"transaction1>>");

    const signedtxn = await tronWeb.trx.sign(transaction.transaction, privateKey);
    console.log(signedtxn,"transaction2>>");

    const receipt = await tronWeb.trx.sendRawTransaction(signedtxn);

    console.log(receipt)

}
triggercontract().catch(e=>{
    console.error(e)
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

tronWeb.getEventResult("TAo46rvXgYorCL1xfWEQ1MqRqwnZxuCp8P",
    {
        // eventName:"Deposit",
        size:50,
        // sort:"block_timestamp",
        // fingerprint:"9mPzvhwuzujE1TfigFV5NK5pvjiYHpsYV27iJmFYYTDhAUyFGYX5vb3Ts1ktx2mG2KNmGrxn9gAdFmG78DG82cMJP2DJujNme"
    }).then((rest:any)=>{
    console.log(rest)
}).catch((e:any)=>{
    console.log(">>>>",e)
})