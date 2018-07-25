let accountContoller = require('../controllers/account.controller');
let accountValidation = require('../validations/account.validation');


module.exports = (server) => {
  server.post('/account', accountValidation.createAccount, accountContoller.createAccount);

  server.get('/balances', accountContoller.getBalances);
  server.get('/ethBalance', accountContoller.getETHBalances)
};