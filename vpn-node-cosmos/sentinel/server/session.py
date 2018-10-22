# coding=utf-8
import json

import falcon

from ..config import DEFAULT_GAS
from ..cosmos import call as cosmos_call
from ..db import db
from ..node import add_tx
from ..node import node
from ..vpn import Keys
from ..vpn import disconnect_client


class AddSessionDetails(object):
    def on_post(self, req, res, account_addr, session_id):
        account_addr = str(account_addr)
        session_id = str(session_id)
        token = str(req.body['token'])

        _ = db.clients.find_one_and_update({
            'account_addr': account_addr,
            'session_id': session_id
        }, {
            '$set': {
                'token': token,
                'status': 'ADDED_SESSION_DETAILS'
            }
        }, upsert=True)

        message = {
            'success': True,
            'message': 'Session details added successfully.'
        }

        res.status = falcon.HTTP_200
        res.body = json.dumps(message)


class GetVpnCredentials(object):
    def on_post(self, req, res, account_addr, session_id):
        """
        @api {POST} /clients/{account_addr}/sessions/{session_id}/credentials VPN Session credentials
        @apiName GetVpnCredentials
        @apiGroup Session
        @apiParam {String} account_addr Cosmos account address of the client.
        @apiParam {String} session_id Unique session ID.
        @apiParam {String} token Token for communication with node.
        @apiSuccess {Boolean} success Success key.
        @apiSuccess {String[]} ovpn OVPN data.
        """
        account_addr = str(account_addr)
        session_id = str(session_id)
        token = str(req.body['token'])

        client = db.clients.find_one({
            'account_addr': account_addr,
            'session_id': session_id,
            'token': token,
            'status': {
                '$in': [
                    'ADDED_SESSION_DETAILS',
                    'SHARED_VPN_CREDS'
                ]
            }
        })
        if client is not None:
            keys = Keys(session_id)
            keys.generate()
            _ = db.clients.find_one_and_update({
                'account_addr': account_addr,
                'session_id': session_id,
                'token': token,
                'status': {
                    '$in': [
                        'ADDED_SESSION_DETAILS',
                        'SHARED_VPN_CREDS'
                    ]
                }
            }, {
                '$set': {
                    'usage': {
                        'up': 0,
                        'down': 0
                    },
                    'status': 'SHARED_VPN_CREDS'
                }
            })
            message = {
                'success': True,
                'ovpn': keys.ovpn()
            }
        else:
            message = {
                'success': False,
                'message': 'Wrong details.'
            }

        res.status = falcon.HTTP_200
        res.body = json.dumps(message)


class AddSessionPaymentSign(object):
    def on_post(self, req, res, account_addr, session_id):
        """
        @api {POST} /clients/{account_addr}/sessions/{session_id}/sign Add payment signature for the session
        @apiName AddSessionPaymentSigns
        @apiGroup Session
        @apiParam {String} account_addr Cosmos account address of the client.
        @apiParam {String} session_id Unique session ID.
        @apiParam {String} token Token for communication with node.
        @apiParam {Object} signature Info fo the signature.
        @apiParam {String} signature.hash Signature hash.
        @apiParam {Number} signature.index Signature index.
        @apiParam {String} signature.amount Signature amount to be claimed.
        @apiParam {Boolean} signature.final Whether Final signature or not.
        @apiSuccess {Boolean} success Success key.
        """
        account_addr = str(account_addr)
        session_id = str(session_id)
        token = str(req.body['token'])
        signature = {
            'hash': str(req.body['signature']['hash']),
            'index': int(req.body['signature']['index']),
            'amount': str(req.body['signature']['amount']),
            'final': req.body['signature']['final']
        }
        client = db.clients.find_one({
            'account_addr': account_addr,
            'session_id': session_id,
            'token': token,
            'status': 'CONNECTED'
        })
        if client:
            _ = db.clients.find_one_and_update({
                'account_addr': account_addr,
                'session_id': session_id,
                'token': token,
                'status': 'CONNECTED'
            }, {
                '$push': {
                    'signatures': signature
                }
            })
            if signature['final']:
                client_name = 'client' + session_id
                disconnect_client(client_name)

                error, data = cosmos_call('get_vpn_payment', {
                    'amount': signature['amount'],
                    'session_id': session_id,
                    'counter': signature['index'],
                    'name': node.config['account']['name'],
                    'gas': DEFAULT_GAS,
                    'isfinal': True,
                    'password': node.config['account']['password'],
                    'sign': signature['hash']
                })
                if error is None:
                    tx = {
                        'from_account_address': 'VPN_PAYMENT',
                        'to_account_address': account_addr,
                        'tx_hash': data['hash'].encode()
                    }
                    error, data = add_tx(tx)
                print(error, data)
            message = {
                'success': True
            }
        else:
            message = {
                'success': False,
                'message': 'Wrong details.'
            }

        res.status = falcon.HTTP_200
        res.body = json.dumps(message)
