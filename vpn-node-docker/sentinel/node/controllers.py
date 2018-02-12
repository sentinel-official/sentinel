import json
from urlparse import urljoin
import requests
from ..config import LOCAL_SERVER_URL
from ..config import MASTER_NODE_URL
from ..config import ACCOUNT_DATA_PATH
import getip
import socket


def register_node(node):
    body = {
        'account': {
            'addr': node.account['addr']
        },
        'location': node.location,
        'ip': getip.get(),
        'net_speed': node.net_speed
    }
    url = urljoin(LOCAL_SERVER_URL, 'node/register')
    res = requests.post(url, json=body)
    res=res.json()
    if res['success'] == True:
        info = {'type': 'account', 'token': res['token']}
        node.update_nodeinfo(info)
        return True
    return False


def create_account(password):
    body = {'password': password}
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
    url = urljoin(LOCAL_SERVER_URL, 'node/update-nodeinfo')
    res = requests.post(url, json=body)
    print("Res..")
    print(res)
    res=res.json()
    if res['success'] == True:
        body={
            'location':node.location,
            'net_speed':node.net_speed,
            'vpn':node.vpn
        }
        url = urljoin(LOCAL_SERVER_URL, 'vpn/getCurrentNode')
        resp = requests.post(url, json=body)
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
    url = urljoin(LOCAL_SERVER_URL, 'node/add-usage')
    res = requests.post(url, json=body)
    res=res.json()
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
    res=res.json()
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
