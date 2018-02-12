import json
import falcon
import requests
from ..config import MASTER_NODE_URL
from urlparse import urljoin

class RegisterNode(object):
    def on_post(self, req, resp):
        body = req.body
        url = urljoin(MASTER_NODE_URL, 'node/register')
        res = requests.post(url, json=body)
        res=res.json()
        if res['success']:
            res_body = res
            message = {
                'success': True,
                'token':res_body['token'],
                'message': 'Node registered successfully.'
            }
        else:
            message = {
                'success': False,
                'message': 'Error occurred while registering the node.'
            }
        resp.status = falcon.HTTP_200
        resp.body = json.dumps(message)