# coding=utf-8
import requests

from ..config import REFERRAL_URL
from ..db import db


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
        url = '{}/session'.format(REFERRAL_URL)
        res = requests.post(url, json=body, timeout=10)
        res = res.json()
        return None, res['success']
    except Exception as error:
        return error, None


def get_vpn_sessions(device_id):
    usage = db.ref_sessions.find({
        'device_id': device_id
    }, {
        '_id': 0,
        'session_id': 0,
        'to_addr': 0,
    })
    return usage if usage and len(usage) else []
