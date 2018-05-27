let mixerDbo = require('../server/dbos/mixer.dbo');
let accountDbo = require('../server/dbos/account.dbo');
let { transferEthers } = require('../ethereum/transactions');


let mixTransfer = (toAddress, destinationAddress, totalAmount, cb) => {
  accountDbo.getFromAddressesDetails([toAddress],
    (error, fromAddressesDetails) => {
      if (error) console.log(error);
      else {
        fromAddressesDetails.forEach((fromAddressDetails) => {
          let amount = Math.min(totalAmount, fromAddressDetails.balances.eth)
          transferEthers(fromAddressDetails.privateKey, destinationAddress, amount, 'main',
            (error, txHash) => {
              if (error) console.log(error);
              else {
                totalAmount -= amount;
                mixerDbo.insertTxHash(toAddress, txHash,
                  (error, result) => {
                    if (error) console.log(error);
                    else console.log(txHash);
                  });
              }
            });
        });
      }
    });
}

module.exports = {
  mixTransfer: mixTransfer
};
