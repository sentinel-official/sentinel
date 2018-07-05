let async = require('async');
let lodash = require('lodash');
let swixerDbo = require('../server/dbos/swixer.dbo');
let accountDbo = require('../server/dbos/account.dbo');
let accountHelper = require('../server/helpers/account.helper');
let { transfer } = require('../factories/transactions');
let coins = require('../config/coins');


let swixTransfer = (toAddress, destinationAddress, totalAmount, coinSymbol, cb) => {
  let coinType = coins[coinSymbol].type;
  async.waterfall([
    (l0Next) => {
      accountDbo.getAccounts([coinType],
        (error, accounts) => {
          if (error) l0Next({
            status: 4000,
            message: 'Error occurred while getting accounts.'
          });
          else l0Next(null, accounts);
        });
    }, (accounts, l0Next) => {
      let addresses = lodash.map(accounts, 'address');
      addresses.splice(addresses.indexOf(toAddress), 1);
      accountHelper.getBalancesOfAccounts(addresses,
        (error, balances) => {
          if (error) l0Next({
            status: 5001,
            message: 'Error occurred while getting balances of accounts.'
          });
          else l0Next(null, accounts, addresses, balances);
        });
    }, (accounts, addresses, balances, l0Next) => {
      let remainingAmount = totalAmount;
      async.eachLimit(addresses, 1,
        (address, l1Next) => {
          let account = accounts[address];
          let _balances = balances[address];
          if ((coinType === 'BTC' && _balances[coinSymbol] > 0) ||
            (coinType === 'ETH' && _balances.ETH > 20e9 * 50e3 && _balances[coinSymbol] > 0)) {
            let value = Math.min(_balances[coinSymbol], remainingAmount);
            async.waterfall([
              (l2Next) => {
                transfer(account.privateKey, destinationAddress, value, coinSymbol,
                  (error, txHash) => {
                    if (txHash) remainingAmount -= value;
                    l2Next(null, {
                      value,
                      txHash,
                      fromAddress: address,
                      timestamp: Math.round(Date.now() / Math.pow(10, 3))
                    }, remainingAmount);
                  });
              }, (txInfo, remainingAmount, l2Next) => {
                swixerDbo.updateSwixTransactionStatus(toAddress, txInfo, remainingAmount,
                  (error, result) => {
                    l2Next(null);
                  });
              }
            ], () => {
              l1Next(null);
            });
          } else l1Next(null);
        }, () => {
          l0Next(null);
        });
    }
  ], (error) => {
    cb(error);
  });
};

module.exports = {
  swixTransfer
};