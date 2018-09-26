let mongoose = require('mongoose');


let accountSchema = new mongoose.Schema({
  accountAddress: {
    type: String,
    required: true
  },
  txHashes: [],
  addedOn: {
    type: Date,
    default: Date.now
  }
}, {
    strict: true,
    versionKey: false
  });

module.exports = mongoose.model('Account', accountSchema);