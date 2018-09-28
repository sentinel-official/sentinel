let joi = require('joi');


let addSession = (req, res, next) => {
  let addSessionSchema = joi.object().keys({
    txHash: joi.string().required()
  });
  let { error } = joi.validate(req.body, addSessionSchema);
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
  addSession,
  getSessions
};
