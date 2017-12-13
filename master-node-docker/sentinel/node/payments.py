import falcon
import json
import time
from ..db import db
from ..helpers import eth_helper


def get_client_address(account_addr):
    connection = db.connections.find_one({'server_addr': account_addr})
    return connection['client_addr']


def calculate_amount(used_bytes):
    return used_bytes / (1024.0 * 1024.0)


class AddVpnUsage(object):
    def on_post(self, req, resp):
        account_addr = str(req.body['account_addr'])
        keystore = str(req.body['keystore'])
        password = str(req.body['password'])
        to_addr = get_client_address(account_addr)
        used_bytes = int(req.body['used_bytes'])
        amount = int(calculate_amount(used_bytes))
        timestamp = int(time.time())

        error, tx_hash = eth_helper.add_vpn_usage(
            account_addr, to_addr, used_bytes, amount,
            timestamp, keystore, password)

        if error is None:
            message = {
                'success': True,
                'tx_hash': tx_hash,
                'message': 'Added VPN usage data successfully.'
            }
        else:
            message = {
                'success': False,
                'error': error,
                'message': 'Error occurred while adding VPN usage data.'
            }
        resp.status = falcon.HTTP_200
        resp.body = json.dumps(message)
