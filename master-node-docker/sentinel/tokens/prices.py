# coding=utf-8
import json

import falcon

from ..helpers import tokens


class GetSents(object):
    def on_get(self, req, resp):
        to_addr = str(req.get_param('to_addr'))
        value = int(req.get_param('value'))
        token = tokens.get_token(to_addr)
        if token is not None:
            sents = tokens.calculate_sents(token, value)
            message = {
                'success': True,
                'sents': sents,
            }
        else:
            message = {
                'success': False,
                'message': 'No token found.'
            }

        resp.status = falcon.HTTP_200
        resp.body = json.dumps(message)
