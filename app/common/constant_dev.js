"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.THREAD_CONFIG = exports.CROSS_ADDRESS = exports.TOKEN_ADDRESS = exports.mongo = exports.GAS_ESTIMATE = exports.GAS_TRACKER = exports.API_ETHERSCAN = exports.ETH_HOST = exports.SERO_RPC_HOST = void 0;
exports.SERO_RPC_HOST = "http://106.53.88.143:8547";
exports.ETH_HOST = "http://106.53.88.143:8745";
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
    USDT: "0xdac17f958d2ee523a2206206994597c13d831ec7",
    eSERO: "0x944854f404c7C0dF9780651D9B29947C89D8fD19",
    //new
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
        SERO: 70483,
        ETH: 453
    },
    LIMIT: {
        SERO: 5000,
        ETH: 10
    }
};
//# sourceMappingURL=constant_dev.js.map