let schedule = require('node-schedule');
let { swixTransfer } = require('./transfer');
let swixerDbo = require('../server/dbos/swixer.dbo');


let scheduleSwixTransfer = (swix, cb) => {
  let address = swix.toAddress;
  let { destinationAddress,
    transferAmount,
    delayInSeconds } = swix;
  let coinSymbol = swix.toSymbol;
  let date = new Date(Date.now() + (delayInSeconds * 1000));
  try {
    schedule.scheduleJob(date,
      () => {
        swixTransfer(address, destinationAddress, transferAmount, coinSymbol,
          () => {
            swixerDbo.increaseTries(address,
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
  scheduleSwixTransfer
};
