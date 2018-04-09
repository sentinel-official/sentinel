import { getKeystore } from './AccountActions';
const keythereum = require('keythereum');
const EthereumTx = require('ethereumjs-tx');
const Web3 = require('web3');
const config = require('../config');
const web3 = new Web3();
const SENTINEL_ABI = [{ "constant": true, "inputs": [], "name": "name", "outputs": [{ "name": "", "type": "string" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "_spender", "type": "address" }, { "name": "_value", "type": "uint256" }], "name": "approve", "outputs": [{ "name": "success", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [{ "name": "", "type": "bytes32" }], "name": "services", "outputs": [{ "name": "", "type": "address" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "totalSupply", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "_from", "type": "address" }, { "name": "_to", "type": "address" }, { "name": "_value", "type": "uint256" }], "name": "transferFrom", "outputs": [{ "name": "success", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "decimals", "outputs": [{ "name": "", "type": "uint8" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "_value", "type": "uint256" }], "name": "burn", "outputs": [{ "name": "success", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [{ "name": "", "type": "address" }], "name": "balanceOf", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "_from", "type": "address" }, { "name": "_value", "type": "uint256" }], "name": "burnFrom", "outputs": [{ "name": "success", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "name": "_serviceName", "type": "bytes32" }, { "name": "_from", "type": "address" }, { "name": "_to", "type": "address" }, { "name": "_value", "type": "uint256" }], "name": "payService", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "owner", "outputs": [{ "name": "", "type": "address" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "symbol", "outputs": [{ "name": "", "type": "string" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "_to", "type": "address" }, { "name": "_value", "type": "uint256" }], "name": "transfer", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "name": "_spender", "type": "address" }, { "name": "_value", "type": "uint256" }, { "name": "_extraData", "type": "bytes" }], "name": "approveAndCall", "outputs": [{ "name": "success", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [{ "name": "", "type": "address" }, { "name": "", "type": "address" }], "name": "allowance", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "_owner", "type": "address" }], "name": "transferOwnership", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "name": "_serviceName", "type": "bytes32" }, { "name": "_serviceAddress", "type": "address" }], "name": "deployService", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "name": "_tokenName", "type": "string" }, { "name": "_tokenSymbol", "type": "string" }, { "name": "_decimals", "type": "uint8" }, { "name": "_totalSupply", "type": "uint256" }], "payable": false, "stateMutability": "nonpayable", "type": "constructor" }, { "anonymous": false, "inputs": [{ "indexed": true, "name": "from", "type": "address" }, { "indexed": true, "name": "to", "type": "address" }, { "indexed": false, "name": "value", "type": "uint256" }], "name": "Transfer", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "name": "from", "type": "address" }, { "indexed": false, "name": "value", "type": "uint256" }], "name": "Burn", "type": "event" }];
var contract;
let lang = require('../Components/language');

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

function getAddress() {
    if (localStorage.getItem('config') === 'TEST')
        return config.test.sentinelAddress
    else
        return config.main.sentinelAddress
}

export function getGasCost(from_addr, to_addr, amount, unit, cb) {
    var gasCost;
    console.log(from_addr, to_addr, amount);
    setWeb3();
    if (unit === 'ETH') {
        try {
            gasCost = web3.eth.estimateGas({ to: to_addr, value: amount })
            console.log("Gas...", gasCost)
        } catch (err) {
            console.log("Error...", err)
            gasCost = 21000
        }
        cb(gasCost)
    }
    else {
        setContract()
        try {
            gasCost = contract.transfer.estimateGas(to_addr, amount, { from: from_addr })
            console.log("Gas...", gasCost)
        } catch (err) {
            console.log("Error...", err)
            gasCost = 38119
        }
        cb(gasCost)
    }
}

export function tokenTransaction(from_addr, to_addr, amount, gas_price, gas, privateKey, cb) {
    // amount = amount * Math.pow(10, 8);
    console.log("Amount..",amount);
    setWeb3();
    setContract();
    var SENTINEL_ADDRESS = getAddress();
    var data = contract.transfer.getData(to_addr, amount, { from: from_addr });
    var txParams = {
        nonce: web3.toHex(web3.eth.getTransactionCount(from_addr)),
        gasPrice: gas_price,
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
}

export function ethTransaction(from_addr, to_addr, amount, gas_price, gas, privateKey, cb) {
    setWeb3();
    console.log("Amount..",amount);
    var txParams = {
        nonce: web3.toHex(web3.eth.getTransactionCount(from_addr)),
        gasPrice: gas_price,
        gasLimit: gas,
        from: from_addr,
        to: to_addr,
        value: web3.toHex(amount),
        data: ''
    }
    var tx = new EthereumTx(txParams);
    tx.sign(privateKey);
    var serializedTx = '0x' + tx.serialize().toString('hex');
    cb(serializedTx);
}

export function getPrivateKey(password, language, cb) {
    getKeystore(function (err, data) {
        if (err) cb(err, null);
        else {
            var keystore = JSON.parse(data)
            try {
                var privateKey = keythereum.recover(password, keystore);
                cb(null, privateKey);
                // setTimeout(function () { cb(null, privateKey) }, 2000);
            }
            catch (err) {
                cb({ message: lang[language].KeyPassMatch }, null);
            }
        }
    })
}