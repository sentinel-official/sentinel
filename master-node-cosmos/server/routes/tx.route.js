let txContoller = require('../controllers/tx.controller');
let txValidation = require('../validations/tx.validation');


module.exports = (server) => {
  server.post('/txes', txValidation.addTx, txContoller.addTx);

  server.get('/txes', txValidation.getTxes, txContoller.getTxes);
};