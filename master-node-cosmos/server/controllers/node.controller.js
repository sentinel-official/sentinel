let async = require('async');
let nodeDbo = require('../dbos/node.dbo');
let nodeHelper = require('../helpers/node.helper');


let addNode = (req, res) => {
  let { hash } = req.body;
  async.waterfall([
    (next) => {
      nodeDbo.getNode({ txHash: hash },
        (error, node) => {
          if (error) next({
            status: 500,
            message: 'Error occurred while checking node details.'
          });
          else if (node) next({
            status: 400,
            message: 'Node already exists.'
          });
          else next(null);
        });
    }, (next) => {
      nodeHelper.getNodeDetails(hash,
        (error, details) => {
          if (error) next({
            status: 500,
            message: 'Error occurred while fetching node details.'
          });
          else {
            details.txHash = hash;
            details.token = nodeHelper.generateToken();
            next(null, details);
          }
        });
    }, (details, next) => {
      nodeDbo.addNode(details,
        (error, result) => {
          if (error) next({
            status: 500,
            message: 'Error occurred while adding node details.'
          });
          else next(null, Object.assign({
            status: 200,
            message: 'Node details added successfully.'
          }, details));
        });
    }
  ], (error, success) => {
    let response = Object.assign({
      success: !error
    }, error || success);
    let status = response.status;
    delete (response.status);
    res.status(status).send(response);
  });
};

let updateNode = (req, res) => {
  let {
    accountAddress,
    token,
    type,
    details
  } = req.body;
  if (!details) details = {};
  details['info.pingOn'] = new Date();
  if (type === 'alive') details['info.status'] = 'up';
  else if (type === 'details') details['info.startOn'] = new Date();
  async.waterfall([
    (next) => {
      nodeDbo.getNode({ accountAddress, token },
        (error, node) => {
          if (error) next({
            status: 500,
            message: 'Error occurred while checking node details.'
          });
          else if (node) next(null);
          else next({
            status: 400,
            message: 'Node doesn\'t exists.'
          });
        });
    }, (next) => {
      nodeDbo.updateNode({ accountAddress }, details,
        (error, result) => {
          if (error) next({
            status: 500,
            message: 'Error occurred while updating node details.'
          });
          else next(null, {
            status: 200,
            message: 'Updated node details successfully.'
          });
        });
    }
  ], (error, success) => {
    let response = Object.assign({
      success: !error
    }, error || success);
    let status = response.status;
    delete (response.status);
    res.status(status).send(response);
  });
};

/**
 * @api {GET} /nodes Get Information of nodes
 * @apiName getNodes
 * @apiGroup Node
 * @apiParam {String} type Node type [OpenVPN, Socks5].
 * @apiParam {String} status Node status [up, down].
 * @apiSuccess {Boolean} success Success key.
 * @apiSuccess {Object[]} nodes List of nodes.
 * @apiSuccessExample Success-Response:
 *   HTTP/1.1 200 OK
 *   {
 *     success: true,
 *     nodes: [
 *       
 *     ]
 *   }
 */
let getNodes = (req, res) => {
  let {
    type,
    status
  } = req.query;
  let findObj = {
    '$and': [{
      '$or': type === 'any' ? [{ 'nodeType': 'OpenVPN' }, { 'nodeType': 'Socks5' }] : [{ 'nodeType': type }]
    }, {
      '$or': status === 'any' ? [{ 'info.status': 'up' }, { 'info.status': 'down' }] : [{ 'info.status': status }]
    }]
  };

  async.waterfall([
    (next) => {
      nodeDbo.getNodes(findObj,
        (error, nodes) => {
          if (error) next({
            status: 500,
            message: 'Error occurred while fetching nodes.'
          });
          else next(null, {
            status: 200,
            nodes
          });
        });
    }
  ], (error, success) => {
    let response = Object.assign({
      success: !error
    }, error || success);
    let status = response.status;
    delete (response.status);
    res.status(status).send(response);
  });
};

module.exports = {
  addNode,
  getNodes,
  updateNode
};