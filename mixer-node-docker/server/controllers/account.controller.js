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
  waterfall([
    (next) => {
      accountDbo.getBalances((error, balances) => {
        if (error) next({
          status: 500,
          message: 'Error occurred while getting balance.'
        });
        else next(null, {
          status: 200,
          balances: balances
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
  getBalances: getBalances
};