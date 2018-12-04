# coding=utf-8

from urlparse import urljoin

from ..config import MASTER_NODE_URL
from ..config import GAIA_CLI_URL
from ..utils import fetch

def create_account(password, name):
    body = {
        'name': name,
        'password': password
    }
    url = urljoin(GAIA_CLI_URL, '/keys')
    try:
        keystore, account_addr = None, None
        res = fetch().post(url, json=body)
        res = res.json()
        if res['type'] == "local":
            keystore = res['seed']
            account_addr = str(res['address']).lower()
        return keystore, account_addr
    except Exception as err:
        print(err)

def register_node(node):
    print('this is your node: ', node.config)
    details = {
        'IP': node.ip,
        'pricePerGB': node.config['price_per_gb'],
        'encMethod': node.config['enc_method'],
        'location': node.location,
        'netSpeed': node.net_speed,
        'version': 'v0.1'
    }
    body = {
        'accountAddress': node.config['account_addr'],
        'token': node.config['token'],
        'type':'Socks5',
        'details': details,
    }
    url = urljoin(MASTER_NODE_URL, '/register/vpn')
    try:
        res = fetch().post(url, json=body)
        res = res.json()
        print('response from server: ', res)
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


# def send_connections_info(account_addr, token, connections):
#     body = {
#         'account_addr': account_addr,
#         'token': token,
#         'connections': connections
#     }
#     url = urljoin(MASTER_NODE_URL, 'node/update-connections')
#     try:
#         res = fetch().post(url, json=body)
#         res = res.json()
#         return res['success']
#     except Exception as err:
#         print(err)


# def deregister_node(node):
#     body = {
#         'account_addr': node.config['account_addr'],
#         'token': node.config['token']
#     }
#     url = urljoin(MASTER_NODE_URL, 'node/deregister')
#     try:
#         res = fetch().post(url, json=body)
#         res = res.json()
#         return res['success']
#     except Exception as err:
#         print(err)
