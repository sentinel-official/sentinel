let schedule = require('node-schedule');
let { mixTransfer } = require('./mixTransfer');


let scheduleMixTransfer = (toAddress, destinationAddress, delayInSeconds, amount, cb) => {
  let date = new Date(Date.now() + (delayInSeconds * 1000))
  try {
    schedule.scheduleJob(date, () => {
      mixTransfer(toAddress, destinationAddress, amount,
        (error, result) => {
          if (error) console.log(error);
          else console.log(result);
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
