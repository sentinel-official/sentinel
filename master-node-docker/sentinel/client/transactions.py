import json
import falcon
from ethereum.tools import keys
from ..config import DECIMALS
from ..helpers import eth_helper
from ..logs import logger

class RawTransaction(object):
    def on_post(self, req, resp):
        tx_data = str(req.body['tx_data'])
        error, tx_hash = eth_helper.raw_transaction(tx_data)

        if error is None:
            message = {
                'success': True,
                'tx_hash': tx_hash,
                'message': 'Transaction initiated successfully.'
            }
            resp.status = falcon.HTTP_200
            resp.body = json.dumps(message)

        else:
            message = {
                'success': False,
                'error': error,
                'message': 'Error occurred while initiating the transaction.'
            }
            try:
                raise Exception(error)
            except Exception as err:
                logger.send_log(message,resp)
