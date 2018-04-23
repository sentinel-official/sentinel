# coding=utf-8
import json
import time

import falcon

from ..db import db
from ..helpers import eth_helper


class TokenSwapRawTransaction(object):
    def on_post(self, req, resp):
        """
        @api {post} /swaps/transaction Send raw transaction to specific chain.
        @apiName RawTransaction
        @apiGroup Transactions
        @apiParam {String} tx_data Hex code of the transaction.
        @apiParam {String} net Ethereum chain name {main | rinkeby}.
        @apiSuccess {String} tx_hash Transaction hash.
        """
        tx_data = str(req.body['tx_data'])
        error, tx_hash = eth_helper.raw_transaction(tx_data, 'main')

        if error is None:
            _ = db.token_swaps.insert_one({
                'tx_data': tx_data,
                'tx_hash_0': tx_hash,
                'status': 0,
                'time_0': int(time.time())
            })
            message = {
                'success': True,
                'tx_hash': tx_hash,
                'message': 'Transaction initiated successfully.'
            }
        else:
            message = {
                'success': False,
                'error': error,
                'message': 'Error occurred while initiating the transaction.'
            }

        resp.status = falcon.HTTP_200
        resp.body = json.dumps(message)
