let web3 = require('../web3');
let tokenConfigs = require('../../config/ethereum/tokens');


class Tokens {
  constructor(tokenConfigs) {
    tokenConfigs.forEach((config) => {
      this.loadToken(config);
    });
  }

  loadToken(config) {
    let { symbol,
      abi,
      address,
      decimals } = config;
    this[symbol] = {
      abi,
      symbol,
      address,
      decimals,
      contract: web3.eth.contract(abi).at(address)
    };
  }

  getBalance(address, tokenSymbol, cb) {
    this[tokenSymbol].contract.balanceOf(address,
      (error, balance) => {
        if (error) cb(error, null);
        else cb(null, balance);
      });
  }
}

let tokens = new Tokens(tokenConfigs);

module.exports = tokens;