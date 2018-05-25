let chains = require('./chains');


let getTransactionCount = (address, chainName) => {
  let count = chains[chainName].web3.eth.getTransactionCount(address);
  count = chains[chainName].web3.toDecimal(count);
  return count;
};

let getBalance = (address, chainName) => {
  let balance = chains[chainName].web3.eth.getBalance(address);
  balance = chains[chainName].web3.toDecimal(balance);
  return balance;
};


module.exports = {
  getTransactionCount: getTransactionCount,
  getBalance: getBalance
};
