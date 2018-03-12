from __future__ import print_function

import time
from os import path, environ
from sentinel.config import ACCOUNT_DATA_PATH
from sentinel.node import Node
from sentinel.node import create_account
from sentinel.node import register_node
from sentinel.node import send_nodeinfo
from sentinel.node import send_client_usage
from sentinel.node import send_connections_info

from sentinel.vpn import OpenVPN

from sentinel.db import db


if __name__ == "__main__":
    if path.exists(ACCOUNT_DATA_PATH) is True:
        node = Node(resume=True)
    elif 'PASSWORD' in environ:
        create_account(environ['PASSWORD'])
        node = Node(resume=True)
    else:
        print('ERROR: {} not found.'.format(ACCOUNT_DATA_PATH))
        exit(1)

    openvpn = OpenVPN()
    if node.account['token'] is None:
        register_node(node)
    openvpn.start()
    node.update_vpninfo({
        'type': 'status',
        'status': 'up'
    })
    send_nodeinfo(node, {
        'type': 'vpn',
        'status': node.vpn['status']
    })
    while True:
        line = openvpn.vpn_proc.stdout.readline().strip()
        line_len = len(line)
        if line_len > 0:
            print(line)
            if 'Peer Connection Initiated with' in line:
                client_name = line.split()[6][1:-1]
                print('*' * 128)
                if 'client' in client_name:
                    connections = openvpn.get_connections(
                        client_name=client_name)
                    result = db.clients.find_one({
                        'name': client_name
                    }, {
                        '_id': 0,
                        'account_addr': 1
                    })
                    connections[0]['client_addr'] = result['account_addr']
                    connections[0]['start_time'] = int(time.time())
                    send_connections_info(
                        node.account['addr'], node.account['token'], connections)
            elif 'client-instance exiting' in line:
                client_name = line.split()[5].split('/')[0]
                print('*' * 128)
                if 'client' in client_name:
                    openvpn.revoke(client_name)
                    connections = openvpn.get_connections(
                        client_name=client_name)
                    result = db.clients.find_one({
                        'name': client_name
                    }, {
                        '_id': 0,
                        'account_addr': 1
                    })
                    connections[0]['end_time'] = int(time.time())
                    send_connections_info(
                        node.account['addr'], node.account['token'], connections)
