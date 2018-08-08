

import { sendError } from './authentication.action';
import { B_URL } from './../Constants/constants';
import { GET_ETH_BALANCE, GET_AVAIL_BALANCE, GET_SENT_BALANCE } from './../Constants/action.names';
import axios from 'axios';
const config = require('./../Constants/config');
var TOKEN_BALANCE_URL;
var ETH_BALANCE_URL;
var SENT_BALANCE_URL;

export function getTokenBalance(contract, addr, decimals, cb) {
  try {
    if (localStorage.getItem('config') === 'TEST')
      TOKEN_BALANCE_URL = config.test.balanceUrl
    else
      TOKEN_BALANCE_URL = config.main.balanceUrl
    fetch(TOKEN_BALANCE_URL + contract + "&address=" + addr, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-type': 'application/json',
      }
    }).then(function (response) {
      response.json().then(function (response) {
        if (response.status === '1') {
          var balance = response['result'] / (10 ** (decimals));
          cb(null, balance);
        } else cb({ message: 'Error occurred while getting balance.' }, null);
      });
    });
  } catch (Err) {
    sendError(Err);
  }
}

export function getAvailableTokens() {
  try {
    let request = axios({
      url: B_URL + '/swaps/available',
      method: 'GET'
    })

    return {
      type: GET_AVAIL_BALANCE,
      payload: request
    }
  } catch (Err) {
    sendError(Err);
  }
}

export function getSentValue(toAddr, value, cb) {
  try {
    fetch(B_URL + '/tokens/sents?to_addr=' + toAddr + '&value=' + value, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-type': 'application/json',
      }
    }).then(function (response) {
      response.json().then(function (resp) {
        if (resp.success === true) {
          var sents = resp['sents'] / (10 ** 8);
          cb(null, sents);
        } else cb({ message: 'Error occurred while getting balance.' }, null);
      });
    });
  } catch (Err) {
    sendError(Err);
  }
}

export function getEthBalance(data) {
  try {
    if (localStorage.getItem('config') === 'TEST')
      ETH_BALANCE_URL = config.test.ethBalanceUrl;
    else
      ETH_BALANCE_URL = config.main.ethBalanceUrl;

    let request = axios({
      url: ETH_BALANCE_URL + data,
      method: 'GET',
    })

    return {
      type: GET_ETH_BALANCE,
      payload: request
    }
  } catch (Err) {
    sendError(Err);
  }
}

export function getSentBalance(data) {
  try {
    if (localStorage.getItem('config') === 'TEST')
      SENT_BALANCE_URL = config.test.sentBalanceUrl
    else
      SENT_BALANCE_URL = config.main.sentBalanceUrl

    let request = axios({
      url: SENT_BALANCE_URL + data,
      method: 'GET',
    })

    return {
      type: GET_SENT_BALANCE,
      payload: request
    }
  } catch (Err) {
    sendError(Err);
  }
}

