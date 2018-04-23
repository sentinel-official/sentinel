# coding=utf-8
import requests

from ..tokens_config import TOKENS


class Tokens(object):
    def __init__(self):
        self.prices = {}

    def get_btc_price(self, token):
        btc_price = self.prices[token['name']] if token['name'] in self.prices else None
        try:
            res = requests.get(token['price_url']).json()
            btc_price = float(res[0]['price_btc'])
            self.prices[token['name']] = btc_price
        except Exception as error:
            print(error)
        return btc_price

    def calculate_sents(self, token, value):
        value = value / (1.0 * (10 ** token['decimals']))
        sent_btc = self.get_btc_price(self.get_token(name='SENTinel'))
        token_btc = self.get_btc_price(token)
        sents = token_btc / sent_btc
        sents = sents * value
        return sents

    def get_token(self, address=None, name=None):
        token = None
        if address is not None:
            token = [token for token in TOKENS if token['address'] == address]
        elif name is not None:
            token = [token for token in TOKENS if token['name'] == name]
        return token[0] if ((token is not None) and (len(token) > 0)) else None


tokens = Tokens()
