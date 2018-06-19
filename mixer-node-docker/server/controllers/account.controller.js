let async = require('async');
let lodash = require('lodash');
let accountHelper = require('../helpers/account.helper');
let accountDbo = require('../dbos/account.dbo');
let { accountExpiry } = require('../../config/ethereum/accounts');


let createAccount = (req, res) => {
  async.waterfall([
    (next) => {
      accountHelper.createAccount((error, account) => {
        if (error) next({
          status: 500,
          message: 'Error occurred while creating new account.'
        }, null);
        else next(null, account);
      });
    }, (account, next) => {
      account = Object.assign(account, {
        generatedOn: Math.round(Date.now() / Math.pow(10, 3))
      });
      accountDbo.insertAccount(account,
        (error, result) => {
          if (error) next({
            status: 500,
            message: 'Error occurred while inserting account.'
          });
          else next(null, {
            status: 200,
            message: 'Successfully created new account.',
            address: account.address
          });
        });
    }
  ], (error, success) => {
    let response = Object.assign({
      success: !error
    }, error || success);
    let status = response.status;
    delete (response.status);
    res.status(status).send(response);
  });
};

let getBalances = (req, res) => {
  async.waterfall([
    (next) => {
      accountDbo.getAllAccounts((error, accounts) => {
        if (error) next({
          status: 500,
          message: 'Error occurred while getting accounts.'
        }, null);
        else {
          let addresses = lodash.map(accounts, 'address');
          next(null, addresses);
        }
      })
    }, (addresses, next) => {
      accountHelper.getBalancesOfAllAddresses(addresses,
        (error, balancesOfAllAddresses) => {
          if (error) next({
            status: 500,
            message: 'Error occurred while getting balances of accounts.'
          }, null);
          else {
            let balances = {
              ETH: lodash.sum(lodash.map(balancesOfAllAddresses, 'ETH')),
              SENT: lodash.sum(lodash.map(balancesOfAllAddresses, 'SENT'))
            };
            next(null, {
              status: 200,
              balances: balances
            });
          }
        });
    }
  ], (error, success) => {
    let response = Object.assign({
      success: !error
    }, error || success);
    let status = response.status;
    delete (response.status);
    res.status(status).send(response);
  });
}

module.exports = {
  createAccount: createAccount,
  getBalances: getBalances
};
