let btcAccounts = require('./bitcoin/accounts');
let ethAccounts = require('./ethereum/accounts');
let coins = require('../config/coins');


let getAccount = (coinSymbol, cb) => {
  let coin = coins[coinSymbol];
  if (coin.type === 'BTC') {
    btcAccounts.getAccount(coinSymbol,
      (error, account) => {
        cb(error, account);
      });
  } else if (coin.type === 'ETH') {
    ethAccounts.getAccount((error, account) => {
      cb(error, account);
    });
  }
};

let getBalance = (address, coinSymbol, cb) => {
  let coin = coins[coinSymbol];
  if (coin.type === 'BTC') {
    btcAccounts.getBalance(address, coinSymbol,
      (error, balance) => {
        cb(error, balance);
      });
  } else if (coin.type === 'ETH') {
    ethAccounts.getBalance(address, coinSymbol,
      (error, balance) => {
        cb(error, balance);
      });
  }
};

let getAccountType = (address) => {
  if (address.length === 34) return 'BTC';
  else if (address.length === 42) return 'ETH';
};

module.exports = {
  getAccount,
  getAccountType,
  getBalance
};