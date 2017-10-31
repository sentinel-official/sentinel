import json
from glob import glob
from os import path, unlink
from ethereum.tools import keys
from web3 import Web3, IPCProvider, HTTPProvider


class ETHManager(object):
    def __init__(self, provider=None, data_dir=None, RPC_url=None):
        self.data_dir = path.join(path.expanduser('~'), '.ethereum', 'sentinel') if data_dir is None \
            else data_dir
        self.provider = 'ipc' if provider is None \
            else provider
        self.ipc_path = path.join(self.data_dir, 'geth.ipc')
        self.web3 = Web3(IPCProvider(self.ipc_path)) if self.provider == 'ipc' \
            else Web3(HTTPProvider(RPC_url))

    def create_account(self, password):
        account_addr = self.web3.personal.newAccount(password)
        return account_addr

    def keystore_path(self, account_addr):
        file_path = glob(path.join(
            self.data_dir, 'keystore', '*{}'.format(account_addr[2:])))[0]
        return file_path

    def keystore(self, account_addr):
        keystore_path = self.keystore_path(account_addr)
        keystore = json.load(open(keystore_path, 'r'))
        return keystore

    def privatekey(self, account_addr, password):
        keystore = self.keystore(account_addr)
        key_bytes = keys.decode_keystore_json(keystore, password)
        key_hex = self.web3.toHex(key_bytes)
        return key_hex

    def remove_keystore(self, account_addr):
        keystore_path = self.keystore_path(account_addr)
        unlink(keystore_path)

    def balance(self, account_addr):
        weis = self.web3.eth.getBalance(account_addr)
        balance = self.web3.fromWei(weis, 'ether')
        return balance

    def send_amount(self, account_addr, keystore, password, tx_details):
        self.write_keystore(account_addr, keystore)
        transaction = {
            'from': account_addr,
            'to': tx_details['to_addr'],
            'gas': tx_details['gas'],
            'value': tx_details['amount'],
        }
        self.web3.personal.unlockAccount(account_addr, password)
        tx_hash = self.web3.eth.sendTransaction(transaction)
        self.web3.personal.lockAccount(account_addr)
        self.remove_keystore(account_addr)
        return tx_hash

    def tx_receipt(self, tx_hash):
        receipt = self.web3.eth.getTransactionReceipt(tx_hash)
        return receipt

    def write_keystore(self, account_addr, keystore):
        keystore_path = path.join(self.data_dir, 'keystore', account_addr)
        keystore_file = open(keystore_path, 'w')
        keystore_file.writelines(keystore)
        keystore_file.close()
