let async = require('async');
let nodeDbo = require('../dbos/node.dbo');
let sessionDbo = require('../dbos/session.dbo');
let sessionHelper = require('../helpers/session.helper');
let { GB } = require('../../config/vars');


/**
 * @api {POST} /sessions Get info of a new session
 * @apiName addSession
 * @apiGroup Session
 * @apiParam {String} txHash Session payment transaction hash.
 * @apiSuccess {Boolean} success Success key.
 * @apiSuccess {String} url URL of the node endpoint.
 * @apiSuccess {String} sessionId Unique session ID.
 * @apiSuccess {String} token Token for communication with node.
 * @apiSuccess {Object} maxUsage Max usage limit.
 * @apiSuccess {Number} maxUsage.download Max download limit.
 * @apiSuccess {Number} maxUsage.upload Max upload limit.
 * @apiSuccessExample Success-Response:
 *   HTTP/1.1 200 OK
 *   {
 *     success: true,
 *     url: ''
 *     sessionId: ''
 *     token: '',
 *     maxUsage: {
 *       download: 0,
 *       upload: 0
 *     }
 *   }
 */
let addSession = (req, res) => {
  let {
    txHash
  } = req.body;
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
        'accountAddress': payment.to,
        'status': 'up'
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
      let url = `http://${node.IP}:${node.APIPort}`;
      let maxUsage = {
        download: GB,
        upload: GB
      };
      if (payment.lockedAmount) {
        maxUsage.download = Math.round(GB * (payment.lockedAmount / node.pricePerGB));
        maxUsage.upload = Math.round(GB * (payment.lockedAmount / node.pricePerGB));
      }
      sessionHelper.sendUserDetails(`${url}/clients/${payment.from}/sessions/${payment.sessionId}`, {
        token,
        maxUsage
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
            maxUsage
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
            maxUsage: session.maxUsage,
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
  let {
    accountAddress
  } = req.params;
  async.waterfall([
    (next) => {
      sessionDbo.getSessions({
        'clientAccountAddress': accountAddress
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