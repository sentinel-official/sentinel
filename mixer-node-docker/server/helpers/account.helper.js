let keys = require('../../ethereum/keys');
let accounts = require('../../ethereum/accounts');
let { accountModel } = require('../models/account.model');


let createAccount = (cb) => {
  try {
    let privateKey = keys.generatePrivateKey();
    let address = keys.generateAddress(keys.generatePublicKey(privateKey, false));
    let account = {
      address: '0x' + address.toString('hex'),
      privateKey: privateKey.toString('hex')
    };
    cb(null, account);
  } catch (error) {
    cb(error, null);
  }
};

module.exports = {
  createAccount: createAccount
};