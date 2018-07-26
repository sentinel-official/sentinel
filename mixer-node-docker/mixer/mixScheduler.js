let schedule = require('node-schedule');
let { mixTransfer } = require('./mixTransfer');
let mixerDbo = require('../server/dbos/mixer.dbo');


let scheduleMixTransfer = (details, cb) => {
  let { toAddress,
    destinationAddress,
    transferAmount,
    coinSymbol,
    delayInSeconds } = details;
  let date = new Date(Date.now() + (delayInSeconds * 1000));
  try {
    schedule.scheduleJob(date,
      () => {
        mixTransfer(toAddress, destinationAddress, transferAmount, coinSymbol,
          () => {
            mixerDbo.increaseTries(toAddress,
              (error, result) => {
                console.log('-'.repeat(108));
              });
          });
      });
    cb(null);
  } catch (error) {
    cb(error);
  }
};

module.exports = {
  scheduleMixTransfer: scheduleMixTransfer
};