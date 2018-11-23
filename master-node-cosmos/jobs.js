let nodeDbo = require('./server/dbos/node.dbo');

let MAX_SECS = 2 * 60 * 1000;

let nodeDeadThread = () => {
  let minTime = new Date(new Date() - MAX_SECS);
  nodeDbo.updateNodes({
    'info.pingOn': {
      $lt: minTime
    }
  }, {
      'info.status': 'down'
    }, (error, result) => {
    });
};

setInterval(nodeDeadThread, MAX_SECS / 2);