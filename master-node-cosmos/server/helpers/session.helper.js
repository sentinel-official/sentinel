let axios = require('axios');
let cosmos = require('../../cosmos');


let generateToken = () => {
  let ALPHA_NUM = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcdefghijklmnopqrstuvwxyz";
  let token = '';
  for (let i = 0; i < 24; ++i)
    token += ALPHA_NUM.charAt(Math.floor(Math.random() * ALPHA_NUM.length));
  return token;
};

let getPaymentDetails = (hash, cb) => {
  cosmos.call('verifyHash', {
    hash
  }, (error, result) => {
    if (error) cb(error);
    else {
      let data = Buffer.from(result.result.data, 'base64');
      let sessionId = Buffer.from(result.result.tags[1].value, 'base64');
      data = JSON.parse(data.toString()).value;
      sessionId = sessionId.toString();
      result = {
        from: data.From,
        to: data.Vpnaddr,
        sessionId
      };
      cb(null, result);
    }
  });
};

let sendUserDetails = (url, details, cb) => {
  axios.post(url, details)
    .then((response) => {
      if (response.status === 200) {
        let { data } = response;
        if (data.success) cb(null);
        else cb({
          code: 2,
          message: 'Response data success is false.'
        });
      } else cb({
        code: 1,
        message: 'Response status code is not 200.'
      });
    })
    .catch((error) => {
      cb(error.response);
    });
};

module.exports = {
  generateToken,
  getPaymentDetails,
  sendUserDetails
};