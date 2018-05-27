let accountContoller = require('../controllers/account.controller');


module.exports = (server) => {
  server.post('/account', accountContoller.createAccount);

  server.get('/balance', accountContoller.getTotalBalance);
};
