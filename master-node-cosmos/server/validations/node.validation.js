let joi = require('joi');


let addNode = (req, res, next) => {
  let addNodeSchema = joi.object().keys({
    txHash: joi.string().required(),
  });
  let { error } = joi.validate(req.body, addNodeSchema);
  if (error) res.status(422).send({
    success: false,
    error
  });
  else next();
};

let updateNode = (req, res, next) => {
  let updateNodeSchema = joi.object().keys({
    accountAddress: joi.string().required(),
    token: joi.string().required(),
    type: joi.string().required(),
    details: joi.object().keys({
      IP: joi.string(),
      pricePerGB: joi.number(),
      encMethod: joi.string(),
      location: joi.object().keys({
        latitude: joi.number().required(),
        longitude: joi.number().required(),
        city: joi.string().required(),
        country: joi.string().required()
      }),
      netSpeed: joi.object().keys({
        download: joi.number().required(),
        upload: joi.number().required()
      }),
      version: joi.string(),
    })
  });
  let body = Object.assign({}, req.body, req.params);
  let { error } = joi.validate(body, updateNodeSchema);
  if (error) res.status(422).send({
    success: false,
    error
  });
  else next();
};

let getNodes = (req, res, next) => {
  let getNodesSchema = joi.object().keys({
    type: joi.string().required(),
    status: joi.string().required()
  });

  let { error } = joi.validate(req.query, getNodesSchema);
  if (error) res.status(422).send({
    success: false,
    error
  });
  else next();
};

let updateNodeSessions = (req, res, next) => {
  let session = joi.object().keys({
    sessionId: joi.string().required(),
    usage: joi.object().keys({
      download: joi.number().required(),
      upload: joi.number().required()
    }).required()
  });
  let updateNodeSessionsSchema = joi.object().keys({
    accountAddress: joi.string().required(),
    token: joi.string().required(),
    sessions: joi.array().items(session).required()
  });
  let body = Object.assign({}, req.body, req.params);
  let { error } = joi.validate(body, updateNodeSessionsSchema);
  if (error) res.status(422).send({
    success: false,
    error
  });
  else next();
};

module.exports = {
  addNode,
  updateNode,
  getNodes,
  updateNodeSessions
};