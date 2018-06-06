let web3 = require('./web3');
let tokenConfigs = require('../config/ethereum/tokens');


class Tokens {
  constructor(tokenConfigs) {
    tokenConfigs.forEach((config) => {
      this.loadToken(config);
    });
  }

  loadToken(config) {
    this[config.symbol] = {
      abi: config.abi,
      symbol: config.symbol,
      address: config.address,
      decimals: config.decimals,
      contract: web3.eth.contract(config.abi).at(config.address)
    };
  }

  balanceOf(address, tokenSymbol, cb) {
    let balance = this[tokenSymbol].contract.balanceOf(address, (error, balance) => {
      if(error) cb(error, null);
      else cb(null, balance);
    });
  }

  balanceOfSync(address, tokenSymbol) {
    let balance = this[tokenSymbol].contract.balanceOf(address);
    return balance;
  }
}

let tokens = new Tokens(tokenConfigs);

module.exports = tokens;
