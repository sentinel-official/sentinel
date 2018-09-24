# coding=utf-8

from redis import Redis


class RedisManager(object):
    def __init__(self):
        self.redis = Redis()

    def set_nonce(self, account_addr, net, nonce):
        key = account_addr + '@' + net
        self.redis.set(key, nonce)

    def get_nonce(self, account_addr, net):
        key = account_addr + '@' + net
        nonce = self.redis.get(key)
        return int(nonce)


redis_manager = RedisManager()
