import async from 'async';
import request from 'request';
import uuid from 'uuid'
import axios from 'axios';

import { VpnServiceManager } from "../eth/vpn_contract";
import EthHelper from '../helpers/eth';
import { DECIMALS } from '../config/vars';
import { ADDRESS as COINBASE_ADDRESS } from '../config/eth';
import { Node, Connection } from "../models";
import { BTC_BASED_COINS } from '../config/swaps';
import database from '../db/database';

/**
* @api {get} /client/vpn/list Get all unoccupied VPN servers list.
* @apiName GetVpnsList
* @apiGroup VPN
* @apiSuccess {Object[]} list Details of all VPN servers.
*/

const calculateAmount = (usedBytes, pricePerGB) => {
  return (usedBytes / (1024 * 1024 * 1024)) * pricePerGB;
}

const getNodeList = (vpnType, cb) => {
  Node.find({
    'vpn.status': 'up',
    'vpn_type': vpnType
  }, {
      '_id': 0,
      'account_addr': 1,
      'ip': 1,
      'price_per_GB': 1,
      'price_per_gb': 1,
      'location': 1,
      'net_speed.upload': 1,
      'latency': 1,
      'net_speed.download': 1
    }, (err, resp) => {
      if (err) cb(err, null)
      else cb(null, resp)
    })
}

/**
 * @api {get} /client/vpn/list Get all unoccupied VPN servers list.
 * @apiName GetVpnsList
 * @apiGroup VPN
 * @apiSuccess {Object[]} list Details of all VPN servers.
 */

const getVpnsList = (req, res) => {
  getNodeList('openvpn', (err, list) => {
    if (err) {
      res.send({
        'success': false,
        'message': 'error in getting vpn node list',
        'error': err
      })
    } else {
      async.each(list, (item, iterate) => {
        item['price_per_GB'] = item['price_per_gb'];
        delete item['price_per_gb'];
        iterate();
      }, () => {
        res.status(200).send({
          'success': true,
          'list': list
        })
      })
    }
  })
}

/**
 * @api {get} /client/vpn/socks-list Get all unoccupied Socks servers list.
 * @apiName GetSocksList
 * @apiGroup VPN
 * @apiSuccess {Object[]} list Details of all Socks servers.
 */

const getSocksList = (req, res) => {
  getNodeList('socks5', (err, list) => {
    if (err) {
      res.send({
        'success': false,
        'error': err
      })
    }

    async.each(list, (item, iterate) => {
      item['price_per_GB'] = item['price_per_gb'];
      delete item['price_per_gb'];
      iterate();
    }, () => {
      res.status(200).send({
        'success': true,
        'list': list
      })
    })
  })
}

/**
* @api {post} /client/vpn/current Get current VPN usage.
* @apiName GetVpnCurrentUsage
* @apiGroup VPN
* @apiParam {String} accountAddr Account address.
* @apiParam {String} sessionName Session name of the VPN connection.
* @apiSuccess {Object} usage Current VPN usage.
*/

const getCurrentVpnUsage = (req, res) => {
  let accountAddr = req.body['account_addr']
  accountAddr = accountAddr.toLowerCase();
  let sessionName = req.body['session_name']

  Connection.findOne({
    client_addr: accountAddr,
    session_name: sessionName
  }, {
      _id: 0,
      server_usage: 1
    }, (err, result) => {
      if (!result && !result.usage) {
        res.send({
          success: true,
          usage: {
            down: 0,
            up: 0
          }
        })
      } else {
        res.send({
          success: true,
          usage: result.server_usage || result.usage
        })
      }
    })
}

/**
* @api {post} /client/vpn Get VPN server credentials.
* @apiName GetVpnCredentials
* @apiGroup VPN
* @apiParam {String} accountAddr Account address.
* @apiParam {String} vpnAddr Account address of the VPN server.
* @apiSuccess {String} ip IP address of the VPN server.
* @apiSuccess {Number} port Port number of the VPN server.
* @apiSuccess {String} token Unique token for validation.
* @apiSuccess {String} vpnAddr VPN server account address.
*/

const getVpnCredentials = (req, res) => {
  let accountAddr = req.body['account_addr'];
  let vpnAddr = req.body['vpn_addr'];

  async.waterfall([
    (next) => {
      EthHelper.getBalances(accountAddr,
        (err, balances) => {
          if (err) next(err, null);
          else next(null, balances);
        })
    }, (balances, next) => {
      if (balances.test.sents >= 100 * DECIMALS) {
        EthHelper.getDueAmount(accountAddr, (err, dueAmount) => {
          if (err) {
            next({
              'success': false,
              'error': err,
              'message': 'Error occurred while checking the due amount.'
            }, null)
          } else if (dueAmount <= 0) {
            if (vpnAddr) {
              Node.findOne(
                { 'account_addr': vpnAddr, 'vpn.status': 'up' },
                { '_id': 0, 'token': 0 },
                (err, node) => {
                  if (err) next(err, null);
                  else next(null, node);
                })
            } else {
              Node.findOne(
                { 'vpn.status': 'up' },
                { '_id': 0, 'token': 0 },
                (err, node) => {
                  if (err) next(err, null);
                  else next(null, node);
                })
            }
          } else {
            next({
              'success': false,
              'message': 'You have due amount: ' +
                dueAmount / (DECIMALS * 1.0) + ' SENTs. Please try after clearing the due.'
            }, null)
          }
        });
      } else {
        next({
          'success': false,
          'message': 'Your balance is less than 100 SENTs.'
        }, null)
      }
    }, (node, next) => {
      if (!node) {
        next({
          'success': false,
          'message': 'Currently VPN server is not available. Please try after sometime.'
        }, null)
      } else {
        next(null, node);
      }
    }, (node, next) => {
      EthHelper.getInitialPayment(accountAddr, (err, isPayed) => {
        if (err) {
          next({
            'success': false,
            'message': 'Error occurred while cheking initial payment status.'
          }, null)
        } else if (isPayed) {
          let token = uuid.v4();
          let ip = node.ip;
          let port = 3000;
          let body = {
            account_addr: accountAddr,
            token: token
          };
          let url = 'http://' + ip + ':' + port + '/token';
          // let url = 'http://localhost:3000'
          axios.post(url, JSON.stringify(body))
            .then((resp) => {
              next(null, {
                'success': true,
                'ip': ip,
                'port': port,
                'token': token,
                'vpn_addr': vpnAddr,
                'message': 'Started VPN session.'
              });
            })
            .catch((err) => {
              next({
                'success': false,
                'message': 'Connection timed out while connecting to VPN server.',
                'error': err
              }, null);
            })
        } else {
          next({
            'success': false,
            'account_addr': COINBASE_ADDRESS,
            'message': 'Initial payment status is not done.'
          }, null)
        }
      })
    }
  ], (err, resp) => {
    if (err) res.status(400).send(err);
    else res.status(200).send(resp);
  })
}

/**
* @api {post} /client/vpn/pay VPN usage payment.
* @apiName PayVpnUsage
* @apiGroup VPN
* @apiParam {String} paymentType mode of payment {init | normal}
* @apiParam {String} txData Hex code of the transaction.
* @apiParam {String} net Ethereum chain name {main | rinkeby}.
* @apiParam {String} fromAddr Account address.
* @apiParam {Number} amount Amount to be payed to VPN server.
* @apiParam {Number} sessionId Session ID of the VPN connection.
* @apiSuccess {String[]} errors Errors if any.
* @apiSuccess {String[]} txHashes Transaction hashes.
*/

const payVpnUsage = (req, res) => {
  let paymentType = req.body['payment_type']
  let txData = req.body['tx_data']
  let net = req.body['net']
  let fromAddr = req.body['from_addr']
  let amount = req.body['amount'].toString() || null
  let sessionId = req.body['session_id'].toString() || null

  if (sessionId)
    sessionId = sessionId.toString();

  EthHelper.payVpnSession(fromAddr, amount, sessionId, net, txData, paymentType, (errors, txHashes) => {
    if (errors.length > 0) {
      res.send({
        'success': false,
        'errors': errors,
        'txHashes': txHashes,
        'message': 'Error occurred while paying VPN usage.'
      })
    } else {
      res.send({
        'success': true,
        'errors': errors,
        'txHashes': txHashes,
        'message': 'VPN payment is completed successfully.'
      })
    }
  })
}

/**
 * @api {post} /client/vpn/report Report VPN payment
 * @apiName ReportPayment
 * @apiGroup VPN
 * @apiParam {String} fromAddr Account address. 
 * @apiParam {Number} amount Amount to be payed to VPN server.
 * @apiParam {Number} sessionId Session ID of the VPN connection.
 * @apiSuccess {String} tx_hash Transaction hash.
 */

const reportPayment = (req, res) => {
  let fromAddr = req.body['from_addr']
  let amount = parseInt(req.body['amount'])
  let sessionId = parseInt(req.body['session_id'])

  EthHelper.getValidNonce(COINBASE_ADDRESS, 'rinkeby', (nonce) => {
    VpnServiceManager.payVpnSession(fromAddr, amount, sessionId, nonce, (error, txHash) => {
      if (!error) {
        res.status(200).send({
          'success': true,
          'tx_hash': txHash,
          'message': 'Payment Done Successfully.'
        })
      } else {
        res.status(200).send({
          'success': false,
          'error': error,
          'message': 'Vpn payment not successful.'
        })
      }
    })
  })
}

/**
* @api {post} /client/vpn/usage Get VPN user details of specific account.
* @apiName GetVpnUsage
* @apiGroup VPN
* @apiParam {String} accountAddr Account address.
* @apiSuccess {Object[]} usage VPN usage details.
*/

const getVpnUsage = (req, res) => {
  let accountAddress = req.body['account_addr'];
  accountAddress = accountAddress.toLowerCase();

  EthHelper.getVpnUsage(accountAddress, (err, usage) => {
    if (!err) {
      res.send({
        'success': true,
        'usage': usage
      })
    } else {
      res.send({
        'success': false,
        'error': err,
        'message': 'Error occured while fetching the usage data.'
      })
    }
  });
}

const updateConnection = (req, res) => {

  let accountAddr = req.body['account_addr'].toLowerCase()
  let connections = req.body['connections']
  let txHashes = []
  let sessionNames = []
  let node = null
  let endedConnections = []

  async.waterfall([
    (next) => {
      Node.findOne({
        account_addr: accountAddr,
      }, (err, resp) => {
        if (err) next(err, null);
        node = resp;
        next()
      })
    }, (next) => {
      if (node) {
        async.each(connections, (connection, iterate) => {
          connection['vpn_addr'] = accountAddr;
          let address = connection['account_addr'] || null;

          if (address) {
            connection['client_addr'] = address.toString();
            delete connection['account_addr'];
          }

          Connection.findOne({
            'vpn_addr': connection['vpn_addr'],
            'session_name': connection['session_name']
          }, (err, data) => {
            if (!data) {
              connection['start_time'] = Date.now() / 1000;
              connection['end_time'] = null;
              let ConnectionData = new Connection(connection);

              database.insert(ConnectionData, (err, resp) => {
                iterate()
              })
            } else {
              if (connection['usage']) {
                let findData = {
                  'vpn_addr': connection['vpn_addr'],
                  'session_name': connection['session_name'],
                  'end_time': null
                }

                let updateData = {
                  'client_usage': connection['usage']
                }

                database.update(Connection, findData, updateData, (err, resp) => {
                  iterate()
                })
              } else {
                let findData = {
                  'vpn_addr': connection['vpn_addr'],
                  'session_name': connection['session_name'],
                  'end_time': null
                }

                let updateData = {
                  'end_time': parseInt(Date.now() / 1000)
                }

                database.updateMany(Connection, findData, updateData, (err, resp) => {
                  if (resp.nModified > 0) {
                    Connection.find({
                      'vpn_addr': connection['vpn_addr'],
                      'session_name': connection['session_name'],
                      'end_time': endTime
                    }, (err, endedCons) => {
                      endedConnections = endedCons
                      async.each(endedConnections, (connection, iterate) => {
                        let toAddr = connection['client_addr'].toLowerCase()
                        let sentBytes = parseInt(connection['client_usage']['down'])
                        let sessionDuration = parseInt(connection['end_time']) - parseInt(connection['start_time'])
                        let amount = parseInt(calculateAmount(sentBytes, node['price_per_gb']) * DECIMALS);
                        let timeStamp = parseInt(Date.now() / 1000)

                        EthHelper.addVpnUsage(accountAddr, toAddr, sentBytes, sessionDuration, amount, timeStamp, (err, txHash) => {
                          if (err) txHashes.push(error)
                          else txHashes.push(txHash)
                          iterate()
                        })
                      }, () => {

                      })
                    })
                  } else {
                    iterate()
                  }
                })
              }
            }
          })
        }, () => {
          next(null, {
            'success': true,
            'message': 'Connection details updated successfully.',
            'tx_hashes': txHashes
          })
        })
      } else {
        next({
          'success': false,
          'message': 'Can\'t find node with given details.'
        }, null)
      }
    }], (err, resp) => {
      if (err) res.send(err)
      else res.send(resp)
    })
}

export default {
  getVpnsList,
  getSocksList,
  getCurrentVpnUsage,
  getVpnCredentials,
  payVpnUsage,
  reportPayment,
  getVpnUsage,
  updateConnection
}