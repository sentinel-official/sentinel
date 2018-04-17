# coding=utf-8
import time
from _thread import start_new_thread

import requests

from .config import CENTRAL_WALLET
from .config import CENTRAL_WALLET_PRIVATE_KEY
from .config import TOKENS
from .config import TOKEN_PRICE_URLS
from ..config import DECIMALS
from ..db import db
from ..helpers import eth_helper


class Swaps(object):
    def __init__(self, interval=60):
        self.interval = interval
        self.stop_thread = False
        self.t = None

    def get_btc_price(self, token_name):
        try:
            res = requests.get(TOKEN_PRICE_URLS[token_name])
            if token_name == 'SENTinel':
                btc_price = float(res.json()['last'])
            else:
                btc_price = float(res.json()[0]['price_btc'])
            return btc_price
        except Exception as e:
            print(e)

    def calculate_sents(self, token_name, value, decimals):
        sent_btc = self.get_btc_price('SENTinel')
        token_btc = self.get_btc_price(token_name)
        sents = ((value * token_btc) / (1.0 * (10 ** decimals))) / sent_btc
        return sents

    def transfer_sents(self, to_address, sents):
        sents = int(sents * DECIMALS)
        error, tx_hash = eth_helper.transfer_sents(CENTRAL_WALLET, to_address, sents, CENTRAL_WALLET_PRIVATE_KEY,
                                                   'main')
        return error, tx_hash

    def transfer(self, from_address, to_address, token_name, value, decimals, tx_hash_0):
        if from_address == CENTRAL_WALLET:
            sents = self.calculate_sents(token_name, value, decimals)
            error, tx_hash_1 = self.transfer_sents(to_address, sents)
            if error is None:
                _ = db.swaps.find_one_and_update({
                    'tx_hash_0': tx_hash_0
                }, {
                    '$set': {
                        'tx_hash_1': tx_hash_1,
                        'status': 1
                    }
                })
            else:
                print('Error occurred while initiating transaction.')
        else:
            print('Transferred to wrong wallet address.')

    def mask_as_error(self, tx_hash_0):
        _ = db.swaps.find_one_and_update({
            'tx_hash_0': tx_hash_0
        }, {
            '$set': {
                'status': -1
            }
        })

    def start(self):
        if self.t is None:
            self.t = start_new_thread(self.swap_thread, ())

    def stop(self):
        self.stop_thread = True

    def swap_thread(self):
        while self.stop_thread is False:
            transactions = db.swaps.find({
                'status': 0
            })

            for transaction in transactions:
                tx_hash_0 = transaction['tx_hash_0']
                error, receipt = eth_helper.get_receipt(tx_hash_0, 'main')
                if (error is None) and (receipt is not None):
                    if receipt['status'] == 1:
                        error, tx = eth_helper.get_transaction(tx_hash_0, 'main')
                        if (error is None) and (tx is not None):
                            from_address = str(tx['from']).lower()
                            tx_value = int(tx['value'])
                            tx_input = tx['input']
                            if tx_value == 0 and len(tx_input) == 138:
                                token = TOKENS[tx['to'].lower()]
                                if (token is not None) and (token['name'] != 'SENTinel'):
                                    token_name, decimals = token['name'], token['decimals']
                                    if tx_input[:10] == '0xa9059cbb':
                                        to_address = ('0x' + tx_input[10:74].lstrip('0')).lower()
                                        token_value = int('0x' + tx_input[74:138].lstrip('0'), 0)
                                        self.transfer(to_address, from_address, token_name, token_value, decimals,
                                                      tx_hash_0)
                                    else:
                                        self.mask_as_error(tx_hash_0)
                                        print('Wrong transaction method.')
                                else:
                                    self.mask_as_error(tx_hash_0)
                                    print('No token found.')
                            elif tx_value > 0 and len(tx_input) == 2:
                                to_address = tx['to']
                                self.transfer(to_address, from_address, 'ethereum', tx_value, 18, tx_hash_0)
                            else:
                                self.mask_as_error(tx_hash_0)
                                print('Not a valid transaction.')
                        else:
                            print('Can\'t find the transaction.')
                    else:
                        self.mask_as_error(tx_hash_0)
                        print('Failed transaction.')
                else:
                    print('Can\'t find the transaction receipt.')
            time.sleep(self.interval)
