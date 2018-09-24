# coding=utf-8
import rlp
from ethereum.transactions import Transaction

from .eth import eth_manager
from ..config import MAIN_TOKENS
from ..config import RINKEBY_TOKENS


class ERC20Manager(object):
    def __init__(self, net, name, address, abi):
        self.net = net
        self.address = address
        self.contract = net.web3.eth.contract(contract_name=name, abi=abi, address=address)

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
        except Exception as err:
            return {
                       'code': 201,
                       'error': str(err)
                   }, None
        return None, balance

    def transfer_amount(self, from_addr, to_addr, amount, private_key):
        from ..helpers import nonce_manager
        try:
            nonce = nonce_manager.get_nonce(from_addr, self.net.chain)
            tx = Transaction(nonce=nonce,
                             gasprice=self.net.web3.eth.gasPrice,
                             startgas=1000000,
                             to=self.address,
                             value=0,
                             data=self.net.web3.toBytes(
                                 hexstr=self.contract.encodeABI(fn_name='transfer', args=[to_addr, amount])))
            tx.sign(private_key)
            raw_tx = self.net.web3.toHex(rlp.encode(tx))
            tx_hash = self.net.web3.eth.sendRawTransaction(raw_tx)
            nonce_manager.set_nonce(from_addr, self.net.chain, nonce + 1)
        except Exception as err:
            nonce_manager.set_nonce(from_addr, self.net.chain)
            if '-32000' not in str(err):
                return {
                           'code': 202,
                           'error': str(err)
                       }, None
        return None, tx_hash


erc20_manger = {
    'main': {},
    'rinkeby': {}
}
for symbol in MAIN_TOKENS.keys():
    token = MAIN_TOKENS[symbol]
    erc20_manger['main'][symbol] = ERC20Manager(eth_manager['main'], token['name'], token['address'], token['abi'])
for symbol in RINKEBY_TOKENS.keys():
    token = RINKEBY_TOKENS[symbol]
    erc20_manger['rinkeby'][symbol] = ERC20Manager(eth_manager['rinkeby'], token['name'], token['address'],
                                                   token['abi'])
