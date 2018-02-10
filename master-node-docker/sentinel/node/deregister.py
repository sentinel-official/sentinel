import json
import falcon
from ..db import db


class DeRegisterNode(object):
    def on_post(self, req, resp):
        account_addr = req.body['account_addr']
        token = req.body['token']

        node = db.nodes.find_one_and_delete(
            {'account.addr': account_addr, 'token': token})

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
