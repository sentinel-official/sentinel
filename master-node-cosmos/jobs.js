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