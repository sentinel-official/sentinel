let mongoose = require('mongoose');


let nodeSchema = new mongoose.Schema({
  txHash: {
    type: String,
    unique: true,
    required: true
  },
  accountAddress: {
    type: String,
    unique: true,
    required: true
  },
  token: {
    type: String,
    unique: true,
    required: true,
  },
  IP: {
    type: String,
    required: true
  },
  APIPort: {
    type: Number,
    required: true,
    default: 3000
  },
  pricePerGB: {
    type: Number,
    required: true,
    default: 100
  },
  encMethod: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: '',
  },
  location: {
    latitude: {
      type: Number,
      required: true
    },
    longitude: {
      type: Number,
      required: true
    },
    city: {
      type: String,
      required: true,
      default: 'Unknown'
    },
    country: {
      type: String,
      required: true
    }
  },
  netSpeed: {
    download: {
      type: Number,
      required: true
    },
    upload: {
      type: Number,
      required: true
    }
  },
  nodeType: {
    type: String,
    required: true
  },
  version: {
    type: String,
    required: true
  },
  ratingPoints: {
    type: Number,
    required: true,
    default: 5,
  },
  ratingCount: {
    type: Number,
    required: true,
    default: 1,
  },
  addedOn: {
    type: Date,
    required: true,
    default: Date.now
  },
  lastOn: {
    type: Date,
    required: true,
    default: Date.now
  },
  status: {
    type: String,
    required: true,
    default: 'down'
  },
  statusOn: {
    type: Date,
    required: true,
    default: Date.now
  }
}, {
    strict: true,
    versionKey: false
  });

module.exports = mongoose.model('Node', nodeSchema);