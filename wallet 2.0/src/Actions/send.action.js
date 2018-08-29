import { sendError } from "./authentication.action";
import axios from 'axios';
import * as sendComponentTypes from '../Constants/sendcomponent.types';
import { B_URL } from '../Constants/constants';

export async function payVPNUsage(data) {
  console.log('post data ', data)
    let response = await axios.post(B_URL + '/client/vpn/pay', data, {
      'Accept': 'application/json',
      'Content-type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    });
    console.log('vpn usage', response)
    if (response.data.status === 200) {
      if (response.data.success) {
        return {
          type: sendComponentTypes.TX_SUCCESS,
          payload: response.data['tx_hashes'][0]
        }
      } else {
        sendError(response.data.errors);
        if (response.data.errors.length > 0) {
          if (response.data.errors[0].error) {
            return {
              type: sendComponentTypes.TX_FAILURE,
              payload: JSON.parse(response.data.errors[0].error.split("'").join('"')).message || 'Something went wrong in transaction',
            }
          } else {
            return {
              type: sendComponentTypes.TX_ERROR,
              payload: JSON.parse(response.errors[0].split("'").join('"')).error
                || 'Error occurred while initiating transfer amount.'
            }
          }
        } else {
          return {
            type: sendComponentTypes.TX_ERROR,
            payload: 'Something went wrong in transaction'
          }
        }
      }
    } else {
      return {
        type: sendComponentTypes.TX_ERROR,
        payload: response.message || 'Internal Server Error'
      }
    }
}

export async function transferAmount(net, data) {
  console.log('check types', typeof (net), typeof (data))
  let data1 = {
    tx_data: data,
    net: net
  }
  console.log('in transferamt', JSON.stringify(data1), B_URL, typeof (B_URL))
  try {
    let response = await axios.post(B_URL + '/client/raw-transaction', JSON.stringify(data1), {
      headers: {
        'Accept': 'application/json',
        'Content-type': 'application/json',
      }
    });
    if (response.status === 200) {
      if (response.data.success === true) {
        return {
          type: sendComponentTypes.TX_SUCCESS,
          payload: response.data.tx_hash
        }
      } else {
        sendError(response.error);
        return {
          type: sendComponentTypes.TX_FAILURE,
          payload: JSON.parse(response.error.error.split("'").join('"')).message || 'Error occurred while initiating transfer amount.'
        }
      }
    } else {
      return {
        type: sendComponentTypes.TX_ERROR,
        payload: response.message || 'Internal Server Error'
      }
    }
  } catch (Err) {
    sendError(Err);
  }
}