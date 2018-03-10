import json
from uuid import uuid4
import falcon
from ..db import db
from ..logs import logger

class RegisterNode(object):
    def on_post(self, req, resp):
        account = req.body['account']
        ip = req.body['ip']
        location = req.body['location']
        net_speed = req.body['net_speed']
        token = uuid4().hex

        node = db.nodes.find_one({'account.addr': account['addr']})
        if node is None:
            result = db.nodes.insert_one({
                'account': account,
                'token': token,
                'location': location,
                'ip': ip,
                'net_speed': net_speed
            })
            if result.inserted_id:
                message = {
                    'success': True,
                    'token': token,
                    'message': 'Node registered successfully.'
                }
                resp.status = falcon.HTTP_200
                resp.body = json.dumps(message)
        else:
            message = {
                'success': False,
                'message': 'Error occurred while registering the node.'
            }
            try:
                raise Exception('Error occurred while registering the node.')
            except Exception as err:
                logger.send_log(message,resp)
