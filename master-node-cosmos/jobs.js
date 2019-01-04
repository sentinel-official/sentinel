let async = require('async');
let nodeDbo = require('./server/dbos/node.dbo');
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
          'endedOn': node.statusOn
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

nodeDeadThread();
sessionDeadThread();
setInterval(nodeDeadThread, MAX_SECS / 2);
setInterval(sessionDeadThread, MAX_SECS * 2.5);