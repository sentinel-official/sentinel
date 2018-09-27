let accountContoller = require('../controllers/account.controller');
let accountValidation = require('../validations/account.validation');


module.exports = (server) => {
  server.post('/accounts/:accountAddress/txhashes', accountValidation.addTxHash, accountContoller.addTxHash);

  server.get('/accounts/:accountAddress/txhashes', accountValidation.getTxHashes, accountContoller.getTxHashes);

  server.get('/accounts/:accountAddress/sessions', accountValidation.getSessions, accountContoller.getSessions);
};