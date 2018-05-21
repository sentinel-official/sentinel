# coding=utf-8
from .config import CENTRAL_WALLET

TOKENS = [
    {
        'address': CENTRAL_WALLET,
        'decimals': 18,
        'logo_url': 'https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png',
        'name': 'Ethereum',
        'price_url': 'https://api.coinmarketcap.com/v1/ticker/ethereum/?convert=SENT',
        'symbol': 'ETH'
    },
    {
        'address': '0xb8c77482e45f1f44de1745f52c74426c631bdd52',
        'decimals': 18,
        'logo_url': 'https://s2.coinmarketcap.com/static/img/coins/64x64/1839.png',
        'name': 'Binance Coin',
        'price_url': 'https://api.coinmarketcap.com/v1/ticker/binance-coin/?convert=SENT',
        'symbol': 'BNB'
    },
    {
        'address': '0xa44e5137293e855b1b7bc7e2c6f8cd796ffcb037',
        'decimals': 8,
        'logo_url': 'https://s2.coinmarketcap.com/static/img/coins/64x64/2643.png',
        'name': 'SENTinel',
        'price_url': 'https://api.coinmarketcap.com/v1/ticker/sentinel/?convert=SENT',
        'symbol': 'SENT'
    }
]
