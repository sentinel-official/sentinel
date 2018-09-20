# coding=utf-8

from redis import Redis

from ..helpers import eth_helper


class RedisManager(object):
    def __init__(self):
        self.redis = Redis()

    def set_nonce(self, account_addr, net, nonce):
        key = account_addr + '@' + net
        self.redis.set(key, nonce)

    def get_nonce(self, account_addr, net):
        key = account_addr + '@' + net
        nonce = self.redis.get(key)
        if nonce is None:
            nonce = eth_helper.get_tx_count(account_addr, net)
        return int(nonce)


redis_manager = RedisManager()
