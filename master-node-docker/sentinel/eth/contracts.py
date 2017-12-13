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
                {'from': account_addr}).getBalance()
        except Exception as err:
            return {'code': 201, 'error': str(err)}, None
        return None, float(balance)

    def transfer_amount(self, account_addr, password, to_addr, amount,
                        is_vpn_payment):
        try:
            self.eth_manager.web3.personal.unlockAccount(
                account_addr, password)
            tx_hash = self.contract.transact({'from': account_addr}).transferAmount(
                to_addr, amount, is_vpn_payment)
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

    def get_vpn_usage(self, account_addr, from_addr):
        try:
            usage = self.contract.call(
                {'from': account_addr}).getVpnUsage(from_addr)
        except Exception as err:
            return {'code': 204, 'error': str(err)}, None
        return None, usage

    def get_vpn_addrs(self, account_addr):
        try:
            addrs = self.contract.call(
                {'from': account_addr}).getVpnAddrs()
        except Exception as err:
            return {'code': 205, 'error': str(err)}, None
        return None, addrs

    def add_vpn_usage(self, account_addr, password, to_addr, used_bytes, amount, timestamp):
        try:
            self.eth_manager.web3.personal.unlockAccount(
                account_addr, password)
            print(to_addr, used_bytes, amount, timestamp)
            tx_hash = self.contract.transact(
                {'from': account_addr}).addVpnUsage(to_addr, used_bytes, amount, timestamp)
            self.eth_manager.web3.personal.lockAccount(account_addr)
        except Exception as err:
            return {'code': 206, 'error': str(err)}, None
        return None, tx_hash


contract_manager = ContractManager(
    CONTRACT_NAME, CONTRACT_ABI, CONTRACT_ADDRESS, COINBASE_PASSWORD)
