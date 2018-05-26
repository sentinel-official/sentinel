let { waterfall } = require('async');
let accountHelper = require('../helpers/account.helper');
let accountDbo = require('../dbos/account.dbo');
let { accountExpiry } = require('../../config/ethereum/accounts');


let createAccount = (req, res) => {
  waterfall([
    (next) => {
      accountHelper.createAccount((error, account) => {
        console.log(error, account);
        if (error) next({
          status: 500,
          message: 'Error occurred while creating new account.'
        }, null);
        else next(null, account);
      });
    }, (account, next) => {
      account = Object.assign(account, {
        generatedOn: Math.round(Date.now() / Math.pow(10, 3)),
        expiryOn: Math.round((Date.now() + accountExpiry) / Math.pow(10, 3)),
        isValid: true
      });
      accountDbo.insertAccount(account,
        (error, result) => {
          console.log(error, result);
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

let getBalance = (req, res) => {
  waterfall([
    (next) => {
      accountDbo.getAccountAddresses(true,
        (error, result) => {
          console.log(error, result);
          if (error) next({
            status: 500,
            message: 'Error occurred while getting account addresses.'
          });
          else next(null, result);
        });
    }, (addresses, next) => {
      accountHelper.getBalance(addresses,
        (error, balance) => {
          console.log(error, balance);
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
  getBalance: getBalance
};
