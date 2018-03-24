from __future__ import print_function

import sys
import time
from os import path
from thread import start_new_thread

from sentinel.config import ACCOUNT_DATA_PATH
from sentinel.db import db
from sentinel.node import Node
from sentinel.node import create_account
from sentinel.node import register_node
from sentinel.node import send_connections_info
from sentinel.node import send_nodeinfo
from sentinel.vpn import OpenVPN


def tasks():
    while True:
        try:
            vpn_status_file = path.exists('/etc/openvpn/openvpn-status.log')
            if vpn_status_file is True:
                _connections = openvpn.get_connections()
                connections_len = len(_connections)
                if connections_len > 0:
                    send_connections_info(
                        node.account['addr'], node.account['token'], _connections)

            send_nodeinfo(node, {
                'type': 'alive'
            })
        except Exception as err:
            print(str(err))
        time.sleep(5)


if __name__ == "__main__":
    node = None
    argv_len = len(sys.argv)
    if path.exists(ACCOUNT_DATA_PATH) is True:
        node = Node(resume=True)
    elif argv_len > 1:
        PASSWORD = sys.argv[1]
        create_account(PASSWORD)
        node = Node(resume=True)
    else:
        print('ERROR: {} not found.'.format(ACCOUNT_DATA_PATH))
        exit(1)

    openvpn = OpenVPN()
    if node.account['token'] is None:
        register_node(node)
    openvpn.start()
    send_nodeinfo(node, {
        'type': 'vpn'
    })
    start_new_thread(tasks, ())
    while True:
        line = openvpn.vpn_proc.stdout.readline().strip()
        line_len = len(line)
        if line_len > 0:
            print(line)
            if 'Peer Connection Initiated with' in line:
                client_name = line.split()[6][1:-1]
                print('*' * 128)
                if 'client' in client_name:
                    result = db.clients.find_one({
                        'name': client_name
                    }, {
                        '_id': 0,
                        'account_addr': 1
                    })
                    connections = [{
                        'session_name': client_name,
                        'usage': {
                            'up': 0,
                            'down': 0
                        },
                        'client_addr': result['account_addr'],
                        'start_time': int(time.time())
                    }]
                    send_connections_info(
                        node.account['addr'], node.account['token'], connections)
            elif 'client-instance exiting' in line:
                client_name = line.split()[5].split('/')[0]
                print('*' * 128)
                if 'client' in client_name:
                    openvpn.revoke(client_name)
                    connections = openvpn.get_connections(
                        client_name=client_name)
                    connections[0]['end_time'] = int(time.time())
                    send_connections_info(
                        node.account['addr'], node.account['token'], connections)
