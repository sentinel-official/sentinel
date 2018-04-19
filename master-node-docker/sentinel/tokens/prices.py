# coding=utf-8
import json

import falcon

from ..config import DECIMALS
from ..helpers import tokens


class GetSents(object):
    def on_get(self, req, resp):
        to_addr = str(req.get_param('to_addr'))
        value = int(req.get_param('value'))
        token = tokens.get_token(to_addr)
        if token is not None:
            sents = int(tokens.calculate_sents(token, value) * DECIMALS)
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
