let chains = require('./chains');
let { tokensConfigs } = require('../config/ethereum/tokens');


class Tokens {
  constructor(web3, tokensConfigs) {
    this.web3 = web3;
    tokensConfigs.forEach((config) => {
      this.loadToken(config);
    });
  }

  loadToken(config) {
    this[config.coinSymbol] = {
      address: config.address,
      decimals: config.decimals,
      contract: this.web3.eth.contract(config.abi).at(config.address)
    };
  }

  balanceOf(address, coinSymbol) {
    let balance = this[coinSymbol].contract.balanceOf(address);
    return balance;
  }
}

let tokens = new Tokens(chains['main'].web3, tokensConfigs);

module.exports = tokens;