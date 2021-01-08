export const SERO_RPC_HOST = "http://172.31.34.20:8545";
export const ETH_HOST = "http://172.31.43.228:8545";

export const API_ETHERSCAN = "https://api.etherscan.io/api?";
const API_KEY = "YOUR API KEY";
export const GAS_TRACKER = "module=gastracker&action=gasoracle&apikey="+API_KEY;
export const GAS_ESTIMATE = "module=gastracker&action=gasestimate&apikey="+API_KEY+"&gasprice=";

export const mongo = {
    host: "mongodb://localhost:27017,localhost:27018,localhost:27019?replicaSet=rs",

    sero: {
        name: "sero",
        transactionOptions: {
            readPreference: 'primary',
            readConcern: {level: 'local'},
            writeConcern: {w: 'majority'}
        }
    },

    eth: {
        name: "eth",
        transactionOptions: {
            readPreference: 'primary',
            readConcern: {level: 'local'},
            writeConcern: {w: 'majority'}
        }
    }
};

export const TOKEN_ADDRESS: any = {
    USDT: "0xdac17f958d2ee523a2206206994597c13d831ec7",
    eSERO: "0x944854f404c7C0dF9780651D9B29947C89D8fD19"
}

// Key = Chain
export const CROSS_ADDRESS = {
    ETH: "0xefb47ee694e48ca6a2f8a0c4f00b9578d5db647b",
    SERO: "2CW6VXQqyL6QUpX1WTBPK5fi8ZKBBYFFTJihGHLoNQZn1wkSzbyt3ung8HUME9xCyusLYdVJnqkfBrNg65nrszJBNxadxVjxBGj3xEsRFWRniFKqXBfCJJo2X9GcLjuzrQvB"
}

export const THREAD_CONFIG = {
    CONFIRM_BLOCK_NUM: 12,
    START_AT: {
        SERO: 4791760,
        ETH: 11607531
    },
    LIMIT: {
        SERO: 5000,
        ETH: 10
    }
}