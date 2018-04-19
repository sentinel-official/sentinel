# coding=utf-8
import json

import falcon

from ..tokens_config import TOKENS


class GetAvailableTokens(object):
    def on_get(self, req, resp):
        tokens = [{'decimals': TOKENS[token]['decimals'], 'name': TOKENS[token]['name']} for token in TOKENS.keys()]

        message = {
            'success': True,
            'tokens': tokens,
        }

        resp.status = falcon.HTTP_200
        resp.body = json.dumps(message)
