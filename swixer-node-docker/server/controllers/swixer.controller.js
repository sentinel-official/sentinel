let async = require('async');
let swixerDbo = require('../dbos/swixer.dbo');


let getStatus = (req, res) => {
  let swixHash = req.query.swixHash;
  async.waterfall([
    (next) => {
      swixerDbo.getSwix(swixHash, (error, result) => {
        if (error) next({
          status: 500,
          message: 'Error occurred while getting swix.'
        }, null);
        else if (result) {
          if (result.message === 'Scheduled successfully.' || result.message === 'Swix is complete.' || result.message === 'Swix is in progress.') next(null, {
            status: 200,
            swixStatus: 1,
            fromToken: result.fromSymbol,
            toToken: result.toSymbol,
            destAddr: result.destinationAddress,
            txInfos: result.txInfos,
            remainingAmount: 'remainingAmount' in result ? result.remainingAmount : null
          });
          else next(null, {
            status: 200,
            swixStatus: 0,
            txInfos: [],
            fromToken: result.fromSymbol,
            toToken: result.toSymbol,
            destAddr: result.destinationAddress,
            remainingAmount: 'remainingAmount' in result ? result.remainingAmount : null
          });
        } else next({
          status: 400,
          message: 'No swix found.'
        }, null);
      });
    }
  ], (error, success) => {
    let response = Object.assign({
      success: !error
    }, error || success);
    let status = response.status;
    delete(response.status);
    res.status(status).send(response);
  });
};

module.exports = {
  getStatus
};