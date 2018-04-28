# coding=utf-8

from urlparse import urljoin

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
        'location': node.location,
        'net_speed': node.net_speed
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
            node.update_nodeinfo(info)
        return res['success']
    except Exception as err:
        print(err)


def send_nodeinfo(node, info):
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
