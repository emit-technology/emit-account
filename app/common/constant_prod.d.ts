export declare const SERO_RPC_HOST = "http://172.31.34.20:8545";
export declare const ETH_HOST = "http://172.31.43.228:8545";
export declare const API_ETHERSCAN = "https://api.etherscan.io/api?";
export declare const GAS_TRACKER: string;
export declare const GAS_ESTIMATE: string;
export declare const mongo: {
    host: string;
    sero: {
        name: string;
        transactionOptions: {
            readPreference: string;
            readConcern: {
                level: string;
            };
            writeConcern: {
                w: string;
            };
        };
    };
    eth: {
        name: string;
        transactionOptions: {
            readPreference: string;
            readConcern: {
                level: string;
            };
            writeConcern: {
                w: string;
            };
        };
    };
};
export declare const TOKEN_ADDRESS: any;
export declare const CROSS_ADDRESS: {
    ETH: string;
    SERO: string;
};
export declare const THREAD_CONFIG: {
    CONFIRM_BLOCK_NUM: number;
    START_AT: {
        SERO: number;
        ETH: number;
    };
    LIMIT: {
        SERO: number;
        ETH: number;
    };
};
