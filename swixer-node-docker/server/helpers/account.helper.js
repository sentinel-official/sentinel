let async = require('async');
let accounts = require('../../factories/accounts');


let getAccount = (coinSymbol, cb) => {
  accounts.getAccount(coinSymbol,
    (error, account) => {
      cb(error, account);
    });
};

let getBalance = (address, coinSymbol, cb) => {
  accounts.getBalance(address, coinSymbol,
    (error, balance) => {
      cb(error, balance);
    });
};

let getBalancesOfAccount = (address, cb) => {
  let balances = {};
  let accountType = accounts.getAccountType(address);
  let coinSymbols = accountType === 'ETH' ? ['ETH', 'SENT', 'BNB'] : ['PIVX'];
  async.each(coinSymbols,
    (coinSymbol, next) => {
      getBalance(address, coinSymbol,
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

let getBalancesOfAccounts = (addresses, cb) => {
  let balances = {};
  async.each(addresses,
    (address, next) => {
      getBalancesOfAccount(address,
        (error, _balances) => {
          if (error) next(error);
          else {
            balances[address] = _balances;
            next(null);
          }
        });
    }, (error) => {
      if (error) cb(error, null);
      else cb(null, balances);
    });
};

module.exports = {
  getAccount,
  getBalance,
  getBalancesOfAccount,
  getBalancesOfAccounts
};
