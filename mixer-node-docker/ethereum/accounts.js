let chains = require('./chains');
let tokens = require('./tokens');


let getTransactionCount = (address, chainName) => {
  let count = chains[chainName].web3.eth.getTransactionCount(address);
  count = chains[chainName].web3.toDecimal(count);
  return count;
};

let getBalance = (address, coinSymbol, chainName) => {
  let balance = 0;
  if (coinSymbol === 'eth') {
    balance = chains[chainName].web3.eth.getBalance(address);
    balance = chains[chainName].web3.toDecimal(balance);
  } else {
    balance = tokens.balanceOf(address, coinSymbol);
    balance = tokens.web3.toDecimal(balance);
  }
  return balance;
};


module.exports = {
  getTransactionCount: getTransactionCount,
  getBalance: getBalance
};