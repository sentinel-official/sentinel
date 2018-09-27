let sessionContoller = require('../controllers/session.controller');
let sessionValidation = require('../validations/session.validation');


module.exports = (server) => {
  server.get('/sessions/:txHash', sessionValidation.getSession, sessionContoller.getSession);
};