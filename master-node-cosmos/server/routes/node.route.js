let nodeContoller = require('../controllers/node.controller');
let nodeValidation = require('../validations/node.validation');


module.exports = (server) => {
  server.post('/node', nodeValidation.addNode, nodeContoller.addNode);

  server.put('/node', nodeValidation.updateNode, nodeContoller.updateNode);

  server.get('/nodes', nodeValidation.getNodes, nodeContoller.getNodes);
};
