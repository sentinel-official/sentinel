import json
import falcon
import requests
from uuid import uuid4
from ..db import db
from ..config import DECIMALS
from ..config import SENT_BALANCE
from ..helpers import eth_helper


def get_vpns_list():
    _list = db.nodes.find({'vpn.status': 'up'}, {
        '_id': 0,
        'account.addr': 1,
        'location': 1,
        'net_speed.upload': 1,
        'net_speed.download': 1
    })
    return list(_list)


class PutClientConnection(object):
    def on_post(self, req, resp):
        server_addr = str(req.body['vpn_addr'])
        client_addr = str(req.body['account_addr'])
        connection = db.connections.find_one({'server_addr': server_addr})
        if connection is None:
            db.connections.insert_one(
                {'server_addr': server_addr, 'client_addr': client_addr})
        db.connections.find_one_and_update({'server_addr': server_addr}, {
                                           '$set': {'client_addr': client_addr}})
        message = {'success': True}
        resp.status = falcon.HTTP_200
        resp.body = json.dumps(message)


class GetVpnCredentials(object):
    def on_post(self, req, resp):
        """
        @api {post} /client/vpn Get VPN server credentials.
        @apiName GetVpnCredentials
        @apiGroup VPN
        @apiParam {String} account_addr Account address.
        @apiParam {String} vpn_addr Account address of the VPN server.
        @apiSuccess {String[]} ovpn Ovpn file data of the VPN server.
        """
        account_addr = str(req.body['account_addr'])
        vpn_addr = str(req.body['vpn_addr'])

        url = SENT_BALANCE + account_addr
        res = requests.get(url)
        res = res.json()
        if res['status'] == '1':
            if int(res['result']) >= (100 * (10**8)):
                error, due_amount = eth_helper.get_due_amount(account_addr)
                if error is not None:
                    message = {
                        'success': False,
                        'error': error,
                        'message': 'Error occurred while checking the due amount.'
                    }
                elif due_amount == 0:
                    vpn_addr_len = len(vpn_addr)

                    if vpn_addr_len > 0:
                        node = db.nodes.find_one({'vpn.status': 'up', 'account.addr': vpn_addr}, {
                                                 '_id': 0, 'token': 0})
                    else:
                        node = db.nodes.find_one({'vpn.status': 'up'}, {
                                                 '_id': 0, 'token': 0})

                    if node is None:
                        if vpn_addr_len > 0:
                            message = {
                                'success': False,
                                'message': 'VPN server is already occupied. Please try after sometime.'
                            }
                        else:
                            message = {
                                'success': False,
                                'message': 'All VPN servers are occupied. Please try after sometime.'
                            }
                    else:
                        secretToken = uuid4().hex
                        node_addr = str(node['ip'])
                        message = {
                            'success': True,
                            'ip': node_addr,
                            'port': 3000,
                            'token': secretToken
                        }
                        body = {
                            'account_addr': account_addr,
                            'token': secretToken
                        }
                        url = "http://" + node_addr + ":3000/master/sendToken"
                        res = requests.post(url, json=body)
                else:
                    message = {
                        'success': False,
                        'message': 'You have due amount: ' + str(due_amount / (DECIMALS * 1.0)) + ' SENTs.' + ' Please try after clearing the due.'
                    }
            else:
                message = {
                    'success': False,
                    'message': 'Your balance is less than 100 sents'
                }
        else:
            message = {
                'success': False,
                'message': 'Error while checking your balance'
            }
        resp.status = falcon.HTTP_200
        resp.body = json.dumps(message)


class PayVpnUsage(object):
    def on_post(self, req, resp):
        from_addr = str(req.body['from_addr'])
        amount = float(req.body['amount'])
        session_id = int(req.body['session_id'])
        tx_data = str(req.body['tx_data'])

        amount = int(amount * (DECIMALS * 1.0))

        errors, tx_hashes = eth_helper.pay_vpn_session(
            from_addr, amount, session_id, tx_data)

        if len(errors) > 0:
            message = {
                'success': False,
                'errors': errors,
                'tx_hashes': tx_hashes,
                'message': 'Error occurred while paying VPN usage.'
            }
        else:
            message = {
                'success': True,
                'errors': errors,
                'tx_hashes': tx_hashes,
                'message': 'VPN payment is completed successfully.'
            }

        resp.status = falcon.HTTP_200
        resp.body = json.dumps(message)


class GetVpnUsage(object):
    def on_post(self, req, resp):
        """
        @api {post} /client/vpn/usage Get VPN user details of specific account.
        @apiName GetVpnUsage
        @apiGroup VPN
        @apiParam {String} account_addr Account address.
        @apiSuccess {Object[]} usage VPN usage details.
        """
        account_addr = str(req.body['account_addr'])

        error, usage = eth_helper.get_vpn_usage(account_addr)

        if error is None:
            message = {'success': True, 'usage': usage}
        else:
            message = {
                'success': False,
                'error': error,
                'message': 'Error occured while fetching the usage data.'
            }

        resp.status = falcon.HTTP_200
        resp.body = json.dumps(message)


class GetVpnsList(object):
    def on_get(self, req, resp):
        """
        @api {get} /client/vpn/list Get all unoccupied VPN servers list.
        @apiName GetVpnsList
        @apiGroup VPN
        @apiSuccess {Object[]} list Details of all VPN servers.
        """
        _list = get_vpns_list()

        message = {'success': True, 'list': _list}
        resp.status = falcon.HTTP_200
        resp.body = json.dumps(message)
