let sessionContoller = require('../controllers/session.controller');
let sessionValidation = require('../validations/session.validation');


module.exports = (server) => {
  server.get('/session', sessionValidation.getSession, sessionContoller.getSession);

  server.put('/sessions', sessionValidation.updateSessions, sessionContoller.updateSessions);

  server.get('/sessions', sessionValidation.getSessions, sessionContoller.getSessions);
};