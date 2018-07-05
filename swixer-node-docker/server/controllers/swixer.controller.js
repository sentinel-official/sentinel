let async = require('async');
let swixerDbo = require('../dbos/swixer.dbo');


let getStatus = (req, res) => {
  let swixHash = req.query.swixHash;
  async.waterfall([
    (next) => {
    swixerDbo.getSwix(swixHash, (error, result) => {
      if(error) next({
        status: 500,
        message: 'Error occurred while getting swix.'
      }, null);
      else if(result) {
        if(result.message === 'Scheduled successfully.') next(null, {
          status: 200,
          swixStatus: 1,
          txInfos: result.txInfos,
          remainingAmount: result.remainingAmount || null
        });
        else next(null, {
          status: 200,
          swixStatus: 0,
          txInfos: [],
          remainingAmount: result.remainingAmount || null
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
    delete (response.status);
    res.status(status).send(response);
  });
};

module.exports = {
  getStatus
};
