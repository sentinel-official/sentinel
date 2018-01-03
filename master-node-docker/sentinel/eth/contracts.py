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
    def __init__(self, sentinel, vpn_service, password):
        self.sentinel = sentinel
        self.vpn_service = vpn_service
        self.eth_manager = eth_manager
        self.coinbase = eth_manager.web3.eth.coinbase
        self.password = password
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
                        password, session_id=None):
        try:
            self.eth_manager.web3.personal.unlockAccount(
                account_addr, password)
            if session_id is None:
                tx_hash = self.contracts[0].transact(
                    {'from': account_addr}).transfer(to_addr, amount)
            else:
                tx_hash = self.contracts[1].transact(
                    {'from': account_addr}).payVpnSession(sentinel['address'], amount, session_id)
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
                    to_addr, received_bytes, session_duration,
                    amount, timestamp)
            self.eth_manager.web3.personal.lockAccount(account_addr)
        except Exception as err:
            return {'code': 207, 'error': str(err)}, None
        return None, tx_hash


contract_manager = ContractManager(
    {'name': SENTINEL_NAME, 'abi': SENTINEL_ABI, 'address': SENTINEL_ADDRESS},
    {'name': VPNSERVICE_NAME, 'abi': VPNSERVICE_ABI, 'address': VPNSERVICE_ADDRESS},
    COINBASE_PASSWORD)
