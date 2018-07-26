let async = require('async');
let lodash = require('lodash');
let accountDbo = require('../server/dbos/account.dbo');
let accountHelper = require('../server/helpers/account.helper');
let {
  transfer
} = require('../factories/transactions');
let coins = require('../config/coins');
let schedule = require('node-schedule');
let {
  sendGasPrice
} = require('../swixer/sendGasPrice')


let gasFee = () => {
  schedule.scheduleJob('0 0 * * *', () => {

    async.waterfall([
      (l0Next) => {
        accountDbo.getAccounts(['ETH'],
          (error, accounts) => {
            if (error) l0Next({
              status: 4000,
              message: 'Error occurred while getting accounts.'
            });
            else l0Next(null, accounts);
          });
      }, (accounts, l0Next) => {
        let addresses = lodash.map(accounts, 'address');
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
            if ((_balances.SENT > 0 || _balances.BNB > 0) && _balances.ETH < 5 * 20e9 * 50e3) {
              sendGasPrice(address, (error, txHash) => {
                if (txHash) {
                  l1Next(null, txHash)
                } else {
                  l1Next(error, null)
                }
              })
            } else l1Next(null);
          }, () => {
            l0Next(null);
          });
      }
    ], (error, txHash) => {

    });
  })
};

module.exports = {
  gasFee
}