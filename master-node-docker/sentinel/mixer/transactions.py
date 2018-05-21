# coding=utf-8
import json
import time

import falcon

from ..db import db
from ..helpers import eth_helper


class MixerRawTransaction(object):
    def on_post(self, req, resp):
        """
        @api {post} /mixer/transaction Send raw transaction to specific chain.
        @apiName RawTransaction
        @apiGroup Transactions
        @apiParam {String} tx_data Hex code of the transaction.
        @apiParam {String} to_addr To address. Either contract address or central wallet address.
        @apiParam {String} dest_addr Destination address.
        @apiSuccess {String} tx_hash Transaction hash.
        """
        tx_data = str(req.body['tx_data'])
        to_addr = str(req.body['to_addr'])
        dest_addr = str(req.body['dest_addr'])

        error, tx_hash = eth_helper.raw_transaction(tx_data, 'main')
        if error is None:
            tx_count = eth_helper.get_tx_count(dest_addr, 'main')
            _ = db.mixer.insert_one({
                'tx_data': tx_data,
                'to_addr': to_addr,
                'dest_addr': dest_addr,
                'tx_count': tx_count,
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
