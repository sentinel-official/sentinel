# coding=utf-8
import json

import falcon

from ..helpers import eth_helper


class RawTransaction(object):
    def on_post(self, req, resp):
        """
        @api {post} /client/raw-transaction Send raw transaction to specific chain.
        @apiName RawTransaction
        @apiGroup Transactions
        @apiParam {String} tx_data Hex code of the transaction.
        @apiParam {String} net Ethereum chain name {main | rinkeby}.
        @apiSuccess {String} tx_hash Transaction hash.
        """
        tx_data = str(req.body['tx_data'])
        net = str(req.body['net']).lower()
        error, tx_hash = eth_helper.raw_transaction(tx_data, net)

        if error is None:
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
