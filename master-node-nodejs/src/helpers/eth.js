import md5 from 'md5'
import redis from 'redis'
import sleep from 'sleep'
import async from 'async'

import { ETHManager, rinkeby, mainnet } from '../eth/eth';
import { SentinelMain, SentinelRinkeby } from '../eth/sentinel_contract';
import { DECIMALS, COINBASE_ADDRESS, COINBASE_PRIVATE_KEY, SESSIONS_SALT, LIMIT_10MB, LIMIT_100MB } from '../utils/config';
import * as VpnManager from '../eth/vpn_contract';

var redisClient = redis.createClient();

const getEncodedSessionId = async (accountAddr, index, cb) => {
  accountAddr = accountAddr.toString('utf8');
  index = index.toString();
  index = index.toString('utf8')
  let sessionId = await md5(accountAddr + index + SESSIONS_SALT)
  return cb(sessionId)
}

const getValidNonce = (accountAddr, net, cb) => {
  let key = accountAddr + '_' + net;
  let previousNonce = redisClient.get(key);
  let error = -1;
  let nonce = -1;

  if (previousNonce)
    previousNonce = parseInt(previousNonce);

  if (net == 'main') {
    mainnet.getTransactionCount(accountAddr, (err, nonce) => {
      if (!err && (!previousNonce || nonce > previousNonce)) {
        redisClient.set(key, nonce)
        return cb(nonce)
      } else {
        sleep.sleep(1)
        return getValidNonce(accountAddr, net, cb)
      }
    })
  } else if (net == 'rinkeby') {
    rinkeby.getTransactionCount(accountAddr, (err, nonce) => {
      if (!err && (!previousNonce || nonce > previousNonce)) {
        redisClient.set(key, nonce)
        return cb(nonce)
      } else {
        sleep.sleep(1)
        return getValidNonce(accountAddr, net, cb)
      }
    })
  }
}

export const createAccount = (password, cb) => {
  mainnet.createAccount(password, (err, accountDetails) => {
    cb(err, accountDetails);
  });
}

export const getBalances = (accountAddr, cb) => {
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
    mainnet.getBalance(accountAddr, (err, balance) => {
      balances.main.eths = balance
      SentinelMain.getBalance(accountAddr, (err, balance) => {
        balances.main.sents = balance
        rinkeby.getBalance(accountAddr, (err, balance) => {
          balances.test.eths = balance
          SentinelRinkeby.getBalance(accountAddr, (err, balance) => {
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

export const getTxReceipt = (txHash, net, cb) => {
  if (net === 'main') {
    mainnet.getTransactionReceipt(txHash, (err, receipt) => {
      cb(err, receipt)
    })
  }
  else if (net === 'rinkeby') {
    rinkeby.getTransactionReceipt(txHash, (err, receipt) => {
      cb(err, receipt)
    })
  }
}

export const getTx = (txHash, net, cb) => {
  if (net === 'main') {
    mainnet.getTransaction(txHash, (err, receipt) => {
      cb(err, receipt)
    })
  }
  else if (net === 'rinkeby') {
    rinkeby.getTransaction(txHash, (err, receipt) => {
      cb(err, receipt)
    })
  }
}

export const transferSents = (fromAddr, toAddr, amount, privateKey, net, cb) => {
  getValidNonce(fromAddr, net, (nonce = null) => {
    if (net == 'main') {
      SentinelMain.transferAmount(toAddr, amount, privateKey, nonce, (err, txHash) => {
        cb(err, txHash)
      })
    } else if (net == 'rinkeby') {
      SentinelRinkeby.transferAmount(toAddr, amount, privateKey, nonce, (err, txHash) => {
        cb(err, txHash)
      })
    }
  })
}

export const transferEths = (fromAddr, toAddr, amount, privateKey, net, cb) => {
  if (net == 'main') {
    mainnet.transferAmount(fromAddr, toAddr, amount, privateKey, (err, txHash) => {
      cb(err, txHash)
    })
  } else if (net == 'rinkeby') {
    rinkeby.transferAmount(fromAddr, toAddr, amount, privateKey, (err, txHash) => {
      cb(err, txHash)
    })
  }
}

export const free = (toAddr, eths, sents, cb) => {
  let errors = [], txHashes = []

  let PRIVATE_KEY = Buffer.from(COINBASE_PRIVATE_KEY, 'hex');
  transferEths(COINBASE_ADDRESS, toAddr, eths, PRIVATE_KEY, 'rinkeby', (err, txHash) => {
    if (!err) {
      txHashes.push(txHash);
      transferSents(COINBASE_ADDRESS, toAddr, eths, PRIVATE_KEY, 'rinkeby', (err, txHash) => {
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

export const getAccountAddress = (privateKey, cb) => {
  mainnet.getAddress(privateKey,
    (err, address) => {
      let accountAddress = address.substr(2)
      cb(null, accountAddress)
    })
}

export const rawTransaction = (txData, net, cb) => {
  if (net == 'main') {
    mainnet.sendRawTransaction(txData,
      (err, txHash) => {
        cb(err, txHash);
      })
  }
  else if (net == 'rinkeby') {
    rinkeby.sendRawTransaction(txData,
      (err, txHash) => {
        cb(err, txHash);
      })
  }
}

export const getDueAmount = (accountAddr, cb) => {
  VpnManager.getDueAmount(accountAddr,
    (err, dueAmount) => {
      cb(err, dueAmount);
    });
}

export const getVpnSessionCount = (account_addr, cb) => {
  VpnManager.getVpnSessionCount(account_addr, (err, sessions) => {
    cb(err, sessions);
  })
}

export const getInitialPayment = (accountAddr, cb) => {
  VpnManager.getInitialPayment(accountAddr, (err, isPayed) => {
    cb(err, isPayed)
  })
}

export const transferAmount = (fromAddr, toAddr, amount, unit, keystore, password, privateKey = null, cb) => {
  if (!privateKey) {
    ETHManager.getprivatekey(keystore, password,
      (err, privateKey) => {
        privateKey = privateKey
        if (err)
          return cb(err, null)
        if (unit == 'ETH') {
          ETHManager.transferAmount(fromAddr, toAddr, amount, privateKey,
            (err, resp) => {
              cb(err, resp)
            })
        } else {
          SentinelMain.transferAmount(fromAddr, toAddr, amount, privateKey,
            (err, resp) => {
              cb(err, resp);
            })
        }
      })
  }
}

export const getVpnUsage = async (accountAddr, cb) => {
  let usage = {
    'due': 0,
    'stats': {
      'received_bytes': 0,
      'duration': 0,
      'amount': 0
    },
    'sessions': []
  }
  VpnManager.getVpnSessionCount(accountAddr, (err, sessions) => {
    if (!err) {
      async.times(sessions, (index, next) => {
        getEncodedSessionId(accountAddr, index, (sessionId) => {
          VpnManager.getVpnUsage(accountAddr, sessionId, (error, _usage) => {
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
              return cb(error, null)
            }
          })
        })
      }, () => {
        return cb(null, usage)
      })
    } else {
      cb(err, null)
    }
  })
}

export const payVpnSession = (fromAddr, amount, sessionId, net, txData, paymentType, cb) => {
  let errors = []
  let txHashes = []

  rawTransaction(txData, net, (err1, txHash1) => {
    if (!err1) {
      txHashes.push(txHash1)
      getValidNonce(COINBASE_ADDRESS, 'rinkeby', (nonce) => {
        if (paymentType == 'init') {
          VpnManager.setInitialPayment(fromAddr, nonce, (err2, txHash2) => {
            if (!err2) {
              txHashes.push(txHash2)
              return cb(errors, txHashes)
            } else {
              errors.push(err2)
              return cb(errors, txHashes)
            }
          })
        } else if (paymentType == 'normal') {
          VpnManager.payVpnSession(fromAddr, amount, sessionId, nonce, (err2, txHash2) => {
            if (!err2) {
              txHashes.push(txHash2)
              return cb(errors, txHashes)
            } else {
              errors.push(err2)
              return cb(errors, txHashes)
            }
          })
        } else {
          return cb(errors, txHashes)
        }
      })
    } else {
      errors.push(err1)
      return cb(errors, txHashes);
    }
  })
}

export const addVpnUsage = (fromAddr, toAddr, sentBytes, sessionDuration, amount, timeStamp, cb) => {
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
      global.db.collection('usage').findOne({
        'from_addr': fromAddr,
        'to_addr': toAddr
      }, (err, usage) => {
        _usage = usage
        next()
      })
    }, (next) => {
      if (!_usage) {
        if (sentBytes > LIMIT_10MB && sentBytes < LIMIT_100MB) {
          global.db.collection('usage').insertOne({
            'from_addr': fromAddr,
            'to_addr': toAddr,
            'sent_bytes': sentBytes,
            'session_duration': sessionDuration,
            'amount': amount,
            'timestamp': timeStamp
          }, (err, resp) => {
            next()
          })
        } else if (sentBytes >= LIMIT_100MB) {
          makeTx = true;
          next()
        } else {
          next()
        }
      } else if (parseInt(_usage['sent_bytes']) + sentBytes < LIMIT_100MB) {
        global.db.collection('usage').findOneAndUpdate({
          'from_addr': fromAddr,
          'to_addr': toAddr
        }, {
            '$set': {
              'sent_bytes': _usage['sent_bytes'] + sentBytes,
              'session_duration': _usage['session_duration'] + sessionDuration,
              'amount': _usage['amount'] + amount,
              'timestamp': timeStamp
            }
          }, (err, resp) => {
            next()
          })
      } else {
        sentBytes = parseInt(_usage['sent_bytes']) + sentBytes;
        sessionDuration = parseInt(_usage['session_duration']) + sessionDuration;
        amount = int(_usage['amount']) + amount;
        make_tx = true;
        global.db.collection('usage').findOneAndDelete({
          'from_addr': fromAddr,
          'to_addr': toAddr
        }, (err, resp) => {
          next()
        })
      }
    }, (next) => {
      if (makeTx) {
        getValidNonce(COINBASE_ADDRESS, 'rinkeby', (nonce) => {
          VpnManager.addVpnUsage(fromAddr, toAddr, sentBytes, sessionDuration, amount, timeStamp, sessionId, nonce,
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