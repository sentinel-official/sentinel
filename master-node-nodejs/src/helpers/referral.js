import axios from "axios";
import {
  REFERRAL_URL
} from "../config/referral";

const addSession = (deviceId, sessionId, txHash = null, cb) => {
  try {
    let body = {
      'deviceId': deviceId,
      'session': {
        'sessionId': sessionId
      }
    }
    if (txHash) {
      body['session']['paymentTxHash'] = txHash
    }
    let url = `https://${REFERRAL_URL}/session`
    axios.post(url, body, {
      timeout: 10
    }).then((resp) => {
      resp = resp.data
      cb(null, resp['success'])
    })
  } catch (error) {
    cb(error, null)
  }
}

export {
  addSession
}
