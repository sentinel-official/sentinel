import mongoose from "mongoose";

let Schema = mongoose.Schema

let usageSchema = new Schema({
  from_addr: String,
  to_addr: String,
  sent_bytes: Number,
  session_duration: Number,
  amount: Number,
  timestamp: Number
});

export const Usage = mongoose.model('Usage', usageSchema);