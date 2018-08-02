import mongoose from "mongoose";
let Schema = mongoose.Schema

let swixerNodeModel = new Schema({
  account_addr: String,
  token: String,
  ip: String,
  service_charge: Number,
  joined_on: Number,
  swixer: {
    status: String,
    init_on: Number,
    ping_on: Number
  }
})

export const SwixerNodes = mongoose.model('SwixerNode', swixerNodeModel)