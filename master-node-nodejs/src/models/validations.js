import mongoose from "mongoose";

let Schema = mongoose.Schema

let validationSchema = new Schema({
  nodeId: String,
  invalidCount: Number,
  isBlocked: {
    type: Boolean,
    default: false
  }
});

export const Validation = mongoose.model('Validation', validationSchema);