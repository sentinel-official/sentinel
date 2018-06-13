# coding=utf-8
import json

import falcon
import requests

from ..config import MIN_GAS
from ..db import db
from ..helpers import eth_helper


def get_mixer_nodes_list(eth=0, sent=0):
    _list = db.mixer_nodes.find({
        'mixer.status': 'up',
        'balances.eth': {
            '$gte': eth + MIN_GAS
        },
        'balances.sent': {
            '$gte': sent
        }
    }, {
        '_id': 0,
        'account_addr': 1,
        'service_charge': 1,
        'balances': 1
    })

    return list(_list)


def get_to_address(ip):
    url = 'https://{}:3000/account'.format(ip)
    res = requests.post(url)
    res = res.json()

    return res['address'] if res['success'] is True else None


def send_mix_details(ip, to_address, destination_address, delay_in_seconds, coin_symbol):
    url = 'https://{}:3000/mix'.format(ip)
    body = {
        'toAddress': to_address,
        'destinationAddress': destination_address,
        'delayInSeconds': delay_in_seconds,
        'coinSymbol': coin_symbol
    }
    res = requests.post(url, json=body)
    res = res.json()

    return res['success']


class GetMixerNodessList(object):
    def on_post(self, req, resp):
        eth = float(req.body['eth']) if 'eth' in req.body else 0
        sent = float(req.body['sent']) if 'sent' in req.body else 0
        _list = get_mixer_nodes_list(eth, sent)

        message = {
            'success': True,
            'list': _list
        }

        resp.status = falcon.HTTP_200
        resp.body = json.dumps(message)


class GetMixerToAddress(object):
    def on_post(self, req, resp):
        account_addr = str(req.body['account_addr']).lower()
        node = db.mixer_nodes.find_one({
            'account_addr': account_addr,
            'mixer.status': 'up'
        })
        if node is None:
            message = {
                'success': False,
                'message': 'No mixer node found.'
            }
        else:
            to_address = get_to_address(node.ip)
            if to_address is None:
                message = {
                    'success': False,
                    'message': 'Error occured while getting to_address'
                }
            else:
                message = {
                    'success': True,
                    'to_address': to_address
                }

        resp.status = falcon.HTTP_200
        resp.body = json.dumps(message)


class InitiateMix(object):
    def on_post(self, req, resp):
        account_addr = str(req.body['account_addr']).lower()
        to_address = str(req.body['to_address']).lower()
        destination_address = str(req.body['destination_address']).lower()
        delay_in_seconds = int(req.body['delay_in_seconds'])
        coin_symbol = str(req.body['coin_symbol']).lower()
        tx_data = str(req.body['tx_data'])
        net = str(req.body['net'])

        node = db.mixer_nodes.find_one({
            'account_addr': account_addr,
            'mixer.status': 'up'
        })
        if node is None:
            message = {
                'success': False,
                'message': 'No mixer node found.'
            }
        else:
            success = send_mix_details(node.ip, to_address, destination_address, delay_in_seconds, coin_symbol)
            if success is True:
                error, tx_hash = eth_helper.raw_transaction(tx_data, net)
                if error is None:
                    message = {
                        'success': True,
                        'message': 'Mix details sent successfully and transaction initiated.',
                        'tx_hash': tx_hash
                    }
                else:
                    message = {
                        'success': False,
                        'message': 'Mix details sent successfully.'
                    }
            else:
                message = {
                    'success': False,
                    'message': 'Error occured while sending mix details.'
                }

        resp.status = falcon.HTTP_200
        resp.body = json.dumps(message)
