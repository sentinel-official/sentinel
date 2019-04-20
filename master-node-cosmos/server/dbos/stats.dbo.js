let StatsModel = require('../models/stats.model');


let addStats = (details, cb) => {
  let stats = new StatsModel(details);
  stats.save((error, result) => {
    if (error) cb(error);
    else cb(null, result);
  });
};

let getStats = (findObj, cb) => {
  StatsModel.findOne(findObj, {
    '_id': 0
  }, (error, result) => {
    if (error) cb(error);
    else cb(null, result);
  });
};

module.exports = {
  addStats,
  getStats
};