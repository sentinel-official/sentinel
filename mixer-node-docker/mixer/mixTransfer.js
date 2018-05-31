let mixerDbo = require('../server/dbos/mixer.dbo');
let accountDbo = require('../server/dbos/account.dbo');
let { transfer } = require('../ethereum/transactions');


let mixTransfer = (toAddress, destinationAddress, totalAmount, coinSymbol, cb) => {
  accountDbo.getFromAddressesDetails([toAddress], coinSymbol,
    (error, fromAddressesDetails) => {
      if (error) {
        mixerDbo.updateMixStatus(toAddress, 'Error occurred while getting from addresses details.',
          (error, result) => {
            cb();
          });
      } else {
        if (fromAddressesDetails.length === 0) {
          mixerDbo.updateMixStatus(toAddress, 'No from addresses details found.',
            (error, result) => {
              cb();
            });
        }
        fromAddressesDetails.forEach((fromAddressDetails, index) => {
          let amount = Math.min(totalAmount, fromAddressDetails.balances[coinSymbol]);
          if (amount > 0) {
            transfer(fromAddressDetails.privateKey, destinationAddress, amount, coinSymbol, 'main',
              (error, txHash) => {
                if (error) {
                  mixerDbo.updateTransactionsStatus(toAddress, totalAmount, null, 'Error occurred while initiating transaction.',
                    (error, result) => {
                      if (index === fromAddressesDetails.length - 1) cb();
                    });
                } else {
                  totalAmount -= amount;
                  mixerDbo.updateTransactionsStatus(toAddress, totalAmount, txHash, 'Transactions initiated successfully.',
                    (error, result) => {
                      if (index === fromAddressesDetails.length - 1) cb();
                    });
                }
              });
          } else {
            mixerDbo.updateMixStatus(toAddress, 'Minimum amount became zero.',
              (error, result) => {
                cb();
              });
          }
        });
      }
    });
};

module.exports = {
  mixTransfer: mixTransfer
};