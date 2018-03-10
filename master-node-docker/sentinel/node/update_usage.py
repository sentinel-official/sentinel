import json
import falcon
from ..db import db


class UpdateClientUsage(object):
    def on_post(self, req, resp):
        token = str(req.body['token'])
        account_addr = str(req.body['account_addr'])
        client_addr = str(req.body['client_addr'])
        session_name = str(req.body['session_name'])
        is_connected = int(req.body['is_connected'])
        usage = dict(req.body['usage'])
        start_time = int(req.body['start_time'])
        end_time = int(req.body['end_time'])

        node = db.nodes.find_one({
            'account.addr': account_addr,
            'token': token
        })
        if node is not None:
            connection = db.connections.find_one({
                'account_addr': account_addr,
                'client_addr': client_addr,
                'session_name': session_name
            })
            if connection is None:
                _ = db.connections.insert_one({
                    'account_addr': account_addr,
                    'client_addr': client_addr,
                    'session_name': session_name,
                    'is_connected': is_connected,
                    'usage': usage,
                    'start_time': start_time,
                    'end_time': end_time
                })
            else:
                _ = db.connections.find_one_and_update({
                    'account_addr': account_addr,
                    'client_addr': client_addr,
                    'session_name': session_name
                }, {
                    '$set': {
                        'is_connected': is_connected,
                        'usage': usage,
                        'start_time': start_time,
                        'end_time': end_time
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
