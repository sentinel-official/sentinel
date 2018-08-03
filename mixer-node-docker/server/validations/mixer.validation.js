let joi = require('joi');


let insertMixDetails = (req, res, next) => {
  let addMixDetailsSchema = joi.object().keys({
    toAddress: joi.string().regex(/^0x[a-fA-F0-9]{40}$/).required(),
    destinationAddress: joi.string().regex(/^0x[a-fA-F0-9]{40}$/).required(),
    delayInSeconds: joi.number().required(),
    coinSymbol: joi.string().required()
  });

  let validation = joi.validate(req.body, addMixDetailsSchema);
  if(validation.error) res.status(422).send(validation.error);
  else next();
};

module.exports = {
  insertMixDetails: insertMixDetails
};
