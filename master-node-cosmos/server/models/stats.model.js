let mongoose = require('mongoose');


let statisticsSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true
  },
  totalNodesCount: {
    type: Number,
    required: true,
  },
  activeNodesCount: {
    type: Number,
    required: true,
  }
}, {
    strict: true,
    versionKey: false
  });

module.exports = mongoose.model('Statistics', statisticsSchema);