import async from 'async';
import uuid from 'uuid';
import {
  exec
} from "child_process";

import {
  Node,
  Connection,
  Statistic,
  Payment,
  Device
} from "../models";
import EthHelper from '../helpers/eth';
import {
  DECIMALS
} from '../config/vars';
import dbo from "../db/database";
import database from '../db/database';
import {
  REFERRAL_DUMMY
} from '../config/referral';

const getLatency = (url, cb) => {
  const avgLatencyCmd = "ping -c 2 " + url + " | tail -1 | awk '{print $4}' | cut -d '/' -f 2"
  exec(avgLatencyCmd, (error, stdout, stderr) => {
    if (error)
      return cb({
        'error': 'error getting in latency'
      }, null)
    return cb(null, stdout)
  })
}

const calculateAmount = (usedBytes, pricePerGB) => {
  return (usedBytes / (1024 * 1024 * 1024)) * pricePerGB;
}

/**
 * @api {post} /node/register VPN registration.
 * @apiName RegisterNode
 * @apiGroup NODE
 * @apiParam {String} account_addr Account address.
 * @apiParam {String} price_per_gb price of data usage for GB
 * @apiParam {String} ip Internet Protocal of the VPN node.
 * @apiParam {String} location location of the VPN node.
 * @apiParam {String} net_speed Net Speed of the VPN node.
 * @apiParam {String} vpn_type Type of vpn that the user want to give.
 * @apiSuccess {String} token Token id for the node.
 * @apiSuccess {String} message Node registered successfully.
 */

const registerNode = (req, res) => {
  let accountAddr = req.body['account_addr']
  let pricePerGB = parseFloat(req.body['price_per_gb']) || parseFloat(req.body['price_per_GB'])
  let ip = req.body['ip']
  let location = req.body['location']
  let netSpeed = req.body['net_speed']
  let vpnType = req.body['vpn_type'] || 'openvpn'
  let token = uuid.v4();
  let joinedOn = Date.now() / 1000;
  let latency = null;
  let method = 'AES-128-CBC'
  if (vpnType == 'socks5')
    method = 'aes-256-cfb'

  let encMethod = req.body['enc_method'] || method

  accountAddr = accountAddr.toString();
  pricePerGB = parseFloat(pricePerGB);
  ip = ip.toString();
  vpnType = vpnType.toString();

  async.waterfall([
    (next) => {
      getLatency(ip, (err, resp) => {
        if (err) next(err, null);
        latency = resp;
        next();
      })
    }, (next) => {
      Node.findOne({
          "account_addr": accountAddr
        },
        (err, node) => {
          if (!err) {
            next(null, node)
          } else next({
            'succes': false,
            'message': 'Error occurred while registering node.'
          }, null)
        })
    }, (node, next) => {
      if (!location['city']) {
        location['city'] = 'Unknown'
      }
      if (!node) {
        let data = {
          'account_addr': accountAddr,
          'token': token,
          'ip': ip,
          'price_per_gb': pricePerGB,
          'latency': latency,
          'vpn_type': vpnType,
          'joined_on': joinedOn,
          'location': location,
          'net_speed': netSpeed,
          'enc_method': encMethod
        }

        let nodeData = new Node(data)
        database.insert(nodeData, (err, resp) => {
          console.log('err, resp', err, resp)
          if (err) {
            next({
              'success': false,
              'message': 'Error occurred while registering the node.'
            }, null)
          } else if (resp) {
            next(null, {
              'success': true,
              'token': token,
              'message': 'Node registered successfully.'
            });
          }
        })
      } else {
        let findData = {
          'account_addr': accountAddr
        }

        let updateData = {
          'token': token,
          'ip': ip,
          'price_per_GB': pricePerGB,
          'latency': latency,
          'vpn_type': vpnType,
          'location': location,
          'net_speed': netSpeed,
          'enc_method': encMethod
        }

        database.update(Node, findData, updateData, (err, resp) => {
          if (err) {
            next({
              'success': false,
              'message': 'node not registered successfully'
            }, null)
          } else {
            next(null, {
              'success': true,
              'token': token,
              'message': 'Node registered successfully.'
            })
          }
        })
      }
    }
  ], (err, result) => {
    if (err) res.send(err);
    else res.send(result);
  })
}

/**
 * @api {post} /node/update-nodeinfo Update the existing node info.
 * @apiName UpdateNodeInfo
 * @apiGroup NODE
 * @apiParam {String} token Token Id of Node.
 * @apiParam {String} accountAddr Account address.
 * @apiParam {String} info Info to be updated.
 * @apiSuccess {String} message Node info updated successfully.
 */

const updateNodeInfo = (req, res) => {
  let token = req.body['token'];
  let accountAddr = req.body['account_addr'];
  let info = req.body['info'];

  let findData = {
    'account_addr': accountAddr,
    'token': token
  }

  async.waterfall([
    (next) => {
      if (info['type'] == 'location') {
        let location = info['location'];
        let updateData = {
          'location': location
        }

        database.update(Node, findData, updateData,
          (err, node) => {

            if (err) next(err, null);
            else next(null, node);
          })
      } else if (info['type'] == 'net_speed') {
        let netSpeed = info['net_speed'];

        let updateData = {
          'location': netSpeed
        }

        database.update(Node, findData, updateData,
          (err, node) => {
            if (err) next(err, null);
            else next(null, node);
          })
      } else if (info['type'] == 'vpn') {
        let initOn = parseInt(Date.now() / 1000)
        let updateData = {
          'vpn.status': 'up',
          'vpn.init_on': initOn,
          'vpn.ping_on': initOn
        }

        database.update(Node, findData, updateData,
          (err, node) => {
            if (err) next(err, null);
            else next(null, node);
          })
      } else if (info['type'] == 'alive') {
        let pingOn = parseInt(Date.now() / 1000)
        let updateData = {
          'vpn.status': 'up',
          'vpn.ping_on': pingOn
        }

        database.update(Node, findData, updateData,
          (err, node) => {
            if (err) next(err, null);
            else next(null, node);
          })
      }
    }
  ], (err, node) => {
    if (err) {
      res.send({
        success: false,
        err: 'Error in finding node'
      })
    }
    if (!node.n) {
      res.send({
        'success': false,
        'message': 'Node is not registered.'
      })
    } else {
      res.send({
        'success': true,
        'message': 'Node info updated successfully.'
      });
    }
  })
}

/**
 * @api {post} /node/update-connections Update the connections of VPNs.
 * @apiName UpdateConnections
 * @apiGroup NODE
 * @apiParam {String} token Token Id of Node.
 * @apiParam {String} accountAddr Account address.
 * @apiParam {String[]} connections connected nodes list.
 * @apiSuccess {String} message Connection details updated successfully.
 * @apiSuccess {Object[]} tx_hashes list transaction hashes.
 */

const updateConnections = (req, res) => {
  let token = req.body['token']
  let accountAddr = req.body['account_addr']
  let connections = req.body['connections']
  let txHashes = []
  let sessionNames = []
  let cond = '$nin'
  let node = null

  async.waterfall([
    (next) => {
      Node.findOne({
        account_addr: accountAddr,
        token: token
      }, (err, resp) => {
        if (err) next(err, null);
        node = resp;
        next()
      })
    }, (next) => {
      if (node) {
        async.eachSeries(connections, (connection, iterate) => {
          connection['vpn_addr'] = accountAddr;
          let address = connection['account_addr'] || null;

          if (address) {
            connection['client_addr'] = address.toString();
            delete connection['account_addr'];
          }
          if ('usage' in connection) {
            connection['server_usage'] = connection['usage']
            delete connection['usage']
          }
          if ('client_addr' in connection && connection['client_addr'] == 16) {
            connection['device_id'] = connection['client_addr'];
            connection['client_addr'] = REFERRAL_DUMMY
          }

          Connection.findOne({
            'vpn_addr': connection['vpn_addr'],
            'session_name': connection['session_name']
          }, (err, data) => {
            if (!data) {
              connection['start_time'] = Date.now() / 1000;
              connection['end_time'] = null;
              let connectionData = new Connection(connection)

              database.insert(connectionData, (err, resp) => {
                sessionNames.push(connection['session_name'])
                let endTime = connection['end_time'] || null
                if (endTime)
                  cond = '$in'
                iterate()
              })
            } else {
              let findData = {
                'vpn_addr': connection['vpn_addr'],
                'session_name': connection['session_name'],
                'end_time': null
              }
              let updateData = {
                'server_usage': connection['usage']
              }
              database.update(Connection, findData, updateData, (err, resp) => {
                sessionNames.push(connection['session_name'])
                let endTime = connection['end_time'] || null
                if (endTime)
                  cond = '$in'
                iterate()
              })
            }
          })
        }, () => {
          next()
        })
      } else {
        next({
          'success': false,
          'message': 'Can\'t find node with given details.'
        }, null)
      }
    }, (next) => {
      let endTime = Date.now() / 1000;
      let endedConnections = [];
      let sesName = {};
      sesName[cond] = sessionNames;

      let findData = {
        'vpn_addr': accountAddr,
        'session_name': sesName,
        'end_time': null
      }

      let updateData = {
        'end_time': endTime
      }

      database.updateMany(Connection, findData, updateData, (err, resp) => {
        if (resp.nModified > 0) {
          Connection.find({
            'vpn_addr': accountAddr,
            'session_name': sesName,
            'end_time': endTime
          }, (err, resp) => {
            next(null, resp)
          })
        } else {
          next(null, endedConnections);
        }
      })
    }, (endedConnections, next) => {
      async.eachSeries(endedConnections, (connection, iterate) => {
        let toAddr = (connection['client_addr']);
        let sentBytes = parseInt(connection['server_usage']['down']);
        let sessionDuration = parseInt(connection['end_time']) - parseInt(connection['start_time']);
        let amount = parseInt(calculateAmount(sentBytes, node['price_per_gb']) * DECIMALS);
        let deviceId = 'device_id' in connection ? connection['device_id'] : null
        let timeStamp = Date.now() / 1000;
        EthHelper.addVpnUsage(accountAddr, toAddr, sentBytes, sessionDuration, amount, timeStamp, deviceId, (err, txHash) => {
          if (err) txHashes.push(err)
          else txHashes.push(txHash)
          iterate()
        })
      }, () => {
        next(null, {
          'success': true,
          'message': 'Connection details updated successfully.',
          'tx_hashes': txHashes
        })
      })
    }
  ], (err, resp) => {
    if (err) res.send(err)
    else res.send(resp)
  })
}

/**
 * @api {post} /node/deregister Deregistering the node.
 * @apiName DeRegisterNode
 * @apiGroup NODE
 * @apiParam {String} accountAddr Account address to be deregistered.
 * @apiParam {String} token Token Id of Node.
 * @apiSuccess {String} message Node deregistred successfully.
 */

const deRegisterNode = (req, res) => {
  let accountAddr = req.body['account_addr'];
  let token = req.body['token'];

  async.waterfall([
    (next) => {
      Node.deleteOne({
        'account_addr': accountAddr,
        'token': token
      }, (err, resp) => {
        if (!resp.n) {
          next({
            'success': false,
            'message': 'Node is not registered.'
          }, null);
        } else {
          next(null, {
            'success': true,
            'message': 'Node deregistred successfully.'
          })
        }
      })
    }
  ], (err, resp) => {
    if (err) res.send(err);
    else res.send(resp);
  })
}

/**
 * @api {post} /node/add-usage add the usage of the VPN.
 * @apiName AddVpnUsage
 * @apiGroup NODE
 * @apiParam {String} fromAddr Account address which is used the VPN.
 * @apiParam {String} toAddr Account address whose VPN is.
 * @apiParam {Number} sentBytes Bytes used by the client.
 * @apiParam {Number} sessionDuration Duration of the VPN connection.
 * @apiSuccess {String} txHash Hash of the transaction.
 * @apiSuccess {String} message VPN usage data will be added soon.
 */
//---------------------------------------------------------------------------------------

/**
 * @api {get} /stats/data/daily-stats daily usage of vpns.
 * @apiName GetDailyDataCount
 * @apiGroup NODE
 * @apiSuccess {Object[]} stats Total daily data downloaded by the clients.
 */

const getDailyDataCount = (req, res) => {
  Connection.aggregate([{
    "$project": {
      "total": {
        "$add": [
          new Date(1970 - 1 - 1), {
            "$multiply": ["$start_time", 1000]
          }
        ]
      },
      "data": "$server_usage.down"
    }
  }, {
    "$group": {
      "_id": {
        "$dateToString": {
          "format": "%d/%m/%Y",
          "date": '$total'
        }
      },
      "dataCount": {
        "$sum": "$data"
      }
    }
  }, {
    "$sort": {
      "_id": 1
    }
  }], (err, result) => {
    if (err) res.send(err);
    else
      res.send({
        'success': true,
        'stats': result
      });
  })
}

/**
 * @api {get} /stats/data/total-data total data usage.
 * @apiName getTotalDataCount
 * @apiGroup NODE
 * @apiSuccess {Number} stats total data downloaded by the clients.
 */

const getTotalDataCount = (req, res) => {
  Connection.aggregate([{
    "$group": {
      "_id": null,
      "Total": {
        "$sum": "$server_usage.down"
      }
    }
  }], (err, result) => {
    if (err) res.send(err)
    res.send({
      'success': true,
      'stats': result
    })
  })
}

/**
 * @api {get} /stats/data/last-data last day's data usage.
 * @apiName getLastDataCount
 * @apiGroup NODE
 * @apiSuccess {Object[]} stats Data usage of last day.
 */

const getLastDataCount = (req, res) => {
  Connection.aggregate([{
      '$match': {
        'start_time': {
          '$gte': (Date.now() / 1000) - (24 * 60 * 60)
        }
      }
    },
    {
      '$group': {
        '_id': null,
        'Total': {
          '$sum': '$server_usage.down'
        }
      }
    }
  ], (err, resp) => {
    if (err) {
      res.send({
        'success': false,
        'err': err
      })
    } else {
      res.send({
        'success': true,
        'stats': resp
      })
    }
  })
}

/**
 * @api {get} /stats/nodes/daily-stats registered nodes per day.
 * @apiName getDailyNodeCount
 * @apiGroup NODE
 * @apiSuccess {Object[]} stats total nodes registered per day.
 */

const getDailyNodeCount = (req, res) => {
  let dailyCount = []

  Node.aggregate([{
    "$project": {
      "total": {
        "$add": [
          new Date(1970 - 1 - 1), {
            "$multiply": ["$created_at", 1000]
          }
        ]
      }
    }
  }, {
    "$group": {
      "_id": {
        "$dateToString": {
          "format": "%d/%m/%Y",
          "date": '$total'
        }
      },
      "nodesCount": {
        "$sum": 1
      }
    }
  }, {
    "$sort": {
      "_id": 1
    }
  }], (err, result) => {
    if (err) {
      res.status(400).send({
        'success': false,
        'err': err
      })
    } else {
      res.status(200).send({
        'success': true,
        'stats': result
      })
    }
  })
}

/**
 * @api {get} /stats/nodes/total-nodes total registered nodes.
 * @apiName getTotalNodeCount
 * @apiGroup NODE
 * @apiSuccess {Number} stats total nodes registered.
 */

const getTotalNodeCount = (req, res) => {
  Statistic.aggregate([{
    '$project': {
      'total': {
        '$add': [
          new Date(1970 - 1 - 1), {
            '$multiply': ['$timestamp', 1000]
          }
        ]
      },
      'nodes': '$nodes.total'
    }
  }, {
    '$group': {
      '_id': {
        '$dateToString': {
          'format': '%d/%m/%Y',
          'date': '$total'
        }
      },
      'nodesCount': {
        '$sum': '$nodes'
      }
    }
  }, {
    '$sort': {
      '_id': 1
    }
  }], (err, resp) => {
    if (err) {
      res.status(400).send({
        'success': false,
        'err': err
      })
    } else {
      res.status(200).send({
        'success': true,
        'stats': resp
      })
    }
  })
}

/**
 * @api {get} /stats/nodes/daily-active active nodes per day.
 * @apiName getDailyActiveNodeCount
 * @apiGroup NODE
 * @apiSuccess {Object[]} stats List of nodes active per day.
 */

const getDailyActiveNodeCount = (req, res) => {
  Statistic.aggregate([{
    '$project': {
      'total': {
        '$add': [
          new Date(1970 - 1 - 1), {
            '$multiply': ['$timestamp', 1000]
          }
        ]
      },
      'nodes': '$nodes.up'
    }
  }, {
    '$group': {
      '_id': {
        '$dateToString': {
          'format': '%d/%m/%Y',
          'date': '$total'
        }
      },
      'nodesCount': {
        '$sum': '$nodes'
      }
    }
  }, {
    '$sort': {
      '_id': 1
    }
  }], (err, resp) => {
    if (err) {
      res.status(400).send({
        'success': false,
        'err': err
      })
    } else {
      res.status(200).send({
        'success': true,
        'stats': resp
      })
    }
  })
}

/**
 * @api {get} /stats/nodes/average-nodes average nodes per day
 * @apiName getAverageNodesCount
 * @apiGroup NODE
 * @apiSuccess {Object} average Average list of node registered count per day.
 */

const getAverageNodesCount = (req, res) => {
  Node.aggregate([{
    '$group': {
      '_id': null,
      'olddate': {
        '$min': "$joined_on"
      },
      'newdate': {
        '$max': "$joined_on"
      },
      "SUM": {
        '$sum': 1
      }
    }
  }, {
    '$project': {
      '_id': 0,
      'Average': {
        '$divide': [
          "$SUM", {
            '$divide': [{
              "$subtract": ["$newdate", "$olddate"]
            }, 24 * 60 * 60]
          }
        ]
      }
    }
  }], (err, resp) => {
    if (err) {
      res.status(400).send({
        'success': false,
        'err': err
      })
    } else {
      res.status(200).send({
        'success': true,
        'average': resp
      })
    }
  })
}

/**
 * @api {get} /stats/nodes/active-count active nodes count
 * @apiName getActiveNodeCount
 * @apiGroup NODE
 * @apiSuccess {Number} stats Active nodes count .
 */

const getActiveNodeCount = (req, res) => {
  Node.find({
    "vpn.status": "up"
  }, (err, data) => {
    if (err) {
      res.status(400).send({
        'success': false,
        'err': err
      })
    } else {
      res.status(200).send({
        'success': true,
        'average': data.length
      })
    }
  })
}

/**
 * @api {get} /stats/sessions/daily-stats daily sessions count
 * @apiName getDailySessionCount
 * @apiGroup NODE
 * @apiSuccess {Object[]} stats List of daily using sessions count
 */

const getDailySessionCount = (req, res) => {
  Connection.aggregate([{
    "$project": {
      "total": {
        "$add": [
          new Date(1970 - 1 - 1), {
            "$multiply": ["$start_time", 1000]
          }
        ]
      }
    }
  }, {
    "$group": {
      "_id": {
        "$dateToString": {
          "format": "%d/%m/%Y",
          "date": "$total"
        }
      },
      "sessionsCount": {
        "$sum": 1
      }
    }
  }, {
    "$sort": {
      "_id": 1
    }
  }], (err, data) => {
    if (err) {
      res.status(400).send({
        'success': false,
        'err': err
      })
    } else {
      res.status(200).send({
        'success': true,
        'stats': data.length
      })
    }
  })
}

/**
 * @api {get} /stats/sessions/average-count average sessions
 * @apiName getAverageSessionsCount
 * @apiGroup NODE
 * @apiSuccess {Object[]} average List of average sessions count.
 */

const getAverageSessionsCount = (req, res) => {
  Connection.aggregate([{
    '$group': {
      '_id': null,
      'olddate': {
        '$min': "$start_time"
      },
      'newdate': {
        '$max': "$start_time"
      },
      "SUM": {
        '$sum': 1
      }
    }
  }, {
    '$project': {
      '_id': 0,
      'Average Sessions': {
        '$divide': [
          "$SUM", {
            '$divide': [{
              "$subtract": ["$newdate", "$olddate"]
            }, 24 * 60 * 60]
          }
        ]
      }
    }
  }], (err, resp) => {
    if (err) {
      res.status(400).send({
        'success': false,
        'err': err
      })
    } else {
      res.status(200).send({
        'success': true,
        'average': resp
      })
    }
  })
}

/**
 * @api {get} /stats/sessions/active-count active session count.
 * @apiName getActiveSessionCount
 * @apiGroup NODE
 * @apiSuccess {Number} count Active sessions count.
 */

const getActiveSessionCount = (req, res) => {
  Connection.find({
    end_time: null
  }, (err, data) => {
    if (err) {
      res.status(400).send({
        'success': false,
        'err': err
      })
    } else {
      res.status(200).send({
        'success': true,
        'count': data.length
      })
    }
  })
}

/**
 * @api {get} /stats/time/daily-stats daily duration usage.
 * @apiName getDailyDurationCount
 * @apiGroup NODE
 * @apiSuccess {Object[]} stats Daily duration of the vpn usage.
 */

const getDailyDurationCount = (req, res) => {
  Connection.aggregate([{
    "$project": {
      "total": {
        "$add": [
          new Date(1970 - 1 - 1), {
            "$multiply": ["$start_time", 1000]
          }
        ]
      },
      "start": "$start_time",
      "end": {
        "$cond": [{
            "$eq": ["$end_time", null]
          },
          parseInt(Date.now() / 1000), "$end_time"
        ]
      }
    }
  }, {
    "$group": {
      "_id": {
        "$dateToString": {
          "format": "%d/%m/%Y",
          "date": '$total'
        }
      },
      "durationCount": {
        "$sum": {
          "$subtract": ["$end", "$start"]
        }
      }
    }
  }, {
    "$sort": {
      "_id": 1
    }
  }], (err, dailyCount) => {
    if (err) {
      res.status(400).send({
        'success': false,
        'err': err
      })
    } else {
      res.status(200).send({
        'success': true,
        'count': dailyCount
      })
    }
  })
}

/**
 * @api {get} /stats/time/average-daily average duration per everyday .
 * @apiName getDailyAverageDuration
 * @apiGroup NODE
 * @apiSuccess {String} average List of daily average duration of the vpn.
 */

const getDailyAverageDuration = (req, res) => {
  Connection.aggregate([{
    '$project': {
      'total': {
        '$add': [new Date(1970 - 1 - 1), {
          '$multiply': ['$start_time', 1000]
        }]
      },
      'Sum': {
        '$sum': {
          '$subtract': [{
              '$cond': [{
                  '$eq': ['$end_time', null]
                },
                parseInt(Date.now() / 1000),
                '$end_time'
              ]
            },
            '$start_time'
          ]
        }
      }
    }
  }, {
    '$group': {
      '_id': {
        '$dateToString': {
          'format': '%d/%m/%Y',
          'date': '$total'
        }
      },
      'Average': {
        '$avg': '$Sum'
      }
    }
  }, {
    '$sort': {
      '_id': 1
    }
  }], (err, resp) => {
    if (err) {
      res.status(400).send({
        'success': false,
        'err': err
      })
    } else {
      res.status(200).send({
        'success': true,
        'average': resp
      })
    }
  })
}

/**
 * @api {get} /stats/time/average-duration average duration of sessions.
 * @apiName getAverageDuration
 * @apiGroup NODE
 * @apiSuccess {Number} average daily average duration of vpn usage.
 */

const getAverageDuration = (req, res) => {
  let avgCount = []
  Connection.aggregate([{
    "$project": {
      "Sum": {
        "$sum": {
          "$subtract": [{
            "$cond": [{
                "$eq": ["$end_time", null]
              },
              parseInt(Date.now() / 1000), "$end_time"
            ]
          }, "$start_time"]
        }
      }
    }
  }, {
    "$group": {
      "_id": null,
      "Average": {
        "$avg": "$Sum"
      }
    }
  }], (err, avgCount) => {
    if (err) {
      res.status(400).send({
        'success': false,
        'err': err
      })
    } else {
      res.status(200).send({
        'success': true,
        'average': avgCount
      })
    }
  })
}

/**
 * @api {get} /stats/time/last-average last day's average duration.
 * @apiName getLastAverageDuration
 * @apiGroup NODE
 * @apiSuccess {Number} average Average duration of the last day.
 */

const getLastAverageDuration = (req, res) => {
  Connection.aggregate([{
      '$match': {
        'start_time': {
          '$gte': Date.now() / 1000 - (24 * 60 * 60)
        }
      }
    },
    {
      '$project': {
        'Sum': {
          '$sum': {
            '$subtract': [{
              '$cond': [{
                  '$eq': ['$end_time', null]
                },
                Date.now() / 1000, '$end_time'
              ]
            }, '$start_time']
          }
        }
      }
    }, {
      '$group': {
        '_id': null,
        'Average': {
          '$avg': '$Sum'
        }
      }
    }
  ], (err, resp) => {
    if (err) {
      res.status(400).send({
        'success': false,
        'err': err
      })
    } else {
      res.status(200).send({
        'success': true,
        'average': resp
      })
    }
  })
}

/**
 * @api {get} stats/node?addr = {vpn address} vpn address stats.
 * @apiName getNodeStatistics
 * @apiGroup NODE
 * @apiParam {String} addr vpn address of the node.
 * @apiSuccess {Object} average The usage of the node.
 */

const getNodeStatistics = (req, res) => {
  let account_addr = req.query.addr;

  Connection.aggregate([{
    '$match': {
      'account_addr': account_addr
    }
  }, {
    '$group': {
      '_id': '$vpn_addr',
      'sessions_count': {
        '$sum': 1
      },
      'active_sessions': {
        '$sum': {
          '$cond': [{
            '$or': [{
              '$eq': ['$end_time', null]
            }, {
              '$eq': ['$end_time', null]
            }]
          }, 1, 0]
        }
      },
      'download': {
        '$sum': '$server_usage.down'
      },
      'upload': {
        '$sum': '$server_usage.up'
      }
    }
  }], (err, resp) => {
    if (err) {
      res.status(400).send({
        'success': false,
        'err': err
      })
    } else {
      res.status(200).send({
        'success': true,
        'average': resp
      })
    }
  })
}

const getDailyPaidSentsCount = (req, res) => {
  Statistic.aggregate([{
    '$project': {
      'total': {
        '$add': [
          new Date(1970 - 1 - 1), {
            '$multiply': ['$timestamp', 1000]
          }
        ]
      },
      'amount': '$paid_count'
    }
  }, {
    '$group': {
      '_id': {
        '$dateToString': {
          'format': '%d/%m/%Y',
          'date': '$total'
        }
      },
      'sentsCount': {
        '$sum': '$amount'
      }
    }
  }, {
    '$sort': {
      '_id': 1
    }
  }], (err, dailyCount) => {
    if (err) {
      res.status(400).send({
        success: false,
        message: "error getting daily paid session count"
      })
    } else {
      res.status(200).send({
        success: true,
        stats: dailyCount
      })
    }
  })
}

const getDailyTotalSentsUsed = (req, res) => {
  Statistic.aggregate([{
    '$project': {
      'total': {
        '$add': [
          new Date(1970 - 1 - 1), {
            '$multiply': ['$timestamp', 1000]
          }
        ]
      },
      'amount': {
        '$add': ['$paid_count', '$unpaid_count']
      }
    }
  }, {
    '$group': {
      '_id': {
        '$dateToString': {
          'format': '%d/%m/%Y',
          'date': '$total'
        }
      },
      'sentsCount': {
        '$sum': '$amount'
      }
    }
  }, {
    '$sort': {
      '_id': 1
    }
  }], (err, dailyCount) => {
    if (err) {
      res.status(400).send({
        success: false,
        message: "error getting daily sents used"
      })
    } else {
      res.status(200).send({
        success: true,
        stats: dailyCount
      })
    }
  })
}

const getAveragePaidSentsCount = (req, res) => {
  Payment.aggregate([{
      '$group': {
        '_id': 0,
        'AverageCount': {
          '$avg': '$paid_count'
        }
      }
    }],
    (err, avgCount) => {
      if (err) {
        res.status(400).send({
          success: false,
          message: "error getting average paid sents count"
        })
      } else {
        res.status(200).send({
          success: true,
          stats: avgCount
        })
      }
    })
}

const getAverageTotalSentsCount = (req, res) => {
  Payment.aggregate([{
    '$project': {
      'total': {
        '$add': ['$paid_count', '$unpaid_count']
      }
    }
  }, {
    '$group': {
      '_id': 0,
      'Avg': {
        '$avg': '$total'
      }
    }
  }], (err, avgCount) => {
    if (err) {
      res.status(400).send({
        success: false,
        message: "error getting average total sents count"
      })
    } else {
      res.status(200).send({
        success: true,
        stats: avgCount
      })
    }
  })
}

export default {
  registerNode,
  updateNodeInfo,
  updateConnections,
  deRegisterNode,
  addVpnUsage,
  getDailyDataCount,
  getTotalDataCount,
  getLastDataCount,
  getDailyNodeCount,
  getTotalNodeCount,
  getDailyActiveNodeCount,
  getAverageNodesCount,
  getActiveNodeCount,
  getDailySessionCount,
  getAverageSessionsCount,
  getActiveSessionCount,
  getDailyDurationCount,
  getDailyAverageDuration,
  getAverageDuration,
  getLastAverageDuration,
  getNodeStatistics,
  getDailyPaidSentsCount,
  getDailyTotalSentsUsed,
  getAveragePaidSentsCount,
  getAverageTotalSentsCount
}
