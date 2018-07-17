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
      if (mixDetails.length === 0) cb();
      mixDetails.forEach((details, index) => {
        let { toAddress,
          destinationAddress,
          delayInSeconds,
          coinSymbol,
          remainingAmount } = details;
        let balance = getBalance(toAddress, coinSymbol, 'main');
        // let balance = 1e8;
        if (balance > 0) {
          accountDbo.updateAccountBalance(toAddress, balance, coinSymbol,
            (error, result) => {
              if (error) {
                mixerDbo.updateMixStatus(toAddress, 'Error occurred while updating balance.',
                  (error, result) => {
                    if (error) {
                      console.log(error);
                      if (index === mixDetails.length - 1) cb();
                    } else {
                      if (index === mixDetails.length - 1) cb();
                    }
                  });
              } else {
                if (!remainingAmount) remainingAmount = balance;
                if (remainingAmount > 0) {
                  if (remainingAmount !== balance) delayInSeconds = 15;
                  scheduleMixTransfer(toAddress, destinationAddress, delayInSeconds, remainingAmount, coinSymbol,
                    (error) => {
                      if (error) {
                        mixerDbo.updateMixStatus(toAddress, 'Error occurred while scheduling mix.',
                          (error, result) => {
                            if (error) {
                              console.log(error);
                              if (index === mixDetails.length - 1) cb();
                            } else {
                              if (index === mixDetails.length - 1) cb();
                            }
                          });

                      } else {
                        mixerDbo.updateMixStatus(toAddress, 'Mix scheduled successfully.',
                          (error, result) => {
                            if (error) {
                              console.log(error);
                              if (index === mixDetails.length - 1) cb();
                            }
                            else {
                              if (index === mixDetails.length - 1) cb();
                            }
                          });
                      }
                    });
                } else {
                  if (index === mixDetails.length - 1) cb();
                }
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
