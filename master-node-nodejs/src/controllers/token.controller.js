import async from 'async'

import { TOKENS } from '../token_config'
import { tokens } from '../helpers/tokens'
import { CENTRAL_WALLET, DECIMALS } from '../utils/config'
import * as ETHHelper from '../helpers/eth'

export const getAvailableTokens = (req, res) => {
  let dailyCount = [];
  let token = [];
  token = Object.assign([], TOKENS)

  async.eachSeries(token, (item, next) => {
    delete item.price_url
    next()
  }, () => {
    res.status = 200;
    res.send({
      'success': true,
      'tokens': token,
    })
  })
}

export const getSents = (req, res) => {
  let toAddr = req.query['to_addr'];
  toAddr = toAddr.toString();
  let value = req.query['value'];
  let token = tokens.getToken(toAddr);

  if (token) {
    tokens.calculateSents(token, value, (sents) => {
      res.send({
        'success': true,
        'sents': sents
      })
    })
  } else {
    res.send({
      'success': false,
      'message': 'No token found.'
    })
  }
}

export const tokenSwapRawTransaction = (req, res) => {

  let txData = req.body['tx_data'];
  let toAddr = req.query['to_addr'];
  let value = parseInt(req.query['value']);
  let token = tokens.getToken(toAddr);
  let requestedSents = 0;
  let availableSents = 1;

  console.log('req.body in token swaps', req.body, txData, toAddr, '--------------------------------------------------------------------------------------------');

  async.waterfall([
    (next) => {
      /* tokens.calculateSents(token, value, (reqSents) => {
        console.log('requested sents', reqSents)
        requestedSents = reqSents;
        next()
      }) */
      next()
    }, (next) => {
      /* ETHHelper.getBalances(CENTRAL_WALLET, (err, availSents) => {
        console.log('requested sents', availSents, err, '----------------------------------------------------------------------------')
        availableSents = availSents
        next()
      }) */
      next()
    }, (next) => {
      // if (availableSents['main']['sents'] >= (requestedSents * DECIMALS)) {
      if (availableSents >= requestedSents) {
        ETHHelper.rawTransaction(txData, 'main', (err, txHash) => {
          if (!err) {
            global.db.collection('token_swaps').insertOne({
              'txData': txData,
              'txHash_0': txHash,
              'status': 0,
              'time_0': parseInt(Date.now() / 1000)
            }, (err, resp) => {
              if (err) next(err, null);
              else next(null, {
                'success': true,
                'txHash': txHash,
                'message': 'Transaction initiated successfully.'
              })
            })
          } else {
            next({
              'success': false,
              'error': err,
              'message': 'Error occurred while initiating the transaction.'
            }, null)
          }
        })
      } else {
        next({
          'success': false,
          'message': 'No enough SENTs in the Central wallet.'
        }, null)
      }
    }
  ], (err, resp) => {
    if (err) res.send(err);
    else res.send(resp)
  })
}