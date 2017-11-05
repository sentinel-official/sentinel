"""__doc__"""

from __future__ import print_function

import os
import time
from sentinel.node import Node
from sentinel.node import register_node
from sentinel.node import send_nodeinfo

from sentinel.vpn import OpenVPN
from sentinel.vpn import Keys


def process_output():
    while True:
        line = openvpn.vpn_proc.stdout.readline().strip()
        line_len = len(line)
        if line_len > 0:
            print(line)
            if 'Peer Connection Initiated with' in line:
                node.set_vpn_status('busy')
                send_nodeinfo(node, 'vpn_status')
            elif 'client-instance exiting' in line:
                openvpn.stop()
                break


if __name__ == "__main__":
    account_addr = os.environ['ACCOUNT_ADDR']
    keys = Keys()
    node = Node(account_addr)
    openvpn = OpenVPN()
    register_node(node)
    while True:
        keys.generate()
        node.set_ovpn(keys.ovpn())
        send_nodeinfo(node, 'ovpn')
        openvpn.start()
        node.set_vpn_status('up')
        send_nodeinfo(node, 'vpn_status')
        process_output()
        time.sleep(2)
