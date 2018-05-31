var { createHash } = require('crypto');


let generateMixHash = (mixDetails, cb) => {
  try {
    mixDetails = JSON.stringify({
      coinSymbol: mixDetails.coinSymbol,
      delayInSeconds: mixDetails.delayInSeconds,
      destinationAddress: mixDetails.destinationAddress,
      toAddress: mixDetails.toAddress
    });
    let hash = createHash('md5').update(mixDetails).digest('hex');
    cb(null, hash);
  } catch (error) {
    cb(error, null);
  }
};

module.exports = {
  generateMixHash: generateMixHash
};