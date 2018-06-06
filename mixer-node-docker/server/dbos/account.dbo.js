let lodash = require('lodash');
let AccountModel = require('../models/account.model');


let insertAccount = (account, cb) => {
  account = new AccountModel(account);
  account.save((error, result) => {
    if (error) cb(error, null);
    else cb(null, result);
  });
};

let getFromAddressesDetails = (blackListAddresses, coinSymbol, cb) => {
  let findObject = {
    'address': {
      $nin: blackListAddresses
    },
    'balances.eth': {
      $gte: 20e9 * 50e3
    }
  };
  let sortKey = `balances.${coinSymbol}`;
  if (coinSymbol !== 'eth') {
    findObject[sortKey] = {
      $gte: 0
    };
  }
  AccountModel.find(findObject, {}, {
    sort: {
      sortKey: -1
    }
  }, (error, result) => {
    if (error) cb(error, null);
    else cb(null, result);
  });
};

let getAllAccounts = (cb) => {
  AccountModel.find({},
    {
      _id: 0
    }, (error, details) => {
      if (error) cb(error, null);
      else cb(null, details);
    });
};

let getAccount = (address, cb) => {
  AccountModel.find({
    address: address
  }, {
      _id: 0
    }, (error, details) => {
      if (error) cb(error, null);
      else cb(null, details);
    });
};

module.exports = {
  insertAccount: insertAccount,
  getAllAccounts: getAllAccounts,
  getAccount: getAccount,
  getFromAddressesDetails: getFromAddressesDetails
};
