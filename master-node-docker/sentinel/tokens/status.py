# coding=utf-8
import json

import falcon

from ..db import db


class SwapStatus(object):
    def on_get(self, req, resp):
        tx_hash = str(req.get_param('tx_hash'))

        result = db.token_swaps.find_one({
            'tx_hash_0': tx_hash
        }, {
            '_id': 0,
            'tx_data': 0,
            'tx_hash_0': 0,
            'time_0': 0
        })
        if result is None:
            message = {
                'success': False,
                'message': 'No transaction found.'
            }
        else:
            message = {
                'success': True,
                'result': result
            }

        resp.status = falcon.HTTP_200
        resp.body = json.dumps(message)
