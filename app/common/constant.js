"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TRC20_ADDRESS = exports.TRON_API_HOST = exports.THREAD_CONFIG = exports.CROSS_ADDRESS = exports.TOKEN_ADDRESS = exports.mongo = exports.GAS_ESTIMATE = exports.GAS_TRACKER = exports.API_ETHERSCAN = exports.ETH_HOST = exports.SERO_RPC_HOST = void 0;
exports.SERO_RPC_HOST = "http://106.53.88.143:8547";
exports.ETH_HOST = "http://106.53.88.143:8745";
// export const SERO_RPC_HOST = "http://10.0.0.16:8547";
// export const ETH_HOST = "http://10.0.0.16:8855";
// export const SERO_RPC_HOST = "http://172.31.34.20:8545";
// export const ETH_HOST = "http://172.31.43.228:8545";
exports.API_ETHERSCAN = "https://api-cn.etherscan.com/api?";
var API_KEY = "ZJVD7B6TYIK2VRH844ZR82IB1AMDR5YTW1";
exports.GAS_TRACKER = "module=gastracker&action=gasoracle&apikey=" + API_KEY;
exports.GAS_ESTIMATE = "module=gastracker&action=gasestimate&apikey=" + API_KEY + "&gasprice=";
exports.mongo = {
    host: "mongodb://localhost:27017,localhost:27018,localhost:27019?replicaSet=rs",
    sero: {
        name: "sero",
        transactionOptions: {
            readPreference: 'primary',
            readConcern: { level: 'local' },
            writeConcern: { w: 'majority' }
        }
    },
    eth: {
        name: "eth",
        transactionOptions: {
            readPreference: 'primary',
            readConcern: { level: 'local' },
            writeConcern: { w: 'majority' }
        }
    }
};
exports.TOKEN_ADDRESS = {
    USDT: "0x793359af58fa92e0beb08f37e509071c42dcc32c",
    eSERO: "0xe462e7697F2fb33DE4eb46665D4E7D29DA647816",
    WBTC: "0x50395D1b70d8a73eF350AEbFE6278a212B018Ade",
    WETH: "0xE69B7b16AD568BDF11924C0b471176553e9AD1aF"
};
// Key = Chain
exports.CROSS_ADDRESS = {
    ETH: "0xC7c287200D0952d4f591509463fD5203C7D88F56",
    SERO: "GD8XEXxLSG4GxtaTbVEuRJsjoqNSyoRqFzTB367etU3eQvPNeZKaBSSFvdha1UU3dcYuDdZJhoxqTufERKYaZpgQasyWSdsMgRomJfgVMmL32p61m54sfQQe1JVF6t8bqQj"
};
exports.THREAD_CONFIG = {
    CONFIRM_BLOCK_NUM: 0,
    START_AT: {
        SERO: 100000,
        ETH: 0
    },
    LIMIT: {
        SERO: 5000,
        ETH: 100
    }
};
exports.TRON_API_HOST = {
    fullNode: "https://api.shasta.trongrid.io/",
    solidityNode: "https://api.shasta.trongrid.io",
    eventServer: "https://api.shasta.trongrid.io"
};
// export const TRON_API_HOST = {
//     fullNode:"https://api.trongrid.io/",
//     solidityNode:"https://api.trongrid.io",
//     eventServer:"https://api.trongrid.io"
// }
exports.TRC20_ADDRESS = {
    USDT: "TCUnjCxPqwE2SB9vRo8oNwDZx9b7DxAkbv"
};
