import mongoose from "mongoose";

let Schema = mongoose.Schema

let swapSchema = new Schema({
  from_symbol: String,
  to_symbol: String,
  from_address: String,
  to_address: String,
  tx_hash_0:String,
  time_0: Number,
  status: Number,
  message:String,
  tx_hash_1:String,
  time_1:Number
});

export const Swap = mongoose.model('Swap', swapSchema);