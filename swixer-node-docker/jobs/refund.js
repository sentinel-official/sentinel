let {
  scheduleJob
} = require('node-schedule');
let {
  waterfall,
  eachLimit
} = require('async');
let {
  getBalance
} = require('../factories/accounts');
let {
  getAccount
} = require('../server/dbos/account.dbo');
let {
  transfer
} = require('../factories/transactions');
let {
  updateSwixStatus,
  updateSwix
} = require('../server/dbos/swixer.dbo')
let {
  getExchangeRate
} = require('../factories/exchange');
let SwixerModel = require('../server/models/swixer.model');
let {
  decimals
} = require('../config/vars')

const resend = (list, cb) => {
  eachLimit(list, 1, (item, iterate) => {
    console.log('item', item)
    let address = item.toAddress;
    let fromSymbol = item.fromSymbol;
    let toSymbol = item.toSymbol;
    let clientAddress = item.clientAddress;
    let refundingBalance = null;
    let accountDetails = null;
    let rate = item.rate;

    waterfall([
      (next) => {
        let remainAmount = 'remainingAmount' in item ? true : false
        if (!remainAmount) {
          refundingBalance = item.receivedValue
          next()
        } else {
          let amount = item.remainingAmount
          amount = (1 / rate) * amount * decimals[fromSymbol] * (1 / decimals[toSymbol])
          refundingBalance = amount
          next()
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
        updateSwix({
          toAddress: address
        }, {
          isScheduled: true,
          status: 'refunded',
          message: 'refunded to the client'
        }, (err, resp) => {
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
  scheduleJob('*/5 * * * *', () => {
    SwixerModel.aggregate([{
      $project: {
        isScheduled: 1,
        fromSymbol: 1,
        toSymbol: 1,
        refundAddress: 1,
        toAddress: 1,
        remainingAmount: 1,
        receivedValue: 1,
        tries: 1,
        rate,
        time: {
          $add: ["$insertedOn", "$delayInSeconds", 60 * 60 * 1]
        }
      }
    }, {
      $match: {
        $and: [{
          "time": {
            $lte: parseInt(Date.now() / 1000)
          }
        }, {
          "isScheduled": {
            $eq: false
          }
        }, {
          "tries": {
            $gte: 10
          }
        }, {
          $or: [{
            'remainingAmount': {
              $exists: false
            }
          }, {
            'remainingAmount': {
              $gt: 0
            }
          }]
        }]
      }
    }], (err, list) => {
      if (!err && list) {
        resend(list, () => {})
      } else {
        console.log('error occured in resend job')
      }
    })
  })
}

module.exports = {
  refund
}