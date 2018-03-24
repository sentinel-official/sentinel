# coding=utf-8
import json
from uuid import uuid4

import falcon
import requests

from ..config import DECIMALS
from ..config import LIMIT
from ..db import db
from ..eth import vpn_service_manager
from ..helpers import eth_helper
from ..logs import logger


def get_vpns_list():
    _list = db.nodes.find({
        'vpn.status': 'up'
    }, {
        '_id': 0,
        'account_addr': 1,
        'location': 1,
        'net_speed.upload': 1,
        'net_speed.download': 1
    })
    return list(_list)


def get_current_vpn_usage(account_addr, session_name):
    result = db.connections.find_one({
        'client_addr': account_addr,
        'session_name': session_name
    }, {
        '_id': 0,
        'usage': 1
    })

    return {} if result is None else result['usage']


class GetVpnCredentials(object):
    def on_post(self, req, resp):
        """
        @api {post} /client/vpn Get VPN server credentials.
        @apiName GetVpnCredentials
        @apiGroup VPN
        @apiParam {String} account_addr Account address.
        @apiParam {String} vpn_addr Account address of the VPN server.
        @apiSuccess {String} ip IP address of the VPN server.
        @apiSuccess {String} port Port number of the VPN server.
        @apiSuccess {String} token Unique token for validation.
        """
        account_addr = str(req.body['account_addr'])
        vpn_addr = str(req.body['vpn_addr'])

        balances = eth_helper.get_balances(account_addr)

        if balances['rinkeby']['sents'] >= 100:
            error, usage = eth_helper.get_latest_vpn_usage(account_addr)
            if error is None:
                due_amount = 0 if usage['is_payed'] is True else usage['amount']
                if (due_amount > 0) and (usage['received_bytes'] < LIMIT):
                    vpn_addr = usage['account_addr']

                if (due_amount > 0) and (usage['received_bytes'] >= LIMIT):
                    message = {
                        'success': False,
                        'message': 'You have due amount: ' + str(
                            due_amount / (DECIMALS * 1.0)) + ' SENTs. Please try after clearing the due.'
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
                        error, is_payed = eth_helper.get_initial_payment(
                            account_addr)
                        if error is None:
                            if is_payed is True:
                                try:
                                    token = uuid4().hex
                                    ip, port = str(node['ip']), 3000
                                    body = {
                                        'account_addr': account_addr,
                                        'token': token
                                    }
                                    url = 'http://{}:{}/token'.format(
                                        ip, port)
                                    _ = requests.post(
                                        url, json=body, timeout=10)
                                    message = {
                                        'success': True,
                                        'ip': ip,
                                        'port': port,
                                        'token': token
                                    }
                                except Exception as _:
                                    message = {
                                        'success': False,
                                        'message': 'Connection timed out while connecting to VPN server.'
                                    }
                                    logger.send_log(message, resp)
                            else:
                                message = {
                                    'success': False,
                                    'account_addr': vpn_addr,
                                    'message': 'Initial payment status is empty.'
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
        @apiParam {String} from_addr Account address.
        @apiParam {Number} amount Amount to be payed to VPN server.
        @apiParam {Number} session_id Session ID of the VPN connection.
        @apiParam {String} tx_data Hex code of the transaction.
        @apiParam {String} net Ethereum chain name {main | rinkeby}.
        @apiSuccess {String[]} errors Errors if any.
        @apiSuccess {String[]} tx_hashes Transaction hashes.
        """
        payment_type = str(req.body['payment_type'])  # normal OR init
        tx_data = str(req.body['tx_data'])
        net = str(req.body['net'])
        from_addr = str(req.body['from_addr'])
        amount = float(
            req.body['amount']) if 'amount' in req.body and req.body['amount'] is not None else None
        session_id = int(req.body['session_id']
                         ) if 'session_id' in req.body and req.body['session_id'] is not None else None

        amount = int(amount * (DECIMALS * 1.0))

        errors, tx_hashes = eth_helper.pay_vpn_session(
            from_addr, amount, session_id, net, tx_data, payment_type)

        if len(errors) > 0:
            message = {
                'success': False,
                'errors': errors,
                'tx_hashes': tx_hashes,
                'message': 'Error occurred while paying VPN usage.'
            }
            try:
                raise Exception(errors)
            except Exception as _:
                logger.send_log(message, resp)
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
        from_addr = str(req.body['from_addr'])
        amount = int(req.body['amount'])
        session_id = int(req.body['session_id'])

        error, tx_hash = vpn_service_manager.pay_vpn_session(
            from_addr, amount, session_id)

        if error is None:
            message = {
                'success': True,
                'tx_hash': tx_hash,
                'message': 'Payment Done Successfully.'
            }
            resp.status = falcon.HTTP_200
            resp.body = json.dumps(message)

        else:
            message = {
                'success': False,
                'error': error,
                'message': 'Vpn payment not successful.'
            }
            try:
                raise Exception(error)
            except Exception as _:
                logger.send_log(message, resp)


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
            message = {
                'success': True,
                'usage': usage
            }
            resp.status = falcon.HTTP_200
            resp.body = json.dumps(message)
        else:
            message = {
                'success': False,
                'error': error,
                'message': 'Error occured while fetching the usage data.'
            }
            try:
                raise Exception(error)
            except Exception as _:
                logger.send_log(message, resp)


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
        account_addr = str(req.body['account_addr'])
        session_name = str(req.body['session_name'])

        usage = get_current_vpn_usage(account_addr, session_name)

        message = {
            'success': True,
            'usage': usage
        }

        resp.status = falcon.HTTP_200
        resp.body = json.dumps(message)
