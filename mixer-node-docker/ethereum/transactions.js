let chains = require('./chains');
let { getTransactionCount } = require('./accounts');
let { generatePublicKey, generateAddress } = require('./keys');


let getGasPrice = (chainName) => {
  let price = chains[chainName].web3.eth.gasPrice;
  price = chains[chainName].web3.toHex(price);
  return price;
};

let transferEthers = (fromPrivateKey, toAddress, value, chainName, cb) => {
  let frompublicKey = generatePublicKey(fromPrivateKey);
  let fromAddress = generateAddress(frompublicKey);
  let rawTx = {
    nonce: getTransactionCount(fromAddress, chainName),
    gasPrice: getGasPrice(chainName),
    gasLimit: chains[chainName].web3.toHex(1000000),
    to: toAddress,
    value: chains[chainName].web3.toHex(value),
    data: '0x0'
  };

  let tx = new Tx(rawTx);
  tx.sign(fromPrivateKey);
  let serializedTx = '0x' + tx.serialize().toString('hex');
  chains[chainName].web3.eth.sendRawTransaction(serializedTx, (err, txHash) => {
    if (error) cb(error, null);
    else cb(null, txHash);
  });
};

let getEstimatedGasUnits = (fromAddress, toAddress, value, chainName, cb) {
  chains[chainName].web3.eth.estimateGas({
    from: fromAddress,
    to: toAddress,
    value: value
  }, (error, gasUnits) => {
    if(error) cb(error, null);
    else {
      gasUnits = Number(gasUnits);
      cb(null, gasUnits);
    }
  });
};

