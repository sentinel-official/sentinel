# coding=utf-8
import requests

from ..tokens_config import TOKENS


class Tokens(object):
    def __init__(self):
        self.prices = {}

    def get_btc_price(self, token):
        btc_price = self.prices[token['name']]
        try:
            res = requests.get(token['price_url']).json()
            btc_price = float(res['last']) if token['name'] == 'SENTinel' else float(res[0]['price_btc'])
        except Exception as error:
            print(error)
        return btc_price

    def calculate_sents(self, token, value):
        sent_btc = self.get_btc_price(TOKENS['SENTinel'])
        token_btc = self.get_btc_price(token)
        sents = ((value * token_btc) / (1.0 * (10 ** token['decimals']))) / sent_btc
        return sents

    def get_token(self, address):
        return TOKENS[address.lower()]


tokens = Tokens()
