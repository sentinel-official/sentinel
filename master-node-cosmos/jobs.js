let async = require('async');
let nodeDbo = require('./server/dbos/node.dbo');
let statsDbo = require('./server/dbos/stats.dbo');
let sessionDbo = require('./server/dbos/session.dbo');

let MAX_SECS = 2 * 60 * 1000;

let endSessions = (nodes, cb) => {
  async.each(nodes,
    (node, next) => {
      sessionDbo.updateSessions({
        'nodeAccountAddress': node.accountAddress,
        '$or': [{
          'endedOn': null
        }, {
          'endedOn': {
            $exists: false
          }
        }]
      }, {
          'endedOn': node.statusOn,
          'updatedOn': node.statusOn
        }, (error, result) => {
          next(null);
        });
    }, cb);
};

let sessionDeadThread = () => {
  async.waterfall([
    (next) => {
      nodeDbo.getNodes({
        'status': 'down'
      }, (error, result) => {
        if (error) next(error);
        else endSessions(result, next);
      });
    }
  ], (error, result) => { });
};

let nodeDeadThread = () => {
  let now = new Date();
  let minTime = new Date(now - MAX_SECS);
  nodeDbo.updateNodes({
    'statusOn': {
      $lt: minTime
    }
  }, {
      'status': 'down',
      'statusOn': now
    }, (error, result) => { });
};

let nodesStatsThread = () => {
  let activeNodesCount = 0;
  let totalNodesCount = 0;
  let date = new Date(new Date().toDateString());

  async.waterfall([
    (next) => {
      statsDbo.getStats({
        date
      }, (error, result) => {
        if (error) next(error);
        else if (result) next({
          message: 'Today\'s stats are already exist.'
        });
        else next(null);
      });
    }, (next) => {
      nodeDbo.getNodes({
        'status': 'up',
      }, (error, result) => {
        if (error) next(error);
        else {
          activeNodesCount = result.length;
          next(null);
        }
      });
    }, (next) => {
      nodeDbo.getNodes({},
        (error, result) => {
          if (error) next(error);
          else {
            totalNodesCount = result.length;
            next(null);
          }
        });
    }, (next) => {
      statsDbo.addStats({
        date,
        totalNodesCount,
        activeNodesCount,
      }, (error, result) => {
        if (error) next(error);
        else next(null);
      });
    }
  ], (error, result) => {
    setTimeout(nodesStatsThread, new Date(new Date(new Date().setDate(new Date().getDate() + 1)).toDateString()) - new Date());
  });
};

nodesStatsThread();
nodeDeadThread();
sessionDeadThread();
setInterval(nodeDeadThread, MAX_SECS / 2);
setInterval(sessionDeadThread, MAX_SECS * 2.5);