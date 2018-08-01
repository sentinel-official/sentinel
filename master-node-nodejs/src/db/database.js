import mongoose from "mongoose";
import chalk from "chalk";
import {
  MONGO_HOST,
  MONGO_USER,
  MONGO_PASS
} from '../config/vars'


let pass = encodeURIComponent(MONGO_PASS)
let host = MONGO_HOST
let user = MONGO_USER
let url = "mongodb://" + user + ":" + pass.toString() + "@" + host + ":27017/sentinel";

export const dbo = () => {
  mongoose.connect(url, {
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
