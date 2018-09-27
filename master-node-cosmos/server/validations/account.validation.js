let joi = require('joi');


let addTxHash = (req, res, next) => {
  let addTxHashSchema = joi.object().keys({
    accountAddress: joi.string().required(),
    txHash: joi.string().required()
  });
  let { error } = joi.validate(req.body.concat(req.params), addTxHashSchema);
  if (error) res.status(422).send({
    success: false,
    error
  });
  else next();
};

let getTxHashes = (req, res, next) => {
  let getTxHashesSchema = joi.object().keys({
    accountAddress: joi.string().required()
  });
  let { error } = joi.validate(req.params, getTxHashesSchema);
  if (error) res.status(422).send({
    success: false,
    error
  });
  else next();
};

let getSessions = (req, res, next) => {
  let getSessionsSchema = joi.object().keys({
    accountAddress: joi.string().required()
  });
  let { error } = joi.validate(req.params, getSessionsSchema);
  if (error) res.status(422).send({
    success: false,
    error
  });
  else next();
};

module.exports = {
  addTxHash,
  getTxHashes,
  getSessions
};