let { scheduleJob } = require('node-schedule');
let { waterfall, eachLimit } = require('async');
let { getBalance } = require('../factories/accounts');
let { getAccount } = require('../server/dbos/account.dbo');
let { transfer } = require('../factories/transactions');
let { updateSwixStatus } = require('../server/dbos/swixer.dbo')
let SwixerModel = require('../server/models/swixer.model');

const resend = (list, cb) => {
  eachLimit(list, 1, (item, iterate) => {
    console.log('item', item)
    let address = item.toAddress;
    let coinSymbol = item.fromSymbol;
    let clientAddress = item.clientAddress;
    let refundingBalance = null;
    let accountDetails = null;

    waterfall([
      (next) => {
        getBalance(address, coinSymbol, (err, balance) => {
          if (err) {
            console.log('error at getBalance in resend job');
            next({}, null)
          } else {
            refundingBalance = balance;
            next()
          }
        })
      }, (next) => {
        getAccount(address, (err, details) => {
          if (err) {
            console.log('error at getAccount in resend job');
            next({}, null)
          } else {
            accountDetails = details;
            next()
          }
        })
      }, (next) => {
        updateSwixStatus(address, 'money refunded to client', true, (err, resp) => {
          if (err) {
            console.log('error at updating swix status in resend job');
            next({}, null)
          } else {
            next()
          }
        })
      }, (next) => {
        let privateKey = details.privateKey;
        transfer(privateKey, clientAddress, refundingBalance, coinSymbol, (err, resp) => {
          if (err) {
            console.log('error at transfer in resend job')
            next({}, null)
          } else {
            next()
          }
        })
      }
    ], (err, resp) => {
      iterate();
    })
  }, () => {
    cb();
  })
}

const refund = () => {
  scheduleJob('0 * * * * *', () => {
    SwixerModel.aggregate([
      {
        $project: {
          isScheduled: 1,
          fromSymbol: 1,
          clientAddress: 1,
          toAddress: 1,
          remainingAmount: 1,
          day: { $add: ["$insertedOn", "$delayInSeconds"] }
        }
      }, {
        $match: {
          $and: [{ "day": { $lte: parseInt(Date.now() / 1000) } }, { "isScheduled": { $eq: false } }, { "remainingAmount": { $exists: false } }]
        }
      }
    ], (err, list) => {
      if (!err && list) {
        resend(list, () => {

        })
      } else {
        console.log('error occured in resed job')
      }
    })
  })
}

module.exports = {
  refund
}