import mongoose from "mongoose";
let Schema = mongoose.Schema

let connectionSchema = new Schema({
  usage: { down: Number, up: Number },
  session_name: String,
  start_time: Number,
  client_addr: String,
  vpn_addr: String,
  end_time: Number,
  server_usage: { down: Number, up: Number }  
});

export const Connection = mongoose.model('Connection', connectionSchema);