# coding=utf-8
import json

from falcon_auth import FalconAuthMiddleware

from .jwt import jwt


class JSONTranslator(object):
    def process_request(self, req, resp):
        body = req.stream.read()
        try:
            req.body = json.loads(body.decode('utf-8'))
        except ValueError:
            _ = {
                'message': 'Malformed JSON',
                'errors': ['JSON was incorrect or not encoded as UTF-8.']
            }


auth_middleware = FalconAuthMiddleware(jwt, exempt_routes=['/', '/client/token', '/node/account'],
                                       exempt_methods=['HEAD'])
