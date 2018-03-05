from __future__ import print_function

import time
from os import path, environ
from sentinel.config import ACCOUNT_DATA_PATH
from sentinel.node import Node
from sentinel.node import create_account
from sentinel.node import register_node
from sentinel.node import send_nodeinfo
from sentinel.node import send_client_usage
from sentinel.node import get_amount

from sentinel.vpn import OpenVPN
from sentinel.vpn import Keys

from sentinel.db import db


if __name__ == "__main__":
    if path.exists(ACCOUNT_DATA_PATH) is True:
        node = Node(resume=True)
    elif 'PASSWORD' in environ:
        create_account(environ['PASSWORD'])
        node = Node(resume=True)
    else:
        print ('ERROR: {} not found.'.format(ACCOUNT_DATA_PATH))
        exit(1)

    openvpn = OpenVPN()
    if node.account['token'] is None:
        register_node(node)
    openvpn.start()
    node.update_vpninfo({'type': 'status', 'status': 'up'})
    send_nodeinfo(node, {'type': 'vpn', 'status': node.vpn['status']})
    while True:
        line = openvpn.vpn_proc.stdout.readline().strip()
        line_len = len(line)
        if line_len > 0:
            print(line)
            if 'Peer Connection Initiated with' in line:
                client_name = line.split()[6][1:-1]
                _ = db.clients.find_one_and_update(
                    {'name': client_name}, {'$set': {'isConnected': 1}})
            elif 'client-instance exiting' in line:
                client_name = line.split()[5].split('/')[0]
                _ = db.clients.find_one_and_update(
                    {'name': client_name}, {'$set': {'isConnected': 0}})
                client_details = db.clients.find_one({'name': client_name})
                received_bytes, sent_bytes, connected_time = openvpn.get_client_usage(
                    client_name)
                sesstion_duration = int(time.time()) - connected_time
                send_client_usage(node, client_details['account_addr'],
                                  received_bytes, sent_bytes, sesstion_duration)
