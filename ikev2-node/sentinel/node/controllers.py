# coding=utf-8
import os
from urllib.parse import urljoin

from psutil import cpu_count, cpu_percent, virtual_memory

from ..config import MASTER_NODE_URL
from ..utils import fetch


def create_account(password):
    body = {
        'password': password
    }
    url = urljoin(MASTER_NODE_URL, 'node/account')
    try:
        keystore, account_addr = None, None
        res = fetch().post(url, json=body)
        res = res.json()
        if res['success'] is True:
            keystore = res['keystore']
            account_addr = str(res['account_addr']).lower()
        return keystore, account_addr
    except Exception as err:
        print(err)


def register_node(node):
    body = {
        'ip': node.ip,
        'account_addr': node.config['account_addr'],
        'price_per_gb': node.config['price_per_gb'],
        'moniker': node.config['moniker'],
        'description': node.config['description'],
        'vpn_type': 'IKEv2',
        'location': node.location,
        'net_speed': node.net_speed,
        'version': node.version,
        'cpus': cpu_count(),
        'memory': virtual_memory().total,
        'lite': os.getenv('LITE_NETWORK')
    }
    url = urljoin(MASTER_NODE_URL, 'node/register')
    try:
        res = fetch().post(url, json=body)
        res = res.json()
        if res['success'] is True:
            info = {
                'type': 'config',
                'token': str(res['token'])
            }
            node.update_node_info(info)
        return res['success']
    except Exception as err:
        print(err)


def send_node_info(node, info):
    body = {
        'account_addr': node.config['account_addr'],
        'token': node.config['token'],
        'info': info
    }
    url = urljoin(MASTER_NODE_URL, 'node/update-nodeinfo')
    try:
        res = fetch().post(url, json=body)
        res = res.json()
        return res['success']
    except Exception as err:
        print(err)


def send_connections_info(account_addr, token, connections):
    body = {
        'account_addr': account_addr,
        'token': token,
        'load': {
            'cpu': cpu_percent(),
            'memory': virtual_memory().active
        },
        'connections': connections
    }
    url = urljoin(MASTER_NODE_URL, 'node/update-connections')
    try:
        res = fetch().post(url, json=body)
        res = res.json()
        return res['success']
    except Exception as err:
        print(err)


def deregister_node(node):
    body = {
        'account_addr': node.config['account_addr'],
        'token': node.config['token']
    }
    url = urljoin(MASTER_NODE_URL, 'node/deregister')
    try:
        res = fetch().post(url, json=body)
        res = res.json()
        return res['success']
    except Exception as err:
        print(err)
