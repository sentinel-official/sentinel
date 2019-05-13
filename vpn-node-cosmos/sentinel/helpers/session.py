from ..config import DEFAULT_GAS
from ..cosmos import call as cosmos_call
from ..db import db
from ..node import add_tx
from ..node import node
from ..node import update_session
from ..vpn import disconnect_client


def update_session_status(session_id, status):
    _ = db.clients.find_one_and_update({
        'session_id': session_id
    }, {
        '$set': {
            'status': status
        }
    })


def end_session(session_id):
    session = db.clients.find_one({
        'session_id': session_id,
        'status': 'CONNECTED'
    })
    if session is not None:
        update_session_status(session_id, 'DISCONNECTED')
        client_name = 'client' + session_id
        disconnect_client(client_name)
        if 'signatures' in session and len(session['signatures']) > 0:
            signature = session['signatures'][-1]
            error, data = cosmos_call('get_vpn_payment', {
                'amount': signature['amount'],
                'session_id': session_id,
                'counter': signature['index'],
                'name': node.config['account']['name'],
                'gas': DEFAULT_GAS,
                'isfinal': signature['final'],
                'password': node.config['account']['password'],
                'sign': signature['hash']
            })
            if error is None:
                tx = {
                    'from_account_address': 'VPN_PAYMENT',
                    'to_account_address': session['account_addr'],
                    'tx_hash': data['hash'].encode()
                }
                error, data = add_tx(tx)
                if error is None:
                    error, data = update_session(session_id, session['token'], signature['amount'])
            print(error, data)
