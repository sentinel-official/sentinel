let lodash = require('lodash');
let AccountModel = require('../models/account.model');


let insertAccount = (account, cb) => {
  account = new AccountModel(account);
  account.save((error, result) => {
    if (error) cb(error, null);
    else cb(null, result);
  });
};

let getTotalBalance = (cb) => {
  AccountModel.aggregate([
    {
      '$group': {
        '_id': null,
        'balance': {
          '$sum': '$balances.eth'
        }
      }
    }
  ], (error, result) => {
    if (error) cb(error, null);
    else cb(null, result[0].balance);
  });
}

let getFromAddressesDetails = (blackListAddresses, cb) => {
  AccountModel.find({
    'address': {
      '$nin': blackListAddresses
    },
    'balances.eth': {
      '$gt': 0
    },
  }, {}, {
      'sort': {
        'balances.eth': -1
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

let updateAccountBalance = (address, balance, cb) => {
  AccountModel.findOneAndUpdate({
    address: address
  }, {
      '$set': {
        'balances.eth': balance
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
  getTotalBalance: getTotalBalance,
  getFromAddressesDetails: getFromAddressesDetails
};
