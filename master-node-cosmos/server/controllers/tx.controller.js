let async = require('async');
let txDbo = require('../dbos/tx.dbo');

/**
 * @api {POST} /txes Add a new transaction details
 * @apiName addTx
 * @apiGroup Tx
 * @apiParam {String} fromAccountAddress From account address.
 * @apiParam {String} toAccountAddress To account address.
 * @apiParam {String} txHash Transaction hash.
 * @apiSuccess {Boolean} success Success key.
 * @apiSuccessExample Success-Response:
 *   HTTP/1.1 200 OK
 *   {
 *     success: true
 *   }
 */
let addTx = (req, res) => {
  let {
    fromAccountAddress,
    toAccountAddress,
    txHash
  } = req.body;
  async.waterfall([
    (next) => {
      txDbo.getTx({ txHash },
        (error, tx) => {
          if (error) next({
            status: 500,
            message: 'Error occurred while fetching the tx.'
          }); else if (tx) next({
            status: 400,
            message: 'Tx already exists.'
          }); else next(null);
        });
    }, (next) => {
      txDbo.addTx({ fromAccountAddress, toAccountAddress, txHash },
        (error, result) => {
          if (error) next({
            status: 500,
            message: 'Error occurred while adding tx.'
          });
          else next(null, {
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
 * @api {GET} /txes?fromAccountAddress=&toAccountAddress= Get txes based on from and to addresses
 * @apiName getTxHashes
 * @apiGroup Account
 * @apiParam {String} accountAddress Account address.
 * @apiSuccess {Boolean} success Success key.
 * @apiSuccess {Object[]} txes List of transactions.
 * @apiSuccessExample Success-Response:
 *   HTTP/1.1 200 OK
 *   {
 *     success: true
 *     txes: []
 *   }
 */
let getTxes = (req, res) => {
  let {
    fromAccountAddress,
    toAccountAddress
  } = req.query;
  let findObj = {};
  async.waterfall([
    (next) => {
      if (fromAccountAddress && toAccountAddress) {
        findObj = fromAccountAddress === toAccountAddress ? {
          $or: [{
            fromAccountAddress
          }, {
            toAccountAddress
          }]
        } : {
            fromAccountAddress,
            toAccountAddress
          };
        next(null);
      } else if (fromAccountAddress) {
        findObj = {
          fromAccountAddress
        };
        next(null);
      } else if (toAccountAddress) {
        findObj = {
          toAccountAddress
        };
        next(null);
      } else next({
        status: 400,
        message: 'Need from or to account address.'
      });
    }, (next) => {
      txDbo.getTxes(findObj,
        (error, txes) => {
          if (error) next({
            status: 500,
            message: 'Error occurred while adding tx hash.'
          });
          else next({
            status: 200,
            txes
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
  addTx,
  getTxes
};
