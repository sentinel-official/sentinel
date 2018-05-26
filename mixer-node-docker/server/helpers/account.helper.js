let keys = require('../../ethereum/keys');
let accounts = require('../../ethereum/accounts');


let createAccount = (cb) => {
  try {
    let privateKey = keys.generatePrivateKey();
    let address = keys.generateAddress(keys.generatePublicKey(privateKey, false));
    let account = {
      address: address.toString('hex'),
      privateKey: privateKey.toString('hex')
    };
    cb(null, account);
  } catch (error) {
    cb(error, null);
  }
};

let getBalance = (addresses, cb) => {
  let balance = 0;
  try {
    addresses.forEach((address) => {
      balance += accounts.getBalance(address, 'main')
    });
    cb(null, balance);
  } catch (error) {
    cb(error, null);
  }
}

module.exports = {
  createAccount: createAccount,
  getBalance: getBalance
};
