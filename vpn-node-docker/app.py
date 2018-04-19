# coding=utf-8
import sys
import time
from os import path
from thread import start_new_thread

from sentinel.config import ACCOUNT_DATA_PATH
from sentinel.node import Node
from sentinel.node import create_account
from sentinel.node import register_node
from sentinel.node import send_connections_info
from sentinel.node import send_nodeinfo
from sentinel.vpn import OpenVPN


def alive_job():
    while True:
        try:
            send_nodeinfo(node, {
                'type': 'alive'
            })
        except Exception as err:
            print(str(err))
        time.sleep(30)


def connections_job():
    while True:
        try:
            vpn_status_file = path.exists('/etc/openvpn/openvpn-status.log')
            if vpn_status_file is True:
                connections = openvpn.get_connections()
                connections_len = len(connections)
                if connections_len > 0:
                    send_connections_info(node.account['addr'], node.account['token'], connections)
        except Exception as err:
            print(str(err))
        time.sleep(5)


if __name__ == "__main__":
    node = None
    argv_len = len(sys.argv)
    if path.exists(ACCOUNT_DATA_PATH) is True:
        node = Node()
    elif argv_len > 1:
        PASSWORD = sys.argv[1]
        create_account(PASSWORD)
        node = Node()
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
    start_new_thread(alive_job, ())
    start_new_thread(connections_job, ())
    while True:
        line = openvpn.vpn_proc.stdout.readline().strip()
        line_len = len(line)
        if line_len > 0:
            print(line)
            if 'Peer Connection Initiated with' in line:
                client_name = line.split()[6][1:-1]
                if 'client' in client_name:
                    print('*' * 128)
            elif 'client-instance exiting' in line:
                client_name = line.split()[5].split('/')[0]
                if 'client' in client_name:
                    print('*' * 128)
                    openvpn.revoke(client_name)
