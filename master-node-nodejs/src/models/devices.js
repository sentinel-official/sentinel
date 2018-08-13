import mongoose from "mongoose";
let Schema = mongoose.Schema

let DeviceSchema = new Schema({
  session_name: String,
  account_addr: String,
  device_id: String,
});

export const Device = mongoose.model('Device', DeviceSchema);
