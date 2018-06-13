# coding=utf-8
import json

import falcon

from ..db import db


class SwapStatus(object):
    def on_get(self, req, resp):
        key = str(req.get_param('key'))

        if len(key) == 66:
            find_key = {'tx_hash_0': key}
        elif len(key) == 34:
            find_key = {'address': key}

        result = db.swaps.find_one(find_key, {
            '_id': 0
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
