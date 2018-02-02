import falcon
import json
import requests
from ..config import MASTER_NODE_URL
from urlparse import urljoin

class AddVpnUsage(object):
    def on_post(self, req, resp):
        body=req.body
        url = urljoin(MASTER_NODE_URL, 'node/add-usage')
        res = requests.post(url, json=body)
        res=res.json()
        if res['success']:
            res_body=res
            message = {
                'success': True,
                'tx_hash': res_body['tx_hash'],
                'message': 'VPN usage data will be added soon.'
            }
        else:
            res_body=res.json()
            message = {
                'success': False,
                'error': res_body['error'],
                'message': 'Error occurred while adding the VPN usage data.'
            }

        resp.status = falcon.HTTP_200
        resp.body = json.dumps(message)