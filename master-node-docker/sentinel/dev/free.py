# coding=utf-8
import json

import falcon

from ..config import DECIMALS
from ..helpers import eth_helper
from ..logs import logger


class GetFreeAmount(object):
    def on_post(self, req, resp):
        account_addr = str(req.body['account_addr'])
        eths = int(0.25 * (10 ** 18))
        sents = int(1000 * (DECIMALS * 1.0))

        errors, tx_hashes = eth_helper.free(account_addr, eths, sents)

        if len(errors) > 0:
            message = {
                'success': False,
                'errors': errors,
                'tx_hashes': tx_hashes,
                'message': 'Error occurred while transferring free amount.'
            }
            try:
                raise Exception(errors)
            except Exception as _:
                logger.send_log(message, resp)
        else:
            message = {
                'success': True,
                'errors': errors,
                'tx_hashes': tx_hashes,
                'message': 'Free amount transaction initiated successfully.'
            }
            resp.status = falcon.HTTP_200
            resp.body = json.dumps(message)
