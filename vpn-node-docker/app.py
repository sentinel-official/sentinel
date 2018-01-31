from __future__ import print_function

import time
import json
import falcon
from os import path, environ
from sentinel.config import ACCOUNT_DATA_PATH
from sentinel.node import Node
from sentinel.node import create_account
from sentinel.node import register_node
from sentinel.node import send_nodeinfo
from sentinel.node import send_client_usage
from sentinel.node import get_amount

from sentinel.client import GenerateOVPN
from sentinel.master import GetMasterToken

from sentinel.vpn import OpenVPN
from sentinel.vpn import Keys

from sentinel.utils import JSONTranslator

class Up():
    def on_post(self, req, resp):
        resp.status = falcon.HTTP_200
        resp.body = json.dumps({'status': 'UP'})

    def on_get(self, req, resp):
        resp.status = falcon.HTTP_200
        resp.body = json.dumps({'status': 'UP'})

app=falcon.API(middleware=[JSONTranslator()])
app.add_route('/',Up())

#Client
app.add_route('/client',Up())
app.add_route('/client/getOvpn',GenerateOVPN())

#Master
app.add_route('/master',Up())
app.add_route('/master/sendToken',GetMasterToken())

def process_output():
    while True:
        line = openvpn.vpn_proc.stdout.readline().strip()
        line_len = len(line)
        if line_len > 0:
            print(line)
            if 'Peer Connection Initiated with' in line:
                node.update_vpninfo({'type': 'status', 'status': 'busy'})
                send_nodeinfo(
                    node, {'type': 'vpn', 'status': node.vpn['status']})
            elif 'client-instance exiting' in line:
                openvpn.stop()
                received_bytes, sent_bytes, connected_time = openvpn.get_client_usage()
                sesstion_duration = int(time.time()) - connected_time
                send_client_usage(node, received_bytes,
                                  sent_bytes, sesstion_duration)
                break


if __name__ == "__main__":
    if path.exists(ACCOUNT_DATA_PATH) is True:
        node = Node(resume=True)
    elif 'PASSWORD' in environ:
        create_account(environ['PASSWORD'])
        node = Node(resume=True)
    else:
        print ('ERROR: {} not found.'.format(ACCOUNT_DATA_PATH))
        exit(1)

    if environ['SENT_ENV'] == 'DEV':
        get_amount(node, 10, 'ETH')
        get_amount(node, 100, 'SENT')

    keys = Keys()
    openvpn = OpenVPN()
    if node.account['token'] is None:
        register_node(node)
    while True:
        keys.generate()
        node.update_vpninfo({'type': 'ovpn', 'ovpn': keys.ovpn()})
        #send_nodeinfo(node, {'type': 'vpn', 'ovpn': node.vpn['ovpn']})
        openvpn.start()
        node.update_vpninfo({'type': 'status', 'status': 'up'})
        send_nodeinfo(node, {'type': 'vpn', 'status': node.vpn['status']})
        process_output()
        time.sleep(2)
