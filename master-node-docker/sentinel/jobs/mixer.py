# coding=utf-8
import time
from _thread import start_new_thread

from ..config import MIXER_WALLET
from ..config import MIXER_WALLET_PRIVATE_KEY
from ..config import SENTINEL_ADDRESS
from ..db import db
from ..helpers import eth_helper


class Mixer(object):
    def __init__(self, interval=(5 * 60)):
        self.interval = interval
        self.stop_thread = False
        self.t = None

    def transfer(self, from_address, to_address, token_name, value, tx_hash_0, tx_count, time_0):
        if from_address == MIXER_WALLET:
            new_tx_count = eth_helper.get_tx_count(to_address)
            if (new_tx_count >= (tx_count + 5)) or (int(time.time()) >= (time_0 + (60 * 60 * 24))):
                error, tx_hash_1 = True, None
                if token_name == 'Ethereum':
                    error, tx_hash_1 = eth_helper.transfer_eths(MIXER_WALLET, to_address, value,
                                                                MIXER_WALLET_PRIVATE_KEY, 'main')
                elif token_name == 'SENTinel':
                    error, tx_hash_1 = eth_helper.transfer_sents(MIXER_WALLET, to_address, value,
                                                                 MIXER_WALLET_PRIVATE_KEY, 'main')

                if error is None:
                    self.mark_tx(tx_hash_0, 1, 'Transaction is initiated successfully.', tx_hash_1)
                    print('Transaction is initiated successfully.')
                else:
                    self.mark_tx(tx_hash_0, 0, 'Error occurred while initiating transaction.')
                    print('Error occurred while initiating transaction.')
            else:
                self.mark_tx(tx_hash_0, 0, 'Not enough transactions or need time.')
                print('Not enough transactions count or need time.')
        else:
            self.mark_tx(tx_hash_0, -1, 'From address is not MIXER WALLET.')
            print('From address is not MIXER WALLET.')

    def mark_tx(self, tx_hash_0, status, message, tx_hash_1=None):
        _ = db.mixer.find_one_and_update({
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
            transactions = db.mixer.find({
                'status': 0
            })

            for transaction in transactions:
                try:
                    dest_addr, tx_hash_0, tx_count, time_0 = transaction['dest_addr'], transaction['tx_hash_0'], \
                                                             transaction['tx_count'], transaction['time_0']
                    error, receipt = eth_helper.get_tx_receipt(tx_hash_0, 'main')
                    if (error is None) and (receipt is not None):
                        if receipt['status'] == 1:
                            error, tx = eth_helper.get_tx(tx_hash_0, 'main')
                            if (error is None) and (tx is not None):
                                to_address, tx_value, tx_input = str(tx['to']).lower(), int(tx['value']), tx['input']
                                if tx_value == 0 and len(tx_input) == 138:
                                    if to_address == SENTINEL_ADDRESS:
                                        if tx_input[:10] == '0xa9059cbb':
                                            to_address = ('0x' + tx_input[10:74].lstrip('0').zfill(40)).lower()
                                            token_value = int('0x' + tx_input[74:138].lstrip('0'), 0)
                                            self.transfer(to_address, dest_addr, 'SENTinel', token_value, tx_hash_0,
                                                          tx_count, time_0)
                                        else:
                                            self.mark_tx(tx_hash_0, -1, 'Wrong transaction method.')
                                            print('Wrong transaction method.')
                                    else:
                                        self.mark_tx(tx_hash_0, -1, 'No token found.')
                                        print('No token found.')
                                elif tx_value > 0 and len(tx_input) == 2:
                                    self.transfer(to_address, dest_addr, 'Ethereum', tx_value, tx_hash_0, tx_count,
                                                  time_0)
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
