import json
import time
import falcon
from ..db import db
from ..config import DECIMALS
from ..helpers import eth_helper


def put_transaction_history(from_addr, to_addr, amount, unit, tx_hash, session_id):
    amount = amount / ((10 ** 18) * 1.0) \
        if unit == 'ETH' else amount / (DECIMALS * 1.0)

    transaction = {
        'from_addr': from_addr,
        'to_addr': to_addr,
        'amount': amount,
        'unit': unit,
        'tx_hash': tx_hash,
        'session_id': session_id,
        'timestamp': int(time.time())
    }
    db.transactions.insert_one(transaction)


def get_transaction_history(account_addr):
    transactions = db.transactions.find(
        {'$or': [{'from_addr': account_addr}, {'to_addr': account_addr}]}, {'_id': 0})
    return list(transactions)


class TransferAmount(object):
    def on_post(self, req, resp):
        from_addr = str(req.body['from_addr'])
        to_addr = str(req.body['to_addr'])
        amount = float(req.body['amount'])
        unit = str(req.body['unit'])
        keystore = str(req.body['keystore'])
        password = str(req.body['password'])
        session_id = req.body['session_id']

        amount = int(amount * (10 ** 18)) \
            if unit == 'ETH' else int(amount * DECIMALS)

        error, tx_hash = eth_helper.transfer_amount(
            from_addr, to_addr, amount, unit, keystore, password, session_id)

        if error is None:
            put_transaction_history(
                from_addr, to_addr, amount, unit, tx_hash, session_id)

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


class TranscationReceipt(object):
    def on_post(self, req, resp):
        tx_hash = str(req.body['tx_hash'])

        error, receipt = eth_helper.get_tx_receipt(tx_hash)

        if error is None:
            message = {
                'success': True,
                'receipt': {
                    'cumulativeGasUsed': receipt['cumulativeGasUsed'],
                    'from': receipt['from'],
                    'blockHash': receipt['blockHash'],
                    'transactionHash': receipt['transactionHash'],
                    'root': receipt['root'],
                    'blockNumber': receipt['blockNumber'],
                    'to': receipt['to'],
                    'gasUsed': receipt['gasUsed']
                }
            }
        else:
            message = {
                'success': False,
                'error': error,
                'message': 'Error occurred while fetching the transaction receipt.'
            }
        resp.status = falcon.HTTP_200
        resp.body = json.dumps(message)


class TransactionHistory(object):
    def on_post(self, req, resp):
        account_addr = str(req.body['account_addr'])

        history = get_transaction_history(account_addr)

        message = {
            'success': True,
            'history': history
        }
        resp.status = falcon.HTTP_200
        resp.body = json.dumps(message)
