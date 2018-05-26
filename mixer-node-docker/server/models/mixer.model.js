let mongoose = require('mongoose');


let mixDetailsSchema = new mongoose.Schema({
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

module.exports = {
  mixDetailsModel: mongoose.model('MixDetails', mixDetailsSchema)
};
