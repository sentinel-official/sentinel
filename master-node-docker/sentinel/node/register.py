# coding=utf-8
import json
from uuid import uuid4

import falcon

from ..db import db


class RegisterNode(object):
    def on_post(self, req, resp):
        account_addr = req.body['account_addr']
        ip = req.body['ip']
        location = req.body['location']
        net_speed = req.body['net_speed']
        token = uuid4().hex

        node = db.nodes.find_one({
            'account_addr': account_addr
        })
        if node is None:
            _ = db.nodes.insert_one({
                'account_addr': account_addr,
                'token': token,
                'location': location,
                'ip': ip,
                'net_speed': net_speed
            })
        else:
            _ = db.nodes.find_one_and_update({
                'account_addr': account_addr
            }, {
                '$set': {
                    'token': token,
                    'location': location,
                    'ip': ip,
                    'net_speed': net_speed
                }
            })
        message = {
            'success': True,
            'token': token,
            'message': 'Node registered successfully.'
        }
        resp.status = falcon.HTTP_200
        resp.body = json.dumps(message)
