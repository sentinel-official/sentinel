# coding=utf-8

import json
from threading import Lock

import falcon
from falcon_cors import CORS

from sentinel.helpers import eth_helper
from sentinel.utils import JSONTranslator


class Nonce(object):
    def __init__(self):
        self.nonces = {}
        self.locks = {}

    def set_nonce(self, account_addr, net, nonce=None):
        key = account_addr + '@' + net
        if nonce:
            self.nonces[key] = nonce
        if key not in self.locks:
            self.locks[key] = Lock()
        self.locks[key].release()

    def get_nonce(self, account_addr, net):
        key = account_addr + '@' + net
        if key not in self.locks:
            self.locks[key] = Lock()
        self.locks[key].acquire()
        if key not in self.nonces:
            nonce = eth_helper.get_tx_count(account_addr, net)
        else:
            nonce = self.nonces[key]

        return nonce

    def on_put(self, req, resp):
        account_addr = str(req.body['account_addr']).lower()
        net = str(req.body['net']).lower()
        nonce = int(req.body['nonce'])

        self.set_nonce(account_addr, net, nonce)

        message = {
            'success': True
        }

        resp.status = falcon.HTTP_200
        resp.body = json.dumps(message)

    def on_get(self, req, resp):
        account_addr = str(req.params['account_addr']).lower()
        net = str(req.body['net']).lower()

        nonce = self.get_nonce(account_addr, net)

        message = {
            'success': True,
            'nonce': nonce,
        }

        resp.status = falcon.HTTP_200
        resp.body = json.dumps(message)


cors = CORS(allow_all_origins=True)
server = falcon.API(middleware=[cors.middleware, JSONTranslator()])
server.add_route('/nonce', Nonce())
