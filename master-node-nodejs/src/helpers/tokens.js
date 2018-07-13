import request from 'request'
import axios from 'axios';
import _ from 'lodash'
import async from 'async'
import { FEE_PERCENTAGE, TOKENS } from '../config/swaps';
import { DECIMALS } from '../config/vars';

class Tokens {
  constructor() {
    this.tokens = {};
    for (let i = 0; i < TOKENS.length; i++)
      this.tokens[TOKENS[i].symbol] = TOKENS[i];
  }
  getToken(symbol = null, address = null) {
    if (symbol) {
      return this.tokens[symbol];
    }
    else if (address) {
      let keys = Object.keys(this.tokens);
      for (let i = 0; i < keys.length; i++) {
        let token = this.tokens[keys[i]];
        if (token['address'] === address)
          return token;
      }
    }
    else {
      return null;
    }
  }
  getPrice(token, cb) {
    let price = null;
    axios.get(token['price_url'])
      .then((res) => {
        cb(parseFloat(res.data[0]['price_btc']));
      })
      .catch((err) => {
        console.log('err', err);
      });
  }
  
  exchange(fromToken, toToken, value, serviceCharge, cb) {
    value = value / (1.0 * (Math.pow(10, fromToken['decimals'])));
    let self = this;
    let fromPrice = null;
    let toPrice = null;
    async.waterfall([
      (next) => {
        self.getPrice(fromToken, (price) => {
          fromPrice = price;
          next();
        });
      }, (next) => {
        self.getPrice(toToken, (price) => {
          toPrice = price;
          next();
        });
      }
    ], (err, resp) => {
      value = value * (fromPrice / toPrice) * (1.0 - (serviceCharge * 0.01));
      value = value * Math.pow(10, toToken['decimals']);
      cb(value);
    });
  }
}

export const tokens = new Tokens();