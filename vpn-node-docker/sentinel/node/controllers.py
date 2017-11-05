import urlparse
import requests
from ..config import MASTER_NODE_URL


def register_node(node):
    if node.location is None:
        node.update_location()
    if node.net_speed['download'] is None:
        node.update_netspeed()
    body = {
        'account': {
            'address': node.account_addr
        },
        'location': node.location,
        'net_speed': node.net_speed
    }
    url = urlparse.urljoin(MASTER_NODE_URL, 'register-node')
    res = requests.post(url, json=body)
    if res.status_code == 200 and res.ok:
        res_body = res.json()
        node.set_token(res_body['token'])
        return True
    return False


def send_nodeinfo(node, info_type):
    info = {
        'type': info_type
    }
    if info_type == 'location':
        info['location'] = node.location
    elif info_type == 'net_speed':
        info['net_speed'] = node.net_speed
    elif info_type == 'ovpn':
        info['ovpn'] = node.ovpn
    elif info_type == 'vpn_status':
        info['vpn_status'] = node.vpn_status
    body = {
        'account_addr': node.account_addr,
        'token': node.token,
        'info': info
    }
    url = urlparse.urljoin(MASTER_NODE_URL, 'update-nodeinfo')
    res = requests.post(url, json=body)
    if res.status_code == 200 and res.ok:
        return True
    return False


def deregister_node(node):
    body = {
        'account_addr': node.account_addr,
        'token': node.token
    }
    url = urlparse.urljoin(MASTER_NODE_URL, 'deregister-node')
    res = requests.post(url, json=body)
    if res.status_code == 200 and res.ok:
        return True
    return False
