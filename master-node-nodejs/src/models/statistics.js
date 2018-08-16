import mongoose from "mongoose";

let Schema = mongoose.Schema

let statisticSchema = new Schema({
  timestamp: Number,
  nodes: {
    up: Number,
    total: Number
  }
});

export const Statistic = mongoose.model('Statistic', statisticSchema);