import json
import falcon
from ..eth import eth_manager
from ..eth import contract_manager
from ..config import COINBASE_PASSWORD


COINBASE = eth_manager.web3.eth.coinbase


class GetFreeAmount(object):
    def on_post(self, req, resp):
        """
        @api {post} /get-free-amount Get free amount to an account
        @apiName GetFreeAmount
        @apiGroup Development
        @apiParam {String} account_addr An account address.
        @apiParam {String} unit Currency unit [ SENT or ETH ].
        @apiParam {Number} amount Value of the amount.
        @apiSuccess {String} tx_hash Hash of the initiated transaction.
        """
        account_addr = str(req.body['account_addr'])
        unit = str(req.body['unit'])
        amount = int(req.body['amount'])

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
                COINBASE, COINBASE_PASSWORD, account_addr, amount, False)

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
