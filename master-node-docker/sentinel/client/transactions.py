import json
import falcon
from ..db import db
from ..helpers import eth_helper


def put_transaction_history(from_addr, to_addr, amount, unit, tx_hash, session_id):
    transaction = {
        'to_addr': to_addr,
        'amount': amount,
        'unit': unit,
        'tx_hash': tx_hash,
        'session_id': session_id
    }
    client = db.clients.find_one({'account.addr': from_addr})
    if client is None:
        db.clients.insert_one(
            {'account': {'addr': from_addr}, 'transaction_history': []})
    client = db.clients.find_one_and_update(
        {'account.addr': from_addr},
        {'$push': {'transaction_history': transaction}})

    return (client is None) is False


def get_transaction_history(account_addr):
    client = db.clients.find_one({'account.addr': account_addr})
    if client is None:
        return []
    history = db.clients.find_one(
        {'account.addr': account_addr},
        {'_id': 0, 'transaction_history': 1})

    return history['transaction_history']


class TransferAmount(object):
    def on_post(self, req, resp):
        """
        @api {post} /transfer-amount Transfer amount to another account
        @apiName TransferAmount
        @apiGroup Transactions
        @apiParam {String} from_addr From address.
        @apiParam {String} to_addr To address.
        @apiParam {Number} amount Value of the amount.
        @apiParam {Number} gas Gas units. Set it to 90000.
        @apiParam {String} Currency unit [ SENT or ETH ].
        @apiParam {String} password Password of the account.
        @apiParam {String} keystore Keystore file data.
        @apiSuccess {String} tx_hash Hash of the initiated transaction.
        """
        from_addr = str(req.body['from_addr'])
        to_addr = str(req.body['to_addr'])
        amount = int(req.body['amount'])
        unit = str(req.body['unit'])
        keystore = str(req.body['keystore'])
        password = str(req.body['password'])
        session_id = req.body['session_id']

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
                'message': 'Error occurred while initiating transaction.'
            }
        resp.status = falcon.HTTP_200
        resp.body = json.dumps(message)


class TranscationReceipt(object):
    def on_post(self, req, resp):
        """
        @api {post} /transcation-receipt Transaction receipt
        @apiName TranscationReceipt
        @apiGroup Transactions
        @apiParam {String} tx_hash Hash of the transaction.
        @apiSuccess {Object} receipt Details of the transaction.
        """
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
                'message': 'Error occurred while fetching transaction receipt.'
            }
        resp.status = falcon.HTTP_200
        resp.body = json.dumps(message)


class TransactionHistory(object):
    def on_post(self, req, resp):
        """
        @api {post} /transaction-history Transaction History
        @apiName TransactionHistory
        @apiGroup Transactions
        @apiParam {String} account_addr An account address.
        @apiSuccess {Object[]} history Transactions history of the account.
        """
        account_addr = str(req.body['account_addr'])

        history = get_transaction_history(account_addr)

        message = {
            'success': True,
            'history': history
        }
        resp.status = falcon.HTTP_200
        resp.body = json.dumps(message)
