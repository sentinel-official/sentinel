import mongoose from "mongoose";

let Schema = mongoose.Schema

let nodeSchema = new Schema({
  'device_id': String,
  'session_id': String,
  'from_addr': String,
  'to_addr': String,
  'sent_bytes': Number,
  'session_duration': Number,
  'amount': Number,
  'timestamp': Number
});

export const refSession = mongoose.model('refsession', nodeSchema);
