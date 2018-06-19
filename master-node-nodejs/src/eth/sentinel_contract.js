import { ETHManager, mainnet, rinkeby } from './eth'
import {
  DECIMALS,
  SENTINEL_ABI,
  SENTINEL_ADDRESS,
  SENTINEL_NAME,
  SENTINEL_TEST_ABI,
  SENTINEL_TEST_ADDRESS,
  SENTINEL_TEST_NAME
} from '../utils/config'
import Tx from 'ethereumjs-tx'

let SENT = mainnet.web3.eth.contract(SENTINEL_ABI).at(SENTINEL_ADDRESS);

function SentinelManager(net, name, address, abi) {
  this.net = net
  this.address = address
  this.contract = net.web3.eth.contract(abi).at(address)
}

SentinelManager.prototype.getBalance = function (accountAddr, cb) {
  this.net.web3.eth.getBalance(accountAddr,
    (err, balance) => {
      cb(err, balance)
    })
}

SentinelManager.prototype.transferAmount = function (toAddr, amount, privateKey, nonce, cb) {
  let rawTx = {
    nonce: nonce,
    gasPrice: rinkeby.web3.toHex(this.net.web3.eth.gasPrice),
    gasLimit: rinkeby.web3.toHex(500000),
    to: this.address,
    value: '0x0',
    data: this.contract.transfer.getData(toAddr, amount)
  }
  let tx = new Tx(rawTx);
  tx.sign(Buffer.from(privateKey, 'hex'));
  let serializedTx = tx.serialize();
  this.net.web3.eth.sendRawTransaction('0x' + serializedTx.toString('hex'), (err, txHash) => {
    cb(err, txHash)
  })
}

module.exports.SentinelMain = new SentinelManager(mainnet, SENTINEL_NAME, SENTINEL_ADDRESS, SENTINEL_ABI)
module.exports.SentinelRinkeby = new SentinelManager(rinkeby, SENTINEL_TEST_NAME, SENTINEL_TEST_ADDRESS, SENTINEL_TEST_ABI)