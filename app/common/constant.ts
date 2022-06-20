//for test
export const SERO_RPC_HOST = "http://127.0.0.1:8549";
//export const ETH_HOST = "http://127.0.0.1:8745";

export const ETH_HOST = "http://18.180.150.229:8545";

export const BSC_HOST = "http://18.180.150.229:8545";
// export const BSC_HOST = "https://falling-cold-snow.bsc.quiknode.pro/b34a82333e31f63105c6969a1db612c75ff9bb9b/";

export const API_ETHERSCAN = "https://api-cn.etherscan.com/api?";
const API_KEY = "ZJVD7B6TYIK2VRH844ZR82IB1AMDR5YTW1";
export const GAS_TRACKER = "module=gastracker&action=gasoracle&apikey=" + API_KEY;
export const GAS_ESTIMATE = "module=gastracker&action=gasestimate&apikey=" + API_KEY + "&gasprice=";

export const BSC_COMMIT_TX_HOST = "http://18.180.150.229:8545";

export const mongo = {
	host: "mongodb://localhost:27017,localhost:27018,localhost:27019?replicaSet=rs",

	sero: {
		name: "sero_test",
		transactionOptions: {
			readPreference: 'primary',
			readConcern: {level: 'local'},
			writeConcern: {w: 'majority'}
		}
	},

	eth: {
		name: "eth_test",
		transactionOptions: {
			readPreference: 'primary',
			readConcern: {level: 'local'},
			writeConcern: {w: 'majority'}
		}
	},

	tron: {
		name: "tron_test",
		transactionOptions: {
			readPreference: 'primary',
			readConcern: {level: 'local'},
			writeConcern: {w: 'majority'}
		}
	},

	bsc: {
		name: "bsc_test",
		transactionOptions: {
			readPreference: 'primary',
			readConcern: {level: 'local'},
			writeConcern: {w: 'majority'}
		}
	},

};

export const TOKEN_ADDRESS: any = {
	// USDT: "0x793359af58fa92e0beb08f37e509071c42dcc32c",
	// eSERO: "0xe462e7697F2fb33DE4eb46665D4E7D29DA647816",
	//
	// WBTC: "0x50395D1b70d8a73eF350AEbFE6278a212B018Ade",
	// WETH: "0xE69B7b16AD568BDF11924C0b471176553e9AD1aF",
	// eLIGHT: "0x1A7D3DDd87eAF9d42b06A7AE34451cB5822aB705",
	// ePFID: "0x9F6cE8d19256127b294e793ED09A0d4efe2C2b09"
	ETH: "0x0000000000000000000000000000000000000000"
}

export const ERC721_ADDRESS: any = {
	// eMedal: "0xd8C5e7797A973DBc55879de4430c3A2527876A0a"
}

// Key = Chain
export const CROSS_ADDRESS = {
	ETH: "0xC7c287200D0952d4f591509463fD5203C7D88F56",
	// SERO: "2JgvRCVfsk6cryY95ghYbVez1eR2MSwyWmJGvTpVr4yid1hGWGiruMKay5Q66MfcTDUfaGgyyaJGYmjPZQsHUcKQx7hnxqM37sba2DfomwRJqpB6mjF7pUFEfiiC2MkbWBaP",
	TRON: "TAongUaLfhatu89hZAxgkinS57zfViBYMj",
	// BSC: "0x78f66f75b94dfD01704A04B997eE7b2A300b1B3b"
}

// Key =s Chain
export const CROSS_NFT_ADDRESS = {
	ETH: "0xD9ec8487B3754010bEf3EDAf6c07C3F01Db45f85",
	// SERO: "sUjefhNxawDbgAwLquyuZiZ5piV1jJRXJrzQYS3AYZyyuBVM3Tk3BuRMbgdshdp1V1LxCZSFtwAPXZ5PsLhhXSjRtZSb2Cz11ywBFjCxGaWuthg8DEWNoiVpkMxLAXHTNa3",
	// BSC: "0x2fd8aab81a55986b7c3dc94d6157db8f467c72e1"
}

export const TOKEN_ADDRESS_BSC: any = {
	// bLIGHT: "0x815de5572b1de6DF557CF6d0dbF5b57c1876E493",
	// bDARK: "0x27A35f7521A4d3Affec83B181C25c43BcC489625",
	// bSERO: "0x8CAB1Fb646d4d70A08fbd5C019340f26aE7D293A",
	// bPFID: "0xEb7388D93a2117a82F84061281bE6CEFA02a317B",
	// EARTH: "0x25EcA5C3085C5aBCFdC4ABCb69017dc470C9533B",
	// WATER: "0x2a16EDD6fFf8F4812384dE254275366f139602c8"
	"Bangs":"0xec983Ef3B5b005a1A14e1AA1e911F0dbFDCc1C7c",
	BNB: "0x0000000000000000000000000000000000000000"
	// "USDT": "0x5852aa09ceec8e2d64613fae2b909998986d2407"
}
export const ERC721_ADDRESS_BSC: any = {
	// bWRAPPED_EMIT_AX: "0xbe1fc252a3e0c7082d9b8c0de6bc011201fe268d",
	// COUNTER: "0x224bA6c4628e4f550515a74AE310fc090864A6e5"
}

export const CROSS_ADDRESS_BSC:any = {
	// BSC: "0x4a6119E5ABf0B191B5Df50C95f9925f4aCBe5692"
}

export const CROSS_NFT_ADDRESS_BSC:any = {
	// BSC: "0x8d94c3a6c38219cdab2091d9c30f8172a7dbfd06"
}

export const EMIT_ADDRESS:any = {
	BSC: [
		// "0x059244E8007Af9b1379229A8066a119a6Ff65919",
		// "0x3EA3FfB3C30F09CdBC0c312ffF737b4A6Bf4ae8B",
		// "0x77b5fCBa38070abD5E4A0f11DF938D7a82484df1",
		// "0x89FD3729480f8Bc598035700e0DA4AFFb03f1178",
		// "0x0E1c73565c6A183442010ba051A124c85F1cb927",
		// "0x180E541f6c9E9d6996074BD1beBbd6807186d6fe",
		//
		// "0x770BC5Bb1F70Ed23b283Ae386282a630EE1d20cd",
		// "0xD483b88c69E3a3199BD50756371B169b86840026",
		// "0x5f8eafcab08Cd1FAf6BFD156ca0906AA084EE7a6",
		// "0xc32c5cfC4DfDB6D34Ba45553c9cA2aB3a634c41c",

		"0x42e529d0249410fBf3b0690Ca2f100a83fB78F5F",
		"0xa0a041d451c3ae2Cb32C0a8c9fD054D6bf281D02",
		"0x42811d4F3D4664E5eD75f4B9889E41B910525ce9"

	],
	ETH: [

	]
}

export const THREAD_CONFIG = {
	CONFIRM_BLOCK_NUM: 0,
	START_AT: {
		SERO: 1100000,
		ETH: 0,
		TRON: 11773100,
		BSC: 0
	},
	LIMIT: {
		SERO: 2000,
		ETH: 100,
		TRON: 50,
		BSC: 100
	}
}

export const TRON_API_HOST = {
	fullNode: "https://api.shasta.trongrid.io/",
	solidityNode: "https://api.shasta.trongrid.io",
	eventServer: "https://api.shasta.trongrid.io"
}

export const TRC20_ADDRESS = {
	USDT: "TCUnjCxPqwE2SB9vRo8oNwDZx9b7DxAkbv"
}

export const SYNC_TIME = 1000 * 1 * 100

const IP_PKR_COUNT_ARRAY:Map<string,Array<string>> = new Map<string, Array<string>>();

export const IS_MASTER_NODE = true

const BLACK_PKR = [];

export const checkCommit = (tx:any,req:any):boolean=>{
	return true
}

export const defaultHttpTimeout = 20000;