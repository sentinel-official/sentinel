import axios from "axios";
import { BTC_BASED_COINS } from "../config/swaps";

class BTC_Helper {
  constructor(coins) {
    this.coins = coins;
  }
  getNewAddress(symbol, cb) {
    let server = this.coins[symbol];
    let url = `${server['ip']}/address`;
    axios.get(url)
      .then((resp) => {
        resp = resp.data;
        if (resp['success'])
          cb(resp['address']);
        else
          cb(null);
      })
      .catch((error) => {
        console.log('error');
        cb(null);
      });
  }
  getBalance(address, symbol, cb) {
    let server = this.coins[symbol];
    let url = `${server['ip']}/balance?address=${address}`;
    axios.get(url)
      .then((resp) => {
        resp = resp.data;
        if (resp['success'])
          cb(resp['balance']);
        else
          cb(null);
      })
      .catch((error) => {
        console.log('error');
        cb(null);
      });
  }
  transfer(toAddress, value, symbol, cb) {
    let server = this.coins[symbol];
    let url = `${server['ip']}/transfer`;
    axios.post(url, {
      'toAddress': toAddress,
      'value': value
    }).then((resp) => {
      resp = resp.data;
      if (resp['success'])
        cb(resp['txHash']);
      else
        cb(null);
    }).catch((error) => {
      console.log('error');
      cb(null);
    });
  }
}

export const BTCHelper = new BTC_Helper(BTC_BASED_COINS);