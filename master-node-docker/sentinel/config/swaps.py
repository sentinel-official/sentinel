# coding=utf-8

BTC_BASED_COINS = {
    'PIVX': {
        'ip': '',
        'port': 3000,
        'url': ''
    }
}
ETHEREUM_BASED_COINS = ['ETH', 'BNB', 'SENT']
ADDRESS = ''.lower()
PRIVATE_KEY = ''
FEE_PERCENTAGE = 0.01
TOKENS = [
    {
        'address': ADDRESS,
        'decimals': 18,
        'logo_url': 'https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png',
        'name': 'Ethereum',
        'price_url': 'https://api.coinmarketcap.com/v1/ticker/ethereum/?convert=SENT',
        'symbol': 'ETH',
        'coin_type': 'erc20'
    },
    {
        'address': '0xb8c77482e45f1f44de1745f52c74426c631bdd52',
        'decimals': 18,
        'logo_url': 'https://s2.coinmarketcap.com/static/img/coins/64x64/1839.png',
        'name': 'Binance Coin',
        'price_url': 'https://api.coinmarketcap.com/v1/ticker/binance-coin/?convert=SENT',
        'symbol': 'BNB',
        'coin_type': 'erc20'
    },
    {
        'address': None,
        'decimals': 0,
        'logo_url': 'https://s2.coinmarketcap.com/static/img/coins/64x64/1169.png',
        'name': 'PIVX',
        'price_url': 'https://api.coinmarketcap.com/v1/ticker/pivx/?convert=SENT',
        'symbol': 'PIVX',
        'coin_type': 'btc_fork'
    },
    {
        'address': '0xa44e5137293e855b1b7bc7e2c6f8cd796ffcb037',
        'decimals': 8,
        'logo_url': 'https://s2.coinmarketcap.com/static/img/coins/64x64/2643.png',
        'name': 'SENTinel',
        'price_url': 'https://api.coinmarketcap.com/v1/ticker/sentinel/?convert=SENT',
        'symbol': 'SENT',
        'coin_type': 'erc20'
    }
]
