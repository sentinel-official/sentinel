# coding=utf-8
import json
import time

import falcon

from ..db import db


class UpdateMixerNodeInfo(object):
    def on_post(self, req, resp):
        token = str(req.body['token'])
        account_addr = str(req.body['account_addr']).lower()
        info = req.body['info']

        node = None

        if info['type'] == 'mixer':
            init_on = int(time.time())
            node = db.mixer_nodes.find_one_and_update({
                'account_addr': account_addr,
                'token': token
            }, {
                '$set': {
                    'mixer.status': 'up',
                    'mixer.init_on': init_on,
                    'mixer.ping_on': init_on
                }
            })
        elif info['type'] == 'alive':
            ping_on = int(time.time())
            node = db.mixer_nodes.find_one_and_update({
                'account_addr': account_addr,
                'token': token
            }, {
                '$set': {
                    'mixer.status': 'up',
                    'mixer.ping_on': ping_on
                }
            })

        if node is None:
            message = {
                'success': False,
                'message': 'Node is not registered.'
            }
        else:
            message = {
                'success': True,
                'message': 'Node info updated successfully.'
            }

        resp.status = falcon.HTTP_200
        resp.body = json.dumps(message)
