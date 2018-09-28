let async = require('async');
let lodash = require('lodash');
let nodeDbo = require('../dbos/node.dbo');
let sessionDbo = require('../dbos/session.dbo');
let sessionHelper = require('../helpers/session.helper');


/**
 * @api {POST} /sessions Get info of a new session
 * @apiName addSession
 * @apiGroup Session
 * @apiParam {String} txHash Session payment transaction hash.
 * @apiSuccess {Boolean} success Success key.
 * @apiSuccess {String} url URL of the node endpoint.
 * @apiSuccess {String} sessionId Unique session ID.
 * @apiSuccess {String} token Token for communication with node.
 * @apiSuccessExample Success-Response:
 *   HTTP/1.1 200 OK
 *   {
 *     success: true,
 *     url: ''
 *     sessionId: ''
 *     token: ''
 *   }
 */
let addSession = (req, res) => {
  let { txHash } = req.body;
  async.waterfall([
    (next) => {
      sessionHelper.getPaymentDetails(txHash,
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
        'info.status': 'up'
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
      let url = `http://${node.IP}:3000`;
      sessionHelper.sendUserDetails(`${url}/clients/${payment.from}/sessions/${payment.sessionId}`, {
        token
      }, (error) => {
        if (error) next({
          status: 500,
          message: 'Error occurred while sending the session details to the node.'
        });
        else
          next(null, url, {
            sessionId: payment.sessionId,
            clientAccountAddress: payment.from,
            nodeAccountAddress: payment.to,
            token,
          });
      });
    }, (url, session, next) => {
      sessionDbo.addSession(session,
        (error, result) => {
          if (error) next({
            status: 500,
            message: 'Error occurred while saving the session details.'
          });
          else next(null, {
            status: 200,
            sessionId: session.sessionId,
            token: session.token,
            url
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
 * @api {GET} /accounts/:accountAddress/sessions Get VPN sessions of an account address
 * @apiName getSessions
 * @apiGroup Session
 * @apiParam {String} accountAddress Account address.
 * @apiSuccess {Boolean} success Success key.
 * @apiSuccess {Object[]} sessions List of VPN sessions.
 * @apiSuccessExample Success-Response:
 *   HTTP/1.1 200 OK
 *   {
 *     success: true
 *     sessions: []
 *   }
 */
let getSessions = (req, res) => {
  let { accountAddress } = req.query;
  async.waterfall([
    (next) => {
      sessionDbo.getSessions({
        clientAccountAddress: accountAddress
      }, (error, sessions) => {
        if (error) next({
          status: 500,
          message: 'Error occurred while fetching sessions.'
        });
        else next({
          status: 200,
          sessions
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
  addSession,
  getSessions
};