import { scheduleJob } from "node-schedule";
import { waterfall } from "async";
import { Node } from "../models";
import database from "../db/database";


export const alive = (data) => {
  let maxSecs = data.maxSecs || null;
  let db = null

  if (data.message == 'start') {
    scheduleJob('*/5 * * * * *', () => {
      let minTime = Date.now() / 1000 - maxSecs;

      let findData = {
        'vpn.ping_on': {
          '$lt': minTime
        }
      }

      let updateData = {
        'vpn.status': 'down'
      }
      
      database.updateMany(Node, findData, updateData, (err, resp) => {
        if (err) throw err;
        else console.log('alive')
      })
    })
  }
}