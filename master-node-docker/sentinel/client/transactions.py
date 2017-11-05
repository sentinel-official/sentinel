import json
import falcon
from ..eth import eth_manager
from ..eth import contract_manager


class SendAmount(object):
    def on_post(self, req, resp):
        from_addr = req.body['from_addr']
        to_addr = req.body['to_addr']
        amount = req.body['amount']
        gas = req.body['gas']
        unit = req.body['unit']
        password = req.body['password']
        keystore = req.body['keystore']

        if unit == 'ETH':
            tx_details = {'from': from_addr, 'to': to_addr,
                          'gas': gas, 'value': amount}
            tx_hash = eth_manager.send_amount(keystore, password, tx_details)
        elif unit == 'SENT':
            tx_hash = contract_manager.send_amount(from_addr, to_addr, amount)
        message = {
            'success': True,
            'tx_hash': tx_hash,
            'message': 'Transaction initiated successfully.'
        }
        resp.status = falcon.HTTP_200
        resp.body = json.dumps(message)


class TranscationStatus(object):
    def on_post(self, req, resp):
        tx_hash = req.body['tx_hash']
        receipt = eth_manager.tx_receipt(tx_hash)
        message = {
            'success': True,
            'receipt': receipt
        }
        resp.status = falcon.HTTP_200
        resp.body = json.dumps(message)
