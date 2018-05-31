let { waterfall } = require('async');
let mixerDbo = require('../dbos/mixer.dbo');
let mixerHelper = require('../helpers/mixer.helper');


let insertMixDetails = (req, res) => {
  let mixDetails = Object.assign(req.body, {
    insertedOn: Math.round(Date.now() / Math.pow(10, 3)),
    lastUpdateOn: Math.round(Date.now() / Math.pow(10, 3)),
    tries: 0,
    transactionStatuses: [],
    message: 'Mix details have been added successfully.'
  });
  waterfall([
    (next) => {
      mixerHelper.generateMixHash(mixDetails,
        (error, mixHash) => {
          if (error) next({
            status: 500,
            message: 'Error occurred while generating mix hash.'
          }, null);
          else {
            mixDetails = Object.assign(mixDetails, {
              mixHash: mixHash
            });
            next(null);
          }
        });
    }, (next) => {
      mixerDbo.insertMixDetails(mixDetails,
        (error, result) => {
          if (error) next({
            status: 500,
            message: 'Error occurred while adding mix details.'
          }, null);
          else next(null, {
            status: 200,
            message: 'Mix details have been added successfully.'
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
  insertMixDetails: insertMixDetails
};