import async from 'async'
import { tokens } from '../helpers/tokens'
import ETHHelper from '../helpers/eth'
import { ADDRESS as SWAP_ADDRESS, TOKENS, FEE_PERCENTAGE } from '../config/swaps';
import { DECIMALS } from '../config/vars';
import { BTCHelper } from '../helpers/btc'
import { Swap } from '../models';
import database from '../db/database';

const getAvailableTokens = (req, res) => {
  let dailyCount = [];
  let token = JSON.parse(JSON.stringify(TOKENS));

  async.eachSeries(token, (item, next) => {
    delete item.price_url
    next()
  }, () => {
    res.status(200).send({
      'success': true,
      'tokens': token,
    })
  })
}

const tokenSwapRawTransaction = (req, res) => {

  let txData = req.body['tx_data'];
  let toAddr = req.body['account_addr'];
  let fromToken = tokens.getToken(req.body['from'])
  let toToken = tokens.getToken(req.body['to'])
  let value = 0 // parseInt(req.query['value']);
  // value = tokens.exchange(fromToken, toToken, value)
  // value = value * (1.0*(Math.pow(10, toToken['decimals'])))
  let balance = 1// ETHHelper.rawTransaction(txData, 'main')
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
      /* ETHHelper.getBalances(SWAP_ADDRESS, (err, availSents) => {
        console.log('requested sents', availSents, err, '----------------------------------------------------------------------------')
        availableSents = availSents
        next()
      }) */
      next()
    }, (next) => {
      // if (availableSents['main']['sents'] >= (requestedSents * DECIMALS)) {
      if (balance >= value) {
        ETHHelper.rawTransaction(txData, 'main', (err, txHash) => {
          if (!err) {
            let data = {
              'from_symbol': fromToken['symbol'],
              'to_symbol': toToken['symbol'],
              'from_address': SWAP_ADDRESS,
              'to_address': toAddr,
              'tx_hash_0': txHash,
              'time_0': parseInt(Date.now() / 1000),
              'status': 0
            }

            let swapData = new Swap(data);
            database.insert(swapData, (err, resp) => {
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
          'message': 'No enough coins in the Central wallet.'
        }, null)
      }
    }
  ], (err, resp) => {
    if (err) res.status(400).send(err);
    else res.status(200).send(resp)
  })
}

const getExchangeValue = (req, res) => {
  let fromToken = tokens.getToken(req.query['from']);
  let toToken = tokens.getToken(req.query['to']);
  let value = parseFloat(req.query['value']);
  let message = {}

  if (!fromToken && !toToken) {
    message.success = false;
    message.message = 'From token OR To token is not found.'
    res.status(400).send(message)
  } else {
    tokens.exchange(fromToken, toToken, value, FEE_PERCENTAGE, (value) => {
      message.success = true;
      message.value = value;
      res.status(200).send(message)
    })
  }
}

const swapStatus = (req, res) => {
  let key = req.query['key'];
  let findObj = null;

  if (key.length == 66)
    findObj = { 'tx_hash_0': key }
  else if (key.length == 34)
    findObj = { 'from_address': key }

  Swap.findOne(findObj, { _id: 0 }, (err, result) => {
    if (!result) {
      res.status(400).send({
        'success': false,
        'message': 'No transaction found.'
      })
    } else {
      res.status(200).send({
        'success': true,
        'result': result
      })
    }
  })
}

const getNewAddress = (req, res) => {
  let toAddress = req.body['account_addr']
  let fromToken = tokens.getToken(req.body['from'])
  let toToken = tokens.getToken(req.body['to'])

  BTCHelper.getNewAddress(fromToken['symbol'], (fromAddress) => {
    if (fromAddress) {
      let data = {
        'from_symbol': fromToken['symbol'],
        'to_symbol': toToken['symbol'],
        'from_address': fromAddress,
        'to_address': toAddress,
        'time_0': Date.now() / 1000,
        'status': 0
      }

      let swapData = new Swap(data)

      database.insert(swapData, (err, resp) => {
        if (err) {
          res.status(400).send({
            'success': false,
            'err': err
          })
        } else if (!result) {
          res.status(400).send({
            'success': false,
            'message': 'No transaction found.'
          })
        } else {
          res.status(200).send({
            'success': true,
            'result': resp
          })
        }
      })
    } else {
      res.status(400).send({
        'success': false,
        'message': `Error occurred while getting ${fromAddress['symbol']} address.`
      })
    }
  })
}

export default {
  getAvailableTokens,
  tokenSwapRawTransaction,
  getExchangeValue,
  swapStatus,
  getNewAddress
}