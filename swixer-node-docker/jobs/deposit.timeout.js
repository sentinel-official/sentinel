let { scheduleJob } = require('node-schedule');
let { eachLimit } = require('async')
let SwixerModel = require('../server/models/swixer.model')

const depositTimeout = () => {
  scheduleJob('0 * * * * *', () => {
    SwixerModel.aggregate([
      {
        $project: {
          isScheduled: 1,
          fromSymbol: 1,
          clientAddress: 1,
          toAddress: 1,
          remainingAmount: 1,
          isMoneyDeposited: 1,
          isRefunded: 1,
          time: { $add: ["$insertedOn", 60 * 60 * 1] }
        }
      }, {
        $match: {
          $and: [{ "time": { $lte: parseInt(Date.now() / 1000) } }, { "isMoneyDeposited": { $eq: false } }, { "isRefunded": { $eq: false } }]
        }
      }
    ], (err, list) => {
      if (!err && list) {
        eachLimit(list, 1, (item, iterate) => {
          let address = item.toAddress
          SwixerModel.update({ toAddress: address }, { $set: { isTimeout: true } }, (err, resp) => {
            if (err) {
              console.log('error occured in resend job')
            }
            iterate()
          })
        }, () => {

        })
      } else {
        console.log('error occured in resend job')
      }
    })
  })
}

module.exports = {
  depositTimeout
}


/* 
[{'remainingAmount': {$exists: false}},{'remainingAmount': {$gt: 0}}]
*/