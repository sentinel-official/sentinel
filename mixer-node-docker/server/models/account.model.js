let mongoose = require('mongoose');


let accountSchema = new mongoose.Schema({
  address: String,
  privateKey: String,
  generatedOn: Number,
  balances: {
    eth: Number
  }
}, {
    strict: true,
    versionKey: false
  });

module.exports = mongoose.model('Account', accountSchema);
