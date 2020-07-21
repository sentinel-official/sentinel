# coding=utf-8
import json

import falcon

from ..db import db


class Token(object):
    def on_post(self, req, res):
        account_addr = str(req.body['account_addr']).lower()
        token = str(req.body['token'])
        _ = db.clients.update({
            'account_addr': account_addr,
        }, {
            '$set': {
                'token': token,
                'status': 'session added'
            }
        }, upsert=True)
        message = {
            'success': True
        }

        res.status = falcon.HTTP_200
        res.body = json.dumps(message)
