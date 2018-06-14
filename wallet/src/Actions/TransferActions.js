import { getKeystore, sendError } from './AccountActions';
const keythereum = require('keythereum');
const EthereumTx = require('ethereumjs-tx');
const Web3 = require('web3');
const config = require('../config');
const web3 = new Web3();
const SENTINEL_ABI = [{ "constant": true, "inputs": [], "name": "name", "outputs": [{ "name": "", "type": "string" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "_spender", "type": "address" }, { "name": "_value", "type": "uint256" }], "name": "approve", "outputs": [{ "name": "success", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [{ "name": "", "type": "bytes32" }], "name": "services", "outputs": [{ "name": "", "type": "address" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "totalSupply", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "_from", "type": "address" }, { "name": "_to", "type": "address" }, { "name": "_value", "type": "uint256" }], "name": "transferFrom", "outputs": [{ "name": "success", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "decimals", "outputs": [{ "name": "", "type": "uint8" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "_value", "type": "uint256" }], "name": "burn", "outputs": [{ "name": "success", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [{ "name": "", "type": "address" }], "name": "balanceOf", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "_from", "type": "address" }, { "name": "_value", "type": "uint256" }], "name": "burnFrom", "outputs": [{ "name": "success", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "name": "_serviceName", "type": "bytes32" }, { "name": "_from", "type": "address" }, { "name": "_to", "type": "address" }, { "name": "_value", "type": "uint256" }], "name": "payService", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "owner", "outputs": [{ "name": "", "type": "address" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "symbol", "outputs": [{ "name": "", "type": "string" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "_to", "type": "address" }, { "name": "_value", "type": "uint256" }], "name": "transfer", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "name": "_spender", "type": "address" }, { "name": "_value", "type": "uint256" }, { "name": "_extraData", "type": "bytes" }], "name": "approveAndCall", "outputs": [{ "name": "success", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [{ "name": "", "type": "address" }, { "name": "", "type": "address" }], "name": "allowance", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "_owner", "type": "address" }], "name": "transferOwnership", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "name": "_serviceName", "type": "bytes32" }, { "name": "_serviceAddress", "type": "address" }], "name": "deployService", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "name": "_tokenName", "type": "string" }, { "name": "_tokenSymbol", "type": "string" }, { "name": "_decimals", "type": "uint8" }, { "name": "_totalSupply", "type": "uint256" }], "payable": false, "stateMutability": "nonpayable", "type": "constructor" }, { "anonymous": false, "inputs": [{ "indexed": true, "name": "from", "type": "address" }, { "indexed": true, "name": "to", "type": "address" }, { "indexed": false, "name": "value", "type": "uint256" }], "name": "Transfer", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "name": "from", "type": "address" }, { "indexed": false, "name": "value", "type": "uint256" }], "name": "Burn", "type": "event" }];
var contract;
var tokenGas;
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
    setWeb3();
    if (unit === 'ETH') {
        try {
            gasCost = web3.eth.estimateGas({ to: to_addr, value: amount })
        } catch (err) {
            gasCost = 21000
        }
        cb(gasCost)
    }
    else {
        setContract()
        try {
            gasCost = contract.transfer.estimateGas(to_addr, amount, { from: from_addr })
        } catch (err) {
            gasCost = 38119
        }
        cb(gasCost)
    }
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
    } catch (Err) {
        sendError(Err);
    }
}

export function ethTransaction(from_addr, to_addr, amount, gas_price, gas, privateKey, isPivx, cb) {
    try {
        setWeb3();
        var txParams = {
            nonce: web3.toHex(web3.eth.getTransactionCount(from_addr)),
            gasPrice: gas_price,
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

export function setGas(from_addr, to_addr, amount, cb) {
    try {
        tokenGas = contract.transfer.estimateGas(to_addr, amount, { from: from_addr })
    } catch (err) {
        tokenGas = 38119
    }
    cb(tokenGas);
}

function setSwapContract(contractAddr, cb) {
    fetch('https://api.etherscan.io/api?module=contract&action=getabi&address=' + contractAddr, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-type': 'application/json',
        }
    }).then(function (response) {
        response.json().then(function (resp) {
            if (resp.status === '1') {
                contract = web3.eth.contract(JSON.parse(resp['result'])).at(contractAddr);
                cb(contract);
            } else {
                contract = null;
                cb(null);
            }
        });
    });
}

export function swapTransaction(from_addr, ether_addr, contract_addr, amount, privateKey, unit, cb) {
    try {
        if (amount == 0) {
            cb({ message: 'Please send amount for swapping' }, null)
        } else {
            setWeb3();
            if (unit === 'ETH') {
                var txParams = {
                    nonce: web3.toHex(web3.eth.getTransactionCount(from_addr)),
                    gasPrice: 20 * (10 ** 9),
                    gasLimit: 100000,
                    from: from_addr,
                    to: ether_addr,
                    value: web3.toHex(amount),
                    data: ''
                }
                var tx = new EthereumTx(txParams);
                tx.sign(privateKey);
                var serializedTx = '0x' + tx.serialize().toString('hex');
                cb(null, serializedTx);
            }
            else {
                setSwapContract(contract_addr, function (contract) {
                    if (contract) {
                        setGas(from_addr, ether_addr, amount, function (gasValue) {
                            var data = contract.transfer.getData(ether_addr, amount, { from: from_addr });
                            var txParams = {
                                nonce: web3.toHex(web3.eth.getTransactionCount(from_addr)),
                                gasPrice: 20 * (10 ** 9),
                                gasLimit: gasValue,
                                from: from_addr,
                                to: contract_addr,
                                value: '0x00',
                                data: data
                            }
                            var tx = new EthereumTx(txParams);
                            tx.sign(privateKey);
                            var serializedTx = '0x' + tx.serialize().toString('hex');
                            cb(null, serializedTx);
                        });
                    }
                    else {
                        cb({ message: 'Problem in swapping. Please Try Later' }, null);
                    }
                })

            }
        }
    } catch (Err) {
        sendError(Err);
    }
}