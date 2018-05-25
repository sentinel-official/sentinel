let Web3 = require('web3');
let chainConfigs = require('../config/ethereum/chains');


class Chains {
  constructor(chainConfigs) {
    chainConfigs.forEach((config) => {
      this.loadChain(config);
    });
  }

  loadChain(config) {
    let web3 = new Web3(new Web3.providers.HttpProvider(config.rpcServerAddress));
    this[config.chainName] = {
      chainId: config.chainId,
      rpcServerAddress: config.rpcServerAddress,
      web3: web3,
    };
  }
}

let chains = new Chains(chainConfigs);

module.exports = chains;
