let axios = require('axios');
let gateways = require('../../config/btc/gateways');


let transfer = (toAddress, value, coinSymbol, cb) => {
  let url = `${gateways[coinSymbol].server}/transfer`;
  axios.post(url, {
    toAddress,
    value
  }).then((response) => {
    if (response.status === 200 &&
      response.data.success === true) {
      let txHash = response.data.txHash;
      cb(error, txHash);
    }
    else cb({
      message: 'Unsuccessful request.'
    }, null);
  })
    .catch((error) => {
      cb(error, null);
    });
};

module.exports = {
  transfer
};