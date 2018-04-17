# coding=utf-8
import json
from urlparse import urljoin

from ..config import ACCOUNT_DATA_PATH
from ..config import MASTER_NODE_URL
from ..utils import fetch


def create_account(password):
    body = {
        'password': password
    }
    url = urljoin(MASTER_NODE_URL, 'node/account')
    try:
        res = fetch().post(url, json=body)
        res = res.json()
        if res['success'] is True:
            data = {
                'addr': str(res['account_addr']).lower(),
                'keystore': res['keystore'],
                'password': str(password),
                'private_key': str(res['private_key']),
                'token': None
            }
            data = json.dumps(data)
            data_file = open(ACCOUNT_DATA_PATH, 'w+')
            data_file.writelines(data)
            data_file.close()
        return res['success']
    except Exception as err:
        print(err)


def register_node(node):
    body = {
        'account_addr': node.account['addr'],
        'price_per_GB': node.config['price_per_GB'],
        'location': node.location,
        'ip': node.ip,
        'net_speed': node.net_speed
    }
    url = urljoin(MASTER_NODE_URL, 'node/register')
    try:
        res = fetch().post(url, json=body)
        res = res.json()
        if res['success'] is True:
            info = {
                'type': 'account',
                'token': str(res['token'])
            }
            node.update_nodeinfo(info)
        return res['success']
    except Exception as err:
        print(err)


def send_nodeinfo(node, info):
    body = {
        'account_addr': node.account['addr'],
        'token': node.account['token'],
        'info': info
    }
    url = urljoin(MASTER_NODE_URL, 'node/update-nodeinfo')
    try:
        res = fetch().post(url, json=body)
        res = res.json()
        return res['success']
    except Exception as err:
        print(err)


def send_client_usage(node, to_addr, sent_bytes, session_duration):
    body = {
        'from_addr': node.account['addr'],
        'to_addr': to_addr,
        'token': node.account['token'],
        'sent_bytes': sent_bytes,
        'session_duration': session_duration
    }
    url = urljoin(MASTER_NODE_URL, 'node/add-usage')
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
        'account_addr': node.account['addr'],
        'token': node.account['token']
    }
    url = urljoin(MASTER_NODE_URL, 'node/deregister')
    try:
        res = fetch().post(url, json=body)
        res = res.json()
        return res['success']
    except Exception as err:
        print(err)
