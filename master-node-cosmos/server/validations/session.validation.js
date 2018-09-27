let joi = require('joi');


let getSession = (req, res, next) => {
  let getSessionSchema = joi.object().keys({
    txHash: joi.string().required()
  });
  let { error } = joi.validate(req.params, getSessionSchema);
  if (error) res.status(422).send({
    success: false,
    error
  });
  else next();
};

module.exports = {
  getSession,
};