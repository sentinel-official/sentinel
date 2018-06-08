# coding=utf-8
import json
import time

import falcon

from ..db import db
from ..helpers import pivx


class GetNewAddress(object):
    def on_post(self, req, resp):
        account_addr = req.body['account_addr']
        coin_name = req.body['coin_name']
        address = None

        if coin_name == 'PIVX':
            address = pivx.get_new_address()

        if address is not None:
            _ = db.btc_fork_swaps.insert_one({
                'eth_address': account_addr,
                'address': address,
                'coin_name': coin_name,
                'status': 0,
                'time_0': int(time.time())
            })
            message = {
                'success': True,
                'address': address
            }
        else:
            message = {
                'success': False,
                'message': 'Error occurred while getting {} address.'.format(coin_name)
            }

        resp.status = falcon.HTTP_200
        resp.body = json.dumps(message)
