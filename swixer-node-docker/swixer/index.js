let async = require('async');
let swixerDbo = require('../server/dbos/swixer.dbo');
let { getBalance } = require('../factories/accounts');
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
            async.waterfall([
              (l2Next) => {
                getBalance(address, coinSymbol,
                  (error, balance) => {
                    balance = 1.0;
                    if (error) l2Next({
                      status: 3001,
                      message: 'Error occurred while checking balance.'
                    });
                    else l2Next(null, balance);
                  });
              }, (amount, l2Next) => {
                if (amount > 0) {
                  swix.transferAmount = swix.remainingAmount ? swix.remainingAmount : amount;
                  swix.delayInSeconds = swix.remainingAmount ? 30 : swix.delayInSeconds;
                  async.waterfall([
                    (l3Next) => {
                      scheduleSwixTransfer(swix,
                        (error) => {
                          if (error) l3Next(null, {
                            status: 4001,
                            message: 'Error occurred while scheduling.'
                          });
                          else l3Next(null, {
                            status: 4000,
                            message: 'Scheduled successfully.'
                          });
                        });
                    }, (statusObject, l3Next) => {
                      let { message } = statusObject;
                      swixerDbo.updateSwixStatus(address, message,
                        (error, result) => {
                          l3Next(null, statusObject.status === 4000);
                        });
                    }
                  ], (error, isScheduled) => {
                    if (isScheduled) succeeded.push(address);
                    else failed.push(address);
                    l2Next(null);
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
