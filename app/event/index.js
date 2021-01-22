"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EVENT_ABI_CONFIG = void 0;
var types_1 = require("../types");
var constant = require("../common/constant");
var Web3 = require('web3');
var web3 = new Web3(constant.ETH_HOST);
exports.EVENT_ABI_CONFIG = [
    {
        type: types_1.EVENT_TYPE.ERC20_Transfer,
        abi: {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": true,
                    "name": "from",
                    "type": "address"
                },
                {
                    "indexed": true,
                    "name": "to",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "name": "value",
                    "type": "uint256"
                }
            ],
            "name": "Transfer",
            "type": "event"
        }
    },
    {
        type: types_1.EVENT_TYPE.ERC20_Approve,
        abi: {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": true,
                    "name": "owner",
                    "type": "address"
                },
                {
                    "indexed": true,
                    "name": "spender",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "name": "value",
                    "type": "uint256"
                }
            ],
            "name": "Approval",
            "type": "event"
        }
    },
    {
        type: types_1.EVENT_TYPE.CROSS_DEPOSIT,
        abi: {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": true,
                    "internalType": "uint8",
                    "name": "destinationChainID",
                    "type": "uint8"
                },
                {
                    "indexed": true,
                    "internalType": "bytes32",
                    "name": "resourceID",
                    "type": "bytes32"
                },
                {
                    "indexed": true,
                    "internalType": "uint64",
                    "name": "depositNonce",
                    "type": "uint64"
                }
            ],
            "name": "Deposit",
            "type": "event"
        }
    },
    {
        type: types_1.EVENT_TYPE.CROSS_PROPOSAL,
        abi: {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": true,
                    "internalType": "uint8",
                    "name": "originChainID",
                    "type": "uint8"
                },
                {
                    "indexed": true,
                    "internalType": "uint64",
                    "name": "depositNonce",
                    "type": "uint64"
                },
                {
                    "indexed": true,
                    "internalType": "enum IDepositEvent.ProposalStatus",
                    "name": "status",
                    "type": "uint8"
                },
                {
                    "indexed": false,
                    "internalType": "bytes32",
                    "name": "resourceID",
                    "type": "bytes32"
                },
                {
                    "indexed": false,
                    "internalType": "bytes32",
                    "name": "dataHash",
                    "type": "bytes32"
                }
            ],
            "name": "ProposalEvent",
            "type": "event"
        }
    },
    {
        type: types_1.EVENT_TYPE.WETH_DEPOSIT,
        abi: {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "dst",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "wad",
                    "type": "uint256"
                }
            ],
            "name": "Deposit",
            "type": "event"
        }
    },
    {
        type: types_1.EVENT_TYPE.WETH_WITHDRAW,
        abi: {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "src",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "wad",
                    "type": "uint256"
                }
            ],
            "name": "Withdrawal",
            "type": "event"
        }
    }
];
var Event = /** @class */ (function () {
    function Event() {
    }
    Event.prototype.decodeLog = function (num, txHash, contractAddress, topics, data) {
        var topic = topics[0];
        var eventTypeEnum = types_1.EVENT_TYPE._;
        var input = {};
        for (var _i = 0, EVENT_ABI_CONFIG_1 = exports.EVENT_ABI_CONFIG; _i < EVENT_ABI_CONFIG_1.length; _i++) {
            var conf = EVENT_ABI_CONFIG_1[_i];
            if (topic === web3.eth.abi.encodeEventSignature(conf.abi)) {
                eventTypeEnum = conf.type;
                input = conf.abi["inputs"];
                break;
            }
        }
        if (eventTypeEnum == types_1.EVENT_TYPE._) {
            return;
        }
        var ret = {};
        switch (eventTypeEnum) {
            case types_1.EVENT_TYPE.CROSS_DEPOSIT:
                var rest = web3.eth.abi.decodeLog(input, data, topics.slice(1));
                var t = {
                    destinationChainID: rest.destinationChainID,
                    resourceID: rest.resourceID,
                    depositNonce: rest.depositNonce
                };
                ret = t;
                break;
            case types_1.EVENT_TYPE.CROSS_PROPOSAL:
                var rest2 = web3.eth.abi.decodeLog(input, data, topics.slice(1));
                var t2 = {
                    originChainID: rest2.originChainID,
                    depositNonce: rest2.depositNonce,
                    status: rest2.status,
                    resourceID: rest2.resourceID,
                    dataHash: rest2.dataHash
                };
                ret = t2;
                break;
            case types_1.EVENT_TYPE.ERC20_Approve:
                var rest3 = web3.eth.abi.decodeLog(input, data, topics.slice(1));
                var t3 = {
                    owner: rest3.owner,
                    spender: rest3.spender,
                    value: rest3.value
                };
                ret = t3;
                break;
            case types_1.EVENT_TYPE.ERC20_Transfer:
                var rest4 = web3.eth.abi.decodeLog(input, data, topics.slice(1));
                var t4 = {
                    from: rest4.from,
                    to: rest4.to,
                    value: rest4.value
                };
                ret = t4;
                break;
            case types_1.EVENT_TYPE.WETH_DEPOSIT:
                var rest5 = web3.eth.abi.decodeLog(input, data, topics.slice(1));
                var t5 = {
                    dst: rest5.dst,
                    wad: rest5.wad
                };
                ret = t5;
                break;
            case types_1.EVENT_TYPE.WETH_WITHDRAW:
                var rest6 = web3.eth.abi.decodeLog(input, data, topics.slice(1));
                var t6 = {
                    src: rest6.src,
                    wad: rest6.wad
                };
                ret = t6;
                break;
            default:
                break;
        }
        return {
            num: num,
            txHash: txHash,
            contractAddress: contractAddress,
            eventName: eventTypeEnum,
            topic: topic,
            event: ret
        };
    };
    return Event;
}());
var event = new Event();
exports.default = event;
