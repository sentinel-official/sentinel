# coding=utf-8
import json

import falcon

from ..helpers import tokens


class GetExchangeValue(object):
    def on_get(self, req, resp):
        from_token = tokens.get_token(str(req.get_param('from')))
        to_token = tokens.get_token(str(req.get_param('to')))
        value = float(req.get_param('value'))

        if from_token is None or to_token is None:
            message = {
                'success': False,
                'message': 'From token OR To token is not found.'
            }
        else:
            value = tokens.exchange(from_token, to_token, value)
            message = {
                'success': True,
                'value': value
            }

        resp.status = falcon.HTTP_200
        resp.body = json.dumps(message)
