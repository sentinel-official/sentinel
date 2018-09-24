# coding=utf-8

from threading import Lock

from ..helpers import eth_helper


class NonceManager(object):
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


nonce_manager = NonceManager()
