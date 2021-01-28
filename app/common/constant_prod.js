"use strict";
// export const SERO_RPC_HOST = "http://10.0.0.11:8545";
// export const ETH_HOST = "http://10.0.0.11:8945";
Object.defineProperty(exports, "__esModule", { value: true });
exports.THREAD_CONFIG = exports.CROSS_ADDRESS = exports.TOKEN_ADDRESS = exports.mongo = exports.GAS_ESTIMATE = exports.GAS_TRACKER = exports.API_ETHERSCAN = exports.ETH_HOST = exports.SERO_RPC_HOST = void 0;
exports.SERO_RPC_HOST = "http://172.31.34.20:8545";
exports.ETH_HOST = "http://172.31.43.228:8545";
exports.API_ETHERSCAN = "https://api.etherscan.io/api?";
var API_KEY = "CRZ8FDVUJ4X2ACZ299CK6GJU6YQN8BB8RD";
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
    ETH: "0xefb47ee694e48ca6a2f8a0c4f00b9578d5db647b",
    SERO: "2CW6VXQqyL6QUpX1WTBPK5fi8ZKBBYFFTJihGHLoNQZn1wkSzbyt3ung8HUME9xCyusLYdVJnqkfBrNg65nrszJBNxadxVjxBGj3xEsRFWRniFKqXBfCJJo2X9GcLjuzrQvB"
};
exports.THREAD_CONFIG = {
    CONFIRM_BLOCK_NUM: 12,
    START_AT: {
        SERO: 4791760,
        ETH: 11607531
    },
    LIMIT: {
        SERO: 5000,
        ETH: 10
    }
};
//# sourceMappingURL=constant_prod.js.map