import json
import falcon
from ..db import db


class UpdateNodeInfo(object):
    def on_post(self, req, resp):
        token = req.body['token']
        account_addr = req.body['account_addr']
        info = req.body['info']

        if info['type'] == 'location':
            location = info['location']
            node = db.nodes.find_one_and_update({
                'account.addr': account_addr,
                'token': token
            }, {
                '$set': {
                    'location': location
                }
            })
        elif info['type'] == 'net_speed':
            net_speed = info['net_speed']
            node = db.nodes.find_one_and_update({
                'account.addr': account_addr,
                'token': token
            }, {
                '$set': {
                    'net_speed': net_speed
                }
            })
        elif info['type'] == 'vpn':
            if 'ovpn' in info:
                ovpn = info['ovpn']
                node = db.nodes.find_one_and_update({
                    'account.addr': account_addr,
                    'token': token
                }, {
                    '$set': {
                        'vpn.ovpn': ovpn
                    }
                })
            elif 'status' in info:
                status = info['status']
                node = db.nodes.find_one_and_update({
                    'account.addr': account_addr,
                    'token': token
                }, {
                    '$set': {
                        'vpn.status': status
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
