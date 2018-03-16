# coding=utf-8
import rlp
from ethereum.transactions import Transaction

from .eth import rinkeby
from ..config import COINBASE_ADDRESS
from ..config import COINBASE_PRIVATE_KEY
from ..config import VPNSERVICE_ABI
from ..config import VPNSERVICE_ADDRESS
from ..config import VPNSERVICE_NAME


class VpnServiceManager(object):
    def __init__(self):
        self.contract = rinkeby.web3.eth.contract(
            contract_name=VPNSERVICE_NAME, abi=VPNSERVICE_ABI, address=VPNSERVICE_ADDRESS)

    def pay_vpn_session(self, account_addr, amount, session_id):
        try:
            tx = Transaction(nonce=rinkeby.web3.eth.getTransactionCount(COINBASE_ADDRESS, 'pending'),
                             gasprice=rinkeby.web3.eth.gasPrice,
                             startgas=1000000,
                             to=VPNSERVICE_ADDRESS,
                             value=0,
                             data=rinkeby.web3.toBytes(hexstr=self.contract.encodeABI(fn_name='payVpnSession',
                                                                                      args=[account_addr, amount,
                                                                                            session_id])))
            tx.sign(COINBASE_PRIVATE_KEY)
            raw_tx = rinkeby.web3.toHex(rlp.encode(tx))
            tx_hash = rinkeby.web3.eth.sendRawTransaction(raw_tx)
        except Exception as err:
            return {'code': 201, 'error': str(err)}, None
        return None, tx_hash

    def set_initial_payment(self, account_addr, is_payed=True):
        try:
            tx = Transaction(nonce=rinkeby.web3.eth.getTransactionCount(COINBASE_ADDRESS, 'pending'),
                             gasprice=rinkeby.web3.eth.gasPrice,
                             startgas=1000000,
                             to=VPNSERVICE_ADDRESS,
                             value=0,
                             data=rinkeby.web3.toBytes(hexstr=self.contract.encodeABI(fn_name='setInitialPaymentOf',
                                                                                      args=[account_addr, is_payed])))
            tx.sign(COINBASE_PRIVATE_KEY)
            raw_tx = rinkeby.web3.toHex(rlp.encode(tx))
            tx_hash = rinkeby.web3.eth.sendRawTransaction(raw_tx)
        except Exception as err:
            return {'code': 202, 'error': str(err)}, None
        return None, tx_hash

    def get_due_amount(self, account_addr):
        try:
            caller_object = {
                'from': account_addr,
                'to': VPNSERVICE_ADDRESS,
                'data': rinkeby.web3.toHex(
                    rinkeby.web3.toBytes(hexstr=self.contract.encodeABI(fn_name='getDueAmountOf', args=[account_addr])))
            }
            due = rinkeby.web3.toInt(
                hexstr=rinkeby.web3.eth.call(caller_object))
        except Exception as err:
            return {'code': 203, 'error': str(err)}, None
        return None, due

    def get_vpn_sessions(self, account_addr):
        try:
            caller_object = {
                'from': account_addr,
                'to': VPNSERVICE_ADDRESS,
                'data': rinkeby.web3.toHex(rinkeby.web3.toBytes(
                    hexstr=self.contract.encodeABI(fn_name='getVpnSessionsOf', args=[account_addr])))
            }
            sessions = rinkeby.web3.toInt(
                hexstr=rinkeby.web3.eth.call(caller_object))
        except Exception as err:
            return {'code': 204, 'error': str(err)}, None
        return None, sessions

    def get_initial_payment(self, account_addr):
        try:
            caller_object = {
                'from': account_addr,
                'to': VPNSERVICE_ADDRESS,
                'data': rinkeby.web3.toHex(rinkeby.web3.toBytes(
                    hexstr=self.contract.encodeABI(fn_name='getInitialPaymentOf', args=[account_addr])))
            }
            is_payed = rinkeby.web3.toInt(
                hexstr=rinkeby.web3.eth.call(caller_object))
        except Exception as err:
            return {'code': 205, 'error': str(err)}, None
        return None, is_payed

    def get_vpn_usage(self, account_addr, index):
        try:
            caller_object = {
                'from': account_addr,
                'to': VPNSERVICE_ADDRESS,
                'data': rinkeby.web3.toHex(rinkeby.web3.toBytes(
                    hexstr=self.contract.encodeABI(fn_name='getVpnUsageOf', args=[account_addr, index])))
            }
            usage = rinkeby.web3.eth.call(caller_object)[2:]
            usage = [usage[i:i + 64] for i in range(0, len(usage), 64)]
            usage[0] = rinkeby.web3.toChecksumAddress(usage[0])
            usage[1:] = [rinkeby.web3.toInt(hexstr=usage[i])
                         for i in range(1, len(usage))]
            usage[-1] = usage[-1] != 0
        except Exception as err:
            return {'code': 206, 'error': str(err)}, None
        return None, usage

    def add_vpn_usage(self, from_addr, to_addr, sent_bytes, session_duration, amount, timestamp):
        try:
            tx = Transaction(nonce=rinkeby.web3.eth.getTransactionCount(COINBASE_ADDRESS, 'pending'),
                             gasprice=rinkeby.web3.eth.gasPrice,
                             startgas=1000000,
                             to=VPNSERVICE_ADDRESS,
                             value=0,
                             data=rinkeby.web3.toBytes(hexstr=self.contract.encodeABI(fn_name='addVpnUsage',
                                                                                      args=[from_addr, to_addr,
                                                                                            sent_bytes,
                                                                                            session_duration, amount,
                                                                                            timestamp])))
            tx.sign(COINBASE_PRIVATE_KEY)
            raw_tx = rinkeby.web3.toHex(rlp.encode(tx))
            tx_hash = rinkeby.web3.eth.sendRawTransaction(raw_tx)
        except Exception as err:
            return {'code': 207, 'error': str(err)}, None
        return None, tx_hash


vpn_service_manager = VpnServiceManager()
