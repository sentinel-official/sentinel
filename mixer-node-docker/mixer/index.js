let accountDbo = require('../server/dbos/account.dbo');
let mixerDbo = require('../server/dbos/mixer.dbo');
let { getBalance } = require('../ethereum/accounts');
let { scheduleMixTransfer } = require('./mixScheduler');


let start = (cb) => {
  mixerDbo.getMixDetails((error, mixDetails) => {
    if (error) {
      console.log(error);
      cb();
    } else {
      console.log(mixDetails);
      if (mixDetails.length === 0) cb();
      mixDetails.forEach((details, index) => {
        let { toAddress, destinationAddress, delayInSeconds } = details;
        let balance = getBalance(details.toAddress, 'main');
        if (balance > 0) {
          accountDbo.updateAccountBalance(toAddress, balance,
            (error, result) => {
              if (error) {
                console.log(error);
                if (index === mixDetails.length - 1) cb();
              }
              else {
                scheduleMixTransfer(toAddress, destinationAddress, delayInSeconds, balance,
                  (error) => {
                    if (error) {
                      console.log(error);
                      if (index === mixDetails.length - 1) cb();
                    } else {
                      mixerDbo.updateMixStatus(toAddress, 1,
                        (error, result) => {
                          if (error) {
                            console.log(error);
                            if (index === mixDetails.length - 1) cb();
                          }
                          else {
                            console.log('Success');
                            if (index === mixDetails.length - 1) cb();
                          }
                        });
                    }
                  });
              }
            });
        } else {
          if (index === mixDetails.length - 1) cb();
        }
      });
    }
  });
};

module.exports = {
  start: start
};
