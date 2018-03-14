import json
from urlparse import urljoin

import falcon
import requests

from ..config import MASTER_NODE_URL


class UpdateNodeInfo(object):
    def on_post(self, req, resp):
        body = req.body
        url = urljoin(MASTER_NODE_URL, 'node/update-nodeinfo')
        res = requests.post(url, json=body)
        res = res.json()
        if res['success']:
            message = {
                'success': True,
                'message': 'Node info updated successfully.'
            }
        else:
            message = {
                'success': False,
                'message': 'Node is not registered.'
            }
        resp.status = falcon.HTTP_200
        resp.body = json.dumps(message)
