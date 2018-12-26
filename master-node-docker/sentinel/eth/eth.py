# coding=utf-8
from os import path, urandom

import rlp
from eth_keyfile import create_keyfile_json
from ethereum import utils
from ethereum.tools import keys
from ethereum.transactions import Transaction
from web3 import HTTPProvider, IPCProvider, Web3


class ETHManager(object):
    def __init__(self, provider=None, data_dir=None, rpc_url=None, chain=None):
        self.chain = chain
        self.data_dir = path.join(path.expanduser('~'), '.ethereum') if data_dir is None else data_dir
        self.provider = 'ipc' if provider is None else provider
        self.ipc_path = path.join(self.data_dir, 'geth.ipc')
        self.web3 = Web3(IPCProvider(self.ipc_path)) if self.provider == 'ipc' else Web3(HTTPProvider(rpc_url))

    def create_account(self, password):
        try:
            password = password.encode()
            private_key = utils.sha3(urandom(4096))
            raw_address = utils.privtoaddr(private_key)
            account_addr = utils.checksum_encode(raw_address)
            keystore_data = create_keyfile_json(private_key, password)
        except Exception as err:
            return {
                       'code': 101,
                       'error': str(err)
                   }, None, None, None
        return None, account_addr, private_key.hex(), keystore_data

    def get_privatekey(self, keystore_data, password):
        try:
            key_bytes = keys.decode_keystore_json(keystore_data, password)
            key_hex = self.web3.toHex(key_bytes)
        except Exception as err:
            return {
                       'code': 102,
                       'error': str(err)
                   }, None
        return None, key_hex

    def get_address(self, private_key):
        try:
            private_key = self.web3.toBytes(private_key)
            raw_address = utils.privtoaddr(private_key)
            account_addr = utils.checksum_encode(raw_address)
        except Exception as err:
            return {
                       'code': 103,
                       'error': str(err)
                   }, None
        return None, account_addr

    def get_balance(self, account_addr):
        try:
            balance = self.web3.eth.getBalance(account_addr)
        except Exception as err:
            return {
                       'code': 104,
                       'error': str(err)
                   }, None
        return None, balance

    def get_transaction_count(self, account_addr):
        try:
            tx_count = self.web3.eth.getTransactionCount(account_addr, 'pending')
        except Exception as err:
            return {
                       'code': 105,
                       'error': str(err)
                   }, None
        return None, tx_count

    def send_raw_transaction(self, tx_data):
        try:
            tx_hash = self.web3.eth.sendRawTransaction(tx_data)
        except Exception as err:
            return {
                       'code': 106,
                       'error': str(err)
                   }, None
        return None, tx_hash

    def transfer_amount(self, from_addr, to_addr, amount, private_key):
        from ..helpers import nonce_manager
        try:
            nonce = nonce_manager.get_nonce(from_addr, self.chain)
            tx = Transaction(nonce=nonce,
                             gasprice=self.web3.eth.gasPrice,
                             startgas=1000000,
                             to=to_addr,
                             value=amount,
                             data='')
            tx.sign(private_key)
            raw_tx = self.web3.toHex(rlp.encode(tx))
            tx_hash = self.web3.eth.sendRawTransaction(raw_tx)
            nonce_manager.set_nonce(from_addr, self.chain, nonce + 1)
        except Exception as err:
            nonce_manager.set_nonce(from_addr, self.chain)
            return {
                       'code': 107,
                       'error': str(err)
                   }, None
        return None, tx_hash

    def get_tx_receipt(self, tx_hash):
        try:
            receipt = self.web3.eth.getTransactionReceipt(tx_hash)
        except Exception as err:
            return {
                       'code': 108,
                       'error': str(err)
                   }, None
        return None, receipt

    def get_tx(self, tx_hash):
        try:
            receipt = self.web3.eth.getTransaction(tx_hash)
        except Exception as err:
            return {
                       'code': 109,
                       'error': str(err)
                   }, None
        return None, receipt


eth_manager = {
    'main': ETHManager(provider='rpc', rpc_url='https://mainnet.infura.io/aiAxnxbpJ4aG0zed1aMy', chain='main'),
    'rinkeby': ETHManager(provider='rpc', rpc_url='https://rinkeby.infura.io/aiAxnxbpJ4aG0zed1aMy', chain='rinkeby')
}
