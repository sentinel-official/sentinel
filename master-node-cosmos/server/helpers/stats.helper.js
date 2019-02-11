let NodeModel = require('../models/node.model');
let SessionModel = require('../models/session.model');
let StatsModel = require('../models/stats.model');

let getActiveNodesCount = (cb) => {
  NodeModel.aggregate([{
    $match: {
      'status': 'up'
    }
  }, {
    $group: {
      '_id': null,
      'count': {
        $sum: 1
      }
    }
  }, {
    $project: {
      '_id': 0
    }
  }], (error, result) => {
    if (error) cb(error);
    else cb(null, result);
  });
};

let getAverageActiveNodesCount = (startDate, endDate, cb) => {
  StatsModel.aggregate([{
    $match: {
      $and: [{
        'date': {
          $gte: startDate
        }
      }, {
        'date': {
          $lte: endDate
        }
      }]
    }
  }, {
    $group: {
      '_id': null,
      'count': {
        $avg: '$activeNodesCount'
      }
    }
  }, {
    $project: {
      '_id': 0
    }
  }], (error, result) => {
    if (error) cb(error);
    else cb(null, result);
  });
};

let getNodesTimeline = (startDate, endDate, cb) => {
  StatsModel.aggregate([{
    $match: {
      $and: [{
        'date': {
          $gte: startDate
        }
      }, {
        'date': {
          $lte: endDate
        }
      }]
    }
  }, {
    $project: {
      '_id': 0
    }
  }, {
    $sort: {
      'date': 1
    }
  }], (error, result) => {
    if (error) cb(error);
    else cb(null, result);
  })
};

/* ____________________________________________________________________________________________________ */

let getActiveSessionsCount = (cb) => {
  SessionModel.aggregate([{
    $match: {
      '$or': [{
        'endedOn': null
      }, {
        'endedOn': {
          $exists: false
        }
      }]
    }
  }, {
    $group: {
      '_id': null,
      'count': {
        $sum: 1
      }
    }
  }, {
    $project: {
      '_id': 0
    }
  }], (error, result) => {
    if (error) cb(error);
    else cb(null, result);
  });
};

let getAverageSessionsCount = (startDate, endDate, cb) => {
  SessionModel.aggregate([{
    $match: {
      $and: [{
        'startedOn': {
          $gte: startDate
        }
      }, {
        'startedOn': {
          $lte: endDate
        }
      }]
    }
  }, {
    $group: {
      '_id': null,
      'startDate': {
        $min: '$startedOn',
      },
      'endDate': {
        $max: '$startedOn',
      },
      'count': {
        $sum: 1
      }
    }
  }, {
    $project: {
      '_id': 0,
      'count': {
        $divide: ['$count', {
          $divide: [{
            $subtract: ['$endDate', '$startDate']
          }, 24 * 60 * 60 * 1000]
        }]
      }
    }
  }], (error, result) => {
    if (error) cb(error);
    else cb(null, result);
  });
};

let getSessionsTimeline = (startDate, endDate, cb) => {
  StatsModel.aggregate([{
    $match: {
      $and: [{
        'startedOn': {
          $gte: startDate
        }
      }, {
        'startedOn': {
          $lte: endDate
        }
      }]
    }
  }, {
    $group: {
      '_id': {
        'year': {
          $year: '$startedOn',
        },
        'month': {
          $month: '$startedOn',
        },
        'day': {
          $dayOfMonth: '$startedOn',
        }
      },
      'count': {
        $sum: 1
      }
    }
  }, {
    $project: {
      '_id': 0,
      'date': {
        $dateFromParts: {
          'year': '$_id.year',
          'month': '$_id.month',
          'day': '$_id.day',
        }
      },
      'count': 1
    }
  }, {
    $sort: {
      'date': 1
    }
  }], (error, result) => {
    if (error) cb(error);
    else cb(null, result);
  });
};

/* ____________________________________________________________________________________________________ */

let getDataConsumed = (startDate, endDate, cb) => {
  SessionModel.aggregate([{
    $match: {
      $and: [{
        'startedOn': {
          $gte: startDate
        }
      }, {
        'startedOn': {
          $lte: endDate
        }
      }]
    }
  }, {
    $group: {
      '_id': null,
      'download': {
        $sum: '$usage.download'
      },
      'upload': {
        $sum: '$usage.upload'
      }
    }
  }, {
    $project: {
      '_id': 0
    }
  }], (error, result) => {
    if (error) cb(error);
    else cb(null, result);
  });
};

let getDataConsumedTimeline = (startDate, endDate, cb) => {
  StatsModel.aggregate([{
    $match: {
      $and: [{
        'startedOn': {
          $gte: startDate
        }
      }, {
        'startedOn': {
          $lte: endDate
        }
      }]
    }
  }, {
    $group: {
      '_id': {
        'year': {
          $year: '$startedOn',
        },
        'month': {
          $month: '$startedOn',
        },
        'day': {
          $dayOfMonth: '$startedOn',
        }
      },
      'download': {
        $sum: '$usage.download'
      },
      'upload': {
        $sum: '$usage.upload'
      }
    }
  }, {
    $project: {
      '_id': 0,
      'date': {
        $dateFromParts: {
          'year': '$_id.year',
          'month': '$_id.month',
          'day': '$_id.day',
        }
      },
      'download': 1,
      'upload': 1,
    }
  }, {
    $sort: {
      'date': 1
    }
  }], (error, result) => {
    if (error) cb(error);
    else cb(null, result);
  });
};

/* ____________________________________________________________________________________________________ */

let getAverageDuration = (startDate, endDate, cb) => {
  SessionModel.aggregate([{
    $match: {
      $and: [{
        'startedOn': {
          $gte: startDate
        }
      }, {
        'startedOn': {
          $lte: endDate
        }
      }]
    }
  }, {
    $group: {
      '_id': null,
      'duration': {
        $sum: {
          $subtract: [{
            $ifNull: ['$endedOn', '$updatedOn']
          }, '$startedOn']
        }
      },
      'sessionsCount': {
        $sum: 1
      }
    }
  }, {
    $project: {
      '_id': 0,
      'duration': {
        $divide: ['$duration', '$sessionsCount']
      }
    }
  }], (error, result) => {
    if (error) cb(error);
    else cb(null, result);
  });
};

let getAverageDurationTimeline = (startDate, endDate, cb) => {
  StatsModel.aggregate([{
    $match: {
      $and: [{
        'startedOn': {
          $gte: startDate
        }
      }, {
        'startedOn': {
          $lte: endDate
        }
      }]
    }
  }, {
    $group: {
      '_id': {
        'year': {
          $year: '$startedOn',
        },
        'month': {
          $month: '$startedOn',
        },
        'day': {
          $dayOfMonth: '$startedOn',
        }
      },
      'duration': {
        $sum: {
          $subtract: [{
            $ifNull: ['$endedOn', '$updatedOn']
          }, '$startedOn']
        }
      },
      'sessionsCount': {
        $sum: 1
      }
    }
  }, {
    $project: {
      '_id': 0,
      'date': {
        $dateFromParts: {
          'year': '$_id.year',
          'month': '$_id.month',
          'day': '$_id.day',
        }
      },
      'duration': {
        $divide: ['$duration', '$sessionsCount']
      }
    }
  }, {
    $sort: {
      'date': 1
    }
  }], (error, result) => {
    if (error) cb(error);
    else cb(null, result);
  });
};

module.exports = {
  getActiveNodesCount,
  getAverageActiveNodesCount,
  getNodesTimeline,

  getActiveSessionsCount,
  getAverageSessionsCount,
  getSessionsTimeline,

  getDataConsumed,
  getDataConsumedTimeline,

  getAverageDuration,
  getAverageDurationTimeline,
};