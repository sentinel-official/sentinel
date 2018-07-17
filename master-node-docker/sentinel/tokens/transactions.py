# coding=utf-8
import json
import time

import falcon

from ..config import CENTRAL_WALLET
from ..config import DECIMALS
from ..db import db
from ..helpers import eth_helper
from ..helpers import tokens


class TokenSwapRawTransaction(object):
    def on_post(self, req, resp):
        """
        @api {post} /tokens/swaps/raw-transaction Send raw transaction to specific chain.
        @apiName TokenSwapRawTransaction
        @apiGroup Transactions
        @apiParam {String} tx_data Hex code of the transaction.
        @apiParam {String} to_addr To address. Either contract address or central wallet address.
        @apiParam {Number} value Exchange amount.
        @apiSuccess {String} tx_hash Transaction hash.
        """
        tx_data = str(req.body['tx_data'])
        to_addr = str(req.get_param('to_addr'))
        value = int(req.get_param('value'))
        token = tokens.get_token(to_addr)

        requested_sents = tokens.calculate_sents(token, value)
        available_sents = eth_helper.get_balances(CENTRAL_WALLET)
        if available_sents['main']['sents'] >= (requested_sents * DECIMALS):
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
        else:
            message = {
                'success': False,
                'message': 'No enough SENTs in the Central wallet.'
            }

        resp.status = falcon.HTTP_200
        resp.body = json.dumps(message)
