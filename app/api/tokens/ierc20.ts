import BigNumber from "bignumber.js";
import * as constant from '../../common/constant';
import {ApprovalEvent, TransferEvent} from "../../types/eth";

const Web3 = require('web3');
export class Ierc20 {

    protected abi: any = [{
        "constant": false,
        "inputs": [{"name": "_spender", "type": "address"}, {"name": "_value", "type": "uint256"}],
        "name": "approve",
        "outputs": [{"name": "success", "type": "bool"}],
        "payable": false,
        "type": "function"
    }, {
        "constant": true,
        "inputs": [],
        "name": "totalSupply",
        "outputs": [{"name": "totalSupply", "type": "uint256"}],
        "payable": false,
        "type": "function"
    },{
        "constant": true,
        "inputs": [],
        "name": "symbol",
        "outputs": [{"name": "symbol", "type": "string"}],
        "payable": false,
        "type": "function"
    }, {
        "constant": false,
        "inputs": [{"name": "_from", "type": "address"}, {"name": "_to", "type": "address"}, {
            "name": "_value",
            "type": "uint256"
        }],
        "name": "transferFrom",
        "outputs": [{"name": "success", "type": "bool"}],
        "payable": false,
        "type": "function"
    }, {
        "constant": true,
        "inputs": [{"name": "_owner", "type": "address"}],
        "name": "balanceOf",
        "outputs": [{"name": "balance", "type": "uint256"}],
        "payable": false,
        "type": "function"
    }, {
        "constant": false,
        "inputs": [{"name": "_to", "type": "address"}, {"name": "_value", "type": "uint256"}],
        "name": "transfer",
        "outputs": [{"name": "success", "type": "bool"}],
        "payable": false,
        "type": "function"
    }, {
        "constant": true,
        "inputs": [{"name": "_owner", "type": "address"}, {"name": "_spender", "type": "address"}],
        "name": "allowance",
        "outputs": [{"name": "remaining", "type": "uint256"}],
        "payable": false,
        "type": "function"
    }, {
        "anonymous": false,
        "inputs": [{"indexed": true, "name": "_from", "type": "address"}, {
            "indexed": true,
            "name": "_to",
            "type": "address"
        }, {"indexed": false, "name": "_value", "type": "uint256"}],
        "name": "Transfer",
        "type": "event"
    }, {
        "anonymous": false,
        "inputs": [{"indexed": true, "name": "_owner", "type": "address"}, {
            "indexed": true,
            "name": "_spender",
            "type": "address"
        }, {"indexed": false, "name": "_value", "type": "uint256"}],
        "name": "Approval",
        "type": "event"
    }];
    protected contract: any;
    protected web3: any;

    public address;
    constructor(address: string,host:string) {
        const provider = new Web3.providers.HttpProvider(host,{
            timeout: constant.defaultHttpTimeout,
            keepAlive: false
        })
        this.address = address;
        this.web3 = new Web3(provider);
        this.contract = new this.web3.eth.Contract(this.abi, address);
    }

    totalSupply = async (): Promise<BigNumber> => {
        return new Promise((resolve,reject)=>{
            this.contract.methods.totalSupply().call({}).then(function (rest:any){
                resolve(new BigNumber(rest));
            }).catch((e:any)=>{
                reject(e)
            })
        })
    }

    symbol = async (): Promise<string> => {
        return new Promise((resolve,reject)=>{
            this.contract.methods.symbol().call({}).then(function (rest:any){
                resolve(rest);
            }).catch((e:any)=>{
                reject(e)
            })
        })
    }

    balanceOf = async (who: string): Promise<BigNumber> => {
        return new Promise((resolve,reject)=>{
            this.contract.methods.balanceOf(who).call({from:who}).then(function (rest:any){
                resolve(new BigNumber(rest));
            }).catch((e:any)=>{
                reject(e)
            })
        })
    }

    allowance = async (owner: string, spender: string) => {

    }

    transfer = async (to: string, value: BigNumber) => {

    }

    approve = async (spender: string, value: BigNumber) => {

    }

    transferFrom = async (from: string, to: string, value: BigNumber) => {

    }

    decodeTransferLog = (data: string, topics: Array<string>):TransferEvent => {
        const rest:any = this.web3.eth.abi.decodeLog([
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
        ], data, topics.slice(1));
        return {
            from:rest[0],
            to:rest[1],
            value:rest[2]
        }
    }

    decodeApprovalLog = (data: string, topics: Array<string>):ApprovalEvent => {
        const rest:any = this.web3.eth.abi.decodeLog([
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
        ], data, topics.slice(1));
        return {
            owner:rest[0],
            spender:rest[1],
            value:rest[2]
        }
    }

    encodeEventSignature =(name:string)=>{
        if(name === "Transfer"){
            return this.web3.eth.abi.encodeEventSignature({
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
            })
        }else if(name === "Approval"){
            return this.web3.eth.abi.encodeEventSignature({
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
            })
        }
        return ""
    }

}

export default Ierc20