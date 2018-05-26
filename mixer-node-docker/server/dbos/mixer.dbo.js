let { mixDetailsModel } = require('../models/mixer.model');


let insertMixDetails = (mixDetails, cb) => {
  mixDetails = new mixDetailsModel(mixDetails);
  mixDetails.save((error, result) => {
    if (error) cb(error, null);
    else cb(null, result);
  });
};

module.exports = {
  insertMixDetails: insertMixDetails
};
