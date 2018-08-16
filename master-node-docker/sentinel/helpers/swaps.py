# coding=utf-8
from .eth import eth_helper
from .tokens import tokens
from ..config import SWAP_ADDRESS


def is_valid_ethereum_swap(tx_hash):
    error, receipt = eth_helper.get_tx_receipt(tx_hash, 'main')
    if (error is None) and (receipt is not None):
        if receipt['status'] == 1:
            error, tx = eth_helper.get_tx(tx_hash, 'main')
            if (error is None) and (tx is not None):
                from_address, to_address, tx_value, tx_input = str(tx['from']).lower(), str(
                    tx['to']).lower(), int(tx['value']), str(tx['input'])
                if tx_value > 0 and (len(tx_input) == 2 or int(tx_input, 16) == 0):
                    if to_address == SWAP_ADDRESS:
                        return None, [from_address, tx_value, tokens.get_token('ETH')]
                    else:
                        return {
                                   'status': -1,
                                   'message': 'To address is not Swap address.'
                               }, None
                elif tx_value == 0 and len(tx_input) == 138:
                    token = tokens.get_token(address=to_address)
                    if token is not None:
                        if tx_input[:10] == '0xa9059cbb':
                            to_address = (
                                    '0x' + tx_input[10:74].lstrip('0').zfill(40)).lower()
                            token_value = int(
                                '0x' + tx_input[74:138].lstrip('0'), 0)
                            if to_address == SWAP_ADDRESS:
                                return None, [from_address, token_value, token]
                            else:
                                return {
                                           'status': -1,
                                           'message': 'To address is not Swap address.'
                                       }, None
                        else:
                            return {
                                       'status': -1,
                                       'message': 'Wrong transaction method.'
                                   }, None
                    else:
                        return {
                                   'status': -1,
                                   'message': 'No token found.'
                               }, None
                else:
                    return {
                               'status': -1,
                               'message': 'Not a valid transaction.'
                           }, None
            else:
                return {
                           'status': 0,
                           'message': 'Can\'t find the transaction.'
                       }, None
        else:
            return {
                       'status': -1,
                       'message': 'Failed transaction.'
                   }, None
    else:
        return {
                   'status': 0,
                   'message': 'Can\'t find the transaction receipt.'
               }, None
