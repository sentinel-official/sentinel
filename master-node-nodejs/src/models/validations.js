import mongoose from "mongoose";

let Schema = mongoose.Schema

let validationSchema = new Schema({
  nodeID: String,
  invalidCount: Number,
  ipAddr: String,
  isBlocked: {
    type: Boolean,
    default: false
  }
});

export const Validation = mongoose.model('Validation', validationSchema);