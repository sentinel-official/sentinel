let mongoose = require('mongoose');


let mixDetailsSchema = new mongoose.Schema({
  toAddress: String,
  destinationAddress: String,
  delayInSeconds: Number,
  insertedOn: Number,
  status: Number,
  txHashes: Array,
  error: Object
}, {
    strict: true,
    versionKey: false
  });

module.exports = mongoose.model('MixDetails', mixDetailsSchema);
