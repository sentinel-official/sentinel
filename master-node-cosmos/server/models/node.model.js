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
  pricePerGB: {
    type: Number,
    required: true,
    default: 100
  },
  encMethod: {
    type: String,
    required: true,
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
  info: {
    status: {
      type: String,
      required: true,
      default: 'down'
    },
    startOn: {
      type: Date,
      required: true,
      default: Date.now
    },
    pingOn: {
      type: Date,
      required: true,
      default: Date.now
    }
  },
  addedOn: {
    type: Date,
    default: Date.now
  }
}, {
  strict: true,
  versionKey: false
});

module.exports = mongoose.model('Node', nodeSchema);