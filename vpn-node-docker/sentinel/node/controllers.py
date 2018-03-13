import json
import getip
import requests
from urlparse import urljoin
from ..db import db
from ..config import LOCAL_SERVER_URL
from ..config import MASTER_NODE_URL
from ..config import ACCOUNT_DATA_PATH


def register_node(node):
    body = {
        'account_addr': node.account['addr'],
        'location': node.location,
        'ip': getip.get(),
        'net_speed': node.net_speed
    }
    url = urljoin(LOCAL_SERVER_URL, 'node/register')
    res = requests.post(url, json=body)
    res = res.json()
    if res['success'] == True:
        info = {
            'type': 'account',
            'token': res['token']
        }
        node.update_nodeinfo(info)
        result = db.nodes.find_one({
            'address': node.account['addr']
        })
        if result is None:
            _ = db.nodes.insert_one({
                'address': node.account['addr'],
                'location': node.location,
                'net_speed': node.net_speed
            })
        else:
            _ = db.nodes.find_one_and_update({
                'address': node.account['addr']
            }, {
                '$set': {
                    'location': node.location,
                    'net_speed': node.net_speed
                }
            })
        return True
    return False


def create_account(password):
    body = {
        'password': password
    }
    url = urljoin(LOCAL_SERVER_URL, 'node/account')
    res = requests.post(url, json=body)
    res = res.json()
    if res['success'] == True:
        data = {
            'addr': res['account_addr'],
            'keystore': res['keystore'],
            'password': password,
            'private_key': res['private_key'],
            'token': None
        }
        data = json.dumps(data)
        data_file = open(ACCOUNT_DATA_PATH, 'w+')
        data_file.writelines(data)
        data_file.close()
        return True
    return False


def send_nodeinfo(node, info):
    body = {
        'account_addr': node.account['addr'],
        'token': node.account['token'],
        'info': info
    }
    url = urljoin(MASTER_NODE_URL, 'node/update-nodeinfo')
    res = requests.post(url, json=body)
    res = res.json()
    if res['success'] == True:
        return True
    return False


def send_client_usage(node, to_addr, received_bytes, sent_bytes, session_duration):
    body = {
        'from_addr': node.account['addr'],
        'to_addr': to_addr,
        'token': node.account['token'],
        'sent_bytes': sent_bytes,
        'session_duration': session_duration
    }
    url = urljoin(LOCAL_SERVER_URL, 'node/add-usage')
    res = requests.post(url, json=body)
    res = res.json()
    if res['success'] == True:
        return True
    return False


def send_connections_info(account_addr, token, connections):
    body = {
        'account_addr': account_addr,
        'token': token,
        'connections': connections
    }
    url = urljoin(MASTER_NODE_URL, 'node/update-connections')
    res = requests.post(url, json=body)
    res = res.json()
    if res['success'] == True:
        return True
    return False


def deregister_node(node):
    body = {
        'account_addr': node.account['addr'],
        'token': node.account['token']
    }
    url = urljoin(LOCAL_SERVER_URL, 'node/deregister')
    res = requests.post(url, json=body)
    res = res.json()
    if res['success'] == True:
        return True
    return False


def get_amount(node, amount, unit):
    body = {
        'account_addr': node.account['addr'],
        'unit': unit,
        'amount': amount
    }
    url = urljoin(MASTER_NODE_URL, 'dev/transfer-amount')
    res = requests.post(url, json=body)

    if res.status_code == 200 and res.ok:
        return True
    return False
