let btcTransactions = require('./bitcoin/transactions');
let ethTransactions = require('./ethereum/transactions');
let coins = require('../config/coins');


let transfer = (fromPrivateKey, toAddress, value, coinSymbol, cb) => {
  let coin = coins[coinSymbol];
  if (coin.type === 'BTC') {
    btcTransactions.transfer(toAddress, value, coinSymbol,
      (error, txHash) => {
        console.log('error, txHash in BTC-----------------------------------------------', error, txHash)
        cb(error, txHash);
      });
  } else if (coin.type === 'ETH') {
    ethTransactions.transfer(fromPrivateKey, toAddress, value, coinSymbol,
      (error, txHash) => {
        cb(error, txHash);
      });
  }
};

module.exports = {
  transfer
};