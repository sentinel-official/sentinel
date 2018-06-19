import { scheduleJob } from "node-schedule";
import { each, waterfall } from "async";
import ltrim from "ltrim";
import zfill from "zfill";

import { dbs } from "../db/db";
import * as EthHelper from "../helpers/eth";
import { tokens } from '../helpers/tokens';
import { CENTRAL_WALLET, CENTRAL_WALLET_PRIVATE_KEY } from '../utils/config'

var db = null;

const makeTx = (txHash0, status, message, txHash1 = null, cb) => {
  db.collection('token_swaps').findOneAndUpdate({
    'txHash_0': txHash0
  }, {
      '$set': {
        'status': status,
        'message': message,
        'txHash_1': txHash1,
        'time_1': Date.now() / 1000
      }
    }, (err, resp) => {
      if (err) cb(err, null)
      else cb(null, resp);
    })
}

const transfer = (fromAddr, toAddr, token, txHash0, value, cb) => {
  if (fromAddr == CENTRAL_WALLET) {
    tokens.calculateSents(token, value, (sents) => {
      EthHelper.transferSents(CENTRAL_WALLET, toAddr, sents, CENTRAL_WALLET_PRIVATE_KEY, 'main', (err, txHash1) => {
        console.log('err, txHash1', err, txHash1)
        if (!err) {
          cb(txHash0, 1, 'Transaction is initiated successfully.', txHash1);
        } else {
          cb(txHash0, -1, 'Error occurred while initiating transaction.');
        }
      })
    })
  } else {
    cb(txHash0, -1, 'From address is not CENTRAL WALLET.');
  }
}

const checkTx = (transactions, cb) => {
  each(transactions, (transaction, iterate) => {
    var txHash0 = transaction['txHash_0']
    var receipt = null;
    var tx = null;
    var fromAddr = null;
    var toAddr = null;
    var txValue = null;
    var txInput = null;
    var token = null;
    var tokenValue = null;

    waterfall([
      (next) => {
        EthHelper.getTxReceipt(txHash0, 'main', (err, txReceipt) => {
          if (!err && txReceipt) {
            receipt = txReceipt
            next()
          } else {
            next(txHash0, 0, 'Can\'t find the transaction receipt.')
          }
        })
      }, (next) => {
        if (receipt['status'] == 1) {
          EthHelper.getTx(txHash0, 'main', (err, Tx) => {
            if (!err && Tx) {
              tx = Tx
              next()
            }
          })
        } else {
          next(txHash0, -1, 'Failed transaction.')
        }
      }, (next) => {
        fromAddr = tx['from'].toLowerCase()
        toAddr = tx['to'].toLowerCase()
        txValue = parseInt(tx['value'])
        txInput = tx['input']

        if (txValue == 0 && txInput.length == 138) {
          token = tokens.getToken(toAddr)
          if (token && token['name'] != 'SENTinel') {
            if (txInput.substring(0, 10) === '0xa9059cbb') {
              toAddr = txInput.substring(10, 74)
              toAddr = ('0x' + zfill(ltrim(toAddr, '0'), 40)).toLowerCase();
              tokenValue = parseInt('0x' + ltrim(txInput.substring(74, 138), '0'))
              next();
            } else {
              next(txHash0, -1, 'Wrong transaction method.')
            }
          } else {
            next(txHash0, -1, 'No token found.')
          }
        } else if (txValue > 0 && txInput.length == 2) {
          token = tokens.getToken(toAddr)
          next()
        } else {
          next(txHash0, -1, 'Not a valid transaction')
        }
      }, (next) => {
        transfer(toAddr, fromAddr, token, txHash0, txValue, (TxHash0, Status, Message, TxHash1 = null) => {
          next(TxHash0, Status, Message, TxHash1)
        })
      }
    ], (TxHash0, Status, Message, TxHash1 = null) => {
      makeTx(TxHash0, Status, Message, TxHash1, (err, resp) => {
        iterate()
      })
    })
  }, () => {
    cb()
  })
}

export const swaps = (data) => {
  if (data.message === 'start') {
    scheduleJob('0 * * * * *', () => {
      waterfall([
        (next) => {
          dbs((err, dbo) => {
            db = dbo.db('sentinel1');
            next()
          })
        }, (next) => {
          db.collection('token_swaps').find({ status: 0 }).toArray((err, transactions) => {
            checkTx(transactions, () => {
              next()
            })
          })
        }
      ], (err, resp) => {
        console.log('swaps');
      })
    })
  }
}