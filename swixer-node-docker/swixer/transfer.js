let async = require('async');
let lodash = require('lodash');
let swixerDbo = require('../server/dbos/swixer.dbo');
let accountDbo = require('../server/dbos/account.dbo');
let accountHelper = require('../server/helpers/account.helper');
let {
  transfer
} = require('../factories/transactions');
let coins = require('../config/coins');


let swixTransfer = (toAddress, destinationAddress, totalAmount, coinSymbol, cb) => {
  let coinType = coins[coinSymbol].type;
  let remainingAmount = totalAmount;
  if (coinType === 'ETH') remainingAmount = Math.round(remainingAmount);
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
      let index = addresses.indexOf(toAddress);
      if (index >= 0) addresses.splice(index, 1);
      accountHelper.getBalancesOfAccounts(addresses,
        (error, balances) => {
          if (error) l0Next({
            status: 5001,
            message: 'Error occurred while getting balances of accounts.'
          });
          else l0Next(null, accounts, addresses, balances);
        });
    }, (accounts, addresses, balances, l0Next) => {
      async.eachLimit(addresses, 1,
        (address, l1Next) => {

          let account = lodash.filter(accounts, item => item.address === address)[0];
          let _balances = balances[address];
          if ((coinType === 'BTC' && _balances[coinSymbol] > 0) && remainingAmount > 0 ||
            (coinType === 'ETH' && _balances.ETH > 20e9 * 50e3 && _balances[coinSymbol] > 0 && remainingAmount > 0)) {
            let value = Math.min(_balances[coinSymbol], remainingAmount);
            async.waterfall([
              (l2Next) => {
                transfer(account.privateKey, destinationAddress, value, coinSymbol,
                  (error, txHash) => {
                    console.log(error, txHash);
                    if (txHash || coinSymbol === 'PIVX'){
                      remainingAmount -= value;
                    }
                    l2Next(null, {
                      value,
                      txHash,
                      fromAddress: address,
                      timestamp: Date.now()
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
    let updateData = {
      lastUpdateOn: Date.now()
    }

    if (remainingAmount > 0) {
      updateData.message = 'Swix is in progress.';
      updateData.isScheduled = false;
      updateData.status = 'progress';
    } else {
      updateData.message = 'Swix is complete.';
      updateData.isScheduled = true
      updateData.status = 'sent'
    }

    swixerDbo.updateSwix({
        toAddress
      }, updateData,
      (error, result) => {
        cb(error);
      });
  });
};

module.exports = {
  swixTransfer
};