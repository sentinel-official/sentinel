let joi = require('joi');


let getSession = (req, res, next) => {
  let getSessionSchema = joi.object().keys({
    hash: joi.string().required()
  });
  let { error } = joi.validate(req.query, getSessionSchema);
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
  let { error } = joi.validate(req.query, getSessionsSchema);
  if (error) res.status(422).send({
    success: false,
    error
  });
  else next();
};

let updateSessions = (req, res, next) => {
  let session = joi.object().keys({
    sessionId: joi.string().required(),
    usage: {
      download: joi.number().required(),
      upload: joi.number().required()
    }.required()
  });
  let updateSessionsSchema = joi.object().keys({
    accountAddress: joi.string().required(),
    token: joi.string().required(),
    sessions: joi.array().items(session).required()
  });
  let { error } = joi.validate(req.body, updateSessionsSchema);
  if (error) res.status(422).send({
    success: false,
    error
  });
  else next();
};

module.exports = {
  getSession,
  getSessions,
  updateSessions
};