import { sendError } from "./authentication.action";
import axios from 'axios';
// import { axiosInstance as axios }  from '../Actions/AxiosGlobalConfig';
import * as sendComponentTypes from '../Constants/sendcomponent.types';
import { B_URL } from '../Constants/constants';

export async function payVPNUsage(data) {
  console.log('post data ', data)
  let BS_URL = localStorage.getItem('B_URL');
  let response = await axios.post(BS_URL + '/client/vpn/pay', data);
  console.log('vpn usage', response)
  if (response.status === 200) {
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
            payload: JSON.parse(response.data.errors[0].error.split("'").join('"')).message || 'Something went wrong',
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
          payload: 'Something went wrong'
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
  let BS_URL = localStorage.getItem('B_URL');
  // console.log('in transferamt', JSON.stringify(data1), BS_URL, typeof (BS_URL))
  try {
    let response = await axios.post(BS_URL + '/client/raw-transaction', data1);
    console.log('in trnsfer amt respose', response);
    if (response.status === 200) {
      if (response.data.success === true) {
        return {
          type: sendComponentTypes.TX_SUCCESS,
          payload: response.data.tx_hash
        }
      } else {
        sendError(response.data.error);
        return {
          type: sendComponentTypes.TX_FAILURE,
          payload: JSON.parse(response.data.error.error.split("'").join('"')).message || 'Error occurred while initiating transfer amount.'
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
    return {
      type: sendComponentTypes.TX_ERROR,
      payload: 'Internal Server Error'
    }
  }
}