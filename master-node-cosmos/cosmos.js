let axios = require('axios');
let {
  chainUrl,
  localUrl
} = require('./config/cosmos');


let routes = {
  'deleteMasterNode': {
    url: chainUrl + '/master',
    method: 'DELETE',
  },
  'deleteVpnNode': {
    url: chainUrl + '/vpn',
    method: 'DELETE',
  },
  'payVpn': {
    url: chainUrl + '/vpn/pay',
    method: 'POST',
  },
  'refund': {
    url: chainUrl + '/refund',
    method: 'POST',
  },
  'getKeys': {
    url: chainUrl + '/keys',
    method: 'POST',
  },
  'getVpnPayment': {
    url: chainUrl + '/vpn/getpayment',
    method: 'POST',
  },
  'generateSeed': {
    url: chainUrl + '/keys/seed',
    method: 'GET',
  },
  'registerMasterNode': {
    url: chainUrl + '/register/master',
    method: 'POST',
  },
  'registerVpnNode': {
    url: chainUrl + '/register/vpn',
    method: 'POST',
  },
  'verifyHash': {
    url: localUrl + '/txs',
    method: 'GET'
  },
  'getBalance': {
    url: localUrl + '/accounts',
    method: 'GET'
  }
};

let call = (name, data, cb) => {
  let {url, method} = routes[name];

  switch (name) {
    case 'verifyHash':
      url += `/${data.hash}`;
      break;
    case 'getBalance':
      url += `/${data.address}`;
      break;
    default:
      break;
  }

  console.log(url, method, data, name);
  axios({
    method,
    url,
    data
  })
    .then((response) => {
      console.log(response.status, response.data, name);
      if (response.status === 200) {
        let {data} = response;
        switch (name) {
          case 'generateSeed':
            cb(null, {
              success: true,
              seed: data
            });
            break;
          case 'getKeys':
          case 'getBalance':
          case 'verifyHash':
            cb(null, Object.assign({
              success: true
            }, data));
            break;
          default:
            if (data.success) cb(null, data);
            else cb({
              code: 2,
              message: 'Response data success is false.'
            });
            break;
        }
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
  call
};