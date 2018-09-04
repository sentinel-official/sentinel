import json
import time

import falcon

from ..config import SWAP_ADDRESS
from ..db import db
from ..helpers import eth_helper
from ..helpers import tokens


class GetSwapAddressBalance(object):
	def on_get(self, req, resp):
		message = {}
		balances = eth_helper.get_balances(SWAP_ADDRESS)

		message = {
				'success': True,
				'balances': balances
		}

		resp.status = falcon.HTTP_200
		resp.body = json.dumps(message)
