# coding=utf-8
import rlp
from ethereum.transactions import Transaction

from .eth import mainnet
from .eth import rinkeby
from ..config import DECIMALS
from ..config import SENTINEL_ABI
from ..config import SENTINEL_ADDRESS
from ..config import SENTINEL_NAME
from ..config import SENTINEL_TEST_ABI
from ..config import SENTINEL_TEST_ADDRESS
from ..config import SENTINEL_TEST_NAME


class SentinelManger(object):
    def __init__(self, net, name, address, abi):
        self.net = net
        self.address = address
        self.contract = net.web3.eth.contract(
            contract_name=name, abi=abi, address=address)

    def get_balance(self, account_addr):
        try:
            caller_object = {
                'from': account_addr,
                'to': self.address,
                'data': self.net.web3.toHex(
                    self.net.web3.toBytes(hexstr=self.contract.encodeABI(fn_name='balanceOf', args=[account_addr])))
            }
            balance = self.net.web3.toInt(
                hexstr=self.net.web3.eth.call(caller_object))
            balance = balance / (DECIMALS * 1.0)
        except Exception as err:
            return {'code': 201, 'error': str(err)}, None
        return None, balance

    def transfer_amount(self, from_addr, to_addr, amount, private_key):
        try:
            tx = Transaction(nonce=self.net.web3.eth.getTransactionCount(from_addr),
                             gasprice=self.net.web3.eth.gasPrice,
                             startgas=1000000,
                             to=self.address,
                             value=0,
                             data=self.net.web3.toBytes(
                                 hexstr=self.contract.encodeABI(fn_name='transfer', args=[to_addr, amount])))
            tx.sign(private_key)
            raw_tx = self.net.web3.toHex(rlp.encode(tx))
            tx_hash = self.net.web3.eth.sendRawTransaction(raw_tx)
        except Exception as err:
            return {'code': 202, 'error': str(err)}, None
        return None, tx_hash


sentinel_main = SentinelManger(
    mainnet, SENTINEL_NAME, SENTINEL_ADDRESS, SENTINEL_ABI)
sentinel_rinkeby = SentinelManger(
    rinkeby, SENTINEL_TEST_NAME, SENTINEL_TEST_ADDRESS, SENTINEL_TEST_ABI)
