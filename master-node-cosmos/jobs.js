let async = require('async');
let lodash = require('lodash');
let nodeDbo = require('./server/dbos/node.dbo');
let sessionDbo = require('./server/dbos/session.dbo');

let MAX_SECS = 2 * 60 * 1000;

let endDeadSessions = (deadTime, cb) => {
  async.waterfall([
    (next) => {
      nodeDbo.getNodes({
        'status': 'down',
        'statusOn': deadTime
      }, (error, result) => {
        if (error) next(error);
        else {
          let addresses = lodash.map(result, 'accountAddress');
          next(null, addresses);
        }
      });
    }, (addresses, next) => {
      sessionDbo.updateSessions({
        'nodeAccountAddress': {
          $in: addresses
        },
        'startedOn': {
          $exists: true
        },
        'endedOn': {
          $exists: false
        }
      }, {
          'endedOn': now
        }, next);
    }
  ], cb);
};

let nodeDeadThread = () => {
  let now = new Date();
  let minTime = new Date(now - MAX_SECS);
  async.waterfall([
    (next) => {
      nodeDbo.updateNodes({
        'statusOn': {
          $lt: minTime
        }
      }, {
          'status': 'down',
          'statusOn': now
        }, (error, result) => {
          if (error) next(error);
          else if (result.modifiedCount > 0) endDeadSessions(now, next);
          else next(null);
        });
    }
  ], (error, result) => { });
};

nodeDeadThread();
setInterval(nodeDeadThread, MAX_SECS / 2);