let axios = require('axios');
let gateways = require('../../config/btc/gateways');


let getAccount = (coinSymbol, cb) => {
  let url = `${gateways[coinSymbol].server}/address`;
  axios.get(url)
    .then((response) => {
      if (response.status === 200 &&
        response.data.success === true) {
        let account = {
          address: response.data.address,
          privateKey: response.data.address
        };
        cb(null, account);
      } else cb({
        message: 'Unsuccessful request.'
      }, null);
    })
    .catch((error) => {
      cb(error, null);
    });
};

let getBalance = (address, coinSymbol, cb) => {
  let url = `${gateways[coinSymbol].server}/balance?address=${address}`;
  axios.get(url)
    .then((response) => {
      if (response.status === 200 &&
        response.data.success === true) {
        let balance = response.data.balance;
        cb(null, balance);
      } else cb({
        message: 'Unsuccessful request.'
      }, null);
    })
    .catch((error) => {
      cb(error, null);
    });
};

module.exports = {
  getAccount,
  getBalance
};