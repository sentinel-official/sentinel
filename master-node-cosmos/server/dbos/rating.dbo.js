let RatingModel = require('../models/rating.model');


let addRating = (details, cb) => {
  let rating = new RatingModel(details);
  rating.save((error, result) => {
    if (error) cb(error);
    else cb(null, result);
  });
};

let getRating = (findObj, cb) => {
  RatingModel.findOne(findObj, {
    '_id': 0
  }, (error, result) => {
    if (error) cb(error);
    else cb(null, result);
  });
};

module.exports = {
  addRating,
  getRating
};