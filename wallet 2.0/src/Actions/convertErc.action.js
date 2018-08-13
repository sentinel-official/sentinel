import { sendError } from './authentication.action';
import { B_URL } from './../Constants/constants';
const Web3 = require('web3');
const config = require('./../Constants/config');
const web3 = new Web3();
const EthereumTx = require('ethereumjs-tx');
var contract;
var tokenGas;
function setWeb3() {
    if (localStorage.getItem('config') === 'TEST')
        web3.setProvider(new web3.providers.HttpProvider(config.test.infuraUrl));
    else
        web3.setProvider(new web3.providers.HttpProvider(config.main.infuraUrl));
}
export const isOnline = function () {
    try {
        if (window.navigator.onLine) {
            return true
        }
        else {
            return false
        }
    } catch (Err) {
        sendError(Err);
    }
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
                var contract = web3.eth.contract(JSON.parse(resp['result'])).at(contractAddr);
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
                    gasPrice: web3.toHex(web3.eth.gasPrice),
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
                                gasPrice: web3.toHex(web3.eth.gasPrice),
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

export function swapRawTransaction(data, toAddr, from, to, cb) {
    try {
        fetch(B_URL + '/swaps/raw-transaction', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Authorization': localStorage.getItem('access_token')
            },
            body: JSON.stringify({
                tx_data: data,
                account_addr: toAddr,
                from: from,
                to: to
            })
        }).then(function (response) {

            response.json().then(function (response) {
                console.log("Response...", response)
                if (response.success === true) {
                    var tx_hash = response['tx_hash'];
                    cb(null, tx_hash);
                } else {
                    sendError(response.error);
                    try {
                        cb({ message: JSON.parse(response.error.error.split("'").join('"')).message || 'Error occurred while initiating transfer amount.' }, null);
                    } catch (expecErr) {
                        cb({ message: response.error || 'Error occurred while initiating transfer amount.' }, null);
                    }
                }
            })
        });
    } catch (Err) {
        sendError(Err);
    }
}
