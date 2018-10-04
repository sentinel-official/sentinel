# coding=utf-8
import requests

from ..config import REFERRAL_URL
from ..db import db


def add_bonus(device_id):
    try:
        url = '{}/accounts/{}/bonuses'.format(REFERRAL_URL, device_id)
        res = requests.post(url, timeout=15)
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
    return list(usage) if usage else []
