const Tx = require('ethereumjs-tx');
let web3 = require('./web3');
let tokens = require('./tokens');
let { getTransactionCount } = require('./accounts');
let { generatePublicKey,
  generateAddress } = require('./keys');


let transfer = (fromPrivateKey, toAddress, value, coinSymbol, chainName, cb) => {
  fromPrivateKey = Buffer.from(fromPrivateKey, 'hex');
  let frompublicKey = generatePublicKey(fromPrivateKey);
  let fromAddress = '0x' + generateAddress(frompublicKey).toString('hex');
  let rawTx = {
    nonce: getTransactionCount(fromAddress, chainName),
    gasPrice: '0x04a817c800',
    gasLimit: '0xf4240',
    to: toAddress,
    value: coinSymbol === 'eth' ? web3.toHex(value) : '0x',
    data: coinSymbol === 'eth' ? '0x' : tokens[coinSymbol].contract.transfer.getData(toAddress, value)
  };
  let tx = new Tx(rawTx);
  tx.sign(fromPrivateKey);
  let serializedTx = '0x' + tx.serialize().toString('hex');
  web3.eth.sendRawTransaction(serializedTx,
    (error, txHash) => {
      if (error) cb(error, null);
      else cb(null, txHash);
    });
};

let getEstimatedGasUnits = (fromAddress, toAddress, value, chainName, cb) => {
  web3.eth.estimateGas({
    from: fromAddress,
    to: toAddress,
    value: value
  }, (error, gasUnits) => {
    if (error) cb(error, null);
    else {
      gasUnits = web3.toDecimal(gasUnits);
      cb(null, gasUnits);
    }
  });
};

module.exports = {
  transfer: transfer,
  getEstimatedGasUnits: getEstimatedGasUnits
};
