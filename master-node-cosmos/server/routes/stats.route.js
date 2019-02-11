let statsContoller = require('../controllers/stats.controller');
let statsValidation = require('../validations/stats.validation');


module.exports = (server) => {
  server.get('/stats/nodes', statsValidation.getNodesStats, statsContoller.getNodesStats);
  server.get('/stats/sessions', statsValidation.getSessionsStats, statsContoller.getSessionsStats);
  server.get('/stats/data-consumed', statsValidation.getDataConsumedStats, statsContoller.getDataConsumedStats);
  server.get('/stats/average-duration', statsValidation.getAverageDurationStats, statsContoller.getAverageDurationStats);
};