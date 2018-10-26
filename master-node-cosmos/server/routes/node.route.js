let nodeContoller = require('../controllers/node.controller');
let nodeValidation = require('../validations/node.validation');


module.exports = (server) => {
  server.post('/nodes', nodeValidation.addNode, nodeContoller.addNode);

  server.get('/nodes', nodeValidation.getNodes, nodeContoller.getNodes);

  server.put('/nodes/:accountAddress', nodeValidation.updateNode, nodeContoller.updateNode);

  server.put('/nodes/:accountAddress/sessions', nodeValidation.updateNodeSessions, nodeContoller.updateNodeSessions);

  server.put('/nodes/:accountAddress/sessions/:sessionId', nodeValidation.updateNodeSession, nodeContoller.updateNodeSession);
};