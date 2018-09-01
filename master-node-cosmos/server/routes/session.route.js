let sessionContoller = require('../controllers/session.controller');
let sessionValidation = require('../validations/session.validation');


module.exports = (server) => {
  server.get('/session', sessionValidation.getSession, sessionContoller.getSession);
};