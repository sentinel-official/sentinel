# coding=utf-8
import json
import sys
import time
from os import path
from thread import start_new_thread

from sentinel.config import CONFIG_DATA_PATH
from sentinel.config import KEYSTORE_FILE_PATH
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
    extra = 2
    while True:
        try:
            vpn_status_file = path.exists('/etc/openvpn/openvpn-status.log')
            if vpn_status_file is True:
                connections = openvpn.get_connections()
                connections_len = len(connections)
                if (connections_len > 0) or (extra > 0):
                    send_connections_info(node.config['account_addr'], node.config['token'], connections)
                    extra = 2 if connections_len > 0 else extra - 1
        except Exception as err:
            print(str(err))
        time.sleep(5)


if __name__ == "__main__":
    config = None
    if path.exists(CONFIG_DATA_PATH) is True:
        config = json.load(open(CONFIG_DATA_PATH, 'r'))
    else:
        print('ERROR: {} not found.'.format(CONFIG_DATA_PATH))
        exit(1)

    if (len(config['account_addr']) == 0) and (len(sys.argv) > 1):
        PASSWORD = sys.argv[1]
        keystore, account_addr = create_account(PASSWORD)
        if (keystore is not None) and (account_addr is not None):
            keystore_file = open(KEYSTORE_FILE_PATH, 'w')
            keystore_file.writelines(keystore)
            keystore_file.close()

            config['account_addr'] = account_addr
        else:
            print('Error occurred while creating a new account.')
            exit(3)
    elif (len(config['account_addr']) == 42) and (len(sys.argv) == 1):
        pass
    else:
        print('Password is not provided OR `account_addr` in config is incorrect. \
               Please try again after deleting config file.')
        exit(2)

    node = Node(config)
    openvpn = OpenVPN()

    if len(node.config['token']) == 0:
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
