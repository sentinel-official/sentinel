# coding=utf-8
import requests

from ..config import REFERRAL_URL


def add_session(device_id, session_id, tx_hash=None):
    try:
        body = {
            'deviceId': device_id,
            'session': {
                'sessionId': session_id
            }
        }
        if tx_hash:
            body['session']['paymentTxHash'] = tx_hash
        url = 'https://{}/session'.format(REFERRAL_URL)
        res = requests.post(url, json=body, timeout=10)
        res = res.json()
        return None, res['success']
    except Exception as error:
        return error, None
