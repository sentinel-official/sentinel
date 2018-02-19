import rlp
from .eth import eth_manager
from ethereum.transactions import Transaction
from ..config import SENTINEL_ABI
from ..config import SENTINEL_ADDRESS
from ..config import SENTINEL_NAME

from ..config import VPNSERVICE_ABI
from ..config import VPNSERVICE_ADDRESS
from ..config import VPNSERVICE_NAME

from ..config import COINBASE_ADDRESS
from ..config import COINBASE_PASSWORD
from ..config import DECIMALS


class ContractManager(object):
    def __init__(self, sentinel, vpn_service):
        self.sentinel = sentinel
        self.vpn_service = vpn_service
        self.contracts = [
            eth_manager.web3.eth.contract(contract_name=sentinel['name'], abi=sentinel['abi'], address=sentinel['address']),
            eth_manager.web3.eth.contract(contract_name=vpn_service['name'], abi=vpn_service['abi'], address=vpn_service['address'])
        ]

    def get_balance(self, account_addr):
        try:
            balance = self.contracts[0].call(
                {'from': account_addr}).balanceOf(account_addr)
        except Exception as err:
            return {'code': 201, 'error': str(err)}, None
        return None, balance / (DECIMALS * 1.0)

    def transfer_amount(self, from_addr, to_addr, amount, private_key, session_id=None):
        try:
            print(from_addr, to_addr, amount, private_key, session_id)
            if session_id is None:
                tx = Transaction(nonce=eth_manager.web3.eth.getTransactionCount(from_addr),
                                 gasprice=eth_manager.web3.eth.gasPrice,
                                 startgas=100000,
                                 to=self.sentinel['address'],
                                 value=0,
                                 data=eth_manager.web3.toBytes(hexstr=self.contracts[0].encodeABI(fn_name='transfer', args=[to_addr, amount])))
            else:
                tx = Transaction(nonce=eth_manager.web3.eth.getTransactionCount(COINBASE_ADDRESS),
                                 gasprice=eth_manager.web3.eth.gasPrice,
                                 startgas=100000,
                                 to=self.sentinel['address'],
                                 value=0,
                                 data=eth_manager.web3.toBytes(hexstr=self.contracts[1].encodeABI(fn_name='payVpnSession', args=[from_addr, amount, session_id])))
            tx.sign(private_key)
            raw_tx = eth_manager.web3.toHex(rlp.encode(tx))
            tx_hash = eth_manager.web3.eth.sendRawTransaction(raw_tx)
        except Exception as err:
            return {'code': 202, 'error': str(err)}, None
        return None, tx_hash

    def get_due_amount(self, account_addr):
        try:
            due = self.contracts[1].call({'from': account_addr}).getDueAmountOf(account_addr)
        except Exception as err:
            return {'code': 203, 'error': str(err)}, None
        return None, due

    def get_vpn_sessions(self, account_addr):
        try:
            sessions = self.contracts[1].call(
                {'from': account_addr}).getVpnSessionsOf(account_addr)
        except Exception as err:    
            return {'code': 204, 'error': str(err)}, None
        return None, sessions

    def get_vpn_usage(self, account_addr, index):
        try:
            usage = self.contracts[1].call(
                {'from': account_addr}).getVpnUsageOf(account_addr, index)
        except Exception as err:
            return {'code': 205, 'error': str(err)}, None
        return None, usage

    def add_vpn_usage(self, from_addr, to_addr, received_bytes, sent_bytes, session_duration,
                      amount, timestamp, private_key):
        try:
            tx = Transaction(nonce=eth_manager.web3.eth.getTransactionCount(from_addr),
                             gasprice=eth_manager.web3.eth.gasPrice,
                             startgas=100000,
                             to=self.vpn_service['address'],
                             value=0,
                             data=eth_manager.web3.toBytes(hexstr=self.contracts[1].encodeABI(fn_name='addVpnUsage', args=[to_addr, sent_bytes, session_duration, amount, timestamp])))
            tx.sign(private_key)
            raw_tx = eth_manager.web3.toHex(rlp.encode(tx))
            tx_hash = eth_manager.web3.eth.sendRawTransaction(raw_tx)
        except Exception as err:
            return {'code': 207, 'error': str(err)}, None
        return None, tx_hash

    def gas_units(self, from_addr, to_addr, amount, session_id):
        try:
            if session_id is None:
                gas_units = self.contracts[0].estimateGas(
                    {'from': from_addr}).transfer(to_addr, amount)
            else:
                gas_units = self.contracts[1].estimateGas(
                    {'from': COINBASE_ADDRESS}).payVpnSession(from_addr, amount, session_id)
        except Exception as err:
            return {'code': 208, 'error': str(err)}, None
        return None, gas_units


contract_manager = ContractManager(
    {'name': SENTINEL_NAME, 'abi': SENTINEL_ABI, 'address': SENTINEL_ADDRESS},
    {'name': VPNSERVICE_NAME, 'abi': VPNSERVICE_ABI, 'address': VPNSERVICE_ADDRESS})
