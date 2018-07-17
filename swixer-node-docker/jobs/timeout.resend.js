let { scheduleJob } = require('node-schedule');
let { eachLimit, waterfall } = require('async');
let { getAccount } = require('../server/dbos/account.dbo');
let { getBalance } = require('../factories/accounts');
let { transfer } = require('../factories/transactions');

let SwixerModel = require('../server/models/swixer.model');

const resend = (list, cb) => {
  eachLimit(list, 1, (item, iterate) => {
    let address = item.toAddress;
    let fromSymbol = item.fromSymbol;
    let toSymbol = item.toSymbol;
    let clientAddress = item.clientAddress;
    let refundingBalance = null;

    waterfall([
      (next) => {
        getBalance(address, fromSymbol, (err, balance) => {
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
        if (refundingBalance > 0) {
          updateSwix({ toAddress: address }, { isScheduled: true, isRefunded: true, message: 'money refunded to client' }, (err, resp) => {
            if (err) {
              console.log('error at updating swix status in resend job');
              next({}, null)
            } else {
              next()
            }
          })
        } else {
          next({}, null)
        }
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
      iterate()
    })
  }, () => {
    cb()
  })
}

const timeoutResend = () => {
  scheduleJob('0 * * * * *', () => {
    SwixerModel.find({ isTimeout: true, isRefunded: false }, (err, list) => {
      if (!err && list) {
        resend(list, () => {

        })
      } else {
        console.log('error occured in resend job')
      }
    })
  })
}

module.exports = {
  timeoutResend
}


/* 
[{'remainingAmount': {$exists: false}},{'remainingAmount': {$gt: 0}}]
*/