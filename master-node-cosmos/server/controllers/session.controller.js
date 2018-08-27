let async = require('async');
let nodeDbo = require('../dbos/node.dbo');
let sessionHelper = require('../helpers/session.helper');


/**
 * @api {GET} /session Get info of a new session
 * @apiName getSession
 * @apiGroup Session
 * @apiParam {String} hash Transaction hash of the initial session payment.
 * @apiSuccess {Boolean} success Success key.
 * @apiSuccess {String} url URL of the node endpoint.
 * @apiSuccess {String} sessionId Unique session ID.
 * @apiSuccess {String} token Token for communication with node.
 * @apiSuccessExample Success-Response:
 *   HTTP/1.1 200 OK
 *   {
 *     success: true,
 *     url: 
 *     sessionId: 
 *     token: 
 *   }
 */
let getSession = (req, res) => {
  let { hash } = req.query;
  async.waterfall([
    (next) => {
      sessionHelper.getPaymentDetails(hash,
        (error, details) => {
          if (error) next({
            status: 500,
            message: 'Error occurred while fetching payment details.'
          });
          else next(null, details);
        });
    }, (payment, next) => {
      nodeDbo.getNode({
        accountAddress: payment.to,
        info: { status: 'up' }
      }, (error, node) => {
        if (error) next({
          status: 500,
          message: 'Error occurred while fetching node details.'
        });
        else if (node) next(null, payment, node);
        else next({
          status: 400,
          message: 'Node doesn\'t exists or node is down.'
        });
      });
    }, (payment, node, next) => {
      let token = sessionHelper.generateToken();
      sessionHelper.sendUserDetails(node.apiUrl + '/session', {
        accountAddress: payment.from,
        sessionId: payment.sessionId,
        token
      }, (error) => {
        if (error) next({
          status: 500,
          message: 'Error occurred while sending the session details to the node.'
        });
        else next(null, {
          status: 200,
          url: `http://${node.IP}:3000/session/credentials`,
          sessionId: payment.sessionId,
          token
        });
      });
    },
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
  getSession
};
