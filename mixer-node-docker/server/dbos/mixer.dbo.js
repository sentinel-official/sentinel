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
    status: 0,
  }, {
      _id: 0
    }, (error, result) => {
      if (error) cb(error, null);
      else cb(null, result);
    });
};

let updateMixStatus = (toAddress, status, cb) => {
  MixDetailsModel.findOneAndUpdate({
    toAddress: toAddress
  }, {
      '$set': {
        'status': status
      }
    }, (error, result) => {
      if (error) cb(error, null);
      else cb(null, result);
    });
};

let insertTxHash = (toAddress, txHash, cb) => {
  MixDetailsModel.findOneAndUpdate({
    toAddress: toAddress
  }, {
      '$push': {
        txHashes: txHash
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
  insertTxHash: insertTxHash
};
