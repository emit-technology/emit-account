import {EVENT_TYPE, EventStruct, EventType} from "../types";
import * as constant from "../common/constant";
import {ApprovalEvent, DepositEvent, ProposalEvent, TransferEvent} from "../types/eth";

const Web3 = require('web3');
const web3 = new Web3(constant.ETH_HOST);

interface configType {
    type: EVENT_TYPE,
    abi: any
}

export const EVENT_ABI_CONFIG: Array<configType> = [
    {
        type: EVENT_TYPE.ERC20_Transfer,
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
        type: EVENT_TYPE.ERC20_Approve,
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
        type: EVENT_TYPE.CROSS_DEPOSIT,
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
        type: EVENT_TYPE.CROSS_PROPOSAL,
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
    }
]

class Event {

    constructor() {
    }

    decodeLog(num: number, txHash: string, contractAddress: string, topics: Array<string>, data: string): EventStruct | undefined {
        const topic = topics[0]
        let eventTypeEnum = EVENT_TYPE._;
        let input: any = {};
        for (let conf of EVENT_ABI_CONFIG) {
            if (topic === web3.eth.abi.encodeEventSignature(conf.abi)) {
                eventTypeEnum = conf.type;
                input = conf.abi["inputs"];
                break
            }
        }
        if (eventTypeEnum == EVENT_TYPE._) {
            return
        }
        let ret: any = {};
        switch (eventTypeEnum) {
            case EVENT_TYPE.CROSS_DEPOSIT:
                const rest: any = web3.eth.abi.decodeLog(input, data, topics.slice(1));
                const t: DepositEvent = {
                    destinationChainID: rest.destinationChainID,
                    resourceID: rest.resourceID,
                    depositNonce: rest.depositNonce
                }
                ret = t;
                break;
            case EVENT_TYPE.CROSS_PROPOSAL:
                const rest2: any = web3.eth.abi.decodeLog(input, data, topics.slice(1));
                const t2: ProposalEvent = {
                    originChainID: rest2.originChainID,
                    depositNonce: rest2.depositNonce,
                    status: rest2.status,
                    resourceID: rest2.resourceID,
                    dataHash: rest2.dataHash
                }
                ret = t2;
                break;
            case EVENT_TYPE.ERC20_Approve:
                const rest3: any = web3.eth.abi.decodeLog(input, data, topics.slice(1));
                const t3: ApprovalEvent = {
                    owner: rest3.owner,
                    spender: rest3.spender,
                    value: rest3.value
                }
                ret = t3;
                break;
            case EVENT_TYPE.ERC20_Transfer:
                const rest4: any = web3.eth.abi.decodeLog(input, data, topics.slice(1));
                const t4: TransferEvent = {
                    from: rest4.from,
                    to: rest4.to,
                    value: rest4.value
                }
                ret = t4;
                break;
            default:
                break
        }
        return {
            num: num,
            txHash: txHash,
            contractAddress: contractAddress,
            eventName: eventTypeEnum,
            topic: topic,
            event: ret
        }
    }
}

const event:Event = new Event();

export default event