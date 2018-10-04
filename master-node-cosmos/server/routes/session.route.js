let sessionContoller = require('../controllers/session.controller');
let sessionValidation = require('../validations/session.validation');


module.exports = (server) => {
  server.post('/sessions', sessionValidation.addSession, sessionContoller.addSession);

  server.get('/accounts/:accountAddress/sessions', sessionValidation.getSessions, sessionContoller.getSessions);
};