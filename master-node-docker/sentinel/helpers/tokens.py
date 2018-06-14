# coding=utf-8
import requests

from ..config import SWAP_TOKENS


class Tokens(object):
    def __init__(self, swap_tokens):
        self.tokens = {}
        for token in swap_tokens:
            self.tokens[token['symbol']] = token

    def get_price(self, token):
        price = None
        try:
            res = requests.get(token['price_url'])
            res = res.json()
            price = float(res[0]['price_btc'])
        except Exception as error:
            print(error)
        return price

    def exchange(self, from_token, to_token, value):
        value = value / (1.0 * (10 ** from_token['decimals']))
        from_price = self.get_price(from_token)
        to_price = self.get_price(to_token)
        return (value * (from_price / to_price)) * 10 ** to_token['decimals']

    def get_token(self, symbol=None, address=None):
        if symbol is not None:
            return self.tokens[symbol]
        elif address is not None:
            for symbol in self.tokens:
                token = self.tokens[symbol]
                if token['address'] == address:
                    return token
        return None


tokens = Tokens(SWAP_TOKENS)
