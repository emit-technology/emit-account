"use strict";
exports.__esModule = true;
exports.TRC20_ADDRESS = exports.TRON_API_HOST = exports.THREAD_CONFIG = exports.CROSS_ADDRESS = exports.TOKEN_ADDRESS = exports.mongo = exports.GAS_ESTIMATE = exports.GAS_TRACKER = exports.API_ETHERSCAN = exports.ETH_HOST = exports.SERO_RPC_HOST = void 0;
exports.SERO_RPC_HOST = "http://172.31.34.20:8545";
exports.ETH_HOST = "http://172.31.43.228:8545";
exports.API_ETHERSCAN = "https://api.etherscan.io/api?";
var API_KEY = "YOUR API KEY";
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
    },
    tron: {
        name: "tron",
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
    WBTC: "0x2260fac5e5542a773aa44fbcfedf7c193bc2c599",
    WETH: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2"
};
// Key = Chain
exports.CROSS_ADDRESS = {
    ETH: "0xefb47ee694e48ca6a2f8a0c4f00b9578d5db647b",
    SERO: "2CW6VXQqyL6QUpX1WTBPK5fi8ZKBBYFFTJihGHLoNQZn1wkSzbyt3ung8HUME9xCyusLYdVJnqkfBrNg65nrszJBNxadxVjxBGj3xEsRFWRniFKqXBfCJJo2X9GcLjuzrQvB",
    TRON: "TAo46rvXgYorCL1xfWEQ1MqRqwnZxuCp8P"
};
exports.THREAD_CONFIG = {
    CONFIRM_BLOCK_NUM: 12,
    START_AT: {
        SERO: 4791760,
        ETH: 11607531,
        TRON: 27214560
    },
    LIMIT: {
        SERO: 5000,
        ETH: 10,
        TRON: 50
    }
};
exports.TRON_API_HOST = {
    fullNode: "https://api.trongrid.io/",
    solidityNode: "https://api.trongrid.io",
    eventServer: "https://api.trongrid.io"
};
exports.TRC20_ADDRESS = {
    USDT: "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t"
};
