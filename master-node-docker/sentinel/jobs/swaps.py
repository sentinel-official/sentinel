# coding=utf-8
import time
from _thread import start_new_thread

from ..config import CENTRAL_WALLET
from ..config import CENTRAL_WALLET_PRIVATE_KEY
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
            sents = tokens.calculate_sents(token, value)
            error, tx_hash_1 = eth_helper.transfer_sents(CENTRAL_WALLET, to_address, sents, CENTRAL_WALLET_PRIVATE_KEY,
                                                         'main')
            if error is None:
                self.mark_tx(tx_hash_0, 1, 'Transaction is initiated successfully.', tx_hash_1)
                print('Transaction is initiated successfully.')
            else:
                self.mark_tx(tx_hash_0, 0, 'Error occurred while initiating transaction.')
                print('Error occurred while initiating transaction.')
        else:
            self.mark_tx(tx_hash_0, -1, 'From address is not CENTRAL WALLET.')
            print('From address is not CENTRAL WALLET.')

    def mark_tx(self, tx_hash_0, status, message, tx_hash_1=None):
        _ = db.token_swaps.find_one_and_update({
            'tx_hash_0': tx_hash_0
        }, {
            '$set': {
                'status': status,
                'message': message,
                'tx_hash_1': tx_hash_1,
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
            transactions = db.token_swaps.find({
                'status': 0
            })

            for transaction in transactions:
                try:
                    tx_hash_0 = transaction['tx_hash_0']
                    error, receipt = eth_helper.get_tx_receipt(tx_hash_0, 'main')
                    if (error is None) and (receipt is not None):
                        if receipt['status'] == 1:
                            error, tx = eth_helper.get_tx(tx_hash_0, 'main')
                            if (error is None) and (tx is not None):
                                from_address, to_address, tx_value, tx_input = str(tx['from']).lower(), str(
                                    tx['to']).lower(), int(tx['value']), tx['input']
                                if tx_value == 0 and len(tx_input) == 138:
                                    token = tokens.get_token(to_address)
                                    if (token is not None) and (token['name'] != 'SENTinel'):
                                        if tx_input[:10] == '0xa9059cbb':
                                            to_address = ('0x' + tx_input[10:74].lstrip('0').zfill(40)).lower()
                                            token_value = int('0x' + tx_input[74:138].lstrip('0'), 0)
                                            self.transfer(to_address, from_address, token, token_value, tx_hash_0)
                                        else:
                                            self.mark_tx(tx_hash_0, -1, 'Wrong transaction method.')
                                            print('Wrong transaction method.')
                                    else:
                                        self.mark_tx(tx_hash_0, -1, 'No token found.')
                                        print('No token found.')
                                elif tx_value > 0 and len(tx_input) == 2:
                                    token = tokens.get_token(to_address)
                                    self.transfer(to_address, from_address, token, tx_value, tx_hash_0)
                                else:
                                    self.mark_tx(tx_hash_0, -1, 'Not a valid transaction.')
                                    print('Not a valid transaction.')
                            else:
                                self.mark_tx(tx_hash_0, 0, 'Can\'t find the transaction.')
                                print('Can\'t find the transaction.')
                        else:
                            self.mark_tx(tx_hash_0, -1, 'Failed transaction.')
                            print('Failed transaction.')
                    else:
                        self.mark_tx(tx_hash_0, 0, 'Can\'t find the transaction receipt.')
                        print('Can\'t find the transaction receipt.')
                except Exception as err:
                    print(err)
            time.sleep(self.interval)
