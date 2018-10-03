# coding=utf-8
import json

import falcon

from ..db import db
from ..vpn import disconnect_client


class GetSessionUsage(object):
    def on_post(self, req, res, account_addr, session_id):
        """
        @api {POST} /clients/{account_addr}/sessions/{session_id}/usage Usage of the current session
        @apiName GetSessionUsage
        @apiGroup Client
        @apiParam {String} account_addr Cosmos account address of the client.
        @apiParam {String} session_id Unique session ID.
        @apiParam {String} token Token for communication with node.
        @apiSuccess {Boolean} success Success key.
        @apiSuccess {Object} usage Usage of the current session.
        """
        account_addr = str(account_addr)
        session_id = str(session_id)
        token = str(req.body['token'])

        client = db.clients.find_one({
            'account_addr': account_addr,
            'session_id': session_id,
            'token': token
        })
        if client is None:
            message = {
                'success': False,
                'message': 'Wrong details.'
            }
        else:
            message = {
                'success': True,
                'usage': client['usage'] if 'usage' in client else None
            }

        res.status = falcon.HTTP_200
        res.body = json.dumps(message)


class DisconnectClient(object):
    def on_post(self, req, res, account_addr, session_id):
        """
        @api {POST} /clients/{account_addr}/sessions/{session_id}/disconnect Disconnect a client
        @apiName DisconnectClient
        @apiGroup Client
        @apiParam {String} account_addr Cosmos account address of the client.
        @apiParam {String} session_id Unique session ID.
        @apiParam {String} token Token for communication with node.
        @apiSuccess {Boolean} success Success key.
        """
        account_addr = str(account_addr)
        session_id = str(session_id)
        token = str(req.body['token'])

        client = db.clients.find_one({
            'account_addr': account_addr,
            'session_id': session_id,
            'token': token
        })
        if client is None:
            message = {
                'success': False,
                'message': 'Wrong details.'
            }
        else:
            client_name = 'client' + session_id
            disconnect_client(client_name)
            message = {
                'success': True,
                'message': 'Disconnected successfully.'
            }

        res.status = falcon.HTTP_200
        res.body = json.dumps(message)
