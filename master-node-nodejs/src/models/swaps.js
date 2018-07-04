import mongoose from "mongoose";

let Schema = mongoose.Schema

let swapSchema = new Schema({
  from_symbol: String,
  to_symbol: String,
  from_address: String,
  to_address: String,
  time_0: Number,
  status: Number
});

export const Swap = mongoose.model('Swap', swapSchema);