let joi = require('joi');


let getStatus = (req, res, next) => {
  let getStatusSchema = joi.object().keys({
    swixHash: joi.string().required()
  });
  let { error } = joi.validate(req.query, getStatusSchema);
  if (error) res.status(422).send({
    success: false,
    error
  });
  else next();
};

module.exports = {
  getStatus
};
