import json
import falcon
import requests
from ..config import MASTER_NODE_URL
from ..config import ACCOUNT_DATA_PATH
from urlparse import urljoin


class CreateNewAccount(object):
    def on_post(self, req, resp):
        body = req.body
        url = urljoin(MASTER_NODE_URL, 'node/account')
        res = requests.post(url, json=body)
        res = res.json()
        if res['success']:
            res_body = res
            message = {
                'success':
                True,
                'account_addr':
                res_body['account_addr'],
                'private_key':
                res_body['private_key'],
                'keystore':
                res_body['keystore'],
                'message':
                'Account created successfully.' +
                ' Please store the Private key and Keystore data safely.'
            }
        else:
            message = {'success': False, 'message': 'Error occured'}
        resp.status = falcon.HTTP_200
        resp.body = json.dumps(message)