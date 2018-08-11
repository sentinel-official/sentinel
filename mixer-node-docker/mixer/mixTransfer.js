let mixerDbo = require('../server/dbos/mixer.dbo');
let accountDbo = require('../server/dbos/account.dbo');
let accountHelper = require('../server/helpers/account.helper');
let { transfer } = require('../ethereum/transactions');


let mixTransfer = (toAddress, destinationAddress, totalAmount, coinSymbol, cb) => {
  async.waterfall([
    (l0Next) => {
      accountDbo.getAllAccounts((error, accounts) => {
        if (error) l0Next({
          status: 4000,
          message: 'Error occurred while getting accounts.'
        });
        else l0Next(null, accounts);
      });
    }, (accounts, l0Next) => {
      let addresses = lodash.map(accounts, 'address');
      addresses.splice(addresses.indexOf(toAddress), 1);
      accountHelper.getBalancesOfAllAddresses(addresses,
        (error, balancesOfAllAddresses) => {
          if (error) l0Next({
            status: 4001,
            message: 'Error occurred while getting balances of accounts.'
          });
          else l0Next(null, accounts, addresses, balancesOfAllAddresses);
        });
    }, (accounts, addresses, balancesOfAllAddresses, l0Next) => {
      let remainingAmount = totalAmount;
      async.eachLimit(addresses, 1,
        (address, l1Next) => {
          let account = accounts[address];
          let balancesOfAddress = balancesOfAllAddresses[addresses];
          if (balancesOfAddress['ETH'] > 20e9 * 50e3 && balancesOfAddress[coinSymbol] > 0) {
            let value = Math.min(balancesOfAddress[coinSymbol], remainingAmount);
            async.waterfall([
              (l2Next) => {
                transfer(account.privateKey, destinationAddress, value, coinSymbol,
                  (error, txHash) => {
                    if (txHash) remainingAmount -= value;
                    l2Next(null, {
                      fromAddress: account.address,
                      value: value,
                      txHash: txHash,
                      timestamp: Math.round(Date.now() / Math.pow(10, 3))
                    }, remainingAmount);
                  });
              }, (txInfo, remainingAmount, l2Next) => {
                mixerDbo.updateMixTransactionStatus(toAddress, txInfo, remainingAmount,
                  (error, result) => {
                    l2Next(null);
                  });
              }
            ], () => {
              l1Next(null);
            });
          } else l1Next(null);
        }, () => {
          l0Next(null);
        });
    }
  ], (error) => {
    cb(error);
  });
};

module.exports = {
  mixTransfer: mixTransfer
};
