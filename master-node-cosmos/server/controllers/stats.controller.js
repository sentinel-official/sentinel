let async = require('async');
let statsHelper = require('../helpers/stats.helper');


/**
 * @api {GET} /stats/nodes?average=&timeline=&startSeconds=&endSeconds= Get stats of nodes
 * @apiName getNodesStats
 * @apiGroup Stats
 * @apiParam {Boolean} average Average stats of nodes.
 * @apiParam {Boolean} timeline Timeline of nodes.
 * @apiParam {Number} startSeconds UNIX epoch seconds of start date.
 * @apiParam {Number} endSeconds UNIX epoch seconds of end date.
 */
let getNodesStats = (req, res) => {
  let {
    average,
    timeline,
    startSeconds,
    endSeconds
  } = req.query;
  let startDate = startSeconds ? new Date(startSeconds) : new Date(0);
  let endDate = endSeconds ? new Date(endSeconds) : new Date(Date.now());

  async.waterfall([
    (next) => {
      if (average) {
        statsHelper.getAverageActiveNodesCount(startDate, endDate,
          (error, result) => {
            if (error) next({
              status: 500,
              message: 'Error occurred while fetching data.'
            }); else next(null, {
              status: 200,
              result
            });
          });
      } else if (timeline) {
        statsHelper.getNodesTimeline(startDate, endDate,
          (error, result) => {
            if (error) next({
              status: 500,
              message: 'Error occurred while fetching data.'
            }); else next(null, {
              status: 200,
              result
            });
          });
      } else {
        statsHelper.getActiveNodesCount(
          (error, result) => {
            if (error) next({
              status: 500,
              message: 'Error occurred while fetching data.'
            }); else next(null, {
              status: 200,
              result
            });
          });
      }
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
 * @api {GET} /stats/sessions?average=&timeline=&startSeconds=&endSeconds= Get stats of sessions
 * @apiName getSessionsStats
 * @apiGroup Stats
 * @apiParam {Boolean} average Average stats of sessions.
 * @apiParam {Boolean} timeline Timeline of sessions.
 * @apiParam {Number} startSeconds UNIX epoch seconds of start date.
 * @apiParam {Number} endSeconds UNIX epoch seconds of end date.
 */
let getSessionsStats = (req, res) => {
  let {
    average,
    timeline,
    startSeconds,
    endSeconds
  } = req.query;
  let startDate = startSeconds ? new Date(startSeconds) : new Date(0);
  let endDate = endSeconds ? new Date(endSeconds) : new Date(Date.now());

  async.waterfall([
    (next) => {
      if (average) {
        statsHelper.getAverageSessionsCount(startDate, endDate,
          (error, result) => {
            if (error) next({
              status: 500,
              message: 'Error occurred while fetching data.'
            }); else next(null, {
              status: 200,
              result
            });
          });
      } else if (timeline) {
        statsHelper.getSessionsTimeline(startDate, endDate,
          (error, result) => {
            if (error) next({
              status: 500,
              message: 'Error occurred while fetching data.'
            }); else next(null, {
              status: 200,
              result
            });
          });
      } else {
        statsHelper.getActiveSessionsCount(
          (error, result) => {
            if (error) next({
              status: 500,
              message: 'Error occurred while fetching data.'
            }); else next(null, {
              status: 200,
              result
            });
          });
      }
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
 * @api {GET} /stats/data-consumed?timeline=&startSeconds=&endSeconds= Get stats of data consumed
 * @apiName getDataConsumedStats
 * @apiGroup Stats
 * @apiParam {Boolean} timeline Timeline of data consumed.
 * @apiParam {Number} startSeconds UNIX epoch seconds of start date.
 * @apiParam {Number} endSeconds UNIX epoch seconds of end date.
 */
let getDataConsumedStats = (req, res) => {
  let {
    timeline,
    startSeconds,
    endSeconds
  } = req.query;
  let startDate = startSeconds ? new Date(startSeconds) : new Date(0);
  let endDate = endSeconds ? new Date(endSeconds) : new Date(Date.now());

  async.waterfall([
    (next) => {
      if (timeline) {
        statsHelper.getDataConsumedTimeline(startDate, endDate,
          (error, result) => {
            if (error) next({
              status: 500,
              message: 'Error occurred while fetching data.'
            }); else next(null, {
              status: 200,
              result
            });
          });
      } else {
        statsHelper.getDataConsumed(startDate, endDate,
          (error, result) => {
            if (error) next({
              status: 500,
              message: 'Error occurred while fetching data.'
            }); else next(null, {
              status: 200,
              result
            });
          });
      }
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
 * @api {GET} /stats/average-duration?timeline=&startSeconds=&endSeconds= Get stats of average duration
 * @apiName getAverageDurationStats
 * @apiGroup Stats
 * @apiParam {Boolean} timeline Timeline of average duration.
 * @apiParam {Number} startSeconds UNIX epoch seconds of start date.
 * @apiParam {Number} endSeconds UNIX epoch seconds of end date.
 */
let getAverageDurationStats = (req, res) => {
  let {
    timeline,
    startSeconds,
    endSeconds
  } = req.query;
  let startDate = startSeconds ? new Date(startSeconds) : new Date(0);
  let endDate = endSeconds ? new Date(endSeconds) : new Date(Date.now());

  async.waterfall([
    (next) => {
      if (timeline) {
        statsHelper.getAverageDurationTimeline(startDate, endDate,
          (error, result) => {
            if (error) next({
              status: 500,
              message: 'Error occurred while fetching data.'
            }); else next(null, {
              status: 200,
              result
            });
          });
      } else {
        statsHelper.getAverageDuration(startDate, endDate,
          (error, result) => {
            if (error) next({
              status: 500,
              message: 'Error occurred while fetching data.'
            }); else next(null, {
              status: 200,
              result
            });
          });
      }
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
  getNodesStats,
  getSessionsStats,
  getDataConsumedStats,
  getAverageDurationStats,
};