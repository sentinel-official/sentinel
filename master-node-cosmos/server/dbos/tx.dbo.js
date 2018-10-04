let TxModel = require('../models/tx.model');


let addTx = (details, cb) => {
  let tx = new TxModel(details);
  tx.save((error, result) => {
    console.log(error);
    if (error) cb(error);
    else cb(null, result);
  });
};

let getTxes = (findObj, cb) => {
  TxModel.find(findObj, {
    _id: 0
  }, (error, result) => {
    if (error) cb(error);
    else cb(null, result || []);
  });
};

let getTx = (findObj, cb) => {
  TxModel.findOne(findObj, {
    _id: 0
  }, (error, result) => {
    if (error) cb(error);
    else cb(null, result);
  });
};

module.exports = {
  addTx,
  getTx,
  getTxes
};