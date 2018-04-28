# coding=utf-8
import requests

from ..config import DECIMALS
from ..tokens_config import TOKENS


class Tokens(object):
    def __init__(self):
        self.prices = {}

    def get_usd_price(self, token):
        usd_price = self.prices[token['name']] if token['name'] in self.prices else None
        try:
            res = requests.get(token['price_url']).json()
            usd_price = float(res[0]['price_usd'])
            self.prices[token['name']] = usd_price
        except Exception as error:
            print(error)
        return usd_price

    def calculate_sents(self, token, value):
        value = value / (1.0 * (10 ** token['decimals']))
        sent_usd = self.get_usd_price(self.get_token(name='SENTinel'))
        token_usd = self.get_usd_price(token)
        sents = token_usd / sent_usd
        sents = int((sents * value) * DECIMALS)
        return sents

    def get_token(self, address=None, name=None):
        token = None
        if address is not None:
            token = [token for token in TOKENS if token['address'] == address]
        elif name is not None:
            token = [token for token in TOKENS if token['name'] == name]
        return token[0] if ((token is not None) and (len(token) > 0)) else None


tokens = Tokens()
