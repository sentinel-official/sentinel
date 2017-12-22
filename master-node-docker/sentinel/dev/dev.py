import json
import falcon
from ..eth import eth_manager
from ..eth import contract_manager
from ..config import DECIMALS
from ..config import COINBASE_PASSWORD


COINBASE = eth_manager.web3.eth.coinbase


class GetFreeAmount(object):
    def on_post(self, req, resp):
        account_addr = str(req.body['account_addr'])
        unit = str(req.body['unit'])
        amount = float(req.body['amount'])

        amount = int(amount * (10 ** 18)) \
            if unit == 'ETH' else int(amount * DECIMALS)

        if unit == 'ETH':
            transaction = {
                'from': COINBASE,
                'to': account_addr,
                'value': amount
            }
            error, tx_hash = eth_manager.transfer_amount(
                COINBASE, COINBASE_PASSWORD, transaction)
        elif unit == 'SENT':
            error, tx_hash = contract_manager.transfer_amount(
                COINBASE, account_addr, amount, COINBASE_PASSWORD, None)

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
                'message': 'Error occurred while initiating transaction.'
            }
        resp.status = falcon.HTTP_200
        resp.body = json.dumps(message)
