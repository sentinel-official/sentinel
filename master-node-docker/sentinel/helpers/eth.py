from time import sleep
from ..eth import eth_manager
from ..eth import contract_manager


class ETHHelper(object):
    def transfer_amount(self, from_addr, to_addr, amount, unit, keystore,
                        password, is_vpn_payment=False):
        eth_manager.add_keystore(from_addr, keystore)
        sleep(1.0)  # Need to check
        transaction = {'from': from_addr, 'to': to_addr, 'value': amount}
        if unit == 'ETH':
            error, tx_hash = eth_manager.transfer_amount(
                from_addr, password, transaction)
        else:
            error, tx_hash = contract_manager.transfer_amount(
                from_addr, password, to_addr, amount, is_vpn_payment)
        eth_manager.remove_keystore(from_addr)

        return error, tx_hash

    def get_tx_receipt(self, tx_hash):
        error, receipt = eth_manager.get_tx_receipt(tx_hash)

        return error, receipt

    def get_due_amount(self, account_addr):
        error, due_amount = contract_manager.get_due_amount(account_addr)

        return error, due_amount

    def get_vpn_usage(self, account_addr):
        usage = []

        error, vpn_addrs = contract_manager.get_vpn_addrs(account_addr)
        if error is None:
            for addr in vpn_addrs:
                error, _usage = contract_manager.get_vpn_usage(
                    account_addr, addr)
                if error is None:
                    usage.append({
                        'addr': addr,
                        'used': _usage[0],
                        'amount': _usage[1],
                        'timestamp': _usage[2],
                        'is_payed': _usage[3]
                    })
                else:
                    return error, None
        else:
            return error, None
        return error, usage

    def add_vpn_usage(self, account_addr, to_addr, used_bytes, amount,
                      timestamp, keystore, password):
        eth_manager.add_keystore(account_addr, keystore)
        sleep(1.0)  # Need to check
        error, tx_hash = contract_manager.add_vpn_usage(
            account_addr, password, to_addr, used_bytes, amount, timestamp)
        eth_manager.remove_keystore(account_addr)

        return error, tx_hash


eth_helper = ETHHelper()
