from time import sleep
from ..eth import eth_manager
from ..eth import contract_manager
from ..config import COINBASE_ADDRESS
from ..config import DECIMALS


class ETHHelper(object):
    def transfer_amount(self,
                        from_addr,
                        to_addr,
                        amount,
                        unit,
                        keystore,
                        password,
                        gas_price,
                        gas_units,
                        session_id=None):
        if session_id is None:
            eth_manager.add_keystore(from_addr, keystore)
            sleep(1.0)
        if unit == 'ETH':
            transaction = {'from': from_addr, 'to': to_addr, 'value': amount}
            if gas_price:
                transaction['gasPrice'] = gas_price
            if gas_units:
                transaction['gas'] = gas_units
            error, tx_hash = eth_manager.transfer_amount(
                from_addr, password, transaction)
        else:
            tx_object = {'from': from_addr}
            if gas_price:
                tx_object['gasPrice'] = gas_price
            if gas_units:
                tx_object['gas'] = gas_units
            if session_id is None:
                error, tx_hash = contract_manager.transfer_amount(
                    from_addr, to_addr, amount, tx_object, password, None)
            else:
                tx_object['from'] = COINBASE_ADDRESS
                error, tx_hash = contract_manager.transfer_amount(
                    from_addr, to_addr, amount, tx_object, None, session_id)

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
                'duration': 0,
                'amount': 0
            },
            'sessions': []
        }

        error, sessions = contract_manager.get_vpn_sessions(account_addr)
        print(sessions)
        if error is None:
            for index in range(0, sessions):
                error, _usage = contract_manager.get_vpn_usage(
                    account_addr, index)
                if error is None:
                    if _usage[5] is False:
                        usage['due'] += _usage[3] / (DECIMALS * 1.0)
                    usage['stats']['received_bytes'] += _usage[1]
                    usage['stats']['duration'] += _usage[2]
                    usage['stats']['amount'] += _usage[3] / (DECIMALS * 1.0)
                    usage['sessions'].append({
                        'id':
                        index,
                        'account_addr':
                        _usage[0],
                        'received_bytes':
                        _usage[1],
                        'duration':
                        _usage[2],
                        'amount':
                        _usage[3] / (DECIMALS * 1.0),
                        'timestamp':
                        _usage[4],
                        'is_payed':
                        _usage[5]
                    })
                else:
                    return error, None
            return None, usage
        else:
            return error, None

    def add_vpn_usage(self, account_addr, to_addr, received_bytes, sent_bytes,
                      session_duration, amount, timestamp, keystore, password):
        eth_manager.add_keystore(account_addr, keystore)
        sleep(1.0)  # Need to check
        error, tx_hash = contract_manager.add_vpn_usage(
            account_addr, to_addr, received_bytes, sent_bytes,
            session_duration, amount, timestamp, password)
        eth_manager.remove_keystore(account_addr)

        return error, tx_hash

    def gas_units(self, from_addr, to_addr, amount, unit, session_id):
        if unit == 'ETH':
            transaction = {'from': from_addr, 'to': to_addr, 'value': amount}
            error, gas_units = eth_manager.gas_units(from_addr, transaction)
        else:
            error, gas_units = contract_manager.gas_units(
                from_addr, to_addr, amount, session_id)

        return error, gas_units


eth_helper = ETHHelper()
