from ..eth import mainnet
from ..eth import rinkeby
from ..eth import sentinel_main
from ..eth import sentinel_test
from ..eth import vpn_service_manager


class ETHHelper(object):
    def create_account(self, password):
        error, account_addr, private_key, keystore = mainnet.create_account(
            password)

        return error, account_addr, private_key, keystore

    def get_balances(self, account_addr):
        balances = {
            'main': {
                'eths': None,
                'sents': None
            },
            'rinkeby': {
                'eths': None,
                'sents': None
            }
        }
        _, balances['main']['eths'] = mainnet.get_balance(account_addr)
        _, balances['main']['sents'] = sentinel_main.get_balance(account_addr)
        _, balances['rinkeby']['eths'] = rinkeby.get_balance(account_addr)
        _, balances['rinkeby']['sents'] = sentinel_test.get_balance(
            account_addr)

        return balances

    def get_account_addr(self, private_key):
        error, account_addr = mainnet.get_address(private_key)
        account_addr = account_addr[2:]

        return error, account_addr

    def raw_transaction(self, net, tx_data):
        if net == 'main':
            error, tx_hash = mainnet.send_raw_transaction(tx_data)
        elif net == 'rinkeby':
            error, tx_hash = rinkeby.send_raw_transaction(tx_data)

        return error, tx_hash

    def get_due_amount(self, account_addr):
        error, due_amount = vpn_service_manager.get_due_amount(account_addr)

        return error, due_amount

    def get_vpn_sessions(self, account_addr):
        error, sessions = vpn_service_manager.get_vpn_sessions(account_addr)

        return error, sessions

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

    def pay_vpn_session(self, from_addr, amount, session_id, net, tx_data):
        errors, tx_hashes = [], []
        error, tx_hash = self.raw_transaction(net, tx_data)
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
