let axios = require('axios');
let MASTER = 'http://185.181.8.90:8333';


let getExchangeRate = (amount, fromSymbol, toSymbol, cb) => {
  let url = `${MASTER}/swix/rate?node=0x47bd80a152d0d77664d65de5789df575c9cabbdb&from=${fromSymbol}&to=${toSymbol}&value=${amount}`
  console.log(url);
  axios.get(url)
    .then((response) => {
      console.log(response.data);
      if (response.status === 200 &&
        response.data.success === true) {
        let amount = response.data.value;
        cb(null, amount);
      } else cb({
        message: 'Unsuccessful request.'
      }, null);
    })
    .catch((error) => {
      console.log(error);
      cb(error, null);
    });
};

module.exports = {
  getExchangeRate
};