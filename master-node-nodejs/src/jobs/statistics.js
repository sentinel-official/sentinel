import { scheduleJob } from "node-schedule";
import { waterfall } from "async";
import { dbs } from "../db/db";

let minutes = 0;
let hours = 0;

export const stats = (message) => {
  if (message === 'start') {
    let j = scheduleJob('*/45 * * * * *', () => {
      let nodes = {};
      let currentTime = new Date();
      let db = null;
      let timestamp = null
      if (global.db) {
        waterfall([
          (next) => {
            if (currentTime.getHours() == hours && currentTime.getMinutes() == minutes) {
              db = global.db
              next()
            } else {
              next({}, null)
            }
          }, (next) => {
            db.collection('nodes').find({ 'vpn.status': 'up' }).toArray(
              (err, up) => {
                nodes.up = up.length;
              }
            )
            db.collection('nodes').find().toArray(
              (err, total) => {
                nodes.total = total.length;
                next();
              }
            )
          }, (next) => {
            timestamp = currentTime;
            timestamp.setHours(0);
            timestamp.setMinutes(0);
            timestamp.setSeconds(0);
            timestamp = timestamp.getTime() / 1000
            db.collection('statistics').update({
              timestamp: timestamp
            }, {
                '$set': { 'nodes': nodes }
              }, {
                upsert: true
              }, (err, resp) => {
                next();
              })
          }
        ], (err, resp) => {
          console.log('statistics : ', timestamp)
        })
      }
    })
  }
}