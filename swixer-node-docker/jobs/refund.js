let { scheduleJob } = require('node-schedule');
let { waterfall, eachLimit } = require('async');
let { getBalance } = require('../factories/accounts');
let { getAccount } = require('../server/dbos/account.dbo');
let { transfer } = require('../factories/transactions');
let { updateSwixStatus } = require('../server/dbos/swixer.dbo')
let { getExchangeRate } = require('../factories/exchange');
let SwixerModel = require('../server/models/swixer.model');

const resend = (list, cb) => {
  eachLimit(list, 1, (item, iterate) => {
    console.log('item', item)
    let address = item.toAddress;
    let fromSymbol = item.fromSymbol;
    let toSymbol = item.toSymbol;
    let clientAddress = item.clientAddress;
    let refundingBalance = null;
    let accountDetails = null;

    waterfall([
      (next) => {
        if (!item.remainingAmount) {
          getBalance(address, fromSymbol, (err, balance) => {
            if (err) {
              console.log('error at getBalance in resend job');
              next({}, null)
            } else {
              refundingBalance = balance;
              next()
            }
          })
        } else {
          getExchangeRate(item.remainingAmount, toSymbol, fromSymbol, (err, value) => {
            if (err) {
              console.log('error at calculating exchange rate');
              next({}, null);
            } else {
              refundingBalance = value
              next()
            }
          })
        }

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
        transfer(privateKey, clientAddress, refundingBalance, fromSymbol, (err, resp) => {
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
          toSymbol: 1,
          clientAddress: 1,
          toAddress: 1,
          remainingAmount: 1,
          time: { $add: ["$insertedOn", "$delayInSeconds", 60 * 60 * 1] }
        }
      }, {
        $match: {
          $and: [{ "time": { $lte: parseInt(Date.now() / 1000) } }, { "isScheduled": { $eq: false } }, { $or: [{ 'remainingAmount': { $exists: false } }, { 'remainingAmount': { $gt: 0 } }] }]
        }
      }
    ], (err, list) => {
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
  refund
}


/* 
[{'remainingAmount': {$exists: false}},{'remainingAmount': {$gt: 0}}]
*/