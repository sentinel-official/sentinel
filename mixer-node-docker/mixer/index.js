let accountDbo = require('../server/dbos/account.dbo');
let mixerDbo = require('../server/dbos/mixer.dbo');
let { getBalance } = require('../ethereum/accounts');
let { scheduleMixTransfer } = require('./mixScheduler');


let start = () => {
  mixerDbo.getMixDetails((error, mixDetails) => {
    if (error) console.log(error);
    else {
      mixDetails.forEach((details) => {
        let balance = getBalance(details.toAddress, 'main');
        if (balance > 0) {
          accountDbo.updateAccountBalance(details.toAddress, balance,
            (error, result) => {
              if (error) console.log(error);
              else {
                scheduleMixTransfer(details.toAddress, details.destinationAddress, details.delayInSeconds, balance,
                  (error) => {
                    if (error) console.log(error);
                    else {
                      mixerDbo.updateMixStatus(details.toAddress, 1,
                        (error, result) => {
                          if (error) console.log(error);
                          else console.log('Success');
                        });
                    }
                  });
              }
            });
        }
      });
    }
  });
};

module.exports = {
  start: start
};
