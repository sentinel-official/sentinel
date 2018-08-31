import md5 from 'md5'
import redis from 'redis'
import async from 'async'

import {
  addSession
} from "./referral";
import {
  Eth_manager
} from '../eth/eth';
import {
  ERC20Manager
} from '../eth/erc20';
import {
  VpnServiceManager
} from '../eth/vpn_contract';
import {
  LIMIT_10MB,
  LIMIT_100MB,
  SESSIONS_SALT
} from '../config/vars';
import {
  ADDRESS as COINBASE_ADDRESS,
  PRIVATE_KEY as COINBASE_PRIVATE_KEY
} from '../config/eth';
import {
  Usage,
  refSession
} from '../models';
import database from '../db/database';
import {
  REFERRAL_DUMMY
} from '../config/referral';

let redisClient = redis.createClient();

const getEncodedSessionId = async (accountAddr, index, cb) => {
  accountAddr = accountAddr.toString('utf8');
  index = index.toString();
  index = index.toString('utf8')
  let sessionId = await md5(accountAddr + index + SESSIONS_SALT)
  return cb(sessionId)
}

const createAccount = (password, cb) => {
  Eth_manager['main'].createAccount(password, (err, accountDetails) => {
    cb(err, accountDetails);
  });
}

const getAccountAddress = (privateKey, cb) => {
  Eth_manager['main'].getAddress(privateKey,
    (err, address) => {
      let accountAddress = address.substr(2)
      cb(null, accountAddress)
    })
}

const getTxReceipt = (txHash, net, cb) => {
  if (net === 'main') {
    Eth_manager['main'].getTransactionReceipt(txHash, (err, receipt) => {
      cb(err, receipt)
    })
  } else if (net === 'rinkeby') {
    Eth_manager['rinkeby'].getTransactionReceipt(txHash, (err, receipt) => {
      cb(err, receipt)
    })
  }
}

const getTx = (txHash, net, cb) => {
  if (net === 'main') {
    Eth_manager['main'].getTransaction(txHash, (err, receipt) => {
      cb(err, receipt)
    })
  } else if (net === 'rinkeby') {
    Eth_manager['rinkeby'].getTransaction(txHash, (err, receipt) => {
      cb(err, receipt)
    })
  }
}

const getTxCount = (accountAddr, net, cb) => {
  if (net == 'main') {
    Eth_manager['main'].getTransactionCount(accountAddr, (err, txCount) => {
      cb(txCount)
    })
  } else if (net == 'rinkeby') {
    Eth_manager['rinkeby'].getTransactionCount(accountAddr, (err, txCount) => {
      cb(txCount)
    })
  }
}

const getValidNonce = (accountAddr, net, cb) => {
  let key = accountAddr + '_' + net;
  let error = null;
  let nonce = 0;

  redisClient.get(key, (error, previousNonce) => {
    if (previousNonce)
      previousNonce = parseInt(previousNonce);

    if (net == 'main') {
      Eth_manager['main'].getTransactionCount(accountAddr, (err, nonce) => {
        if ((err === null) && (previousNonce === null || nonce > previousNonce)) {
          redisClient.set(key, nonce)
          cb(nonce)
        } else {
          setTimeout(() => {
            getValidNonce(accountAddr, net, cb)
          }, 1000);
        }
      })
    } else if (net == 'rinkeby') {
      Eth_manager['rinkeby'].getTransactionCount(accountAddr, (err, nonce) => {
        if ((err === null) && (previousNonce === null || nonce > previousNonce)) {
          redisClient.set(key, nonce)
          cb(nonce)
        } else {
          setTimeout(() => {
            getValidNonce(accountAddr, net, cb)
          }, 1000);
        }
      })
    }
  });
}

const getBalances = (accountAddr, cb) => {
  let balances = {
    main: {
      eths: null,
      sents: null
    },
    test: {
      eths: null,
      sents: null
    }
  }

  try {
    Eth_manager['main'].getBalance(accountAddr, (err, balance) => {
      balances.main.eths = balance
      ERC20Manager['main']['SENT'].getBalance(accountAddr, (err, balance) => {
        balances.main.sents = balance
        Eth_manager['rinkeby'].getBalance(accountAddr, (err, balance) => {
          balances.test.eths = balance
          ERC20Manager['rinkeby']['SENT'].getBalance(accountAddr, (err, balance) => {
            balances.test.sents = balance
            cb(null, balances);
          })
        })
      })
    })
  } catch (error) {
    cb(error, null)
  }
}

const transfer = (fromAddr, toAddr, amount, symbol, privateKey, net, cb) => {
  if (symbol == 'ETH') {
    transferEths(fromAddr, toAddr, amount, privateKey, net,
      (err, resp) => {
        cb(err, resp)
      })
  } else {
    transferErc20(fromAddr, toAddr, amount, symbol, privateKey, net,
      (err, resp) => {
        cb(err, resp);
      })
  }
}

const transferErc20 = (fromAddr, toAddr, amount, symbol, privateKey, net, cb) => {
  getValidNonce(fromAddr, net, (nonce) => {
    ERC20Manager[net][symbol].transferAmount(toAddr, amount, privateKey, nonce, (err, txHash) => {
      cb(err, txHash)
    })
  })
}

const transferEths = (fromAddr, toAddr, amount, privateKey, net, cb) => {
  if (net == 'main') {
    Eth_manager['main'].transferAmount(fromAddr, toAddr, amount, privateKey, (err, txHash) => {
      cb(err, txHash)
    })
  } else if (net == 'rinkeby') {
    Eth_manager['rinkeby'].transferAmount(fromAddr, toAddr, amount, privateKey, (err, txHash) => {
      cb(err, txHash)
    })
  }
}

const rawTransaction = (txData, net, cb) => {
  if (net == 'main') {
    Eth_manager['main'].sendRawTransaction(txData,
      (err, txHash) => {
        cb(err, txHash);
      })
  } else if (net == 'rinkeby') {
    Eth_manager['rinkeby'].sendRawTransaction(txData,
      (err, txHash) => {
        cb(err, txHash);
      })
  }
}

const getInitialPayment = (accountAddr, cb) => {
  VpnServiceManager.getInitialPayment(accountAddr, (err, isPayed) => {
    cb(err, isPayed)
  })
}

const getDueAmount = (accountAddr, cb) => {
  VpnServiceManager.getDueAmount(accountAddr,
    (err, dueAmount) => {
      cb(err, dueAmount);
    });
}

const getVpnSessionCount = (accountAddr, cb) => {
  VpnServiceManager.getVpnSessionCount(accountAddr, (err, sessions) => {
    cb(err, sessions);
  })
}

const getLatestVpnUsage = (accountAddr, cb) => {
  getVpnSessionCount(accountAddr, (err, sessionsCount) => {
    if (!err && sessionsCount > 0) {
      getEncodedSessionId(accountAddr, sessionsCount - 1, (sessionId) => {
        VpnServiceManager.getVpnUsage(accountAddr, sessionId, (err, _usage) => {
          if (!err) {
            let usage = {
              'id': sessionId,
              'account_addr': _usage[0].toString().toLowerCase(),
              'received_bytes': _usage[1],
              'session_duration': _usage[2],
              'amount': _usage[3],
              'timestamp': _usage[4],
              'is_paid': _usage[5]
            }
            cb(null, usage)
          } else {
            cb(err, null)
          }
        })
      })
    }
  })
}

const getVpnUsage = async (accountAddr, cb) => {
  let usage = {
    'due': 0,
    'stats': {
      'received_bytes': 0,
      'duration': 0,
      'amount': 0
    },
    'sessions': []
  }
  VpnServiceManager.getVpnSessionCount(accountAddr, (err, sessions) => {
    if (!err) {
      async.times(sessions, (index, next) => {
        getEncodedSessionId(accountAddr, index, (sessionId) => {
          VpnServiceManager.getVpnUsage(accountAddr, sessionId, (error, _usage) => {
            if (!error) {
              if (!_usage[5])
                usage['due'] += _usage[3]
              usage['stats']['received_bytes'] += parseInt(_usage[1])
              usage['stats']['duration'] += parseInt(_usage[2])
              usage['stats']['amount'] += parseInt(_usage[3])
              usage['sessions'].push({
                'id': sessionId,
                'account_addr': _usage[0],
                'received_bytes': _usage[1],
                'session_duration': _usage[2],
                'amount': _usage[3],
                'timestamp': _usage[4],
                'is_paid': _usage[5]
              })
              next()
            } else {
              next()
              // cb(error, null)
            }
          })
        })
      }, () => {
        cb(null, usage)
      })
    } else {
      cb(err, null)
    }
  })
}

const payVpnSession = (fromAddr, amount, sessionId, net, txData, paymentType, deviceId = null, cb) => {
  let errors = []
  let txHashes = []

  rawTransaction(txData, net, (err1, txHash1) => {
    if (!err1) {
      txHashes.push(txHash1)
      getValidNonce(COINBASE_ADDRESS, 'rinkeby', (nonce) => {
        if (paymentType == 'init') {
          VpnServiceManager.setInitialPayment(fromAddr, nonce, (err2, txHash2) => {
            if (!err2) {
              if (deviceId) {
                addSession(deviceId, sessionId, txHash2, (_, res) => {
                  txHashes.push(txHash2)
                  cb(errors, txHashes)
                })
              }
            } else {
              errors.push(err2)
              cb(errors, txHashes)
            }
          })
        } else if (paymentType == 'normal') {
          VpnServiceManager.payVpnSession(fromAddr, amount, sessionId, nonce, (err2, txHash2) => {
            if (!err2) {
              if (deviceId) {
                addSession(deviceId, sessionId, txHash2, (_, res) => {
                  txHashes.push(txHash2)
                  cb(errors, txHashes)
                })
              }
              txHashes.push(txHash2)
              cb(errors, txHashes)
            } else {
              errors.push(err2)
              cb(errors, txHashes)
            }
          })
        } else {
          cb(errors, txHashes)
        }
      })
    } else {
      errors.push(err1)
      cb(errors, txHashes);
    }
  })
}

const addVpnUsage = (fromAddr, toAddr, sentBytes, sessionDuration, amount, timeStamp, deviceId, cb) => {
  let err = null;
  let txHash = null;
  let makeTx = false;
  let sessionId = null;
  let _usage = null;

  sentBytes = parseInt(sentBytes);
  sessionDuration = parseInt(sessionDuration);
  amount = parseInt(amount);

  async.waterfall([
    (next) => {
      getVpnSessionCount(toAddr, (err, sessionsCount) => {
        if (!err) {
          getEncodedSessionId(toAddr, sessionsCount, (sessId) => {
            sessionId = sessId;
            next();
          })
        } else {
          next();
        }
      })
    }, (next) => {
      Usage.findOne({
        'from_addr': fromAddr,
        'to_addr': toAddr
      }, (err, usage) => {
        _usage = usage
        next()
      })
    }, (next) => {
      if (!_usage) {
        if (sentBytes > LIMIT_10MB && sentBytes < LIMIT_100MB) {

          let data = {
            'from_addr': fromAddr,
            'to_addr': toAddr,
            'sent_bytes': sentBytes,
            'session_duration': sessionDuration,
            'amount': amount,
            'timestamp': timeStamp
          }

          let usageData = new Usage(data)

          database.insert(usageData, (err, resp) => {
            if (err) {
              next(err, null)
            } else {
              next()
            }
          })
        } else if (sentBytes >= LIMIT_100MB) {
          makeTx = true;
          next()
        } else {
          next()
        }
      } else if (parseInt(_usage['sent_bytes']) + sentBytes < LIMIT_100MB) {

        let findData = {
          'from_addr': fromAddr,
          'to_addr': toAddr
        }

        let updateData = {
          'sent_bytes': _usage['sent_bytes'] + sentBytes,
          'session_duration': _usage['session_duration'] + sessionDuration,
          'amount': _usage['amount'] + amount,
          'timestamp': timeStamp
        }

        database.update(Usage, findData, updateData, (err, resp) => {
          next()
        })
      } else {
        sentBytes = parseInt(_usage['sent_bytes']) + sentBytes;
        sessionDuration = parseInt(_usage['session_duration']) + sessionDuration;
        amount = parseInt(_usage['amount']) + amount;
        makeTx = true;
        Usage.findOneAndRemove({
          'from_addr': fromAddr,
          'to_addr': toAddr
        }, (err, resp) => {
          next()
        })
      }
    }, (next) => {
      if (toAddr === REFERRAL_DUMMY && sentBytes >= LIMIT_100MB) {
        addSession(deviceId, sessionId, null, (_, resp) => {
          let error = _
          let _refSession = new refSession({
            'device_id': deviceId,
            'session_id': deviceId,
            'from_addr': fromAddr,
            'to_addr': toAddr,
            'sent_bytes': sentBytes,
            'session_duration': sessionDuration,
            'amount': amount,
            'timestamp': timeStamp
          })
          _refSession.save((err, resp) => {
            next(err, resp)
          })
        })
      } else {
        next(null)
      }
      if (makeTx && toAddr !== REFERRAL_DUMMY) {
        getValidNonce(COINBASE_ADDRESS, 'rinkeby', (nonce) => {
          VpnServiceManager.addVpnUsage(fromAddr, toAddr, sentBytes, sessionDuration, amount, timeStamp, sessionId, nonce,
            (err, txHash) => {
              next(err, txHash)
            })
        })
      } else {
        next(null, null)
      }
    }
  ], (err, resp) => {
    cb(err, resp);
  })
}

const free = (toAddr, eths, sents, cb) => {
  let errors = [],
    txHashes = []

  let PRIVATE_KEY = Buffer.from(COINBASE_PRIVATE_KEY, 'hex');
  transferEths(COINBASE_ADDRESS, toAddr, eths, PRIVATE_KEY, 'rinkeby', (err, txHash) => {
    if (!err) {
      txHashes.push(txHash);
      transferErc20(COINBASE_ADDRESS, toAddr, sents, 'SENT', PRIVATE_KEY, 'rinkeby', (err, txHash) => {
        if (!err) {
          txHashes.push(txHash);
          cb(errors, txHashes);
        } else {
          errors.push(errors);
          cb(errors, txHashes);
        }
      })
    } else {
      errors.push(err);
      cb(errors, txHashes);
    }
  });
}

export default {
  createAccount,
  getAccountAddress,
  getTxReceipt,
  getTx,
  getTxCount,
  getValidNonce,
  getBalances,
  transfer,
  transferErc20,
  transferEths,
  rawTransaction,
  getInitialPayment,
  getDueAmount,
  getVpnSessionCount,
  getLatestVpnUsage,
  getVpnUsage,
  payVpnSession,
  addVpnUsage,
  free,
}
