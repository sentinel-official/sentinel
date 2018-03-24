# coding=utf-8
from hashlib import md5

from ..config import COINBASE_ADDRESS
from ..config import COINBASE_PRIVATE_KEY
from ..config import LIMIT
from ..config import SESSIONS_SALT
from ..db import db
from ..eth import mainnet
from ..eth import rinkeby
from ..eth import sentinel_main
from ..eth import sentinel_rinkeby
from ..eth import vpn_service_manager


def get_encoded_session_id(account_addr, index):
    account_addr = str(account_addr).lower().encode('utf-8')
    index = str(index).encode('utf-8')
    session_id = md5(account_addr + index + SESSIONS_SALT).hexdigest()

    return session_id


class ETHHelper(object):
    def create_account(self, password):
        error, account_addr, private_key, keystore = mainnet.create_account(
            password)

        return error, account_addr, private_key, keystore

    def get_account_addr(self, private_key):
        error, account_addr = mainnet.get_address(private_key)
        account_addr = account_addr[2:]

        return error, account_addr

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
        _, balances['rinkeby']['sents'] = sentinel_rinkeby.get_balance(
            account_addr)

        return balances

    def transfer_sents(self, from_addr, to_addr, amount, private_key, net):
        error, tx_hash = None, None
        if net == 'main':
            error, tx_hash = sentinel_main.transfer_amount(
                from_addr, to_addr, amount, private_key)
        elif net == 'rinkeby':
            error, tx_hash = sentinel_rinkeby.transfer_amount(
                from_addr, to_addr, amount, private_key)

        return error, tx_hash

    def transfer_eths(self, from_addr, to_addr, amount, private_key, net):
        error, tx_hash = None, None
        if net == 'main':
            error, tx_hash = mainnet.transfer_amount(
                from_addr, to_addr, amount, private_key)
        elif net == 'rinkeby':
            error, tx_hash = rinkeby.transfer_amount(
                from_addr, to_addr, amount, private_key)

        return error, tx_hash

    def raw_transaction(self, tx_data, net):
        error, tx_hash = None, None
        if net == 'main':
            error, tx_hash = mainnet.send_raw_transaction(tx_data)
        elif net == 'rinkeby':
            error, tx_hash = rinkeby.send_raw_transaction(tx_data)

        return error, tx_hash

    def get_initial_payment(self, account_addr):
        error, is_payed = vpn_service_manager.get_initial_payment(account_addr)

        return error, is_payed

    def get_vpn_sessions_count(self, account_addr):
        error, sessions_count = vpn_service_manager.get_vpn_sessions_count(
            account_addr)

        return error, sessions_count

    def get_latest_vpn_usage(self, account_addr):
        error, usage = None, None
        error, sessions_count = self.get_vpn_sessions_count(account_addr)
        if error is None:
            session_id = get_encoded_session_id(account_addr, sessions_count)
            _usage = db.usage.find_one({
                'session_id': session_id,
                'to_addr': account_addr
            })
            if _usage is None:
                error, _usage = vpn_service_manager.get_vpn_usage(
                    account_addr, session_id)
                if error is None:
                    usage = {
                        'id': session_id,
                        'account_addr': _usage[0],
                        'received_bytes': _usage[1],
                        'session_duration': _usage[2],
                        'amount': _usage[3],
                        'timestamp': _usage[4],
                        'is_payed': _usage[5]
                    }
            else:
                usage = {
                    'id': _usage['session_id'],
                    'account_addr': _usage['to_addr'],
                    'received_bytes': _usage['sent_bytes'],
                    'session_duration': _usage['session_duration'],
                    'amount': _usage['amount'],
                    'timestamp': _usage['timestamp'],
                    'is_payed': _usage['is_payed']
                }

        return error, usage

    def get_vpn_usage(self, account_addr):
        error, usage = None, {
            'due': 0,
            'stats': {
                'received_bytes': 0,
                'duration': 0,
                'amount': 0
            },
            'sessions': []
        }

        error, sessions_count = self.get_vpn_sessions_count(account_addr)
        if error is None:
            for index in range(0, sessions_count):
                session_id = get_encoded_session_id(account_addr, index)
                error, _usage = vpn_service_manager.get_vpn_usage(
                    account_addr, session_id)
                if error is None:
                    if _usage[5] is False:
                        usage['due'] += _usage[3]
                    usage['stats']['received_bytes'] += _usage[1]
                    usage['stats']['duration'] += _usage[2]
                    usage['stats']['amount'] += _usage[3]
                    usage['sessions'].append({
                        'id': session_id,
                        'account_addr': _usage[0],
                        'received_bytes': _usage[1],
                        'session_duration': _usage[2],
                        'amount': _usage[3],
                        'timestamp': _usage[4],
                        'is_payed': _usage[5]
                    })

        return error, usage

    def pay_vpn_session(self, from_addr, amount, session_id, net, tx_data, payment_type):
        errors, tx_hashes = [], []
        error, tx_hash = self.raw_transaction(net, tx_data)
        if error is None:
            tx_hashes.append(tx_hash)
            if payment_type == 'init':
                error, tx_hash = vpn_service_manager.set_initial_payment(
                    from_addr)
            elif payment_type == 'normal':
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
        error, tx_hash, make_tx, session_id = None, None, False, None
        error, sessions_count = self.get_vpn_sessions_count(to_addr)  # to_addr: client account address
        if error is None:
            session_id = get_encoded_session_id(to_addr, sessions_count)
            _usage = db.usage.find_one({
                'session_id': session_id,
                'to_addr': to_addr
            })
            if _usage is None:
                if sent_bytes < LIMIT:
                    _ = db.usage.insert_one({
                        'session_id': session_id,
                        'from_addr': from_addr,
                        'to_addr': to_addr,
                        'sent_bytes': sent_bytes,
                        'session_duration': session_duration,
                        'amount': amount,
                        'timestamp': timestamp,
                        'is_payed': False
                    })
                else:
                    make_tx = True
            elif (_usage['sent_bytes'] + sent_bytes) < LIMIT:
                _ = db.usage.find_one_and_update({
                    'session_id': session_id,
                    'to_addr': to_addr
                }, {
                    '$set': {
                        'sent_bytes': _usage['sent_bytes'] + sent_bytes,
                        'session_duration': _usage['session_duration'] + session_duration,
                        'amount': _usage['amount'] + amount,
                        'timestamp': timestamp
                    }
                })
            else:
                _ = db.usage.find_one_and_delete({
                    'session_id': session_id,
                    'to_addr': to_addr
                })
                sent_bytes = _usage['sent_bytes'] + sent_bytes
                session_duration = _usage['session_duration'] + session_duration
                amount = _usage['amount'] + amount
                make_tx = True

        if make_tx is True:
            error, tx_hash = vpn_service_manager.add_vpn_usage(
                from_addr, to_addr, sent_bytes, session_duration, amount, timestamp, session_id)

        return error, tx_hash

    # DEV
    def free(self, to_addr, eths, sents):
        errors, tx_hashes = [], []
        error, tx_hash = self.transfer_eths(
            COINBASE_ADDRESS, to_addr, eths, COINBASE_PRIVATE_KEY, 'rinkeby')
        if error is None:
            tx_hashes.append(tx_hash)
            error, tx_hash = self.transfer_sents(
                COINBASE_ADDRESS, to_addr, sents, COINBASE_PRIVATE_KEY, 'rinkeby')
            if error is None:
                tx_hashes.append(tx_hash)
            else:
                errors.append(error)
        else:
            errors.append(error)

        return errors, tx_hashes


eth_helper = ETHHelper()
