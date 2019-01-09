# coding=utf-8
import json

import falcon

from ..config import SWAP_ADDRESS
from ..helpers import eth_helper


class GetSwapAddressBalance(object):
    def on_get(self, req, resp):
        balances = eth_helper.get_balances(SWAP_ADDRESS)
        message = {
            'success': True,
            'balances': balances
        }

        resp.status = falcon.HTTP_200
        resp.body = json.dumps(message)
