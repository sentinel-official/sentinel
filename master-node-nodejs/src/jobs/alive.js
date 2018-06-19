var schedule = require('node-schedule')
var async = require('async')
var dbo = require('../db/db')


export const alive = function (data) {
  var maxSecs = data.maxSecs || null;
  var db = null
  if (data.message == 'start') {
    schedule.scheduleJob('*/5 * * * * *', function () {
      var minTime = Date.now() / 1000 - maxSecs;

      async.waterfall([
        (next) => {
          dbo.dbs((err, dbo) => {
            db = dbo.db('sentinel1');
            next()
          })
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
    })
  } else if (data.message == 'stop') {
    process.kill(process.id)
  }
}