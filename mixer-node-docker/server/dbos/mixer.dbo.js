let MixDetailsModel = require('../models/mixer.model');


let insertMixDetails = (mixDetails, cb) => {
  mixDetails = new MixDetailsModel(mixDetails);
  mixDetails.save((error, result) => {
    if (error) cb(error, null);
    else cb(null, result);
  });
};

let getMixDetails = (cb) => {
  MixDetailsModel.find({
    $or: [
      {
        'remainingAmount': {
          $exists: false
        }
      },
      {
        'remainingAmount': {
          $gt: 0
        }
      }
    ],
    'tries': {
      $lt: 10
    }
  }, {
      '_id': 0
    }, (error, result) => {
      if (error) cb(error, null);
      else cb(null, result);
    });
};

let updateMixStatus = (toAddress, message, cb) => {
  MixDetailsModel.findOneAndUpdate({
    toAddress: toAddress
  }, {
      $set: {
        'lastUpdateOn': Math.round(Date.now() / Math.pow(10, 3)),
        'message': message
      }
    }, (error, result) => {
      if (error) cb(error, null);
      else cb(null, result);
    });
};

let increaseTries = (toAddress, cb) => {
  MixDetailsModel.findOneAndUpdate({
    toAddress: toAddress
  }, {
      $inc: {
        'tries': 1
      }
    }, (error, result) => {
      if (error) cb(error, null);
      else cb(null, result);
    });
}

let updateTransactionsStatus = (toAddress, remainingAmount, txHash, message, cb) => {
  MixDetailsModel.findOneAndUpdate({
    toAddress: toAddress
  }, {
      $push: {
        'transactionStatuses': {
          'txHash': txHash,
          'message': message,
          'timestamp': Math.round(Date.now() / Math.pow(10, 3))
        },
      },
      $set: {
        'remainingAmount': remainingAmount,
        'lastUpdateOn': Math.round(Date.now() / Math.pow(10, 3))
      }
    }, (error, result) => {
      if (error) cb(error, null);
      else cb(null, result);
    });
};

module.exports = {
  insertMixDetails: insertMixDetails,
  getMixDetails: getMixDetails,
  updateMixStatus: updateMixStatus,
  increaseTries: increaseTries,
  updateTransactionsStatus: updateTransactionsStatus
};