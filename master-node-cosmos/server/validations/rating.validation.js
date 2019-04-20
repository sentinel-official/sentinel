let joi = require('joi');


let addRating = (req, res, next) => {
  let addRatingSchema = joi.object().keys({
    fromAccountAddress: joi.string().required(),
    sessionId: joi.string().required(),
    rating: joi.number().integer().min(0).max(5).required(),
    comments: joi.string().allow('')
  });
  let { error } = joi.validate(req.body, addRatingSchema);
  if (error) res.status(422).send({
    success: false,
    error
  });
  else next();
};

module.exports = {
  addRating
};