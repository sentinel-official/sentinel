import Web3 from 'web3';
import hdkey from 'ethereumjs-wallet/hdkey'
import Wallet from 'ethereumjs-wallet';
import crypto from 'crypto';
import Tx from 'ethereumjs-tx';
import async from 'async';
import keythereum from 'keythereum'

class ETHManager {
  constructor(provider = null, rpcURL = null) {
    this.provider = provider;
    this.web3 = new Web3(new Web3.providers.HttpProvider(rpcURL));
  }
  createAccount(password, cb) {
    try {
      const privateKey = crypto.randomBytes(32);
      const wallet = Wallet.fromPrivateKey(privateKey);
      const keystore = wallet.toV3String(password);
      const keystoreData = JSON.parse(keystore);
      const accountDetails = {
        walletAddress: '0x' + keystoreData.address,
        privateKey: '0x' + privateKey.toString('hex'),
        keystoreData: keystoreData
      };
      cb(null, accountDetails);
    }
    catch (error) {
      cb({ 'code': 101, 'error': error }, null);
    }
  }
  getPrivateKey(keystoreData, password, cb) {
    let keyStore = JSON.parse(keystoreData);
    keythereum.recover(password, keyStore, (err, privateKey) => {
      if (err)
        cb({ 'code': 102, 'error': err }, null);
      else
        cb(null, privateKey);
    });
  }
  getAddress(privateKey, cb) {
    try {
      const wallet = Wallet.fromPrivateKey(privateKey);
      const address = wallet.getAddressString();
      cb(null, address);
    }
    catch (error) {
      cb({ 'code': 104, 'error': error }, null);
    }
  }
  getBalance(accountAddr, cb) {
    this.web3.eth.getBalance(accountAddr, (err, balance) => {
      if (err)
        cb({ 'code': 104, 'error': err }, null);
      else
        cb(null, balance);
    });
  }
  getTransactionCount(accountAddr, cb) {
    this.web3.eth.getTransactionCount(accountAddr, 'pending', (err, txCount) => {
      if (err)
        cb({ 'code': 105, 'error': err }, null);
      else
        cb(null, txCount);
    });
  }
  sendRawTransaction(txData, cb) {
    txData = txData.toString();
    this.web3.eth.sendRawTransaction(txData, (err, txHash) => {
      if (err)
        cb({ 'code': 106, 'error': err }, null);
      else
        cb(null, txHash);
    });
  }
  transferAmount(fromAddr, toAddr, amount, privateKey, cb) {
    let rawTx = {
      nonce: this.web3.eth.getTransactionCount(fromAddr),
      gasPrice: this.web3.toHex(this.web3.eth.gasPrice),
      gasLimit: this.web3.toHex(500000),
      to: toAddr,
      value: amount,
      data: ''
    };
    let tx = new Tx(rawTx);
    tx.sign(Buffer.from(privateKey, 'hex'));
    let serializedTx = tx.serialize();
    this.web3.eth.sendRawTransaction('0x' + serializedTx.toString('hex'), (err, txHash) => {
      if (err)
        cb({ 'code': 107, 'error': err }, null);
      else
        cb(null, txHash);
    });
  }
  getTransactionReceipt(txHash, cb) {
    this.web3.eth.getTransactionReceipt(txHash, (err, receipt) => {
      if (err)
        cb({ 'code': 108, 'error': err }, null);
      else
        cb(null, receipt);
    });
  }
  getTransaction(txHash, cb) {
    this.web3.eth.getTransaction(txHash, (err, receipt) => {
      if (err)
        cb({ 'code': 109, 'error': err }, null);
      else
        cb(null, receipt);
    });
  }
}

let eth_manager = {
  'main': new ETHManager('rpc', 'https://mainnet.infura.io/aiAxnxbpJ4aG0zed1aMy'),
  'rinkeby': new ETHManager('rpc', 'https://rinkeby.infura.io/aiAxnxbpJ4aG0zed1aMy')
}

export const Eth_manager = eth_manager;

