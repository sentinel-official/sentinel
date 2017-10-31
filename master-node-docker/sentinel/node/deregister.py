import json
import falcon
from ..db import db


class DeRegisterNode(object):
    def on_post(self, req, resp):
        account_addr = req.body['account_addr']
        token = req.body['token']

        node = db.nodes.find_one_and_delete(
            {'account.address': account_addr, 'token': token})
        if node is None:
            message = {
                'success': False,
                'message': 'Node is not registered or Error occurred while deleting node.'
            }
        else:
            message = {
                'success': True,
                'message': 'Deleted successfully.'
            }
        resp.status = falcon.HTTP_200
        resp.body = json.dumps(message)
