import json
import falcon
from ..eth import eth_manager
from ..eth import contract_manager
from ..config import COINBASE_PASSWORD


COINBASE = eth_manager.web3.eth.coinbase


class GetFreeAmount(object):
    def on_post(self, req, resp):
        account_addr = req.body['account_addr']
        unit = req.body['unit']
        amount = req.body['amount']

        if unit == 'ETH':
            transaction = {
                'from': COINBASE,
                'to': account_addr,
                'value': amount
            }
            eth_manager.web3.personal.unlockAccount(COINBASE, COINBASE_PASSWORD)
            tx_hash = eth_manager.web3.eth.sendTransaction(transaction)
            eth_manager.web3.personal.lockAccount(COINBASE)
        elif unit == 'SENT':
            tx_hash = contract_manager.send_amount(COINBASE, account_addr, amount)
        message = {
            'success': True,
            'tx_hash': tx_hash,
            'message': 'Transaction initiated successfully.'
        }
        resp.status = falcon.HTTP_200
        resp.body = json.dumps(message)
