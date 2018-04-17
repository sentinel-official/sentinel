# coding=utf-8
import json

import falcon

from ..config import DECIMALS
from ..db import db
from ..helpers import eth_helper


def check_free(to_addr):
    tx = db.free.find_one({
        'to_addr': to_addr
    })

    return (tx is None) is False


def insert_free(to_addr):
    _ = db.free.insert_one({
        'to_addr': to_addr
    })


class GetFreeAmount(object):
    def on_post(self, req, resp):
        account_addr = str(req.body['account_addr']).lower()
        eths = int(0.25 * (10 ** 18))
        sents = int(1000 * DECIMALS)

        tx_done = check_free(account_addr)
        if tx_done is True:
            message = {
                'success': False,
                'message': 'Test Tokens already claimed'
            }
        else:
            errors, tx_hashes = eth_helper.free(account_addr, eths, sents)

            if len(errors) > 0:
                message = {
                    'success': False,
                    'errors': errors,
                    'tx_hashes': tx_hashes,
                    'message': 'Error occurred while transferring free amount.'
                }
            else:
                insert_free(account_addr)
                message = {
                    'success': True,
                    'errors': errors,
                    'tx_hashes': tx_hashes,
                    'message': 'Successfully transferred Test Tokens'
                }

        resp.status = falcon.HTTP_200
        resp.body = json.dumps(message)
