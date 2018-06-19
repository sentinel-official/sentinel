import request from 'request'
import _ from 'lodash'
import async from 'async'

import { DECIMALS } from '../utils/config'
import { TOKENS } from '../token_config'

function Tokens() {
  this.prices = {}
}

Tokens.prototype.getToken = function (address = null, name = null) {
  let Token = [];

  if (address) {
    TOKENS.map((token) => {
      if (token['address'] === address) {
        Token.push(token);
      }
    })
  } else if (name) {
    TOKENS.map((token) => {
      if (token['name'] === name) {
        Token.push(token);
      }
    })
  }
  if (Token && Token.length > 0)
    return Token[0]
  return null
}

Tokens.prototype.getUsdPrice = function (token, cb) {
  let usdPrice = null;
  let that = this;
  usdPrice = that.prices[token['name']] || null;
  try {
    request(token['price_url'], (error, response, body) => {
      let data = JSON.parse(body)
      usdPrice = parseFloat(data[0]['price_usd']);
      that.prices[token['name']] = usdPrice;
      cb(usdPrice);
    })
  } catch (error) {
    cb(usdPrice);
  }
}

Tokens.prototype.calculateSents = function (token, value, cb) {
  let sentUsd = null;
  let tokenUsd = null;
  let that = this;
  let sents = null;
  let name = null;

  value = value / (1.0 * Math.pow(10, token['decimals']))

  async.waterfall([
    (next) => {
      name = that.getToken(null, 'SENTinel')
      next()
    }, (next) => {
      that.getUsdPrice(name, (resp) => {
        sentUsd = resp;
        next()
      })
    }, (next) => {
      that.getUsdPrice(token, (resp) => {
        tokenUsd = resp
        next()
      })
    }, (next) => {
      sents = tokenUsd / sentUsd;
      sents = parseInt((sents * value) * DECIMALS);
      next();
    }
  ], (err, resp) => {
    console.log('sents', sents)
    return cb(sents)
  })
}

module.exports.tokens = new Tokens()