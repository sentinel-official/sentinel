import json
import falcon
from ..eth import eth_manager
from ..eth import contract_manager


class CreateNewAccount(object):
    def on_post(self, req, resp):
        """
        @api {post} /create-new-account Create new account
        @apiName CreateNewAccount
        @apiGroup Account
        @apiParam {string} password Password for creating account.
        @apiSuccess {String} account_addr Account address.
        @apiSuccess {String} private_key Private key of the account.
        @apiSuccess {String} keystore Keystore file data.
        """
        password = str(req.body['password'])

        _, account_addr = eth_manager.create_account(password)
        _, private_key = eth_manager.get_privatekey(account_addr, password)
        _, keystore = eth_manager.get_keystore(account_addr)
        eth_manager.remove_keystore(account_addr)

        message = {
            'success': True,
            'account_addr': account_addr,
            'private_key': private_key,
            'keystore': json.dumps(keystore),
            'message': 'Account created successfully.'
        }
        resp.status = falcon.HTTP_200
        resp.body = json.dumps(message)


class GetBalance(object):
    def on_post(self, req, resp):
        """
        @api {post} /get-balance Get the balance of an account
        @apiName GetBalance
        @apiGroup Account
        @apiParam {string} account_addr Account address.
        @apiParam {string} unit Currency [ SENT or ETH ].
        @apiSuccess {Number} balance Balance of the account address.
        """
        account_addr = str(req.body['account_addr'])
        unit = str(req.body['unit'])

        if unit == 'ETH':
            error, balance = eth_manager.get_balance(account_addr)
        elif unit == 'SENT':
            error, balance = contract_manager.get_balance(account_addr)

        if error is None:
            message = {
                'success': True,
                'balance': balance
            }
        else:
            message = {
                'success': False,
                'error': error
            }
        resp.status = falcon.HTTP_200
        resp.body = json.dumps(message)
