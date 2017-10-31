import json
import falcon
from uuid import uuid4
from ..db import db


class RegisterNode(object):
    def on_post(self, req, resp):
        account = req.body['account']
        location = req.body['location']
        net_speed = req.body['net_speed']
        token = uuid4().hex

        node = db.nodes.find_one({'account.address': account['address']})
        if node is None:
            result = db.nodes.insert_one(
                {'account': account, 'token': token, 'location': location, 'net_speed': net_speed})
            if result.inserted_id:
                message = {
                    'success': True,
                    'token': token,
                    'message': 'Node has been registered successfully.'
                }
        else:
            message = {
                'success': False,
                'message': 'Node already registered.'
            }
        resp.status = falcon.HTTP_200
        resp.body = json.dumps(message)
