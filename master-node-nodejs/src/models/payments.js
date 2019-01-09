import mongoose from "mongoose";

let Schema = mongoose.Schema

let paymentSchema = new Schema({
  timestamp: Number,
  paid_count: Number,
  unpaid_count: Number
});

export const Payment = mongoose.model('Payment', paymentSchema);