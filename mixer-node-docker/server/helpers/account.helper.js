let async = require('async');
let keys = require('../../ethereum/keys');
let accounts = require('../../ethereum/accounts');
let accountDbo = require('../dbos/account.dbo');
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

let getBalancesOfAddress = (address, cb) => {
  let balances = {};
  let coinSymbols = ['ETH', 'SENT'];
  async.each(coinSymbols,
    (coinSymbol, next) => {
      accounts.getBalance(address, coinSymbol,
        (error, balance) => {
          if (error) next(error);
          else {
            balances[coinSymbol] = balance;
            next(null);
          }
        });
    }, (error) => {
      if (error) cb(error, null);
      else cb(null, balances);
    });
};

let getBalancesOfAllAddresses = (addresses, cb) => {
  let allBalances = {};
  async.each(addresses,
    (address, next) => {
      getBalancesOfAddress(address,
        (error, balances) => {
          if (error) next(error);
          else {
            allBalances[address] = balances;
            count += 1;
            next(null);
          }
        });
    }, (error) => {
      if (error) cb(error, null);
      else cb(null, allBalances);
    });
};

module.exports = {
  createAccount: createAccount,
  getBalancesOfAddress: getBalancesOfAddress,
  getBalancesOfAllAddresses: getBalancesOfAllAddresses
};
