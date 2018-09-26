let accountContoller = require('../controllers/account.controller');
let accountValidation = require('../validations/account.validation');


module.exports = (server) => {
  server.post('/account/txhashes', accountValidation.addAccountTxHash, accountContoller.addAccountTxHash);

  server.get('/account/txhashes', accountValidation.getAccountTxHashes, accountContoller.getAccountTxHashes);
};