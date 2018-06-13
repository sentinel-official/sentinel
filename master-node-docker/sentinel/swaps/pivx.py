# coding=utf-8
import json
import time

import falcon

from ..db import db
from ..helpers import btc_helper
from ..helpers import tokens


class GetNewAddress(object):
    def on_post(self, req, resp):
        to_address = req.body['account_addr']
        from_token = tokens.get_token(str(req.body['from']))
        to_token = tokens.get_token(str(req.body['to']))

        from_address = btc_helper.get_new_address(from_token['symbol'])

        if from_address is not None:
            _ = db.btc_fork_swaps.insert_one({
                'from_symbol': from_token['symbol'],
                'to_symbol': to_token['symbol'],
                'from_address': from_address,
                'to_address': to_address,
                'time_0': int(time.time()),
                'status': 0
            })
            message = {
                'success': True,
                'address': from_address
            }
        else:
            message = {
                'success': False,
                'message': 'Error occurred while getting {} address.'.format(from_address['symbol'])
            }

        resp.status = falcon.HTTP_200
        resp.body = json.dumps(message)
