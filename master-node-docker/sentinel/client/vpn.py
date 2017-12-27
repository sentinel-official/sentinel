import json
import falcon
from ..db import db
from ..config import DECIMALS
from ..helpers import eth_helper


def put_connection(server_addr, client_addr):
    connection = db.connections.find_one({'server_addr': server_addr})
    if connection is None:
        db.connections.insert_one(
            {'server_addr': server_addr, 'client_addr': client_addr})
    db.connections.find_one_and_update(
        {'server_addr': server_addr},
        {'$set': {'client_addr': client_addr}})


def get_vpns_list():
    _list = db.nodes.find({'vpn.status': 'up'},
                          {'_id': 0, 'account.addr': 1, 'location': 1, 'net_speed': 1})
    return list(_list)


class GetVpnCredentials(object):
    def on_post(self, req, resp):
        """
        @api {post} /client/vpn Get VPN server credentials.
        @apiName GetVpnCredentials
        @apiGroup VPN
        @apiParam {String} account_addr Account address.
        @apiParam {String} vpn.account_addr Account address of the VPN server.
        @apiSuccess {String[]} ovpn Ovpn file data of the VPN server.
        """
        is_specified = False
        account_addr = req.body['account_addr']
        if 'vpn' in req.body:
            vpn = req.body['vpn']

        error, due_amount = eth_helper.get_due_amount(account_addr)

        if error is not None:
            message = {
                'success': False,
                'error': error,
                'message': 'Error occurred while checking the due amount.'
            }
        elif due_amount == 0:
            if 'account_addr' in vpn:
                is_specified = True
                node = db.nodes.find_one({'vpn.status': 'up', 'account.addr': vpn['account_addr']})
            else:
                node = db.nodes.find_one({'vpn.status': 'up'})

            if node is None:
                if is_specified is True:
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
                put_connection(node['account']['addr'], account_addr)

                message = {
                    'success': True,
                    'ovpn': node['vpn']['ovpn']
                }
        else:
            message = {
                'success': False,
                'message': 'You have due amount: ' + str(due_amount / (DECIMALS * 1.0)) + ' SENTs.' +
                           ' Please try after clearing the due.'
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
        account_addr = req.body['account_addr']

        error, usage = eth_helper.get_vpn_usage(account_addr)

        if error is None:
            message = {
                'success': True,
                'usage': usage
            }
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

        message = {
            'success': True,
            'list': _list
        }
        resp.status = falcon.HTTP_200
        resp.body = json.dumps(message)
