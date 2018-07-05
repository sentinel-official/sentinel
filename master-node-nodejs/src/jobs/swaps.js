import { scheduleJob } from "node-schedule";
import { each, waterfall } from "async";
import ltrim from "ltrim";
import zfill from "zfill";

import EthHelper from "../helpers/eth";
import { tokens } from '../helpers/tokens';
import { isValidEthereumSwap } from "../helpers/swaps";
import { BTCHelper } from "../helpers/btc";
import {
  ADDRESS as SWAP_ADDRESS,
  BTC_BASED_COINS,
  ETHEREUM_BASED_COINS,
  PRIVATE_KEY as SWAP_PRIVATE_KEY
} from "../config/swaps";
import { Swap } from "../models";

const updateStatus = (key, status, txHash = null, cb) => {
  console.log(key, status, txHash)
  let findObj = null;
  if (key.length == 66) {
    findObj = { 'tx_hash_0': key }
  } else if (key.length == 34) {
    findObj = { 'from_address': key }
  }

  Swap.findOneAndUpdate(findObj, {
    '$set': {
      'status': status['status'],
      'message': status['message'],
      'tx_hash_1': txHash,
      'time_1': Date.now() / 1000
    }
  }, (err, resp) => {
    cb()
  })
}

const transfer = (key, toAddr, value, toSymbol, cb) => {
  let error = null;
  let txHash1 = null;

  if (ETHEREUM_BASED_COINS.includes(toSymbol)) {
    EthHelper.transfer(SWAP_ADDRESS, toAddr, parseInt(value), toSymbol, SWAP_PRIVATE_KEY, 'main', (err, txHash1) => {
      if (!err && txHash1) {
        updateStatus(key, {
          'status': 1,
          'message': 'Transaction is initiated successfully.',
        }, txHash1, () => {
          cb()
        })
      } else {
        updateStatus(key, {
          'status': 0,
          'message': 'Error occurred while initiating transaction.'
        }, null, () => {
          cb()
        })
      }
    })
  } else if (BTC_BASED_COINS[toSymbol]) {
    BTCHelper.transfer(toAddr, value, toSymbol, (txHash1) => {
      let err = txHash1 ? false : true;
      if (!err && txHash1) {
        updateStatus(key, {
          'status': 1,
          'message': 'Transaction is initiated successfully.',
        }, txHash1, () => {
          cb()
        })
      } else {
        updateStatus(key, {
          'status': 0,
          'message': 'Error occurred while initiating transaction.'
        }, null, () => {
          cb()
        })
      }
    })
  }
}

const checkTx = (swaps, cb) => {
  each(swaps, (swap, iterate) => {
    let fromSymbol = swap['from_symbol'];
    let toSymbol = swap['to_symbol'];
    let txHash0 = swap['tx_hash_0'];
    try {
      if (ETHEREUM_BASED_COINS.includes(fromSymbol)) {
        isValidEthereumSwap(txHash0, (err, details) => {
          if (!err) {
            let toAddr = details.fromAddr;
            let value = details.tokenValue;
            let fromToken = details.token;
            let toToken = tokens.getToken(toSymbol)
            tokens.exchange(fromToken, toToken, value, (val) => {
              value = val
              if (BTC_BASED_COINS[toSymbol]) {
                toAddr = swap['to_address']
              }
              transfer(txHash0, toAddr, value, toSymbol, () => {
                console.log('swapped ERC')
                iterate()
              })
            })
          } else {
            updateStatus(txHash0, err, null, () => {
              iterate()
            })
          }
        })
      } else if (BTC_BASED_COINS[fromSymbol]) {
        let fromAddr = swap['from_address'];
        let toAddr = swap['to_address'];
        let fromToken = tokens.getToken(fromSymbol)
        let toToken = tokens.getToken(toSymbol)
        BTCHelper.getBalance(fromAddr, fromSymbol, (val) => {
          if (val && val > 0) {
            tokens.exchange(fromToken, toToken, val, (value) => {
              transfer(fromAddr, toAddr, value, toSymbol, () => {
                console.log('swapped BTC')
                iterate()
              })
            })
          } else {
            iterate()
          }
        })
      }
    } catch (error) {
      console.log(error)
      iterate()
    }
  }, () => {
    cb()
  })
}

export const swaps = (data) => {
  if (data.message === 'start') {

    scheduleJob('0 * * * * *', () => {
      waterfall([
        (next) => {
          next()
        }, (next) => {
          Swap.find({ status: 0 }, (err, swaps) => {
            checkTx(swaps, () => {
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