let schedule = require('node-schedule');
let { mixTransfer } = require('./mixTransfer');
let mixerDbo = require('../server/dbos/mixer.dbo');


let scheduleMixTransfer = (toAddress, destinationAddress, delayInSeconds, totalAmount, coinSymbol, cb) => {
  let date = new Date(Date.now() + (delayInSeconds * 1000));
  try {
    schedule.scheduleJob(date, () => {
      mixTransfer(toAddress, destinationAddress, totalAmount, coinSymbol,
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