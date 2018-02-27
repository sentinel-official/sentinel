import { getKeystore } from './AccountActions';
const keythereum = require('keythereum');
const EthereumTx = require('ethereumjs-tx');
const Web3 = require('web3');
const config = require('../config');
const web3 = new Web3();
web3.setProvider(new web3.providers.HttpProvider(config.infuraUrl));
const SENTINEL_ABI = [{ "constant": true, "inputs": [], "name": "name", "outputs": [{ "name": "", "type": "string" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "_spender", "type": "address" }, { "name": "_value", "type": "uint256" }], "name": "approve", "outputs": [{ "name": "success", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [{ "name": "", "type": "bytes32" }], "name": "services", "outputs": [{ "name": "", "type": "address" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "totalSupply", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "_from", "type": "address" }, { "name": "_to", "type": "address" }, { "name": "_value", "type": "uint256" }], "name": "transferFrom", "outputs": [{ "name": "success", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "decimals", "outputs": [{ "name": "", "type": "uint8" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "_value", "type": "uint256" }], "name": "burn", "outputs": [{ "name": "success", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [{ "name": "", "type": "address" }], "name": "balanceOf", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "_from", "type": "address" }, { "name": "_value", "type": "uint256" }], "name": "burnFrom", "outputs": [{ "name": "success", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "name": "_serviceName", "type": "bytes32" }, { "name": "_from", "type": "address" }, { "name": "_to", "type": "address" }, { "name": "_value", "type": "uint256" }], "name": "payService", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "owner", "outputs": [{ "name": "", "type": "address" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "symbol", "outputs": [{ "name": "", "type": "string" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "_to", "type": "address" }, { "name": "_value", "type": "uint256" }], "name": "transfer", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "name": "_spender", "type": "address" }, { "name": "_value", "type": "uint256" }, { "name": "_extraData", "type": "bytes" }], "name": "approveAndCall", "outputs": [{ "name": "success", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [{ "name": "", "type": "address" }, { "name": "", "type": "address" }], "name": "allowance", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "_owner", "type": "address" }], "name": "transferOwnership", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "name": "_serviceName", "type": "bytes32" }, { "name": "_serviceAddress", "type": "address" }], "name": "deployService", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "name": "_tokenName", "type": "string" }, { "name": "_tokenSymbol", "type": "string" }, { "name": "_decimals", "type": "uint8" }, { "name": "_totalSupply", "type": "uint256" }], "payable": false, "stateMutability": "nonpayable", "type": "constructor" }, { "anonymous": false, "inputs": [{ "indexed": true, "name": "from", "type": "address" }, { "indexed": true, "name": "to", "type": "address" }, { "indexed": false, "name": "value", "type": "uint256" }], "name": "Transfer", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "name": "from", "type": "address" }, { "indexed": false, "name": "value", "type": "uint256" }], "name": "Burn", "type": "event" }];
const SENTINEL_ADDRESS = config.sentinelAddress;
const contract = web3.eth.contract(SENTINEL_ABI).at(SENTINEL_ADDRESS);

export function tokenTransaction(from_addr, to_addr, amount, privateKey, cb) {
    amount = amount * Math.pow(10, 8);
    var data = contract.transfer.getData(to_addr, amount, { from: from_addr });
    var txParams = {
        nonce: web3.toHex(web3.eth.getTransactionCount(from_addr)),
        gasPrice: web3.toHex(web3.eth.gasPrice.c[0]),
        gasLimit: web3.toHex(config.gasLimit),
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

export function ethTransaction(from_addr, to_addr, amount, privateKey, cb) {
    var txParams = {
        nonce: web3.toHex(web3.eth.getTransactionCount(from_addr)),
        gasPrice: web3.toHex(web3.eth.gasPrice.c[0]),
        gasLimit: web3.toHex(config.gasLimit),
        from: from_addr,
        to: to_addr,
        value: web3.toHex(web3.toWei(amount, 'ether')),
        data: ''
    }
    var tx = new EthereumTx(txParams);
    tx.sign(privateKey);
    var serializedTx = '0x' + tx.serialize().toString('hex');
    cb(serializedTx);
}

export function getPrivateKey(password, cb) {
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
                cb({ message: 'Keystore and Password does not match' }, null);
            }
        }
    })
}