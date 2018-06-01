let lodash = require('lodash');
let AccountModel = require('../models/account.model');


let insertAccount = (account, cb) => {
  account = new AccountModel(account);
  account.save((error, result) => {
    if (error) cb(error, null);
    else cb(null, result);
  });
};

let getBalances = (cb) => {
  AccountModel.aggregate([
    {
      $match: {
        'balances.eth': {
          $gte: 20e9 * 50e3
        }
      }
    }, {
      $group: {
        '_id': null,
        'eth': {
          $sum: '$balances.eth'
        },
        'sent': {
          $sum: '$balances.sent'
        }
      }
    }
  ], (error, result) => {
    console.log(error, result);
    if (error) cb(error, null);
    else {
      delete (result[0]._id);
      cb(null, result[0]);
    }
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
    findObject[`balances.${coinSymbol}`] = {
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

let getAccountsDetails = (cb) => {
  AccountModel.find({},
    {
      _id: 0
    }, (error, details) => {
      if (error) cb(error, null);
      else cb(null, details);
    });
};

let updateAccountBalance = (address, balance, coinSymbol, cb) => {
  let updateKey = `balances.${coinSymbol}`;
  AccountModel.findOneAndUpdate({
    address: address
  }, {
      $set: {
        updateKey: balance
      }
    }, (error, result) => {
      if (error) cb(error, null);
      else cb(null, result);
    });
};

module.exports = {
  insertAccount: insertAccount,
  getAccountsDetails: getAccountsDetails,
  updateAccountBalance: updateAccountBalance,
  getBalances: getBalances,
  getFromAddressesDetails: getFromAddressesDetails
};