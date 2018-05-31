const Tx = require('ethereumjs-tx');
let chains = require('./chains');
let tokens = require('./tokens');
let { getTransactionCount } = require('./accounts');
let { generatePublicKey,
  generateAddress } = require('./keys');


let getGasPrice = (chainName) => {
  let price = chains[chainName].web3.eth.gasPrice;
  price = chains[chainName].web3.toHex(price);
  return price;
};

let transfer = (fromPrivateKey, toAddress, value, coinSymbol, chainName, cb) => {
  fromPrivateKey = Buffer.from(fromPrivateKey, 'hex');
  let frompublicKey = generatePublicKey(fromPrivateKey);
  let fromAddress = '0x' + generateAddress(frompublicKey).toString('hex');
  let rawTx = {
    nonce: getTransactionCount(fromAddress, chainName),
    gasPrice: '0x04a817c800',
    gasLimit: '0xf4240',
    to: toAddress,
    value: coinSymbol === 'eth' ? chains[chainName].web3.toHex(value) : '0x',
    data: coinSymbol === 'eth' ? '0x' : tokens[coinSymbol].contract.transfer.getData(toAddress, value)
  };
  let tx = new Tx(rawTx);
  tx.sign(fromPrivateKey);
  let serializedTx = '0x' + tx.serialize().toString('hex');
  chains[chainName].web3.eth.sendRawTransaction(serializedTx,
    (error, txHash) => {
      console.log(error);
      if (error) cb(error, null);
      else cb(null, txHash);
    });
};

let getEstimatedGasUnits = (fromAddress, toAddress, value, chainName, cb) => {
  chains[chainName].web3.eth.estimateGas({
    from: fromAddress,
    to: toAddress,
    value: value
  }, (error, gasUnits) => {
    if (error) cb(error, null);
    else {
      gasUnits = Number(gasUnits);
      cb(null, gasUnits);
    }
  });
};

module.exports = {
  getGasPrice: getGasPrice,
  transfer: transfer,
  getEstimatedGasUnits: getEstimatedGasUnits
};