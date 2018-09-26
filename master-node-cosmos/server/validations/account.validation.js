let joi = require('joi');


let addAccountTxHash = (req, res, next) => {
  let addAccountTxHashSchema = joi.object().keys({
    accountAddress: joi.string().required(),
    txHash: joi.string().required()
  });
  let { error } = joi.validate(req.body, addAccountTxHashSchema);
  if (error) res.status(422).send({
    success: false,
    error
  });
  else next();
};

let getAccountTxHashes = (req, res, next) => {
  let getAccountTxHashesSchema = joi.object().keys({
    accountAddress: joi.string().required()
  });
  let { error } = joi.validate(req.query, getAccountTxHashesSchema);
  if (error) res.status(422).send({
    success: false,
    error
  });
  else next();
};

module.exports = {
  addAccountTxHash,
  getAccountTxHashes
};