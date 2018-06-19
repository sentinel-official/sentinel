import { rinkeby, mainnet } from './eth'
import Tx from 'ethereumjs-tx';
import {
  VPNSERVICE_ABI,
  VPNSERVICE_ADDRESS,
  VPNSERVICE_NAME,
  COINBASE_ADDRESS,
  COINBASE_PRIVATE_KEY
} from '../utils/config'

let VPN = rinkeby.web3.eth.contract(VPNSERVICE_ABI).at(VPNSERVICE_ADDRESS);

export const payVpnSession = async (accountAddr, amount, sessionId, nonce, cb) => {

  let rawTx = {
    nonce: nonce,
    gasPrice: rinkeby.web3.toHex(rinkeby.web3.eth.gasPrice),
    gasLimit: rinkeby.web3.toHex(500000),
    to: VPNSERVICE_ADDRESS,
    value: '0x0',
    data: VPN.payVpnSession.getData(accountAddr, amount, sessionId)
  }

  let tx = new Tx(rawTx);
  tx.sign(Buffer.from(COINBASE_PRIVATE_KEY, 'hex'));
  let serializedTx = tx.serialize();

  rinkeby.web3.eth.sendRawTransaction('0x' + serializedTx.toString('hex'), (err, txHash) => {
    cb(err, txHash)
  })
}

export const setInitialPayment = (accountAddr, nonce, isPayed = true) => {
  let rawTx = {
    nonce: nonce,
    gasPrice: rinkeby.web3.toHex(rinkeby.web3.eth.gasPrice),
    gasLimit: rinkeby.web3.toHex(500000),
    to: VPNSERVICE_ADDRESS,
    value: '0x0',
    data: VPN.setInitialPaymentOf.getData(accountAddr, isPayed)
  }

  let tx = new Tx(rawTx);
  tx.sign(new Buffer(COINBASE_PRIVATE_KEY));
  let serializedTx = tx.serialize();

  rinkeby.web3.eth.sendRawTransaction('0x' + serializedTx.toString('hex'), (err, txHash) => {
    cb(err, txHash)
  })
}

export const getDueAmount = (accountAddr, cb) => {
  VPN.getDueAmountOf(accountAddr, { from: COINBASE_ADDRESS },
    (err, rawDueAmount) => {
      let dueAmount = parseInt(rawDueAmount);
      dueAmount = dueAmount / Math.pow(10, 18);
      cb(err, dueAmount)
    });
}

export const getVpnSessionCount = (accountAddr, cb) => {
  VPN.getVpnSessionsCountOf(accountAddr, { from: COINBASE_ADDRESS },
    (err, rawSessions) => {
      let sessions = parseInt(rawSessions);
      cb(err, sessions)
    });
}

export const getInitialPayment = (account_addr, cb) => {
  VPN.getInitialPaymentStatusOf(account_addr, { from: COINBASE_ADDRESS },
    (err, isPayed) => {
      cb(null, isPayed);
    })
}

export const getVpnUsage = (accountAddr, index, cb) => {
  VPN.getVpnUsageOf(accountAddr, index, { from: COINBASE_ADDRESS }, (err, usage) => {
    cb(err, usage)
  })
}

export const addVpnUsage = (fromAddr, toAddr, sentBytes, sessionDuration, amount, timeStamp, sessionId, nonce, cb) => {
  try {
    let rawTx = {
      nonce: nonce,
      gasPrice: rinkeby.web3.toHex(rinkeby.web3.eth.gasPrice),
      gasLimit: rinkeby.web3.toHex(500000),
      to: VPNSERVICE_ADDRESS,
      value: '0x0',
      data: VPN.addVpnUsage.getData(fromAddr, toAddr, sentBytes, sessionDuration, amount, timeStamp, sessionId)
    }

    let tx = new Tx(rawTx);
    tx.sign(Buffer.from(COINBASE_PRIVATE_KEY, 'hex'));
    let serializedTx = tx.serialize();

    rinkeby.web3.eth.sendRawTransaction('0x' + serializedTx.toString('hex'),
      (err, txHash) => {
        if (err) cb(err, null);
        else cb(null, txHash);
      });
  } catch (error) {
    cb(error, null)
  }
}