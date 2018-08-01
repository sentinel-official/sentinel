import mongoose from "mongoose";
import chalk from "chalk";
import {
  MONGO_URI
} from '../config/vars'

export const dbo = () => {
  mongoose.connect(MONGO_URI, {
    useNewUrlParser: true
  }, (err, db) => {
    if (err) {
      throw err
    } else {
      console.log(
        chalk.green.bold(
          `
        MongoDB connected Successfully`
        )
      );
    }
  })
}

const insert = (Obj, cb) => {
  Obj.save((err, resp) => {
    if (err) cb(err, null)
    else cb(null, resp)
  })
}

const update = (Obj, findData, updateData, cb) => {
  Obj.update(findData, {
    $set: updateData
  }, (err, resp) => {
    if (err) cb(err, null)
    else cb(null, resp)
  })
}

const updateMany = (Obj, findData, updateData, cb) => {
  Obj.updateMany(findData, {
    $set: updateData
  }, (err, resp) => {
    if (err) cb(err, null)
    else cb(null, resp)
  })
}

export default {
  dbo,
  insert,
  update,
  updateMany
}
