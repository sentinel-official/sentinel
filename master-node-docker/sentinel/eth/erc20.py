# coding=utf-8
import rlp
from ethereum.transactions import Transaction

from .eth import eth_manager
from ..config import MAX_TX_TRY
from ..config import TOKENS


class ERC20Manager(object):
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
        except Exception as err:
            return {'code': 201, 'error': str(err)}, None
        return None, balance

    def transfer_amount(self, to_addr, amount, private_key, nonce):
        count, tx_hash = 0, None
        while count < MAX_TX_TRY:
            try:
                tx = Transaction(nonce=nonce + count,
                                 gasprice=self.net.web3.eth.gasPrice,
                                 startgas=1000000,
                                 to=self.address,
                                 value=0,
                                 data=self.net.web3.toBytes(
                                     hexstr=self.contract.encodeABI(fn_name='transfer', args=[to_addr, amount])))
                tx.sign(private_key)
                raw_tx = self.net.web3.toHex(rlp.encode(tx))
                tx_hash = self.net.web3.eth.sendRawTransaction(raw_tx)
                if len(tx_hash) > 0:
                    break
            except Exception as err:
                err = str(err)
                if '-32000' in err:
                    count += 1
                if (count >= MAX_TX_TRY) or ('-32000' not in err):
                    return {'code': 202, 'error': err}, None
        return None, tx_hash


erc20_manger = {
    'main': {},
    'rinkeby': {}
}
for symbol in TOKENS.keys():
    token = TOKENS[symbol]
    erc20_manger['main'][symbol] = ERC20Manager(
        eth_manager['main'], token['name'], token['address'], token['abi'])
    erc20_manger['rinkeby'][symbol] = ERC20Manager(
        eth_manager['rinkeby'], token['name'], token['address'], token['abi'])
