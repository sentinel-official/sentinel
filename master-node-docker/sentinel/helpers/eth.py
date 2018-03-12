from ..eth import eth_manager
from ..eth import sentinel_manager
from ..eth import vpn_service_manager

from ..config import DECIMALS


class ETHHelper(object):
    def get_account_addr(self, private_key):
        error, account_addr = eth_manager.get_address(private_key)
        account_addr = account_addr[2:]

        return error, account_addr

    def raw_transaction(self, tx_data):
        error, tx_hash = eth_manager.send_raw_transaction(tx_data)

        return error, tx_hash

    def get_due_amount(self, account_addr):
        error, due_amount = vpn_service_manager.get_due_amount(account_addr)

        return error, due_amount

    def get_vpn_usage(self, account_addr):
        usage = {
            'due': 0,
            'stats': {
                'received_bytes': 0,
                'duration': 0,
                'amount': 0
            },
            'sessions': []
        }

        error, sessions = vpn_service_manager.get_vpn_sessions(account_addr)
        if error is None:
            for index in range(0, sessions):
                error, _usage = vpn_service_manager.get_vpn_usage(
                    account_addr, index)
                if error is None:
                    if _usage[5] is False:
                        usage['due'] += _usage[3]
                    usage['stats']['received_bytes'] += _usage[1]
                    usage['stats']['duration'] += _usage[2]
                    usage['stats']['amount'] += _usage[3]
                    usage['sessions'].append({
                        'id': index,
                        'account_addr': _usage[0],
                        'received_bytes': _usage[1],
                        'duration': _usage[2],
                        'amount': _usage[3],
                        'timestamp': _usage[4],
                        'is_payed': _usage[5]
                    })
                else:
                    return error, None
            return None, usage
        else:
            return error, None

    def pay_vpn_session(self, from_addr, amount, session_id, tx_data):
        errors, tx_hashes = [], []
        error, tx_hash = self.raw_transaction(tx_data)
        if error is None:
            tx_hashes.append(tx_hash)
            error, tx_hash = vpn_service_manager.pay_vpn_session(
                from_addr, amount, session_id)
            if error is None:
                tx_hashes.append(tx_hash)
            else:
                errors.append(error)
        else:
            errors.append(error)

        return errors, tx_hashes

    def add_vpn_usage(self, from_addr, to_addr, sent_bytes, session_duration, amount, timestamp):
        error, tx_hash = vpn_service_manager.add_vpn_usage(
            from_addr, to_addr, sent_bytes, session_duration, amount, timestamp)

        return error, tx_hash


eth_helper = ETHHelper()
