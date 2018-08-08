let MixDetailsModel = require('../models/mixer.model');


let insertMixDetails = (mixDetails, cb) => {
  mixDetails = new MixDetailsModel(mixDetails);
  mixDetails.save((error, result) => {
    if (error) cb(error, null);
    else cb(null, result);
  });
};

let getAllValidMixDetails = (cb) => {
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
    'toAddress': toAddress
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
    'toAddress': toAddress
  }, {
      $inc: {
        'tries': 1
      }
    }, (error, result) => {
      if (error) cb(error, null);
      else cb(null, result);
    });
};

let updateMixTransactionStatus = (toAddress, txInfo, remainingAmount, cb) => {
  MixDetailsModel.findOneAndUpdate({
    'toAddress': toAddress
  }, {
      $push: {
        'txInfos': txInfo
      },
      $set: {
        'remainingAmount': remainingAmount
      }
    }, (error, result) => {
      if (error) cb(error, null);
      else cb(null, result);
    })
};

module.exports = {
  insertMixDetails: insertMixDetails,
  getAllValidMixDetails: getAllValidMixDetails,
  updateMixStatus: updateMixStatus,
  increaseTries: increaseTries,
  updateMixTransactionStatus: updateMixTransactionStatus
};