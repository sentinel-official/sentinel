import Tx from 'ethereumjs-tx';

import { Eth_manager } from './eth'
import { VPN_SERVICE } from '../config/services';
import { ADDRESS as COINBASE_ADDRESS, PRIVATE_KEY as COINBASE_PRIVATE_KEY } from '../config/eth';

class VpnService_Manager {
  constructor(net, name, address, abi) {
    this.net = net;
    this.address = address;
    this.contract = net.web3.eth.contract(abi).at(address);
  }
  async payVpnSession(accountAddr, amount, sessionId, nonce, cb) {
    let rawTx = {
      nonce: nonce,
      gasPrice: this.net.web3.toHex(this.net.web3.eth.gasPrice),
      gasLimit: this.net.web3.toHex(500000),
      to: this.address,
      value: '0x0',
      data: this.contract.payVpnSession.getData(accountAddr, amount, sessionId)
    };
    let tx = new Tx(rawTx);
    tx.sign(Buffer.from(COINBASE_PRIVATE_KEY, 'hex'));
    let serializedTx = tx.serialize();
    this.net.web3.eth.sendRawTransaction('0x' + serializedTx.toString('hex'), (err, txHash) => {
      cb(err, txHash);
    });
  }
  setInitialPayment(accountAddr, nonce, isPayed = true) {
    let rawTx = {
      nonce: nonce,
      gasPrice: this.net.web3.toHex(this.net.web3.eth.gasPrice),
      gasLimit: this.net.web3.toHex(500000),
      to: this.address,
      value: '0x0',
      data: this.contract.setInitialPaymentOf.getData(accountAddr, isPayed)
    };
    let tx = new Tx(rawTx);
    tx.sign(Buffer.from(COINBASE_PRIVATE_KEY, 'hex'));
    let serializedTx = tx.serialize();
    this.net.web3.eth.sendRawTransaction('0x' + serializedTx.toString('hex'), (err, txHash) => {
      cb(err, txHash);
    });
  }
  getDueAmount(accountAddr, cb) {
    this.contract.getDueAmountOf(accountAddr, { from: COINBASE_ADDRESS }, (err, rawDueAmount) => {
      let dueAmount = parseInt(rawDueAmount);
      dueAmount = dueAmount / Math.pow(10, 18);
      cb(err, dueAmount);
    });
  }
  getVpnSessionCount(accountAddr, cb) {
    this.contract.getVpnSessionsCountOf(accountAddr, { from: COINBASE_ADDRESS }, (err, rawSessions) => {
      let sessions = parseInt(rawSessions);
      cb(err, sessions);
    });
  }
  getInitialPayment(account_addr, cb) {
    this.contract.getInitialPaymentStatusOf(account_addr, { from: COINBASE_ADDRESS }, (err, isPayed) => {
      cb(null, isPayed);
    });
  }
  getVpnUsage(accountAddr, index, cb) {
    this.contract.getVpnUsageOf(accountAddr, index, { from: COINBASE_ADDRESS }, (err, usage) => {
      cb(err, usage);
    });
  }
  addVpnUsage(fromAddr, toAddr, sentBytes, sessionDuration, amount, timeStamp, sessionId, nonce, cb) {
    try {
      let rawTx = {
        nonce: nonce,
        gasPrice: this.net.web3.toHex(this.net.web3.eth.gasPrice),
        gasLimit: this.net.web3.toHex(500000),
        to: this.address,
        value: '0x0',
        data: this.contract.addVpnUsage.getData(fromAddr, toAddr, sentBytes, sessionDuration, amount, timeStamp, sessionId)
      };
      let tx = new Tx(rawTx);
      tx.sign(Buffer.from(COINBASE_PRIVATE_KEY, 'hex'));
      let serializedTx = tx.serialize();
      this.net.web3.eth.sendRawTransaction('0x' + serializedTx.toString('hex'), (err, txHash) => {
        if (err)
          cb(err, null);
        else
          cb(null, txHash);
      });
    }
    catch (error) {
      cb(error, null);
    }
  }
}

export const VpnServiceManager = new VpnService_Manager(Eth_manager['rinkeby'], VPN_SERVICE['name'], VPN_SERVICE['address'], VPN_SERVICE['abi']);