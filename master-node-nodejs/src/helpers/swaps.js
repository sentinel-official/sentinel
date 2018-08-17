import ltrim from "ltrim";
import zfill from "zfill";
import { waterfall } from "async";

import EthHelper from "./eth";
import { ADDRESS as SWAP_ADDRESS } from "../config/swaps";

import { tokens } from "./tokens";


export const isValidEthereumSwap = (txHash, cb) => {
  let receipt = null;
  let tx = null;
  let fromAddr = null;
  let toAddr = null;
  let txValue = null;
  let txInput = null;
  let token = null;
  let tokenValue = null;

  waterfall([
    (next) => {
      EthHelper.getTxReceipt(txHash, 'main', (err, txReceipt) => {
        if (!err && txReceipt) {
          receipt = txReceipt
          next()
        } else {
          next({
            status: 0,
            message: 'Can\'t find the transaction receipt.'
          })
        }
      })
    }, (next) => {
      if (receipt['status'] == 1) {
        EthHelper.getTx(txHash, 'main', (err, Tx) => {
          if (!err && Tx) {
            tx = Tx
            next()
          } else {
            next({
              'status': 0,
              'message': 'Can\'t find the transaction.'
            }, null)
          }
        })
      } else {
        next({
          status: -1,
          message: 'Failed transaction.'
        })
      }
    }, (next) => {
      fromAddr = tx['from'].toLowerCase()
      toAddr = tx['to'].toLowerCase()
      txValue = parseInt(tx['value'])
      txInput = tx['input']

      if (txValue > 0 && (txInput.length == 2 || parseInt(txInput, 16) == 0)) {
        if (toAddr == SWAP_ADDRESS) {
          next(null, {
            fromAddr: fromAddr,
            tokenValue: txValue,
            token: tokens.getToken('ETH')
          })
        } else {
          next({
            'status': -1,
            'message': 'To address is not Swap address.'
          }, null)
        }
      } else if (txValue == 0 && txInput.length == 138) {
        token = tokens.getToken(null, toAddr)
        if (token) {
          if (txInput.substring(0, 10) == '0xa9059cbb') {
            toAddr = txInput.substring(10, 74)
            toAddr = ('0x' + zfill(ltrim(toAddr, '0'), 40)).toLowerCase();
            tokenValue = parseInt('0x' + ltrim(txInput.substring(74, 138), '0'))
            if (toAddr == SWAP_ADDRESS) {
              next(null, {
                fromAddr: fromAddr,
                tokenValue: tokenValue,
                token: token
              })
            } else {
              next({
                'status': -1,
                'message': 'To address is not Swap address.'
              }, null)
            }
          } else {
            next({
              'status': -1,
              'message': 'Wrong transaction method.'
            }, null)
          }
        } else {
          next({
            'status': -1,
            'message': 'No token found.'
          }, null)
        }
      } else {
        next({
          'status': -1,
          'message': 'Not a valid transaction.'
        }, null)
      }
    }
  ], (err, resp) => {
    if (err) cb(err, null)
    else cb(null, resp)
  })
}