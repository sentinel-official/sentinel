import json
from urlparse import urljoin
import requests
from ..config import MASTER_NODE_URL
from ..config import ACCOUNT_DATA_PATH
import getip

def register_node(node):
    body = {
        'account': {
            'addr': node.account['addr']
        },
        'location': node.location,
        'ip':getip.get(),
        'net_speed': node.net_speed
    }
    url = urljoin(MASTER_NODE_URL, 'node/register')
    res = requests.post(url, json=body)

    if res.status_code == 200 and res.ok:
        res_body = res.json()
        info = {
            'type': 'account',
            'token': res_body['token']
        }
        node.update_nodeinfo(info)
        return True
    return False


def create_account(password):
    body = {
        'password': password
    }
    url = urljoin(MASTER_NODE_URL, 'node/account')
    res = requests.post(url, json=body)

    if res.status_code == 200 and res.ok:
        res_body = res.json()
        data = {
            'addr': res_body['account_addr'],
            'keystore': res_body['keystore'],
            'password': password,
            'private_key': res_body['private_key'],
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

    if res.status_code == 200 and res.ok:
        return True
    return False


def send_client_usage(node, received_bytes, sent_bytes, session_duration):
    body = {
        'account_addr': node.account['addr'],
        'token': node.account['token'],
        'keystore': node.account['keystore'],
        'password': node.account['password'],
        'received_bytes': received_bytes,
        'sent_bytes': sent_bytes,
        'session_duration': session_duration
    }
    url = urljoin(MASTER_NODE_URL, 'node/add-usage')
    res = requests.post(url, json=body)

    if res.status_code == 200 and res.ok:
        return True
    return False


def deregister_node(node):
    body = {
        'account_addr': node.account['addr'],
        'token': node.account['token']
    }
    url = urljoin(MASTER_NODE_URL, 'node/deregister')
    res = requests.post(url, json=body)

    if res.status_code == 200 and res.ok:
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
