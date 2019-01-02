import mongoose from "mongoose";

let Schema = mongoose.Schema

let swixModel = new Schema({
  node_address: String,
  from_symbol: String,
  to_symbol: String,
  client_address: String,
  destination_address: String,
  delay_in_seconds: Number,
  address: String,
  swix_hash: String
})

export const Swixes = mongoose.model('swixes', swixModel)