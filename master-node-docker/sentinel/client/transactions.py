import json
import falcon
from ethereum.tools import keys
from ..config import DECIMALS
from ..helpers import eth_helper


class TransferAmount(object):
    def on_post(self, req, resp):
        """
        @api {post} /client/transaction Transfer amount from one account to another.
        @apiName TransferAmount
        @apiGroup Transactions
        @apiParam {String} from_addr Sender account address.
        @apiParam {String} to_addr Receiver account address.
        @apiParam {Number} amount Amount that has to be transferred.
        @apiParam {String} unit Unit either `SENT` or `ETH`.
        @apiParam {String} keystore Keystore file data of the sender account.
        @apiParam {String} password Password of the sender account.
        @apiParam {Number} session_id Session ID of the VPN session if it's a VPN payment.
        @apiSuccess {String} tx_hash Transaction hash of the transaction.
        """
        from_addr = str(req.body['from_addr'])
        to_addr = str(req.body['to_addr'])
        amount = float(req.body['amount'])
        unit = str(req.body['unit'])
        keystore = json.loads(
            str(req.body['keystore'])) if 'keystore' in req.body else None
        password = str(req.body['password']
                       ) if 'password' in req.body else None
        private_key = str(req.body['private_key']
                          ) if 'private_key' in req.body else None

        if (from_addr[2:].lower() == keystore['address'].lower()):
            try:
                _ = keys.decode_keystore_json(keystore, password)

                amount = int(round(amount * (10 ** 18))) \
                    if unit == 'ETH' else int(round(amount * DECIMALS))
                error, tx_hash = eth_helper.transfer_amount(
                    from_addr, to_addr, amount, unit, keystore, password, private_key)

                if error is None:
                    message = {
                        'success': True,
                        'tx_hash': tx_hash,
                        'message': 'Transaction initiated successfully.'
                    }
                else:
                    error = json.loads((error['error'].replace(
                        "'", '"')).replace('u"', '"'))['message']
                    message = {
                        'success': False,
                        'error': error,
                        'message': 'Error occurred while initiating the transaction.'
                    }
            except Exception as err:
                message = {
                    'success': False,
                    'error': str(err),
                    'message': 'Error occurred while initiating the transaction.'
                }
        else:
            message = {
                'success': False,
                'error': 'Keystore address and Your address does not match.',
                'message': 'Error occurred while initiating the transaction.'
            }
        resp.status = falcon.HTTP_200
        resp.body = json.dumps(message)
