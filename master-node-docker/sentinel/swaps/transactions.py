# coding=utf-8
import json
import time

import falcon

from ..config import SWAP_ADDRESS
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
        to_address = req.body['account_addr']
        from_token = tokens.get_token(str(req.body['from']))
        to_token = tokens.get_token(str(req.body['to']))
        value = 0  # float(req.body['value'])

        # value = tokens.exchange(from_token, to_token, value)
        # value = value * (1.0 * (10 ** to_token['decimals']))
        balance = 1  # eth_helper.get_balance(CENTRAL_WALLET)
        if balance >= value:
            error, tx_hash = eth_helper.raw_transaction(tx_data, 'main')
            if error is None:
                _ = db.swaps.insert_one({
                    'from_symbol': from_token['symbol'],
                    'to_symbol': to_token['symbol'],
                    'from_address': SWAP_ADDRESS,
                    'to_address': to_address,
                    'tx_hash_0': tx_hash,  # Only for ERC20 based
                    'time_0': int(time.time()),
                    'status': 0
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
                'message': 'No enough coins in the Central wallet.'
            }

        resp.status = falcon.HTTP_200
        resp.body = json.dumps(message)
