from ..eth import eth_manager
from ..eth import sentinel_manager
from ..eth import vpn_service_manager

from ..config import DECIMALS


class ETHHelper(object):
    def transfer_amount(self, from_addr, to_addr, amount, unit, keystore, password, private_key=None):
        if private_key is None:
            _, private_key = eth_manager.get_privatekey(keystore, password)
        if unit == 'ETH':
            error, tx_hash = eth_manager.transfer_amount(
                from_addr, to_addr, amount, private_key)
        else:
            error, tx_hash = sentinel_manager.transfer_amount(
                from_addr, to_addr, amount, private_key)

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
                        usage['due'] += _usage[3] / (DECIMALS * 1.0)
                    usage['stats']['received_bytes'] += _usage[1]
                    usage['stats']['duration'] += _usage[2]
                    usage['stats']['amount'] += _usage[3] / (DECIMALS * 1.0)
                    usage['sessions'].append({
                        'id': index,
                        'account_addr': _usage[0],
                        'received_bytes': _usage[1],
                        'duration': _usage[2],
                        'amount': _usage[3] / (DECIMALS * 1.0),
                        'timestamp': _usage[4],
                        'is_payed': _usage[5]
                    })
                else:
                    return error, None
            return None, usage
        else:
            return error, None

    def pay_vpn_session(self, from_addr, to_addr, amount, session_id, keystore, password, private_key=None):
        errors, tx_hashes = [], []
        error, tx_hash = self.transfer_amount(
            from_addr, to_addr, amount, 'SENT', keystore, password, private_key)
        if error is None:
            tx_hashes.append(tx_hash)
            error, tx_hash = vpn_service_manager.pay_vpn_session(
                from_addr, amount, session_id)
            if error is None:
                tx_hashes.append(tx_hash)
            else:
                errors.append(str(error))
        else:
            errors.append(str(error))

        return errors, tx_hashes

    def add_vpn_usage(self, from_addr, to_addr, sent_bytes, session_duration, amount, timestamp, keystore, password, private_key=None):
        if private_key is None:
            _, private_key = eth_manager.get_privatekey(keystore, password)
        error, tx_hash = vpn_service_manager.add_vpn_usage(
            from_addr, to_addr, sent_bytes, session_duration, amount, timestamp, private_key)

        return error, tx_hash


eth_helper = ETHHelper()
