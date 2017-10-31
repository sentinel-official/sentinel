import json
import falcon
from ..eth import ETHManager
from ..utils import logger

eth = ETHManager()
logger.info(eth.web3.isConnected())


class CreateNewAccount(object):
    def on_post(self, req, resp):
        password = req.body['password']

        account_addr = eth.create_account(password)
        private_key = eth.privatekey(account_addr, password)
        keystore = eth.keystore(account_addr)
        eth.remove_keystore(account_addr)
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
        account_addr = req.body['account_addr']
        unit = req.body['unit']

        if unit == 'ETH':
            balance = eth.balance(account_addr)
        elif unit == 'SENT':
            balance = 0
        message = {
            'success': True,
            'balance': balance
        }
        resp.status = falcon.HTTP_200
        resp.body = json.dumps(message)
