let joi = require('joi');


let createAccount = (req, res, next) => {
  let createAccountSchema = joi.object().keys({
    fromSymbol: joi.string().required(),
    toSymbol: joi.string().required(),
    clientAddress: joi.string().regex(/^0x[a-fA-F0-9]{40}$/).required(),
    destinationAddress: joi.string().required(),
    delayInSeconds: joi.number().required()
  });
  let { error } = joi.validate(req.body, createAccountSchema);
  if (error) res.status(422).send({
    success: false,
    error
  });
  else next();
};

module.exports = {
  createAccount
};