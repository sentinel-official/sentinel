# coding=utf-8
import requests

from ..pivx_config import server


class Pivx(object):
    def __init__(self, config):
        self.server = config

    def get_new_address(self):
        try:
            url = 'http://{}:{}/address'.format(server['ip'], server['port'])
            res = requests.get(url).json()
            return res['address'] if res['success'] else None
        except Exception as error:
            return None

    def get_balance(self, address):
        try:
            url = 'http://{}:{}/balance?address={}'.format(server['ip'], server['port'], address)
            res = requests.get(url).json()
            return res['balance'] if res['success'] else None
        except Exception as error:
            return None


pivx = Pivx(server)
