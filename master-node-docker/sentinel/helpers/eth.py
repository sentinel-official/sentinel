# coding=utf-8
from hashlib import md5

from .referral import add_bonus
from .referral import get_vpn_sessions
from ..config import COINBASE_ADDRESS
from ..config import COINBASE_PRIVATE_KEY
from ..config import LIMIT_100MB
from ..config import LIMIT_10MB
from ..config import REFERRAL_DUMMY
from ..config import SESSIONS_SALT
from ..db import db
from ..eth import erc20_manger
from ..eth import eth_manager
from ..eth import vpn_service_manager


def get_encoded_session_id(account_addr, index):
    account_addr = str(account_addr).lower().encode()
    index = str(index).encode('utf-8')
    session_id = md5(account_addr + index + SESSIONS_SALT).hexdigest()

    return session_id


class ETHHelper(object):
    def create_account(self, password):
        error, account_addr, private_key, keystore = eth_manager['main'].create_account(password)

        return error, account_addr, private_key, keystore

    def get_account_addr(self, private_key):
        error, account_addr = eth_manager['main'].get_address(private_key)
        account_addr = account_addr[2:]

        return error, account_addr

    def get_tx_receipt(self, tx_hash, net):
        error, receipt = None, None
        if net == 'main':
            error, receipt = eth_manager['main'].get_tx_receipt(tx_hash)
        elif net == 'rinkeby':
            error, receipt = eth_manager['rinkeby'].get_tx_receipt(tx_hash)

        return error, receipt

    def get_tx(self, tx_hash, net):
        error, tx = None, None
        if net == 'main':
            error, tx = eth_manager['main'].get_tx(tx_hash)
        elif net == 'rinkeby':
            error, tx = eth_manager['rinkeby'].get_tx(tx_hash)

        return error, tx

    def get_tx_count(self, account_addr, net):
        tx_count = 0
        if net == 'main':
            _, tx_count = eth_manager['main'].get_transaction_count(
                account_addr)
        elif net == 'rinkeby':
            _, tx_count = eth_manager['rinkeby'].get_transaction_count(
                account_addr)

        return tx_count

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
        _, balances['main']['eths'] = eth_manager['main'].get_balance(account_addr)
        _, balances['main']['sents'] = erc20_manger['main']['SENT'].get_balance(account_addr)
        _, balances['rinkeby']['eths'] = eth_manager['rinkeby'].get_balance(account_addr)
        _, balances['rinkeby']['sents'] = erc20_manger['rinkeby']['SENT'].get_balance(account_addr)

        return balances

    def transfer(self, from_addr, to_addr, amount, symbol, private_key, net):
        if symbol == 'ETH':
            error, tx_hash = self.transfer_eths(from_addr, to_addr, amount, private_key, net)
        else:
            error, tx_hash = self.transfer_erc20(from_addr, to_addr, amount, symbol, private_key, net)

        return error, tx_hash

    def transfer_eths(self, from_addr, to_addr, amount, private_key, net):
        error, tx_hash = None, None
        if net == 'main':
            error, tx_hash = eth_manager['main'].transfer_amount(from_addr, to_addr, amount, private_key)
        elif net == 'rinkeby':
            error, tx_hash = eth_manager['rinkeby'].transfer_amount(from_addr, to_addr, amount, private_key)

        return error, tx_hash

    def transfer_erc20(self, from_addr, to_addr, amount, symbol, private_key, net):
        error, tx_hash = erc20_manger[net][symbol].transfer_amount(from_addr, to_addr, amount, private_key)

        return error, tx_hash

    def raw_transaction(self, tx_data, net):
        error, tx_hash = None, None
        if net == 'main':
            error, tx_hash = eth_manager['main'].send_raw_transaction(tx_data)
        elif net == 'rinkeby':
            error, tx_hash = eth_manager['rinkeby'].send_raw_transaction(tx_data)

        return error, tx_hash

    def get_initial_payment(self, account_addr):
        error, is_paid = vpn_service_manager.get_initial_payment(account_addr)

        return error, is_paid

    def get_due_amount(self, account_addr):
        error, due_amount = vpn_service_manager.get_due_amount(account_addr)

        return error, due_amount

    def get_vpn_sessions_count(self, account_addr):
        error, sessions_count = vpn_service_manager.get_vpn_sessions_count(account_addr)

        return error, sessions_count

    def get_latest_vpn_usage(self, account_addr):
        error, usage = None, None
        error, sessions_count = self.get_vpn_sessions_count(account_addr)
        if (error is None) and (sessions_count > 0):
            session_id = get_encoded_session_id(account_addr, sessions_count - 1)
            error, _usage = vpn_service_manager.get_vpn_usage(account_addr, session_id)
            if error is None:
                usage = {
                    'id': session_id,
                    'account_addr': str(_usage[0]).lower(),
                    'received_bytes': _usage[1],
                    'session_duration': _usage[2],
                    'amount': _usage[3],
                    'timestamp': _usage[4],
                    'is_paid': _usage[5]
                }

        return error, usage

    def get_vpn_usage(self, account_addr, device_id=None):
        error, usage = None, {
            'due': 0,
            'stats': {
                'received_bytes': 0,
                'duration': 0,
                'amount': 0
            },
            'sessions': []
        }
        if device_id:
            sessions = get_vpn_sessions(device_id)
            sessions_count = len(sessions)
            for index in range(0, sessions_count):
                session = sessions[index]
                usage['stats']['received_bytes'] += session['sent_bytes']
                usage['stats']['duration'] += session['session_duration']
                usage['stats']['amount'] += session['amount']
                usage['sessions'].append({
                    'id': index,
                    'account_addr': str(session['from_addr']).lower(),
                    'received_bytes': session['sent_bytes'],
                    'session_duration': session['session_duration'],
                    'amount': session['amount'],
                    'timestamp': session['timestamp']
                })

            return error, usage

        error, sessions_count = self.get_vpn_sessions_count(account_addr)
        if error is None:
            for index in range(0, sessions_count):
                session_id = get_encoded_session_id(account_addr, index)
                error, _usage = vpn_service_manager.get_vpn_usage(account_addr, session_id)
                if error is None:
                    if _usage[5] is False:
                        usage['due'] += _usage[3]
                    usage['stats']['received_bytes'] += _usage[1]
                    usage['stats']['duration'] += _usage[2]
                    usage['stats']['amount'] += _usage[3]
                    usage['sessions'].append({
                        'id': session_id,
                        'account_addr': str(_usage[0]).lower(),
                        'received_bytes': _usage[1],
                        'session_duration': _usage[2],
                        'amount': _usage[3],
                        'timestamp': _usage[4],
                        'is_paid': _usage[5]
                    })

        return error, usage

    def pay_vpn_session(self, from_addr, session_id, net, tx_data, payment_type, device_id=None):
        errors, tx_hashes = [], []
        error, tx_hash = self.raw_transaction(tx_data, net)
        if error is None:
            tx_hashes.append(tx_hash)
            if payment_type == 'init':
                error, tx_hash = vpn_service_manager.set_initial_payment(from_addr)
            elif payment_type == 'normal':
                error, _usage = vpn_service_manager.get_vpn_usage(from_addr, session_id)
                error, tx_hash = vpn_service_manager.pay_vpn_session(from_addr, int(_usage[3]), session_id)
            if error is None:
                tx_hashes.append(tx_hash)
            else:
                errors.append(error)
        else:
            errors.append(error)

        return errors, tx_hashes

    def add_vpn_usage(self, from_addr, to_addr, sent_bytes, session_duration, amount, timestamp, device_id=None):
        _sent_bytes, _session_duration, _amount = sent_bytes, session_duration, amount
        error, tx_hash, make_tx, session_id = None, None, False, None
        error, sessions_count = self.get_vpn_sessions_count(to_addr)  # to_addr: client account address
        if error is None:
            session_id = get_encoded_session_id(to_addr, sessions_count)
            _usage = db.usage.find_one({
                'from_addr': from_addr,
                'to_addr': to_addr
            })
            if _usage is None:
                if (sent_bytes > LIMIT_10MB) and (sent_bytes < LIMIT_100MB):
                    _ = db.usage.insert_one({
                        'from_addr': from_addr,
                        'to_addr': to_addr,
                        'sent_bytes': sent_bytes,
                        'session_duration': session_duration,
                        'amount': amount,
                        'timestamp': timestamp
                    })
                elif sent_bytes >= LIMIT_100MB:
                    make_tx = True
            elif (_usage['sent_bytes'] + sent_bytes) < LIMIT_100MB:
                _ = db.usage.find_one_and_update({
                    'from_addr': from_addr,
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
                sent_bytes = int(_usage['sent_bytes'] + sent_bytes)
                session_duration = int(
                    _usage['session_duration'] + session_duration)
                amount = int(_usage['amount'] + amount)
                make_tx = True
                _ = db.usage.find_one_and_delete({
                    'from_addr': from_addr,
                    'to_addr': to_addr
                })

        if device_id and to_addr == REFERRAL_DUMMY:
            _ = db.ref_sessions.insert_one({
                'device_id': device_id,
                'session_id': session_id,
                'from_addr': from_addr,
                'to_addr': to_addr,
                'sent_bytes': _sent_bytes,
                'session_duration': _session_duration,
                'amount': _amount,
                'timestamp': timestamp
            })
            if _sent_bytes >= LIMIT_100MB:
                _, res = add_bonus(device_id)

        if make_tx is True and to_addr != REFERRAL_DUMMY:
            error, tx_hash = vpn_service_manager.add_vpn_usage(from_addr, to_addr, sent_bytes, session_duration, amount,
                                                               timestamp, session_id)

        return error, tx_hash

    # DEV
    def free(self, to_addr, eths, sents):
        errors, tx_hashes = [], []
        error, tx_hash = self.transfer_eths(COINBASE_ADDRESS, to_addr, eths, COINBASE_PRIVATE_KEY, 'rinkeby')

        if error is None:
            tx_hashes.append(tx_hash)
            error, tx_hash = self.transfer_erc20(COINBASE_ADDRESS, to_addr, sents, 'SENT', COINBASE_PRIVATE_KEY,
                                                 'rinkeby')
            if error is None:
                tx_hashes.append(tx_hash)
            else:
                errors.append(error)
        else:
            errors.append(error)

        return errors, tx_hashes


eth_helper = ETHHelper()
