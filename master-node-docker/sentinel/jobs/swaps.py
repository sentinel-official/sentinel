# coding=utf-8
import time
from _thread import start_new_thread

from ..config import CENTRAL_WALLET
from ..config import CENTRAL_WALLET_PRIVATE_KEY
from ..config import DECIMALS
from ..db import db
from ..helpers import eth_helper
from ..helpers import tokens


class Swaps(object):
    def __init__(self, interval=60):
        self.interval = interval
        self.stop_thread = False
        self.t = None

    def transfer(self, from_address, to_address, token, value, tx_hash_0):
        if from_address == CENTRAL_WALLET:
            sents = int(tokens.calculate_sents(token, value) * DECIMALS)
            error, tx_hash = eth_helper.transfer_sents(CENTRAL_WALLET, to_address, sents, CENTRAL_WALLET_PRIVATE_KEY,
                                                       'main')
            if error is None:
                _ = db.token_swaps.find_one_and_update({
                    'tx_hash_0': tx_hash_0
                }, {
                    '$set': {
                        'tx_hash_1': tx_hash,
                        'status': 1
                    }
                })
            else:
                print('Error occurred while initiating transaction.')
        else:
            print('From address is not CENTRAL WALLET.')

    def mark_as_error(self, tx_hash_0):
        _ = db.token_swaps.find_one_and_update({
            'tx_hash_0': tx_hash_0
        }, {
            '$set': {
                'status': -1
            }
        })

    def start(self):
        if self.t is None:
            self.t = start_new_thread(self.thread, ())

    def stop(self):
        self.stop_thread = True

    def thread(self):
        while self.stop_thread is False:
            transactions = db.token_swaps.find({
                'status': 0
            })

            for transaction in transactions:
                tx_hash_0 = transaction['tx_hash_0']
                error, receipt = eth_helper.get_receipt(tx_hash_0, 'main')
                if (error is None) and (receipt is not None):
                    if receipt['status'] == 1:
                        error, tx = eth_helper.get_transaction(tx_hash_0, 'main')
                        if (error is None) and (tx is not None):
                            from_address, tx_value, tx_input = str(tx['from']).lower(), int(tx['value']), tx['input']
                            if tx_value == 0 and len(tx_input) == 138:
                                token = tokens.get_token(tx['to'])
                                if (token is not None) and (token['name'] != 'SENTinel'):
                                    if tx_input[:10] == '0xa9059cbb':
                                        to_address = ('0x' + tx_input[10:74].lstrip('0')).lower()
                                        token_value = int('0x' + tx_input[74:138].lstrip('0'), 0)
                                        self.transfer(to_address, from_address, token, token_value, tx_hash_0)
                                    else:
                                        self.mark_as_error(tx_hash_0)
                                        print('Wrong transaction method.')
                                else:
                                    self.mark_as_error(tx_hash_0)
                                    print('No token found.')
                            elif tx_value > 0 and len(tx_input) == 2:
                                to_address, token = tx['to'], tokens.get_token('')
                                self.transfer(to_address, from_address, token, tx_value, tx_hash_0)
                            else:
                                self.mark_as_error(tx_hash_0)
                                print('Not a valid transaction.')
                        else:
                            print('Can\'t find the transaction.')
                    else:
                        self.mark_as_error(tx_hash_0)
                        print('Failed transaction.')
                else:
                    print('Can\'t find the transaction receipt.')
            time.sleep(self.interval)
