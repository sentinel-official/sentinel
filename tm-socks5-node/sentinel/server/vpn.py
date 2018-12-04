# coding=utf-8
import json
import time
from random import choice

import falcon

from ..db import db
# from ..vpn import Keys


class GetSockCreds(object):
    def on_post(self, req, res):
        account_addr = str(req.body['account_addr']).lower()
        vpn_addr = str(req.body['vpn_addr']).lower()
        token = str(req.body['token'])

        client = db.clients.find_one({
            'account_addr': account_addr,
            'token': token
        })
        if client is not None:
            name = str(int(time.time() * (10 ** 6)))
            _ = db.clients.find_one_and_update({
                'account_addr': account_addr,
                'token': token
            }, {
                '$set': {
                    'session_name': 'client' + name,
                    'usage': {
                        'up': 0,
                        'down': 0
                    }
                }
            })
            data = db.node.find_one({
                'account_addr': vpn_addr
            })

            json_data=json.load(open('/root/sentinel/shell_scripts/shadowsocks.json'))
            rand_data=choice(list(json_data['port_password'].keys()))

            config_data={
                'ip':data['ip'],
                'port':rand_data,
                'password':json_data['port_password'][rand_data],
                'method':json_data['method']
            }


            message = {
                'success': True,
                'node': {
                    'location': data['location'],
                    'net_speed': data['net_speed'],
                    'vpn': {
                        'config': config_data
                    }
                },
                'session_name': 'client' + name
            }
        else:
            message = {
                'success': False,
                'message': 'Wrong client wallet address or token.'
            }

        res.status = falcon.HTTP_200
        res.body = json.dumps(message)
