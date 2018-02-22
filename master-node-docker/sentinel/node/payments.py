import falcon
import json
import time
from ..db import db
from ..config import DECIMALS
from ..helpers import eth_helper


def get_client_address(account_addr):
    connection = db.connections.find_one({'server_addr': account_addr})
    return connection['client_addr']


def calculate_amount(used_bytes):
    return (used_bytes / (1024.0 * 1024.0 * 1024.0)) * 100.0


class AddVpnUsage(object):
    def on_post(self, req, resp):
        from_addr = str(req.body['from_addr'])
        to_addr = get_client_address(from_addr)
        sent_bytes = int(req.body['sent_bytes'])
        session_duration = int(req.body['session_duration'])
        amount = int(calculate_amount(sent_bytes) * DECIMALS)
        timestamp = int(time.time())

        if sent_bytes < (10 * 1024 * 1024):
            message = {
                'success': False,
                'error': 'Usage is less than 10 MB. So data is not added',
                'message': 'Usage is less than 10 MB. So data is not added'
            }
        else:
            error, tx_hash = eth_helper.add_vpn_usage(
                from_addr, to_addr, sent_bytes, session_duration, amount, timestamp)

            if error is None:
                message = {
                    'success': True,
                    'tx_hash': tx_hash,
                    'message': 'VPN usage data will be added soon.'
                }
            else:
                message = {
                    'success': False,
                    'error': error,
                    'message': 'Error occurred while adding the VPN usage data.'
                }

        resp.status = falcon.HTTP_200
        resp.body = json.dumps(message)
