import mongoose from "mongoose";

let Schema = mongoose.Schema

let freeSchema = new Schema({
  to_addr: String,
});

export const Free = mongoose.model('Free', freeSchema);