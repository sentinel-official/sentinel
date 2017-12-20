from .eth import eth_manager
from ..config import CONTRACT_ABI
from ..config import CONTRACT_ADDRESS
from ..config import CONTRACT_NAME
from ..config import COINBASE_PASSWORD


class ContractManager(object):
    def __init__(self, name, abi, address, password):
        self.abi = abi
        self.name = name
        self.address = address
        self.eth_manager = eth_manager
        self.coinbase = eth_manager.web3.eth.coinbase
        self.password = password
        self.contract = self.eth_manager.web3.eth.contract(
            contract_name=name, abi=abi, address=address)

    def get_balance(self, account_addr):
        try:
            balance = self.contract.call(
                {'from': account_addr}).balanceOf(account_addr)
        except Exception as err:
            return {'code': 201, 'error': str(err)}, None
        return None, balance

    def transfer_amount(self, account_addr, to_addr, amount,
                        password, session_id=None):
        try:
            self.eth_manager.web3.personal.unlockAccount(
                account_addr, password)
            if session_id is None:
                tx_hash = self.contract.transact(
                    {'from': account_addr}).transfer(to_addr, amount)
            else:
                tx_hash = self.contract.transact(
                    {'from': account_addr}).payVpnSession(to_addr, amount, session_id)
            self.eth_manager.web3.personal.lockAccount(account_addr)
        except Exception as err:
            return {'code': 202, 'error': str(err)}, None
        return None, tx_hash

    def get_due_amount(self, account_addr):
        try:
            due = self.contract.call({'from': account_addr}).getDueAmount()
        except Exception as err:
            return {'code': 203, 'error': str(err)}, None
        return None, due

    def get_vpn_sessions(self, account_addr):
        try:
            sessions = self.contract.call(
                {'from': account_addr}).getVpnSessions()
        except Exception as err:
            return {'code': 204, 'error': str(err)}, None
        return None, sessions

    def get_vpn_usage(self, account_addr, index):
        try:
            usage = self.contract.call(
                {'from': account_addr}).getVpnUsage(index)
        except Exception as err:
            return {'code': 205, 'error': str(err)}, None
        return None, usage

    def add_vpn_usage(self, account_addr, to_addr, received_bytes, sent_bytes, session_duration,
                      amount, timestamp, password):
        try:
            self.eth_manager.web3.personal.unlockAccount(
                account_addr, password)
            print(to_addr, received_bytes, sent_bytes,
                  session_duration, amount, timestamp)
            tx_hash = self.contract.transact(
                {'from': account_addr}).addVpnUsage(
                    to_addr, received_bytes, sent_bytes, session_duration,
                    amount, timestamp)
            self.eth_manager.web3.personal.lockAccount(account_addr)
        except Exception as err:
            return {'code': 207, 'error': str(err)}, None
        return None, tx_hash


contract_manager = ContractManager(
    CONTRACT_NAME, CONTRACT_ABI, CONTRACT_ADDRESS, COINBASE_PASSWORD)
