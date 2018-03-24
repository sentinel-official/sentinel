# coding=utf-8
import json
import time

import falcon

from ..db import db
from ..logs import logger


class UpdateNodeInfo(object):
    def on_post(self, req, resp):
        token = req.body['token']
        account_addr = req.body['account_addr']
        info = req.body['info']

        node = None

        if info['type'] == 'location':
            location = info['location']
            node = db.nodes.find_one_and_update({
                'account_addr': account_addr,
                'token': token
            }, {
                '$set': {
                    'location': location
                }
            })
        elif info['type'] == 'net_speed':
            net_speed = info['net_speed']
            node = db.nodes.find_one_and_update({
                'account_addr': account_addr,
                'token': token
            }, {
                '$set': {
                    'net_speed': net_speed
                }
            })
        elif info['type'] == 'vpn':
            init_time = int(time.time())
            node = db.nodes.find_one_and_update({
                'account_addr': account_addr,
                'token': token
            }, {
                '$set': {
                    'vpn.status': 'up',
                    'vpn.init_time': init_time,
                    'vpn.last_ping': init_time
                }
            })
        elif info['type'] == 'alive':
            last_ping = int(time.time())
            node = db.nodes.find_one_and_update({
                'account_addr': account_addr,
                'token': token
            }, {
                '$set': {
                    'vpn.status': 'up',
                    'vpn.last_ping': last_ping
                }
            })

        if node is None:
            message = {
                'success': False,
                'message': 'Node is not registered.'
            }
            try:
                raise Exception('Node is not registered.')
            except Exception as _:
                logger.send_log(message, resp)
        else:
            message = {
                'success': True,
                'message': 'Node info updated successfully.'
            }
            resp.status = falcon.HTTP_200
            resp.body = json.dumps(message)
