let AccountModel = require('../models/account.model');


let addAccountTxHash = (accountAddress, txHash, cb) => {
  AccountModel.findOneAndUpdate({
    accountAddress
  }, {
      $push: {
        txHashes: txHash
      }
    }, {
      upsert: true
    }, (error, result) => {
      if (error) cb(error);
      else cb(null, result);
    });
};

let getAccountTxhashes = (accountAddress, cb) => {
  AccountModel.findOne({
    accountAddress
  }, {
      _id: 0
    }, (error, result) => {
      if (error) cb(error);
      else if (result && result.txHashes) cb(null, result.txHashes);
      else cb(null, []);
    });
};

module.exports = {
  addAccountTxHash,
  getAccountTxhashes
};