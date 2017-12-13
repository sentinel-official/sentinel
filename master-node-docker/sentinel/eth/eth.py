import json
import time
from glob import glob
from os import path, unlink
from ethereum.tools import keys
from web3 import Web3, IPCProvider, HTTPProvider
from ..utils import logger


class ETHManager(object):
    def __init__(self, provider=None, data_dir=None, RPC_url=None):
        self.data_dir = path.join(path.expanduser(
            '~'), '.ethereum', 'sentinel') if data_dir is None else data_dir
        self.provider = 'ipc' if provider is None \
            else provider
        self.ipc_path = path.join(self.data_dir, 'geth.ipc')
        self.web3 = Web3(IPCProvider(self.ipc_path)) if self.provider == 'ipc' \
            else Web3(HTTPProvider(RPC_url))

    def create_account(self, password):
        try:
            account_addr = self.web3.personal.newAccount(password)
        except Exception as err:
            return {'code': 101, 'error': str(err)}, None
        return None, account_addr

    def get_keystore_path(self, account_addr):
        files = glob(path.join(self.data_dir, 'keystore',
                               '*{}'.format(account_addr[2:]).lower()))
        files_len = len(files)
        if files_len == 0:
            file_path = path.join(self.data_dir, 'keystore',
                                  account_addr[2:].lower())
        else:
            file_path = files[0]
        return file_path

    def get_keystore(self, account_addr):
        try:
            file_path = self.get_keystore_path(account_addr)
            keystore = json.load(open(file_path, 'r'))
        except Exception as err:
            return {'code': 102, 'error': str(err)}, None
        return None, keystore

    def get_privatekey(self, account_addr, password):
        try:
            _, keystore = self.get_keystore(account_addr)
            key_bytes = keys.decode_keystore_json(keystore, password)
            key_hex = self.web3.toHex(key_bytes)
        except Exception as err:
            return {'code': 103, 'error': str(err)}, None
        return None, key_hex

    def add_keystore(self, account_addr, keystore):
        try:
            file_path = self.get_keystore_path(account_addr)
            keystore_file = open(file_path, 'w')
            keystore_file.writelines(keystore)
            keystore_file.close()
        except Exception as err:
            return {'code': 104, 'error': str(err)}
        return None

    def remove_keystore(self, account_addr):
        try:
            file_path = self.get_keystore_path(account_addr)
            unlink(file_path)
        except Exception as err:
            return {'code': 105, 'error': str(err)}
        return None

    def get_balance(self, account_addr):
        try:
            balance = self.web3.eth.getBalance(account_addr)
        except Exception as err:
            return {'code': 106, 'error': str(err)}, None
        return None, balance

    def transfer_amount(self, account_addr, password, transaction):
        try:
            account_addr = transaction['from']
            self.web3.personal.unlockAccount(account_addr, password)
            tx_hash = self.web3.eth.sendTransaction(transaction)
            self.web3.personal.lockAccount(account_addr)
        except Exception as err:
            return {'code': 107, 'error': str(err)}, None
        return None, tx_hash

    def get_tx_receipt(self, tx_hash):
        try:
            receipt = self.web3.eth.getTransactionReceipt(tx_hash)
        except Exception as err:
            return {'code': 108, 'error': str(err)}, None
        return None, receipt


eth_manager = ETHManager()
logger.info(eth_manager.web3.isConnected())
