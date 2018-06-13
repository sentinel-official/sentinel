# coding=utf-8
import time
from _thread import start_new_thread

from ..config import SWAP_ADDRESS
from ..config import SWAP_PRIVATE_KEY
from ..db import db
from ..helpers import eth_helper
from ..helpers import tokens
from ..helpers.swaps import is_valid_ethereum_swap


class Swaps(object):
    def __init__(self, interval=60):
        self.interval = interval
        self.stop_thread = False
        self.t = None

    def transfer(self, key, to_address, value, to_symbol):
        error, tx_hash_1 = None, None
        if to_symbol in ETHEREUM_BASED:
            error, tx_hash_1 = eth_helper.transfer(SWAP_ADDRESS, to_address, value, to_symbol, SWAP_PRIVATE_KEY, 'main')
        elif to_symbol in BTC_BASED:
            error, tx_hash_1 = btc_helper.transfer(to_address, value, to_symbol)
        else:
            self.update_status(key, {
                'status': -1,
                'message': 'Invalid to token.'
            })
        if error is None and tx_hash_1 is not None:
            self.update_status(key, {
                'status': 1,
                'message': 'Transaction is initiated successfully.',
            }, tx_hash_1)
        else:
            self.update_status(key, {
                'status': 0,
                'message': 'Error occurred while initiating transaction.'
            })

    def update_status(self, key, status, tx_hash=None):
        collection, find_key = None, None
        if len(key) == 66:
            find_key = {'tx_hash_0': key}
        elif len(key) == 34:
            find_key = {'address': key}
        _ = db.swaps.find_one_and_update(find_key, {
            '$set': {
                'status': status['status'],
                'message': status['message'],
                'tx_hash_1': tx_hash,
                'time_1': int(time.time())
            }
        })

    def start(self):
        if self.t is None:
            self.t = start_new_thread(self.thread, ())

    def stop(self):
        self.stop_thread = True

    def thread(self):
        while self.stop_thread is False:
            swaps = db.erc20_swaps.find({
                'status': 0
            })

            for swap in swaps:
                try:
                    from_symbol, to_symbol = swap['from_symbol'], swap['to_symbol']
                    if from_symbol in ETHEREUM_BASED:
                        tx_hash_0 = swap['tx_hash_0']
                        error, details = is_valid_ethereum_swap(tx_hash_0)
                        if error is None:
                            to_address, value = details[0], details[1]
                            from_token, to_token = details[2], tokens.get_token(to_symbol)
                            value = tokens.exchange(from_token, to_token, value)
                            self.transfer(tx_hash_0, to_address, value, to_symbol)
                        else:
                            self.update_status(tx_hash_0, error)
                    elif from_symbol in BTC_BASED:
                        from_address, to_address = swap['from_address'], swap['to_address']
                        from_token, to_token = tokens.get_token(from_symbol), tokens.get_token(to_symbol)
                        value = btc_helper.get_balance(from_address, from_symbol)
                        if value is not None and value > 0:
                            value = tokens.exchange(from_token, to_token, value)
                            self.transfer(from_address, to_address, value, to_symbol)
                except Exception as error:
                    print(error)
            time.sleep(self.interval)
