# coding=utf-8
import copy
import json

import falcon

from ..tokens_config import TOKENS


class GetAvailableTokens(object):
    def on_get(self, req, resp):
        tokens = copy.deepcopy(TOKENS)
        for token in tokens:
            token.pop('price_url')

        message = {
            'success': True,
            'tokens': tokens,
        }

        resp.status = falcon.HTTP_200
        resp.body = json.dumps(message)
