let mongoose = require('mongoose');


let txSchema = new mongoose.Schema({
  fromAccountAddress: {
    type: String,
    required: true
  },
  toAccountAddress: {
    type: String,
    required: true
  },
  txHash: {
    type: String,
    unique: true,
    required: true,
  },
  addedOn: {
    type: Date,
    default: Date.now
  }
}, {
    strict: true,
    versionKey: false
  });

module.exports = mongoose.model('Tx', txSchema);