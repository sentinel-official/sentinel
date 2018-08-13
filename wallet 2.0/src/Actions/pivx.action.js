import { sendError } from './authentication.action';
import { B_URL } from './../Constants/constants';
const Web3 = require('web3');
const config = require('./../Constants/config');
const web3 = new Web3();
const EthereumTx = require('ethereumjs-tx');
var contract;

const SENTINEL_ABI = [{ "constant": true, "inputs": [], "name": "name", "outputs": [{ "name": "", "type": "string" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "_spender", "type": "address" }, { "name": "_value", "type": "uint256" }], "name": "approve", "outputs": [{ "name": "success", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [{ "name": "", "type": "bytes32" }], "name": "services", "outputs": [{ "name": "", "type": "address" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "totalSupply", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "_from", "type": "address" }, { "name": "_to", "type": "address" }, { "name": "_value", "type": "uint256" }], "name": "transferFrom", "outputs": [{ "name": "success", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "decimals", "outputs": [{ "name": "", "type": "uint8" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "_value", "type": "uint256" }], "name": "burn", "outputs": [{ "name": "success", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [{ "name": "", "type": "address" }], "name": "balanceOf", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "_from", "type": "address" }, { "name": "_value", "type": "uint256" }], "name": "burnFrom", "outputs": [{ "name": "success", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "name": "_serviceName", "type": "bytes32" }, { "name": "_from", "type": "address" }, { "name": "_to", "type": "address" }, { "name": "_value", "type": "uint256" }], "name": "payService", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "owner", "outputs": [{ "name": "", "type": "address" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "symbol", "outputs": [{ "name": "", "type": "string" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "_to", "type": "address" }, { "name": "_value", "type": "uint256" }], "name": "transfer", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "name": "_spender", "type": "address" }, { "name": "_value", "type": "uint256" }, { "name": "_extraData", "type": "bytes" }], "name": "approveAndCall", "outputs": [{ "name": "success", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [{ "name": "", "type": "address" }, { "name": "", "type": "address" }], "name": "allowance", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "_owner", "type": "address" }], "name": "transferOwnership", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "name": "_serviceName", "type": "bytes32" }, { "name": "_serviceAddress", "type": "address" }], "name": "deployService", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "name": "_tokenName", "type": "string" }, { "name": "_tokenSymbol", "type": "string" }, { "name": "_decimals", "type": "uint8" }, { "name": "_totalSupply", "type": "uint256" }], "payable": false, "stateMutability": "nonpayable", "type": "constructor" }, { "anonymous": false, "inputs": [{ "indexed": true, "name": "from", "type": "address" }, { "indexed": true, "name": "to", "type": "address" }, { "indexed": false, "name": "value", "type": "uint256" }], "name": "Transfer", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "name": "from", "type": "address" }, { "indexed": false, "name": "value", "type": "uint256" }], "name": "Burn", "type": "event" }];

function getAddress() {
    if (localStorage.getItem('config') === 'TEST')
        return config.test.sentinelAddress
    else
        return config.main.sentinelAddress
}
function setWeb3() {
    if (localStorage.getItem('config') === 'TEST')
        web3.setProvider(new web3.providers.HttpProvider(config.test.infuraUrl));
    else
        web3.setProvider(new web3.providers.HttpProvider(config.main.infuraUrl));
}
function setContract() {
    if (localStorage.getItem('config') === 'TEST')
        contract = web3.eth.contract(SENTINEL_ABI).at(config.test.sentinelAddress);
    else
        contract = web3.eth.contract(SENTINEL_ABI).at(config.main.sentinelAddress);
}

export function tokenTransaction(from_addr, to_addr, amount, gas_price, gas, privateKey, cb) {
    try {
        // amount = amount * Math.pow(10, 8);
        setWeb3();
        setContract();
        var SENTINEL_ADDRESS = getAddress();
        var data = contract.transfer.getData(to_addr, amount, { from: from_addr });
        var txParams = {
            nonce: web3.toHex(web3.eth.getTransactionCount(from_addr)),
            gasPrice: gas_price ? gas_price : web3.toHex(web3.eth.gasPrice),
            gasLimit: gas,
            from: from_addr,
            to: SENTINEL_ADDRESS,
            value: '0x00',
            data: data
        }
        var tx = new EthereumTx(txParams);
        tx.sign(privateKey);
        var serializedTx = '0x' + tx.serialize().toString('hex');
        cb(serializedTx);
    } catch (Err) {
        sendError(Err);
    }
}
export function swapPivx(account_addr, from, to, cb) {
    try {
        fetch(B_URL + '/swaps/new-address', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-type': 'application/json',
                'Authorization': localStorage.getItem('access_token')
            },
            body: JSON.stringify({
                account_addr: account_addr,
                from: from,
                to: to
            })
        }).then(function (response) {
            response.json().then(function (response) {
                if (response.success) {
                    var address = response['address'];
                    cb(null, address);
                } else cb({ message: response.message || 'Error occurred while swapping.' }, null);
            });
        })
    } catch (Err) {
        sendError(Err);
    }
}


export function ethTransaction(from_addr, to_addr, amount, gas_price, gas, privateKey, isPivx, cb) {
    try {
        setWeb3();
        var txParams = {
            nonce: web3.toHex(web3.eth.getTransactionCount(from_addr)),
            gasPrice: gas_price ? gas_price : web3.toHex(web3.eth.gasPrice),
            gasLimit: gas,
            from: from_addr,
            to: to_addr,
            value: isPivx ? web3.toHex(web3.toWei(amount, 'ether')) : web3.toHex(amount),
            data: ''
        }
        var tx = new EthereumTx(txParams);
        tx.sign(privateKey);
        var serializedTx = '0x' + tx.serialize().toString('hex');
        cb(serializedTx);
    } catch (Err) {
        sendError(Err);
    }
}