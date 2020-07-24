# coding=utf-8
import json
import time
from _thread import start_new_thread

import falcon

from ..db import db
from ..vpn import add_secret
from ..vpn import disconnect_client
from ..vpn import wait_and_remove_credentials


class GetVpnCredentials(object):
    def on_post(self, req, res):
        account_addr = str(req.body['account_addr']).lower()
        vpn_addr = str(req.body['vpn_addr']).lower()
        token = str(req.body['token'])

        client = db.clients.find_one({
            'account_addr': account_addr,
            'token': token
        })
        if client is not None:
            name = 'client' + str(int(time.time() * (10 ** 6)))
            _ = db.clients.find_one_and_update({
                'account_addr': account_addr,
                'token': token
            }, {
                '$set': {
                    'session_name': name,
                    'usage': {
                        'up': 0,
                        'down': 0
                    },
                    'status': 'credentials shared'
                }
            })
            username, password = add_secret(name)
            start_new_thread(wait_and_remove_credentials, (str.encode(name),))

            data = db.node.find_one({
                'account_addr': vpn_addr
            })
            message = {
                'success': True,
                'node': {
                    'location': data['location'],
                    'net_speed': data['net_speed'],
                    'vpn': {
                        'username': username,
                        'password': password
                    }
                },
                'session_name': name
            }
        else:
            message = {
                'success': False,
                'message': 'Wrong client wallet address or token.'
            }

        res.status = falcon.HTTP_200
        res.body = json.dumps(message)


class Disconnect(object):
    def on_post(self, req, res):
        account_addr = str(req.body['account_addr']).lower()
        token = str(req.body['token'])

        client = db.clients.find_one({
            'account_addr': account_addr,
            'token': token,
            'status': 'connected'
        })
        if client is None:
            message = {
                'success': False,
                'message': 'Wrong client wallet address or token.'
            }
        else:
            disconnected = disconnect_client(
                client['session_name'], client['connection_id'])
            if disconnected:
                _ = db.clients.find_one_and_update({
                    'account_addr': account_addr,
                    'token': token
                }, {
                    '$set': {
                        'status': 'disconnected'
                    }
                })
                message = {
                    'success': True,
                    'message': 'Disconnected successfully.'
                }
            else:
                message = {
                    'success': True,
                    'message': 'Invalid Request.'
                }

        res.status = falcon.HTTP_200
        res.body = json.dumps(message)
