let mongoose = require('mongoose');


let swixDetailsSchema = new mongoose.Schema({
  fromSymbol: {
    type: String,
    required: true
  },
  toSymbol: {
    type: String,
    required: true
  },
  clientAddress: {
    type: String,
    required: true
  },
  toAddress: {
    type: String,
    required: true,
    unique: true
  },
  destinationAddress: {
    type: String,
    required: true
  },
  delayInSeconds: {
    type: Number,
    required: true
  },
  insertedOn: {
    type: Date,
    default: Date.now
  },
  swixHash: {
    type: String,
    unique: true
  },
  tries: {
    type: Number,
    default: 0
  },
  isScheduled: {
    type: Boolean,
    default: false,
  },
  remainingAmount: Number,
  lastUpdateOn: {
    type: Date,
    default: Date.now
  },
  receivedTime: {
    type: Number
  },
  receivedValue: {
    type: Number
  },
  rate: {
    type: Number
  },
  refundAddress: {
    type: String
  },
  status: {
    type: String,
    default: 'init'
  },
  message: {
    type: String,
    default: 'Swix added successfully.'
  },
  txInfos: Array
}, {
  strict: true,
  versionKey: false
});

module.exports = mongoose.model('SwixDetails', swixDetailsSchema);