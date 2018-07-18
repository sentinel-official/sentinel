import mongoose from "mongoose";

let Schema = mongoose.Schema

let nodeSchema = new Schema({
  account_addr: {
    type: String,
    unique: true
  },
  token: String,
  ip: String,
  price_per_gb: Number,
  latency: Number,
  vpn_type: String,
  joined_on: Number,
  enc_method: String,
  location: {
    lattitude: Number,
    longitude: Number,
    city: String,
    country: String
  },
  net_speed: {
    download: Number,
    upload: Number,
  },
  vpn: {
    status: String,
    init_on: Number,
    ping_on: Number
  }
});

export const Node = mongoose.model('Node', nodeSchema);
