var schedule = require('node-schedule')
var async = require('async')
var dbo = require('../db/db')

import * as ETHHelper from '../helpers/eth';

export const payments = (message) => {
  var hour = 20;
  var minute = 40;
  var db = null;
  var paidCount = 0;
  var unPaidCount = 0;

  if (message === 'start') {
    var j = schedule.scheduleJob('*/45 * * * * *', () => {
      var currentTime = new Date()
      var timestamp = Date.now() / 1000
      async.waterfall([
        (next) => {
          if (currentTime.getHours() == hour && currentTime.getMinutes() == minute) {
            dbo.dbs((err, dbo) => {
              db = dbo.db('sentinel1')
              next()
            })
          } else {
            next({}, null)
          }
        }, (next) => {
          db.collection('connections').aggregate([{
            '$match': {
              'start_time': {
                '$gte': timestamp - (24 * 60 * 60)
              }
            }
          }, {
            '$group': {
              '_id': '$client_addr'
            }
          }]).toArray((err, result) => {
            next(null, result)
          })
        }, (result, next) => {
          async.eachSeries(result, (addr, iterate) => {
            if (addr['_id']) {
              ETHHelper.getVpnUsage(addr['_id'], (err, usage) => {
                if (!err) {
                  if (usage) {
                    var sessions = usage['sessions'];
                    sessions.map((session, index) => {
                      if (session['timestamp'] ) {
                        if (session['is_paid']) {
                          paidCount += parseFloat(session['amount'])
                        } else {
                          unPaidCount += parseFloat(session['amount'])
                        }
                      };
                    })
                  } else {
                    next()
                  }
                }
              })
            }
            iterate()
          }, () => {
            db.collection('payments').update({
              'timestamp': timestamp
            }, {
                $set: {
                  'paid_count': paidCount,
                  'unpaid_count': unPaidCount
                }
              }, {
                'upsert': true
              })
            next()
          })
        }
      ], (err, resp) => {
        console.log('payments')
      })
    })
  }
}