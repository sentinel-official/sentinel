# coding=utf-8
import json
import time
from uuid import uuid4

import falcon

from ..db import db


class RegisterMixerNode(object):
    def on_post(self, req, resp):
        account_addr = str(req.body['account_addr']).lower()
        ip = str(req.body['ip'])
        service_charge = float(req.body['service_charge'])
        joined_on = int(time.time())
        token = uuid4().hex

        node = db.mixer_nodes.find_one({
            'account_addr': account_addr
        })
        if node is None:
            _ = db.mixer_nodes.insert_one({
                'account_addr': account_addr,
                'token': token,
                'ip': ip,
                'service_charge': service_charge,
                'joined_on': joined_on
            })
        else:
            _ = db.mixer_nodes.find_one_and_update({
                'account_addr': account_addr
            }, {
                '$set': {
                    'token': token,
                    'ip': ip,
                    'service_charge': service_charge
                }
            })
        message = {
            'success': True,
            'token': token,
            'message': 'Node registered successfully.'
        }

        resp.status = falcon.HTTP_200
        resp.body = json.dumps(message)


class DeRegisterMixerNode(object):
    def on_post(self, req, resp):
        account_addr = str(req.body['account_addr']).lower()
        token = req.body['token']

        node = db.mixer_nodes.find_one_and_delete({
            'account_addr': account_addr,
            'token': token
        })

        if node is None:
            message = {
                'success': False,
                'message': 'Node is not registered.'
            }
        else:
            message = {
                'success': True,
                'message': 'Node deregistred successfully.'
            }

        resp.status = falcon.HTTP_200
        resp.body = json.dumps(message)
