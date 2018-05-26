let mixerContoller = require('../controllers/mixer.controller');
let mixerValidation = require('../validations/mixer.validation');


module.exports = (server) => {
  server.post('/mix', mixerValidation.insertMixDetails, mixerContoller.insertMixDetails);
};
