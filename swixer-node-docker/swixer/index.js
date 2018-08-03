let async = require('async');
let swixerDbo = require('../server/dbos/swixer.dbo');
let {
  getBalance
} = require('../factories/accounts');
let {
  getExchangeRate
} = require('../factories/exchange');
let {
  scheduleSwixTransfer
} = require('./scheduler');
let {
  decimals
} = require('../config/vars')
let {
  sendGasPrice
} = require('../swixer/sendGasPrice')
let coins = require('../config/coins')


let start = (cb) => {
  async.waterfall([
    (l0Next) => {
      swixerDbo.getValidSwixes((error, swixes) => {
        if (error) l0Next({
          status: 2001,
          message: 'Error occurred while getting swixes.'
        }, null);
        else l0Next(null, swixes);
      });
    }, (swixes, l0Next) => {
      let failed = [];
      let succeeded = [];
      if (swixes.length > 0) {
        async.eachLimit(swixes, 1,
          (swix, l1Next) => {
            swix = swix.toObject();
            let address = swix.toAddress;
            let coinSymbol = swix.fromSymbol;
            let {
              fromSymbol,
              toSymbol
            } = swix;
            async.waterfall([
              (l2Next) => {
                getBalance(address, coinSymbol,
                  (error, balance) => {
                    if (error) l2Next({
                      status: 3001,
                      message: 'Error occurred while checking balance.'
                    });
                    else l2Next(null, balance);
                  });
              }, (amount, l2Next) => {
                if (amount > 0) {
                  let receivedVal = 'receivedValue' in swix ? true : false
                  async.waterfall([
                    (l3Next) => {
                      console.log('calling sendGasPrice', !receivedVal && coins[fromSymbol].type === 'ETH')
                      if (!receivedVal && fromSymbol != 'ETH' && coins[fromSymbol].type === 'ETH') {
                        sendGasPrice(address, (error, resp) => {
                          console.log('error , resp in sendGasPrice', error, resp)
                          if (error) {
                            l3Next({
                              status: 4001,
                              message: 'Error occurred while sending gas price'
                            });
                          } else {
                            l3Next(null)
                          }
                        })
                      } else l3Next(null)
                    }, (l3Next) => {
                      if (!receivedVal) {
                        swixerDbo.updateSwix({
                          swixHash: swix.swixHash
                        }, {
                          receivedTime: Date.now(),
                          receivedValue: amount,
                          status: 'gotFunds'
                        }, (error, resp) => {
                          if (error) {
                            l3Next({
                              status: 4001,
                              message: 'Error occurred while getting updating swix.'
                            });
                          } else {
                            amount = (amount * swix.rate) * Math.pow(10, decimals[toSymbol]) / (Math.pow(10, decimals[fromSymbol]))
                            l3Next(null, amount);
                          }
                        })
                      } else {
                        amount = (amount * swix.rate) * Math.pow(10, decimals[toSymbol]) / (Math.pow(10, decimals[fromSymbol]))
                        l3Next(null, amount);
                      }
                    },
                  ], (error, amount) => {
                    if (error) l2Next(error);
                    else {
                      swix.transferAmount = swix.remainingAmount ? swix.remainingAmount : amount;
                      swix.delayInSeconds = swix.remainingAmount ? Math.min(15, swix.delayInSeconds) : swix.delayInSeconds;
                      console.log(swix);
                      async.waterfall([
                        (l4Next) => {
                          scheduleSwixTransfer(swix,
                            (error) => {
                              if (error) l4Next(null, {
                                status: 4001,
                                message: 'Error occurred while scheduling.'
                              });
                              else l4Next(null, {
                                status: 4000,
                                message: 'Scheduled successfully.'
                              });
                            });
                        }, (statusObject, l4Next) => {
                          let {
                            message
                          } = statusObject;
                          swixerDbo.updateSwixStatus(address, message, statusObject.status === 4000,
                            (error, result) => {
                              l4Next(null, statusObject.status === 4000);
                            });
                        }
                      ], (error, isScheduled) => {
                        if (isScheduled) succeeded.push(address);
                        else failed.push(address);
                        l2Next(null);
                      });
                    }
                  });
                } else l2Next(null);
              }
            ], (error) => {
              l1Next(null);
            });
          }, () => {
            l0Next(null, {
              failed,
              succeeded
            });
          });
      } else l0Next(null, {
        failed,
        succeeded
      });
    }
  ], (error, list) => {
    cb(null, list);
  });
};

module.exports = {
  start
};