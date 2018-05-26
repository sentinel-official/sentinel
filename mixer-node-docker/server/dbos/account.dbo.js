let lodash = require('lodash');
let { accountModel } = require('../models/account.model');


let insertAccount = (account, cb) => {
  account = new accountModel(account);
  account.save((error, result) => {
    if (error) cb(error, null);
    else cb(null, result);
  });
};

let getAccountAddresses = (isValid, cb) => {
  accountModel.find({
    isValid: isValid
  }, {
      _id: 0,
      address: 1
    }, (error, result) => {
      if (error) cb(error, null);
      else {
        let addresses = lodash.map(result, 'address');
        cb(null, addresses);
      }
    });
};

module.exports = {
  insertAccount: insertAccount,
  getAccountAddresses: getAccountAddresses
};
