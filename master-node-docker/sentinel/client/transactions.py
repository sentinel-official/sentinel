import json
import falcon
from ..eth import ETHManager

eth = ETHManager()


class SendAmount(object):
    def on_post(self, req, resp):
        from_addr = req.body['from_addr']
        to_addr = req.body['to_addr']
        amount = req.body['amount']
        gas = req.body['gas']
        unit = req.body['unit']
        password = req.body['password']
        keystore = req.body['keystore']

        tx_details = {
            'to': to_addr,
            'gas': gas,
            'amount': amount,
        }
        if unit == 'ETH':
            tx_hash = eth.send_amount(from_addr, keystore, password, tx_details)
        elif unit == 'SENT':
            tx_hash = ''
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
        receipt = eth.tx_receipt(tx_hash)
        message = {
            'success': True,
            'receipt': receipt
        }
        resp.status = falcon.HTTP_200
        resp.body = json.dumps(message)
