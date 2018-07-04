import mongoose from "mongoose";
let Schema = mongoose.Schema

let connectionSchema = new Schema({
  usage: { down: Number, up: Number },
  session_name: String,
  start_time: Number,
  client_addr: String,
  account_addr: String,
  end_time: Number
});

export const Connection = mongoose.model('Connection', connectionSchema);