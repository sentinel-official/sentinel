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
        usage = {
            'due': 0,
            'stats': {
                'received_bytes': 0,
                'sent_bytes': 0,
                'duration': 0,
                'amount': 0
            },
            'list': []
        }

        error, vpn_addrs = contract_manager.get_vpn_addrs(account_addr)
        if error is None:
            for addr in vpn_addrs:
                addr_usage = {
                    'addr': addr,
                    'due': 0,
                    'sessions': [],
                    'stats': {
                        'received_bytes': 0,
                        'sent_bytes': 0,
                        'duration': 0,
                        'amount': 0
                    }
                }
                error, sessions = contract_manager.get_vpn_sessions(
                    account_addr, addr)
                if error is None:
                    for index in range(0, sessions):
                        error, _usage = contract_manager.get_vpn_usage(
                            account_addr, addr, index)
                        if error is None:
                            if _usage[5] is False:
                                addr_usage['due'] += _usage[3]
                            addr_usage['stats']['received_bytes'] += _usage[0]
                            addr_usage['stats']['sent_bytes'] += _usage[1]
                            addr_usage['stats']['duration'] += _usage[2]
                            addr_usage['stats']['amount'] += _usage[3]
                            addr_usage['sessions'].append({
                                'id': index,
                                'received_bytes': _usage[0],
                                'sent_bytes': _usage[1],
                                'duration': _usage[2],
                                'amount': _usage[3],
                                'timestamp': _usage[4],
                                'is_payed': _usage[5]
                            })
                        else:
                            return error, None
                    usage['due'] += addr_usage['due']
                    usage['stats']['received_bytes'] += addr_usage['stats']['received_bytes']
                    usage['stats']['sent_bytes'] += addr_usage['stats']['sent_bytes']
                    usage['stats']['duration'] += addr_usage['stats']['duration']
                    usage['stats']['amount'] += addr_usage['stats']['amount']
                    usage['list'].append(addr_usage)
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
