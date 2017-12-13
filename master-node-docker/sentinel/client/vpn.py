import json
import falcon
from ..db import db
from ..helpers import eth_helper


def put_connection(server_addr, client_addr):
    connection = db.connections.find_one({'server_addr': server_addr})
    if connection is None:
        db.connections.insert_one(
            {'server_addr': server_addr, 'client_addr': client_addr})
    db.connection.find_one_and_update(
        {'server_addr': server_addr},
        {'$set': {'client_addr': client_addr}})


def get_vpns_list():
    _list = db.nodes.find({'vpn.status': 'up'},
                          {'_id': 0, 'location': 1, 'net_speed': 1})
    return list(_list)


class GetVpnCredentials(object):
    def on_post(self, req, resp):
        """
        @api {post} /get-vpn-credentials Get VPN credentials
        @apiName GetVpnCredentials
        @apiGroup VPN
        @apiParam {String} account_addr An account address.
        @apiSuccess {String[]} vpn VPN information along with ovpn data.
        """
        account_addr = req.body['account_addr']

        error, due_amount = eth_helper.get_due_amount(account_addr)

        if error is not None:
            message = {
                'success': False,
                'error': error,
                'message': 'Error occurred while checking due amount.'
            }
        elif due_amount == 0:
            node = db.nodes.find_one({'vpn.status': 'up'})

            if node is None:
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
                'message': 'You have due amount: ' + str(due_amount) + ' SENTs.' +
                           ' Please try after clearing due.'
            }
        resp.status = falcon.HTTP_200
        resp.body = json.dumps(message)


class GetVpnUsage(object):
    def on_post(self, req, resp):
        account_addr = req.body['account_addr']

        error, due_amount = eth_helper.get_due_amount(account_addr)
        error, usage = eth_helper.get_vpn_usage(account_addr)

        if error is None:
            message = {
                'success': True,
                'usage': usage,
                'due_amount': due_amount
            }
        else:
            message = {
                'success': False,
                'error': error,
                'message': 'Error occured while fetching usage data.'
            }
        resp.status = falcon.HTTP_200
        resp.body = json.dumps(message)


class GetVpnsList(object):
    def on_get(self, req, resp):
        _list = get_vpns_list()

        message = {
            'success': True,
            'list': _list
        }
        resp.status = falcon.HTTP_200
        resp.body = json.dumps(message)
