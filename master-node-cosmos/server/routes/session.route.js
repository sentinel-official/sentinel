let sessionContoller = require('../controllers/session.controller');
let sessionValidation = require('../validations/session.validation');


module.exports = (server) => {
  server.post('/sessions/:txHash', sessionValidation.getSession, sessionContoller.getSession);
};