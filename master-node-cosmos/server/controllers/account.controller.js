let async = require('async');
let accountDbo = require('../dbos/account.dbo');

/**
 * @api {POST} /accounts/:accountAddress/txhashes Add a new transaction hash
 * @apiName addTxHash
 * @apiGroup Account
 * @apiParam {String} accountAddress Account address.
 * @apiParam {String} txHash Transaction hash.
 * @apiSuccess {Boolean} success Success key.
 * @apiSuccess {Object[]} nodes List of nodes.
 * @apiSuccessExample Success-Response:
 *   HTTP/1.1 200 OK
 *   {
 *     success: true
 *   }
 */
let addTxHash = (req, res) => {
  let { accountAddress } = req.params;
  let { txHash } = req.body;
  async.waterfall([
    (next) => {
      accountDbo.addTxHash(accountAddress, txHash,
        (error, result) => {
          if (error) next({
            status: 500,
            message: 'Error occurred while adding tx hash.'
          });
          else next({
            status: 200
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
 * @api {GET} /accounts/:accountAddress/txhashes Get transaction hashes of an account address
 * @apiName getTxHashes
 * @apiGroup Account
 * @apiParam {String} accountAddress Account address.
 * @apiSuccess {Boolean} success Success key.
 * @apiSuccess {Object[]} txHashes List of transa.
 * @apiSuccessExample Success-Response:
 *   HTTP/1.1 200 OK
 *   {
 *     success: true
 *     txHashes: []
 *   }
 */
let getTxHashes = (req, res) => {
  let { accountAddress } = req.params;
  async.waterfall([
    (next) => {
      accountDbo.getTxhashes(accountAddress,
        (error, txHashes) => {
          if (error) next({
            status: 500,
            message: 'Error occurred while adding tx hash.'
          });
          else next({
            status: 200,
            txHashes
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
 * @apiGroup Account
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
  let { accountAddress } = req.params;
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
  addTxHash,
  getTxHashes,
  getSessions
};