let mongoose = require('mongoose');


let ratingSchema = new mongoose.Schema({
  fromAccountAddress: {
    type: String,
    required: true
  },
  nodeAccountAddress: {
    type: String,
    required: true
  },
  sessionId: {
    type: String,
    required: true,
    unique: true,
  },
  rating: {
    type: Number,
    default: 5,
    required: true
  },
  comments: {
    type: String
  },
  addedOn: {
    type: Date,
    default: Date.now
  }
}, {
    strict: true,
    versionKey: false
  });

module.exports = mongoose.model('Rating', ratingSchema);