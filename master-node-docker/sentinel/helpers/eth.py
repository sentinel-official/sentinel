from time import sleep
from ..eth import eth_manager
from ..eth import contract_manager


class ETHHelper(object):
    def transfer_amount(self, from_addr, to_addr, amount, unit, keystore,
                        password, session_id=None):
        eth_manager.add_keystore(from_addr, keystore)
        sleep(1.0)  # Need to check
        if unit == 'ETH':
            transaction = {'from': from_addr, 'to': to_addr, 'value': amount}
            error, tx_hash = eth_manager.transfer_amount(
                from_addr, password, transaction)
        else:
            error, tx_hash = contract_manager.transfer_amount(
                from_addr, to_addr, amount, password, session_id)
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
                error, sessions = contract_manager.get_vpn_sessions(
                    account_addr, addr)
                if error is None:
                    for index in range(0, sessions):
                        error, _usage = contract_manager.get_vpn_usage(
                            account_addr, addr, index)
                        if error is None:
                            usage.append({
                                'session_id': index,
                                'addr': addr,
                                'received_bytes': _usage[0],
                                'sent_bytes': _usage[1],
                                'session_time': _usage[2],
                                'amount': _usage[3],
                                'timestamp': _usage[4],
                                'is_payed': _usage[5]
                            })
                        else:
                            return error, None
                else:
                    return error, None
        else:
            return error, None
        return error, usage

    def add_vpn_usage(self, account_addr, to_addr, received_bytes, sent_bytes, session_time,
                      amount, timestamp, keystore, password):
        eth_manager.add_keystore(account_addr, keystore)
        sleep(1.0)  # Need to check
        error, tx_hash = contract_manager.add_vpn_usage(
            account_addr, to_addr, received_bytes, sent_bytes, session_time,
            amount, timestamp, password)
        eth_manager.remove_keystore(account_addr)

        return error, tx_hash


eth_helper = ETHHelper()
