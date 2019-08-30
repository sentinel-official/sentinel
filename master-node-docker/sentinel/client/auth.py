# coding=utf-8
import json
import os

import falcon

from ..utils import jwt


class GetToken(object):
    def on_post(self, req, resp):
        auth_code = req.body['auth_code']
        address = req.body['address']
        if auth_code == os.getenv('AUTH_CODE'):
            try:
                token = jwt.get_auth_token({
                    'address': address
                })
                message = {
                    'success': True,
                    'token': token
                }
            except Exception as error:
                message = {
                    'success': False,
                    'message': 'Error occurred while generating token.'
                }
        else:
            message = {
                'success': False,
                'message': 'Auth code mismatch.'
            }

        resp.status = falcon.HTTP_200
        resp.body = json.dumps(message)
