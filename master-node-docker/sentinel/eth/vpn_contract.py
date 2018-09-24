# coding=utf-8
import rlp
from ethereum.transactions import Transaction

from .eth import eth_manager
from ..config import COINBASE_ADDRESS
from ..config import COINBASE_PRIVATE_KEY
from ..config import VPN_SERVICE
from ..helpers import redis_manager


class VpnServiceManager(object):
    def __init__(self, net, name, address, abi):
        self.net = net
        self.address = address
        self.contract = net.web3.eth.contract(contract_name=name, abi=abi, address=address)

    def pay_vpn_session(self, account_addr, amount, session_id):
        try:
            nonce = redis_manager.get_nonce(COINBASE_ADDRESS, self.net.chain)
            tx = Transaction(nonce=nonce,
                             gasprice=self.net.web3.eth.gasPrice,
                             startgas=1000000,
                             to=self.address,
                             value=0,
                             data=self.net.web3.toBytes(hexstr=self.contract.encodeABI(fn_name='payVpnSession',
                                                                                       args=[account_addr, amount,
                                                                                             session_id])))
            tx.sign(COINBASE_PRIVATE_KEY)
            raw_tx = self.net.web3.toHex(rlp.encode(tx))
            tx_hash = self.net.web3.eth.sendRawTransaction(raw_tx)
            redis_manager.set_nonce(COINBASE_ADDRESS, self.net.chain, nonce + 1)
        except Exception as err:
            return {
                       'code': 301,
                       'error': str(err)
                   }, None
        return None, tx_hash

    def set_initial_payment(self, account_addr, is_paid=True):
        try:
            nonce = redis_manager.get_nonce(COINBASE_ADDRESS, self.net.chain)
            tx = Transaction(nonce=nonce,
                             gasprice=self.net.web3.eth.gasPrice,
                             startgas=1000000,
                             to=self.address,
                             value=0,
                             data=self.net.web3.toBytes(
                                 hexstr=self.contract.encodeABI(fn_name='setInitialPaymentStatusOf',
                                                                args=[account_addr, is_paid])))
            tx.sign(COINBASE_PRIVATE_KEY)
            raw_tx = self.net.web3.toHex(rlp.encode(tx))
            tx_hash = self.net.web3.eth.sendRawTransaction(raw_tx)
            redis_manager.set_nonce(COINBASE_ADDRESS, self.net.chain, nonce + 1)
        except Exception as err:
            return {
                       'code': 302,
                       'error': str(err)
                   }, None
        return None, tx_hash

    def get_due_amount(self, account_addr):
        try:
            caller_object = {
                'from': account_addr,
                'to': self.address,
                'data': self.net.web3.toHex(self.net.web3.toBytes(
                    hexstr=self.contract.encodeABI(fn_name='getDueAmountOf', args=[account_addr])))
            }
            due_amount = self.net.web3.toInt(hexstr=self.net.web3.eth.call(caller_object))
        except Exception as err:
            return {
                       'code': 303,
                       'error': str(err)
                   }, None
        return None, due_amount

    def get_vpn_sessions_count(self, account_addr):
        try:
            caller_object = {
                'from': account_addr,
                'to': self.address,
                'data': self.net.web3.toHex(self.net.web3.toBytes(
                    hexstr=self.contract.encodeABI(fn_name='getVpnSessionsCountOf', args=[account_addr])))
            }
            sessions_count = self.net.web3.toInt(hexstr=self.net.web3.eth.call(caller_object))
        except Exception as err:
            return {
                       'code': 304,
                       'error': str(err)
                   }, None
        return None, sessions_count

    def get_initial_payment(self, account_addr):
        try:
            caller_object = {
                'from': account_addr,
                'to': self.address,
                'data': self.net.web3.toHex(self.net.web3.toBytes(
                    hexstr=self.contract.encodeABI(fn_name='getInitialPaymentStatusOf', args=[account_addr])))
            }
            is_paid = self.net.web3.toInt(hexstr=self.net.web3.eth.call(caller_object))
        except Exception as err:
            return {
                       'code': 305,
                       'error': str(err)
                   }, None
        return None, is_paid == 1

    def get_vpn_usage(self, account_addr, session_id):
        try:
            caller_object = {
                'from': account_addr,
                'to': self.address,
                'data': self.net.web3.toHex(self.net.web3.toBytes(
                    hexstr=self.contract.encodeABI(fn_name='getVpnUsageOf', args=[account_addr, session_id])))
            }
            usage = self.net.web3.eth.call(caller_object)[2:]
            usage = [usage[i:i + 64] for i in range(0, len(usage), 64)]
            usage[0] = self.net.web3.toChecksumAddress(usage[0])
            usage[1:] = [self.net.web3.toInt(hexstr=usage[i]) for i in range(1, len(usage))]
            usage[-1] = usage[-1] != 0
        except Exception as err:
            return {
                       'code': 306,
                       'error': str(err)
                   }, None
        return None, usage

    def add_vpn_usage(self, from_addr, to_addr, sent_bytes, session_duration, amount, timestamp, session_id):
        try:
            nonce = redis_manager.get_nonce(COINBASE_ADDRESS, self.net.chain)
            tx = Transaction(nonce=nonce,
                             gasprice=self.net.web3.eth.gasPrice,
                             startgas=1000000,
                             to=self.address,
                             value=0,
                             data=self.net.web3.toBytes(hexstr=self.contract.encodeABI(fn_name='addVpnUsage',
                                                                                       args=[from_addr, to_addr,
                                                                                             sent_bytes,
                                                                                             session_duration, amount,
                                                                                             timestamp, session_id])))
            tx.sign(COINBASE_PRIVATE_KEY)
            raw_tx = self.net.web3.toHex(rlp.encode(tx))
            tx_hash = self.net.web3.eth.sendRawTransaction(raw_tx)
            redis_manager.set_nonce(COINBASE_ADDRESS, self.net.chain, nonce + 1)
        except Exception as err:
            return {
                       'code': 307,
                       'error': str(err)
                   }, None
        return None, tx_hash


vpn_service_manager = VpnServiceManager(eth_manager['rinkeby'], VPN_SERVICE['name'], VPN_SERVICE['address'],
                                        VPN_SERVICE['abi'])
