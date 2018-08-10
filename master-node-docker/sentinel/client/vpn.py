# coding=utf-8
import json
from uuid import uuid4

import falcon
import requests

from ..config import COINBASE_ADDRESS
from ..config import DECIMALS
from ..config import REFERRAL_DUMMY
from ..db import db
from ..eth import vpn_service_manager
from ..helpers import eth_helper


def get_vpns_list(vpn_type):
    _list = db.nodes.find({
        'vpn.status': 'up',
        'vpn_type': vpn_type
    }, {
        '_id': 0,
        'account_addr': 1,
        'ip': 1,
        'price_per_gb': 1,
        'location': 1,
        'net_speed.upload': 1,
        'latency': 1,
        'net_speed.download': 1,
        'enc_method': 1
    })
    return list(_list)


def get_current_vpn_usage(account_addr, session_name):
    result = db.connections.find_one({
        'client_addr': account_addr,
        'session_name': session_name
    }, {
        '_id': 0,
        'server_usage': 1
    })

    return {} if result is None else result['server_usage']


class GetVpnCredentials(object):
    def on_post(self, req, resp):
        """
        @api {post} /client/vpn Get VPN server credentials.
        @apiName GetVpnCredentials
        @apiGroup VPN
        @apiParam {String} account_addr Account address.
        @apiParam {String} vpn_addr Account address of the VPN server.
        @apiSuccess {String} ip IP address of the VPN server.
        @apiSuccess {Number} port Port number of the VPN server.
        @apiSuccess {String} token Unique token for validation.
        @apiSuccess {String} vpn_addr VPN server account address.
        """
        account_addr = str(req.body['account_addr']).lower() if 'account_addr' in req.body else REFERRAL_DUMMY
        device_id = str(req.body['device_id']) if 'device_id' in req.body else None
        vpn_addr = str(req.body['vpn_addr']).lower()

        balances = eth_helper.get_balances(account_addr)

        if balances['rinkeby']['sents'] >= (100 * DECIMALS):
            error, due_amount = eth_helper.get_due_amount(account_addr)
            if error is None:
                if due_amount > 0:
                    message = {
                        'success': False,
                        'message': 'You have due amount: ' + str(
                            due_amount / DECIMALS) + ' SENTs. Please try after clearing the due.'
                    }
                else:
                    node = db.nodes.find_one({
                        'account_addr': vpn_addr,
                        'vpn.status': 'up'
                    }, {
                        '_id': 0,
                        'token': 0
                    })
                    if node is None:
                        message = {
                            'success': False,
                            'message': 'Currently VPN server is not available. Please try after sometime.'
                        }
                    else:
                        error, is_paid = eth_helper.get_initial_payment(
                            account_addr)
                        if error is None:
                            if is_paid is True:
                                try:
                                    token = uuid4().hex
                                    ip, port = str(node['ip']), 3000
                                    body = {
                                        'account_addr': device_id if account_addr == REFERRAL_DUMMY else account_addr,
                                        # Fixes for SLC
                                        'token': token
                                    }
                                    url = 'http://{}:{}/token'.format(ip, port)
                                    _ = requests.post(
                                        url, json=body, timeout=10)
                                    message = {
                                        'success': True,
                                        'ip': ip,
                                        'port': port,
                                        'token': token,
                                        'vpn_addr': vpn_addr,
                                        'message': 'Started VPN session.'
                                    }
                                except Exception as err:
                                    message = {
                                        'success': False,
                                        'message': 'Connection timed out while connecting to VPN server.',
                                        'error': str(err)
                                    }
                            else:
                                message = {
                                    'success': False,
                                    'account_addr': COINBASE_ADDRESS,
                                    'message': 'Initial VPN payment is not done.'
                                }
                        else:
                            message = {
                                'success': False,
                                'message': 'Error occurred while cheking initial payment status.'
                            }
            else:
                message = {
                    'success': False,
                    'message': 'Error occurred while checking due amount.'
                }
        else:
            message = {
                'success': False,
                'message': 'Your balance is less than 100 SENTs.'
            }

        resp.status = falcon.HTTP_200
        resp.body = json.dumps(message)


class PayVpnUsage(object):
    def on_post(self, req, resp):
        """
        @api {post} /client/vpn/pay VPN usage payment.
        @apiName PayVpnUsage
        @apiGroup VPN
        @apiParam {String} payment_type Type of payment {init | normal}
        @apiParam {String} tx_data Hex code of the transaction.
        @apiParam {String} net Ethereum chain name {main | rinkeby}.
        @apiParam {String} from_addr Account address.
        @apiParam {Number} amount Amount to be paid to VPN server.
        @apiParam {Number} session_id Session ID of the VPN connection.
        @apiSuccess {String[]} errors Errors if any.
        @apiSuccess {String[]} tx_hashes Transaction hashes.
        """
        payment_type = str(req.body['payment_type']).lower()  # init OR normal
        tx_data = str(req.body['tx_data'])
        net = str(req.body['net']).lower()
        from_addr = str(req.body['from_addr']).lower()
        amount = int(req.body['amount']) if 'amount' in req.body and req.body['amount'] is not None else None
        session_id = str(req.body['session_id']) if 'session_id' in req.body and req.body[
            'session_id'] is not None else None
        device_id = str(req.body['device_id']) if 'device_id' in req.body else None

        errors, tx_hashes = eth_helper.pay_vpn_session(
            from_addr, amount, session_id, net, tx_data, payment_type, device_id)

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


class ReportPayment(object):
    def on_post(self, req, resp):
        """
        @api {post} /client/vpn/report Report VPN payment.
        @apiName ReportPayment
        @apiGroup VPN
        @apiParam {String} from_addr Account address.
        @apiParam {Number} amount Amount to be paid to VPN server.
        @apiParam {Number} session_id Session ID of the VPN connection.
        @apiSuccess {String} tx_hash Transaction hash.
        """
        from_addr = str(req.body['from_addr']).lower()
        amount = int(req.body['amount'])
        session_id = str(req.body['session_id'])

        nonce = eth_helper.get_valid_nonce(COINBASE_ADDRESS, 'rinkeby')
        error, tx_hash = vpn_service_manager.pay_vpn_session(
            from_addr, amount, session_id, nonce)

        if error is None:
            message = {
                'success': True,
                'tx_hash': tx_hash,
                'message': 'Payment Done Successfully.'
            }
        else:
            message = {
                'success': False,
                'error': error,
                'message': 'Vpn payment not successful.'
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
        account_addr = str(req.body['account_addr']).lower()

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
        _list = get_vpns_list('openvpn')
        for item in _list:
            item['price_per_GB'] = item['price_per_gb']
            item.pop('price_per_gb')

        message = {
            'success': True,
            'list': _list
        }

        resp.status = falcon.HTTP_200
        resp.body = json.dumps(message)


class GetSocksList(object):
    def on_get(self, req, resp):
        """
        @api {get} /client/vpn/socks-list Get all unoccupied Socks servers list.
        @apiName GetSocksList
        @apiGroup VPN
        @apiSuccess {Object[]} list Details of all Socks servers.
        """
        _list = get_vpns_list('socks5')
        for item in _list:
            item['price_per_GB'] = item['price_per_gb']
            item.pop('price_per_gb')

        message = {
            'success': True,
            'list': _list
        }

        resp.status = falcon.HTTP_200
        resp.body = json.dumps(message)


class GetVpnCurrentUsage(object):
    def on_post(self, req, resp):
        """
        @api {post} /client/vpn/current Get current VPN usage.
        @apiName GetVpnCurrentUsage
        @apiGroup VPN
        @apiParam {String} account_addr Account address.
        @apiParam {String} session_name Session name of the VPN connection.
        @apiSuccess {Object} usage Current VPN usage.
        """
        account_addr = str(req.body['account_addr']).lower()
        session_name = str(req.body['session_name'])

        usage = get_current_vpn_usage(account_addr, session_name)

        message = {
            'success': True,
            'usage': usage
        }

        resp.status = falcon.HTTP_200
        resp.body = json.dumps(message)
