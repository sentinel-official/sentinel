# coding=utf-8
from .config import CENTRAL_WALLET

TOKENS = [
    {
        'address': CENTRAL_WALLET,
        'decimals': 18,
        'name': 'Ethereum',
        'price_url': 'https://api.coinmarketcap.com/v1/ticker/ethereum/?convert=BTC',
        'symbol': 'ETH'
    },
    {
        'address': '0xa74476443119a942de498590fe1f2454d7d4ac0d',
        'decimals': 18,
        'name': 'Golem Network Token',
        'price_url': 'https://api.coinmarketcap.com/v1/ticker/golem-network-tokens/?convert=BTC',
        'symbol': 'GNT'
    },
    {
        'address': '0xd26114cd6ee289accf82350c8d8487fedb8a0c07',
        'decimals': 18,
        'name': 'OMGToken',
        'price_url': 'https://api.coinmarketcap.com/v1/ticker/omisego/?convert=BTC',
        'symbol': 'OMG'
    },
    {
        'address': '0xa44e5137293e855b1b7bc7e2c6f8cd796ffcb037',
        'decimals': 8,
        'name': 'SENTinel',
        'price_url': 'https://api.coinmarketcap.com/v1/ticker/sentinel/?convert=BTC',
        'symbol': 'SENT'
    },
    {
        'address': '0xe41d2489571d322189246dafa5ebde1f4699f498',
        'decimals': 18,
        'name': '0x Protocol Token',
        'price_url': 'https://api.coinmarketcap.com/v1/ticker/0x/?convert=BTC',
        'symbol': 'ZRX'
    }
]
