# coding=utf-8
import copy
import json

import falcon

from ..config import SWAP_TOKENS


class GetAvailableTokens(object):
    def on_get(self, req, resp):
        tokens = copy.deepcopy(SWAP_TOKENS)
        for token in tokens:
            token.pop('price_url')

        message = {
            'success': True,
            'tokens': tokens,
        }

        resp.status = falcon.HTTP_200
        resp.body = json.dumps(message)
