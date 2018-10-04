let joi = require('joi');


let addTx = (req, res, next) => {
  let addTxHashSchema = joi.object().keys({
    fromAccountAddress: joi.string().required(),
    toAccountAddress: joi.string().required(),
    txHash: joi.string().required()
  });
  let { error } = joi.validate(req.body, addTxHashSchema);
  if (error) res.status(422).send({
    success: false,
    error
  });
  else next();
};

let getTxes = (req, res, next) => {
  let getTxesSchema = joi.object().keys({
    fromAccountAddress: joi.string(),
    toAccountAddress: joi.string()
  });
  let { error } = joi.validate(req.query, getTxesSchema);
  if (error) res.status(422).send({
    success: false,
    error
  });
  else next();
};

module.exports = {
  addTx,
  getTxes
};