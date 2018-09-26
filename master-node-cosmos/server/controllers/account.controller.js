let async = require('async');
let accountDbo = require('../dbos/account.dbo');


let addAccountTxHash = (req, res) => {
  let {
    accountAddress,
    txHash
  } = req.body;
  async.waterfall([
    (next) => {
      accountDbo.addAccountTxHash(accountAddress, txHash,
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

let getAccountTxHashes = (req, res) => {
  let { accountAddress } = req.query;
  async.waterfall([
    (next) => {
      accountDbo.getAccountTxhashes(accountAddress,
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

module.exports = {
  addAccountTxHash,
  getAccountTxHashes
};