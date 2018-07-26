let async = require('async');
let accountDbo = require('../server/dbos/account.dbo');
let mixerDbo = require('../server/dbos/mixer.dbo');
let { getBalanceSync } = require('../ethereum/accounts');
let { scheduleMixTransfer } = require('./mixScheduler');


let start = (cb) => {
  async.waterfall([
    (l0Next) => {
      mixerDbo.getAllValidMixDetails((error, allDetails) => {
        if (error) l0Next({
          status: 2001,
          message: 'Error occurred while getting all mix details.'
        }, null);
        else l0Next(null, allDetails);
      });
    }, (allDetails, l0Next) => {
      let failed = [];
      let succeeded = [];
      if (allDetails.length > 0) {
        async.eachLimit(allDetails, 1,
          (details, l1Next) => {
            let amount = getBalanceSync(details.toAddress, coinSymbol);
            if (amount > 0) {
              details.transferAmount = details.remainingAmount ? details.remainingAmount : amount;
              details.delayInSeconds = details.remainingAmount ? 15 : details.delayInSeconds;
              async.waterfall([
                (l2Next) => {
                  scheduleMixTransfer(details,
                    (error) => {
                      if (error) l2Next(null, {
                        status: 3001,
                        message: 'Error occurred while scheduling.'
                      });
                      else l2Next(null, {
                        status: 3000,
                        message: 'Scheduled successfully.'
                      });
                    });
                }, (statusObject, l2Next) => {
                  mixerDbo.updateMixStatus(details.toAddress, statusObject,
                    (error, result) => {
                      l2Next(null, statusObject.status === 3000);
                    });
                }
              ], (error, isScheduled) => {
                if (isScheduled) succeeded.push(details.toAddress);
                else failed.push(details.toAddress);
                l1Next(null);
              });
            } else l1Next(null);
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
  ], (error, info) => {
    cb(null, info);
  });
};

module.exports = {
  start: start
};
