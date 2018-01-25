from .eth import eth_manager
from ..config import SENTINEL_ABI
from ..config import SENTINEL_ADDRESS
from ..config import SENTINEL_NAME

from ..config import VPNSERVICE_ABI
from ..config import VPNSERVICE_ADDRESS
from ..config import VPNSERVICE_NAME

from ..config import COINBASE_PASSWORD
from ..config import DECIMALS


class ContractManager(object):
    def __init__(self, sentinel, vpn_service):
        self.sentinel = sentinel
        self.vpn_service = vpn_service
        self.eth_manager = eth_manager
        self.contracts = [
            self.eth_manager.web3.eth.contract(contract_name=sentinel['name'], abi=sentinel['abi'], address=sentinel['address']),
            self.eth_manager.web3.eth.contract(contract_name=vpn_service['name'], abi=vpn_service['abi'], address=vpn_service['address'])
        ]

    def get_balance(self, account_addr):
        try:
            balance = self.contracts[0].call(
                {'from': account_addr}).balanceOf(account_addr)
        except Exception as err:
            return {'code': 201, 'error': str(err)}, None
        return None, balance / (DECIMALS * 1.0)

    def transfer_amount(self, account_addr, to_addr, amount,
                        tx_object, password, session_id=None):
        try:
            self.eth_manager.web3.personal.unlockAccount(
                account_addr, password)
            if session_id is None:
                tx_hash = self.contracts[0].transact(tx_object).transfer(to_addr, amount)
            else:
                tx_hash = self.contracts[1].transact(tx_object).payVpnSession(sentinel['address'], amount, session_id)
            self.eth_manager.web3.personal.lockAccount(account_addr)
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

    def add_vpn_usage(self, account_addr, to_addr, received_bytes, sent_bytes, session_duration,
                      amount, timestamp, password):
        try:
            self.eth_manager.web3.personal.unlockAccount(
                account_addr, password)
            tx_hash = self.contracts[1].transact(
                {'from': account_addr}).addVpnUsage(
                    to_addr, sent_bytes, session_duration,
                    amount, timestamp)
            self.eth_manager.web3.personal.lockAccount(account_addr)
        except Exception as err:
            return {'code': 207, 'error': str(err)}, None
        return None, tx_hash

    def gas_units(self, from_addr, to_addr, amount, session_id):
        try:
            if session_id is None:
                gas_units = self.contracts[0].estimateGas(
                    {'from': account_addr}).transfer(to_addr, amount)
            else:
                gas_units = self.contracts[1].estimateGas(
                    {'from': account_addr}).payVpnSession(sentinel['address'], amount, session_id)
        except Exception as err:
            return {'code': 208, 'error': str(err)}, None
        return None, gas_units


contract_manager = ContractManager(
    {'name': SENTINEL_NAME, 'abi': SENTINEL_ABI, 'address': SENTINEL_ADDRESS},
    {'name': VPNSERVICE_NAME, 'abi': VPNSERVICE_ABI, 'address': VPNSERVICE_ADDRESS})
