let { waterfall } = require('async');
let accountHelper = require('../helpers/account.helper');
let accountDbo = require('../dbos/account.dbo');
let { accountExpiry } = require('../../config/ethereum/accounts');


let createAccount = (req, res) => {
  waterfall([
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
        generatedOn: Math.round(Date.now() / Math.pow(10, 3)),
        balances: {
          eth: 0
        }
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

let getTotalBalance = (req, res) => {
  waterfall([
    (next) => {
      accountDbo.getTotalBalance((error, balance) => {
        if (error) next({
          status: 500,
          message: 'Error occurred while getting balance.'
        });
        else next(null, {
          status: 200,
          balance: balance
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
}

module.exports = {
  createAccount: createAccount,
  getTotalBalance: getTotalBalance
};
