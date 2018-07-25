let accountContoller = require('../controllers/account.controller');
let accountValidation = require('../validations/account.validation');
let {
  checkBalance
} = require('../../swixer/checkBalance')


module.exports = (server) => {
  server.post('/account', accountValidation.createAccount, accountContoller.createAccount);

  server.get('/balances', accountContoller.getBalances);
  server.get('/ethBalance', accountContoller.getETHBalances)
};