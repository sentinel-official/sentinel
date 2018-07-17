let async = require('async');
let swixerDbo = require('../server/dbos/swixer.dbo');
let { getBalance } = require('../factories/accounts');
let { getExchangeRate } = require('../factories/exchange');
let { scheduleSwixTransfer } = require('./scheduler');


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
            let { fromSymbol,
              toSymbol } = swix;
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
                  async.waterfall([
                    (l3next) => {
                      swixerDbo.updateSwix({ toAddress: address }, { isMoneyDeposited: true }, (err, resp) => {
                        if (err) {
                          l3next({
                            status: 4001,
                            message: 'error occured while changing money deposited'
                          }, null)
                        } else {
                          l3next(null)
                        }
                      })
                    }, (l3Next) => {
                      getExchangeRate(amount, fromSymbol, toSymbol,
                        (error, amount) => {
                          if (error) l3Next({
                            status: 4001,
                            message: 'Error occurred while getting exchange rate.'
                          });
                          else l3Next(null, amount);
                        });
                    }
                  ], (error, amount) => {
                    if (error) l2Next(error);
                    else {
                      swix.transferAmount = swix.remainingAmount ? swix.remainingAmount : amount;
                      swix.delayInSeconds = swix.remainingAmount ? Math.min(15, swix.delayInSeconds) : swix.delayInSeconds;
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
                          let { message } = statusObject;
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
