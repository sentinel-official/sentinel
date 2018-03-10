import json
import falcon
from ..db import db


class UpdateConnections(object):
    def on_post(self, req, resp):
        token = str(req.body['token'])
        account_addr = str(req.body['account_addr'])
        connections = req.body['connections']

        node = db.nodes.find_one({
            'account.addr': account_addr,
            'token': token
        })
        if node is not None:
            for info in connections:
                connection = db.connections.find_one({
                    'account_addr': account_addr,
                    'session_name': info['session_name']
                })
                if connection is None:
                    _ = db.connections.insert_one(info)
                else:
                    _ = db.connections.find_one_and_update({
                        'account_addr': account_addr,
                        'session_name': info['session_name']
                    }, {
                        '$set': {
                            'usage': info['usage'],
                            'end_time': info['end_time'] if 'end_time' in info else None
                        }
                    })
            message = {
                'success': True,
                'message': 'Connection details updated successfully.'
            }
        else:
            message = {
                'success': False,
                'message': 'Can\'t find node with given details.'
            }

        resp.status = falcon.HTTP_200
        resp.body = json.dumps(message)
