# coding=utf-8
import json
import sys
import time
from _thread import start_new_thread
from os import path

from sentinel.config import CONFIG_DATA_PATH
from sentinel.config import KEYSTORE_FILE_PATH
from sentinel.db import db
from sentinel.node import Node
from sentinel.node import create_account
from sentinel.node import register_node
from sentinel.node import send_connections_info
from sentinel.node import send_node_info
from sentinel.vpn import IKEv2
from sentinel.vpn import get_active_connections
from sentinel.vpn import get_shared_connections
from sentinel.vpn import remove_shared


def alive_job():
    while True:
        try:
            send_node_info(node, {
                'type': 'alive'
            })
        except Exception as err:
            print(str(err))
        time.sleep(30)


def connections_job():
    extra = 5
    while True:
        try:
            connections = ikev2.get_connections()
            connections_len = len(connections)
            if (connections_len > 0) or (extra > 0):
                send_connections_info(
                    node.config['account_addr'], node.config['token'], connections)
                extra = 5 if connections_len > 0 else extra - 1
        except Exception as err:
            print(str(err))
        time.sleep(15)


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
    elif len(config['account_addr']) == 42:
        pass
    else:
        print('Password is not provided OR `account_addr` in config is incorrect. \
               Please try again after deleting config file.')
        exit(2)

    node = Node(config)
    ikev2 = IKEv2()

    if len(node.config['token']) == 0:
        register_node(node)
    ikev2.start()
    send_node_info(node, {
        'type': 'vpn'
    })
    start_new_thread(alive_job, ())
    start_new_thread(connections_job, ())

    while True:
        try:
            shared_connections = get_shared_connections()
            active_connections = get_active_connections()
            for conn in shared_connections:
                if conn not in active_connections.keys():
                    client = db.clients.find_one({'session_name': str(conn, 'utf-8')})
                    if client and client['status'] == 'connected':
                        remove_shared(str(conn, 'utf-8'))
                        db.clients.find_one_and_update(
                            client, {'$set': {'status': 'disconnected'}})
        except Exception as err:
            print(err)
        time.sleep(5)
