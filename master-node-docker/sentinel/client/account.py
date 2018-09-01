# coding=utf-8
import json

import falcon
import requests

from ..config import MAIN_URL, RINKEBY_URL, ETH_TRANS_URL, SENT_TRANS_URL1, SENT_TRANS_URL2
from ..helpers import eth_helper


class CreateNewAccount(object):
    def on_post(self, req, resp):
        """
        @api {post} /client/account Create new account for the Sentinel user.
        @apiName CreateNewAccount
        @apiGroup Account
        @apiParam {String} password Password for creating the new account.
        @apiSuccess {String} account_addr New account address.
        @apiSuccess {String} private_key Private key of the account.
        @apiSuccess {String} keystore Keystore file data of the account.
        """
        password = str(req.body['password'])

        error, account_addr, private_key, keystore = eth_helper.create_account(password)

        if error is None:
            message = {
                'success': True,
                'account_addr': account_addr,
                'private_key': private_key,
                'keystore': json.dumps(keystore),
                'message': 'Account created successfully. Please store the Private key and Keystore data safely.'
            }
        else:
            message = {
                'success': False,
                'error': error,
                'message': 'Error occurred while create wallet. Please try again.'
            }

        resp.status = falcon.HTTP_200
        resp.body = json.dumps(message)


class GetBalance(object):
    def on_post(self, req, resp):
        """
        @api {post} /client/account/balance Get account balances.
        @apiName GetBalance
        @apiGroup Account
        @apiParam {String} account_addr Address of the account.
        @apiSuccess {Object} balances Account balances.
        """
        account_addr = str(req.body['account_addr'])

        balances = eth_helper.get_balances(account_addr)
        message = {
            'success': True,
            'balances': balances
        }

        resp.status = falcon.HTTP_200
        resp.body = json.dumps(message)


class GetETHHistory(object):
    def on_post(self, req, resp):
        """
        @api {post} /client/account/history/eth Get account balances.
        @apiName GetETHHistory
        @apiGroup Account
        @apiParam {String} account_addr Address of the account.
        @apiParam {String} network Network.
        @apiParam {Integer} page Page Number of history.
        @apiSuccess {Object} balances Account balances.
        """
        account_addr = str(req.body['account_addr']).lower()
        network = str(req.body['network']).lower()
        page = int(req.body['page'])

        if network == 'main':
            url = MAIN_URL + ETH_TRANS_URL + account_addr + '&page=' + page
        else:
            url = RINKEBY_URL + ETH_TRANS_URL + account_addr + '&page=' + page

        try:
            result = requests.get(url).json()
        except Exception as _:
            result = {
                'status': 0,
                'message': 'No records found',
                'result': []
            }
        resp.status = falcon.HTTP_200
        resp.body = json.dumps(result)


class GetSentHistory(object):
    def on_post(self, req, resp):
        """
        @api {post} /client/account/history/sent Get account balances.
        @apiName GetSentHistory
        @apiGroup Account
        @apiParam {String} account_addr Address of the account.
        @apiParam {String} network Network.
        @apiSuccess {Object} balances Account balances.
        """
        account_addr = str(req.body['account_addr']).lower()
        network = str(req.body['network']).lower()

        if network == 'main':
            url = MAIN_URL + SENT_TRANS_URL1 + account_addr + SENT_TRANS_URL2 + account_addr
        else:
            url = RINKEBY_URL + SENT_TRANS_URL1 + account_addr + SENT_TRANS_URL2 + account_addr

        try:
            result = requests.get(url).json()
        except Exception as _:
            result = {
                'status': 0,
                'message': 'No records found',
                'result': []
            }
        resp.status = falcon.HTTP_200
        resp.body = json.dumps(result)
