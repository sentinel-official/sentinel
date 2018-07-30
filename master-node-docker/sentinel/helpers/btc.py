# coding=utf-8
import requests

from ..config import BTC_BASED_COINS


class BTCHelper(object):
    def __init__(self, coins):
        self.coins = coins

    def get_new_address(self, symbol):
        try:
            server = self.coins[symbol]
            url = '{}address'.format(server['url'])
            res = requests.get(url).json()
            return res['address'] if res['success'] else None
        except Exception as error:
            print(error)
            return None

    def get_balance(self, address, symbol):
        try:
            server = self.coins[symbol]
            url = '{}balance?address={}'.format(server['url'], address)
            res = requests.get(url).json()
            return res['balance'] if res['success'] else None
        except Exception as error:
            print(error)
            return None

    def transfer(self, to_address, value, symbol):
        try:
            server = self.coins[symbol]
            url = '{}transfer'.format(server['url'])
            res = requests.post(url, json={
                'toAddress': to_address,
                'value': value
            }).json()
            return res['txHash'] if res['success'] else None
        except Exception as error:
            print(error)
            return None


btc_helper = BTCHelper(BTC_BASED_COINS)
