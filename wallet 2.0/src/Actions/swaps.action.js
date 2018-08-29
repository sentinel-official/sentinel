
import * as types from './../Constants/action.names';
import { sendError } from './authentication.action';
import { B_URL } from './../Constants/constants';
import { GET_ETH_BALANCE, GET_AVAIL_BALANCE, GET_SENT_BALANCE } from './../Constants/action.names';
import axios from 'axios';
const config = require('./../Constants/config');
var TOKEN_BALANCE_URL;

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

export async function getAvailableTokens() {
  try {
    let request = await axios({
      url: B_URL + '/swaps/available',
      method: 'GET'
    })

    console.log(request);

    return {
      type: GET_AVAIL_BALANCE,
      payload: request
    }
  } catch (Err) {
    sendError(Err);
  }
}

export async function getSentValue(from, to, value, decimals) {
  try {
    let response = await axios({
      url: B_URL + '/swaps/exchange?from=' + from + '&to=' + to + '&value=' + value,
      method: 'GET',
      headers: {
        'Authorization': localStorage.getItem('access_token')
      }
    })

    return {
      type: types.GET_SENT_VALUE,
      payload: response
    }

  } catch (Err) {
    sendError(Err);
  }
}


