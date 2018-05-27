let joi = require('joi');
let { validate } = require('../helpers/validation.helper');


let insertMixDetails = (req, res, next) => {
  let addMixDetailsSchema = joi.object().keys({
    toAddress: joi.string().regex(/^[a-fA-F0-9]{40}$/).required(),
    destinationAddress: joi.string().regex(/^[a-fA-F0-9]{40}$/).required(),
    delayInSeconds: joi.number().required()
  });

  let validation = validate(req.body, addMixDetailsSchema);
  if (validation.isValid) next();
  else res.status(422).send(validation.errors);
};

module.exports = {
  insertMixDetails: insertMixDetails
};
