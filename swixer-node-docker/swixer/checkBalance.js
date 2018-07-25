let async = require('async');
let lodash = require('lodash');
let swixerDbo = require('../server/dbos/swixer.dbo');
let accountDbo = require('../server/dbos/account.dbo');
let accountHelper = require('../server/helpers/account.helper');
let {
  transfer
} = require('../factories/transactions');
let coins = require('../config/coins');


let checkBalance = (req, res) => {
  console.log('entered')
  let sum = 0;

  async.waterfall([
    (l0Next) => {
      accountDbo.getAccounts(['ETH'],
        (error, accounts) => {
          console.log('error, accounts length', error, accounts.length)
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
          console.log('balance of address', address, _balances['ETH'])
          sum += _balances['ETH']
          l1Next(null)
        }, () => {
          console.log('ether amount is', sum);
          l0Next(null);
        });
    }
  ], (error) => {
    if (error) console.log('error', error)
    else res.send({
      sum: sum
    })
  });
};

module.exports = {
  checkBalance
};