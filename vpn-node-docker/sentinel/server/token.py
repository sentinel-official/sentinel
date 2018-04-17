# coding=utf-8
import json

import falcon
import redis


class Token(object):
    def on_post(self, req, res):
        account_addr = str(req.body['account_addr']).lower()
        token = str(req.body['token'])

        rs = redis.Redis()
        rs.set(account_addr, token)
        message = {
            'success': True
        }

        res.status = falcon.HTTP_200
        res.body = json.dumps(message)
