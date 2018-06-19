var schedule = require('node-schedule')
var async = require('async')
var dbo = require('../db/db')

var minutes = 21;
var hours = 18;

export const stats = (message) => {
  if (message === 'start') {
    var j = schedule.scheduleJob('*/45 * * * * *', function () {
      var nodes = {};
      var currentTime = new Date();
      var db = null;
      var timestamp = null

      async.waterfall([
        (next) => {
          if (currentTime.getHours() == hours && currentTime.getMinutes() == minutes) {
            dbo.dbs((err, dbo) => {
              db = dbo.db('sentinel1');
              next()
            })
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
          timestamp = timestamp.getTime()/1000
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
    })

  } else if (message == 'stop') {
    process.kill(process.pid)
  }
}