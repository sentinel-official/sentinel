let async = require('async');
let sessionDbo = require('../dbos/session.dbo');
let ratingDbo = require('../dbos/rating.dbo');

/**
 * @api {POST} /ratings Add a new rating for a session
 * @apiName addRating
 * @apiGroup Rating
 * @apiParam {String} fromAccountAddress From account address.
 * @apiParam {String} sessionId VPN Session ID.
 * @apiParam {Number} rating Rating out of 5.
 * @apiParam {String} comments Comments.
 * @apiSuccess {Boolean} success Success key.
 * @apiSuccessExample Success-Response:
 *   HTTP/1.1 200 OK
 *   {
 *     success: true
 *   }
 */
let addRating = (req, res) => {
  let {
    fromAccountAddress,
    sessionId,
    rating,
    comments
  } = req.body;
  async.waterfall([
    (next) => {
      ratingDbo.getRating({ sessionId },
        (error, rating) => {
          if (error) next({
            status: 500,
            message: 'Error occurred while fetching rating.'
          }); else if (rating) next({
            status: 400,
            message: 'Rating already exists.'
          }); else next(null);
        });
    }, (next) => {
      sessionDbo.getSession({ sessionId },
        (error, session) => {
          if (error) next({
            status: 500,
            message: 'Error occurred while fetching session.'
          }); else if (session && session.clientAccountAddress === fromAccountAddress) {
            next(null, session.nodeAccountAddress);
          } else next({
            status: 400,
            message: 'Session doesn\'t exists.'
          });
        });
    }, (nodeAccountAddress, next) => {
      ratingDbo.addRating({
        fromAccountAddress, nodeAccountAddress,
        sessionId, rating, comments
      }, (error, result) => {
        if (error) next({
          status: 500,
          message: 'Error occurred while adding rating.'
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

module.exports = {
  addRating
};