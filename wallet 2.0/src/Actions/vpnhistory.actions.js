import config from '../Constants/config';
import axios from 'axios';
import { sendError } from './authentication.action';
import { B_URL } from './../Constants/constants';
import * as types from './../Constants/action.names';
import * as routes from './../Constants/api.routes';
import _ from 'lodash';
let zfill = require('zfill');
export const setsnackMessage = (message) => {
  if(message)
  {
  return {
    type: types.SNACK_INPUTS,
    payload: { status: true, message: message }
  }
}
else{
  return {
    type: types.SNACK_INPUTS,
    payload: { status: false, message: message }
  }
  }
}
export async function getVpnHistory(account_addr) {
  try {
    let data = JSON.stringify({
      account_addr: account_addr,
    })
    let response = await axios.post(B_URL + '/client/vpn/usage', data, {
      headers: {
        'Accept': 'application/json',
        'Content-type': 'application/json'
      }
    });
    if (response.data.success === true) {
      return {
        type: types.GET_VPN_HISTORY,
        payload: response.data['usage']
      }
    }
    else {
      return {
        type: types.GET_VPN_HISTORY,
        payload: null
      }
    }
  }
  catch (Err) {
    sendError(Err);
  }

}
export async function getSentTransactionHistory(account_addr, isTest, cb) {
  try {
    let SENT_TRANSC_URL1 = isTest ? config.test.sentTransUrl1 : config.main.sentTransUrl1;
    let response = await axios.get(SENT_TRANSC_URL1 + account_addr + routes.SENT_TRANSC_URL2 + account_addr, {
      headers: {
        'Accept': 'application/json',
        'Content-type': 'application/json'
      }
    });
    if (response.data.status === '1') {
      var history = response.data['result'];
      cb(null, history);
    }
    else {
      cb({ message: 'Error occurred while getting transaction history.' }, null);
    }
  }
  catch (Err) {
    sendError(Err);
  }
}
export const compareTransaction = (sessionData, txhash, account_addr, isTest, cb) => {
  var txId = txhash;
  getSentTransactionHistory('0x' + zfill(account_addr.substring(2), 64), isTest, (err, history) => {
    if (err) {
      cb(null, 'Problem faced in reporting. Try again later')
    }
    else {
      var data = _.sortBy(history, o => o.timeStamp).reverse()
      var transactionDetails = data.find(o => o.transactionHash === txhash)
      if (transactionDetails === undefined) {
        cb(null, 'No transaction found with that transaction Id')
      } else {
        var transacToAddr = '0x' + transactionDetails.topics[2].substring(26);
        var transacFrom = '0x' + transactionDetails.topics[1].substring(26);
        if (transacFrom.toLowerCase() === account_addr.toLowerCase() &&
          transacToAddr.toLowerCase() === sessionData.account_addr.toLowerCase() &&
          (parseInt(transactionDetails.data) === parseInt(sessionData.amount) ||
            (parseInt(transactionDetails.data) + 1) === parseInt(sessionData.amount)) &&
          parseInt(transactionDetails.timeStamp) >= sessionData.timestamp
        ) {
          let body = {
            from_addr: account_addr,
            amount: sessionData.amount,
            session_id: sessionData.id
          }
          reportPayment(body, function (err, tx_addr) {
            if (err) {
              cb(null, 'Problem faced in reporting. Try again later')
            }
            else {
              cb(null, 'Reported Successfully')
            }
          })
        } else {
          cb(null, 'Not a valid transaction hash')
        }
      }
    }
  })
}

export function reportPayment(data, cb) {
  try {
    fetch(B_URL + '/client/vpn/report', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify(data)
    }).then(function (response) {
      if (response.status === 200) {
        response.json().then(function (response) {
          if (response.success === true) {
            var tx_hash = response['tx_hash'];
            cb(null, tx_hash);
          }
          else {
            sendError(response.error);
            cb({ message: JSON.parse(response.error.error.split("'").join('"')).message || 'Transaction Failed' }, null);
          }
        })
      }
      else {
        cb({ message: response.message || 'Internal Server Error' }, null);
      }
    });
  } catch (Err) {
    sendError(Err);
    cb('yes', null);
  }
}
export const setVPNDuePayment = (sessionData) => {
  return {
    type: types.VPN_DUE_PAYMENT,
    payload: {
      isVPNPayment: true,
      data: sessionData
    }
  }
}