import rlp
from ethereum import utils
from ethereum.tools import keys
from ethereum.transactions import Transaction
from eth_keyfile import create_keyfile_json
from os import path, unlink, urandom
from web3 import Web3, IPCProvider, HTTPProvider


class ETHManager(object):
    def __init__(self, provider=None, data_dir=None, RPC_url=None):
        self.data_dir = path.join(path.expanduser(
            '~'), '.ethereum') if data_dir is None else data_dir
        self.provider = 'ipc' if provider is None \
            else provider
        self.ipc_path = path.join(self.data_dir, 'geth.ipc')
        self.web3 = Web3(IPCProvider(self.ipc_path)) if self.provider == 'ipc' \
            else Web3(HTTPProvider(RPC_url))

    def create_account(self, password):
        try:
            password = password.encode()
            private_key = utils.sha3(urandom(4096))
            raw_address = utils.privtoaddr(private_key)
            account_addr = utils.checksum_encode(raw_address)
            keystore_data = create_keyfile_json(private_key, password)
        except Exception as err:
            return {'code': 101, 'error': str(err)}, None, None, None
        return None, account_addr, private_key.hex(), keystore_data

    def get_privatekey(self, keystore_data, password):
        try:
            key_bytes = keys.decode_keystore_json(keystore_data, password)
            key_hex = self.web3.toHex(key_bytes)
        except Exception as err:
            return {'code': 102, 'error': str(err)}, None
        return None, key_hex

    def get_balance(self, account_addr):
        try:
            balance = self.web3.eth.getBalance(account_addr)
            balance = balance / ((10 ** 18) * 1.0)
        except Exception as err:
            return {'code': 103, 'error': str(err)}, None
        return None, balance

    def transfer_amount(self, from_addr, to_addr, amount, private_key):
        try:
            tx = Transaction(nonce=self.web3.eth.getTransactionCount(from_addr),
                             gasprice=self.web3.eth.gasPrice,
                             startgas=100000,
                             to=to_addr,
                             value=amount,
                             data='')
            tx.sign(private_key)
            raw_tx = self.web3.toHex(rlp.encode(tx))
            tx_hash = self.web3.eth.sendRawTransaction(raw_tx)
        except Exception as err:
            return {'code': 104, 'error': str(err)}, None
        return None, tx_hash

    def get_tx_receipt(self, tx_hash):
        try:
            receipt = self.web3.eth.getTransactionReceipt(tx_hash)
        except Exception as err:
            return {'code': 105, 'error': str(err)}, None
        return None, receipt


eth_manager = ETHManager(
    provider='rpc', RPC_url='https://mainnet.infura.io/aiAxnxbpJ4aG0zed1aMy')
mainnet = ETHManager(
    provider='rpc', RPC_url='https://mainnet.infura.io/aiAxnxbpJ4aG0zed1aMy')
rinkeby = ETHManager(
    provider='rpc', RPC_url='https://rinkeby.infura.io/aiAxnxbpJ4aG0zed1aMy')
