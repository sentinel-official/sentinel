import json
import falcon
import requests
from ..config import MASTER_NODE_URL
from urlparse import urljoin


class DeRegisterNode(object):
    def on_post(self, req, resp):
        body = req.body
        url = urljoin(MASTER_NODE_URL, 'node/deregister')
        res = requests.post(url, json=body)
        res=res.json()
        if res['success']:
            message = {
                'success': True,
                'message': 'Node deregistred successfully.'
            }
        else:
            message = {'success': False, 'message': 'Node is not registered.'}
        resp.status = falcon.HTTP_200
        resp.body = json.dumps(message)