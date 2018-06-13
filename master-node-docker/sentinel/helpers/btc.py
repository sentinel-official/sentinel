# coding=utf-8
import requests

from ..config import BTC_BASED_COINS


class BTCHelper(object):
    def __init__(self, coins):
        self.coins = coins

    def get_new_address(self, symbol):
        try:
            server = self.coins[symbol]
            url = 'http://{}:{}/address'.format(server['ip'], server['port'])
            res = requests.get(url).json()
            return res['address'] if res['success'] else None
        except Exception as error:
            print(error)
            return None

    def get_balance(self, address, symbol):
        try:
            server = self.coins[symbol]
            url = 'http://{}:{}/balance?address={}'.format(server['ip'], server['port'], address)
            res = requests.get(url).json()
            return res['balance'] if res['success'] else None
        except Exception as error:
            print(error)
            return None

    def transfer(self, to_address, value, symbol):
        try:
            server = self.coins[symbol]
            url = 'http://{}:{}/transfer'.format(server['ip'], server['port'])
            res = requests.post(url, data={
                'to_address': to_address,
                'value': value
            }).json()
            return res['tx_hash'] if res['success'] else None
        except Exception as error:
            print(error)
            return None


btc_helper = BTCHelper(BTC_BASED_COINS)
