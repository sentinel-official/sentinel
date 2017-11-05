from .eth import eth_manager
from ..config import CONTRACT_ABI
from ..config import CONTRACT_ADDRESS
from ..config import CONTRACT_NAME
from ..config import COINBASE_PASSWORD
from ..config import CONV_UNITS


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

    def balance(self, account_addr):
        balance = self.contract.call(
            {'from': self.coinbase}).getBalanceOf(account_addr)
        return balance

    def send_amount(self, from_addr, to_addr, amount):
        gas_amount = self.estimate_gas_amount(from_addr, to_addr, amount)
        tx_address = self.transfer_amount(
            from_addr, to_addr, amount, gas_amount)
        return tx_address

    def transfer_amount(self, from_addr, to_addr, amount, gas_amount):
        self.eth_manager.web3.personal.unlockAccount(
            self.coinbase, self.password)
        tx_address = self.contract.transact({'from': self.coinbase}).transferAmount(
            from_addr, to_addr, amount, gas_amount)
        self.eth_manager.web3.personal.lockAccount(self.coinbase)
        return tx_address

    def estimate_gas_amount(self, from_addr, to_addr, amount):
        gas_units = self.contract.estimateGas().transferAmount(
            from_addr, to_addr, amount, 10000)
        gas_amount = int(gas_units * CONV_UNITS)
        return gas_amount


contract_manager = ContractManager(
    CONTRACT_NAME, CONTRACT_ABI, CONTRACT_ADDRESS, COINBASE_PASSWORD)
