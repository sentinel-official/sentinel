let mongoose = require('mongoose');


let sessionSchema = new mongoose.Schema({
  sessionId: {
    type: String,
    required: true
  },
  token: {
    type: String,
    required: true
  },
  clientAccountAddress: {
    type: String,
    required: true
  },
  nodeAccountAddress: {
    type: String,
    required: true
  },
  usage: {
    download: {
      type: Number,
      required: true,
      default: 0
    },
    upload: {
      type: Number,
      required: true,
      default: 0
    }
  },
  startedOn: {
    type: Date,
    default: Date.now
  },
  endedOn: {
    type: Date
  },
  addedOn: {
    type: Date,
    default: Date.now
  },
  updatedOn: {
    type: Date,
    default: Date.now
  }
}, {
    strict: true,
    versionKey: false
  });

module.exports = mongoose.model('Session', sessionSchema);