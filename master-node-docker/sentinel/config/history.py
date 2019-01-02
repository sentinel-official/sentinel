# coding=utf-8
from .tokens import MAIN_TOKENS
from .tokens import RINKEBY_TOKENS

API_KEY = ''
MAIN_URL = 'https://api.etherscan.io/api?apikey=' + API_KEY
RINKEBY_URL = 'https://api-rinkeby.etherscan.io/api?apikey=' + API_KEY
ETH_TRANS_URL = '&module=account&action=txlist&startblock=0&endblock=latest&offset=10&sort=desc&address='

SENT_TRANS_URL1 = '&module=logs&action=getLogs&fromBlock=0&toBlock=latest&address='
RINKEBY_SENT_URL2 = RINKEBY_TOKENS['SENT'][
                        'address'] + '&topic0=0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef&topic0_1_opr=and&topic1='
MAIN_SENT_URL2 = MAIN_TOKENS['SENT'][
                     'address'] + '&topic0=0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef&topic0_1_opr=and&topic1='
SENT_TRANS_URL3 = '&topic1_2_opr=or&topic2='
