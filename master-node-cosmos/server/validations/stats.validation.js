let joi = require('joi');


let getNodesStats = (req, res, next) => {
  let getNodesStatsSchema = joi.object().keys({
    average: joi.bool(),
    timeline: joi.bool(),
    startSeconds: joi.number().positive(),
    endSeconds: joi.number().positive()
  });
  let { error } = joi.validate(req.query, getNodesStatsSchema);
  if (error) res.status(422).send({
    success: false,
    error
  });
  else next();
};

let getSessionsStats = (req, res, next) => {
  let getSessionsStatsSchema = joi.object().keys({
    average: joi.bool(),
    timeline: joi.bool(),
    startSeconds: joi.number().positive(),
    endSeconds: joi.number().positive()
  });
  let { error } = joi.validate(req.query, getSessionsStatsSchema);
  if (error) res.status(422).send({
    success: false,
    error
  });
  else next();
};

let getDataConsumedStats = (req, res, next) => {
  let getDataConsumedStatsSchema = joi.object().keys({
    timeline: joi.bool(),
    startSeconds: joi.number().positive(),
    endSeconds: joi.number().positive()
  });
  let { error } = joi.validate(req.query, getDataConsumedStatsSchema);
  if (error) res.status(422).send({
    success: false,
    error
  });
  else next();
};

let getAverageDurationStats = (req, res, next) => {
  let getAverageDurationStatsSchema = joi.object().keys({
    timeline: joi.bool(),
    startSeconds: joi.number().positive(),
    endSeconds: joi.number().positive()
  });
  let { error } = joi.validate(req.query, getAverageDurationStatsSchema);
  if (error) res.status(422).send({
    success: false,
    error
  });
  else next();
};

module.exports = {
  getNodesStats,
  getSessionsStats,
  getDataConsumedStats,
  getAverageDurationStats,
};