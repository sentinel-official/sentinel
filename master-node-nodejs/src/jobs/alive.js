import { scheduleJob } from "node-schedule";
import { waterfall } from "async";
import dbo from "../db/db";


export const alive = (data) => {
  let maxSecs = data.maxSecs || null;
  let db = null

  if (data.message == 'start') {
    scheduleJob('*/5 * * * * *', function () {
      let minTime = Date.now() / 1000 - maxSecs;
      if (global.db) {
        waterfall([
          (next) => {
            db = global.db
            next()
          }, (next) => {
            db.collection('nodes').updateMany({
              'vpn.ping_on': {
                '$lt': minTime
              }
            }, {
                '$set': {
                  'vpn.status': 'down'
                }
              }, (err, resp) => {
                if (err) throw err
                else next()
              })
          }
        ], (err, resp) => {
          console.log('alive')
        })
      }
    })
  }
}