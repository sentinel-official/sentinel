let async = require('async');
let accountDbo = require('../dbos/account.dbo');

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

let getTxHashes = (req, res) => {
  let { accountAddress } = req.params;
  async.waterfall([
    (next) => {
      accountDbo.getTxhashes(accountAddress,
        (error, result) => {
          if (error) next({
            status: 500,
            message: 'Error occurred while adding tx hash.'
          });
          else next({
            status: 200,
            txHashes: result
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

let getSessions = (req, res) => {
  let { accountAddress } = req.params;
  async.waterfall([
    (next) => {
      sessionDbo.getSessions({
        clientAccountAddress: accountAddress
      }, (error, result) => {
        if (error) next({
          status: 500,
          message: 'Error occurred while fetching sessions.'
        });
        else next({
          status: 200,
          sessions: result
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