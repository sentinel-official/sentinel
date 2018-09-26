# coding=utf-8
import subprocess

from pymongo import ReturnDocument

from ..config import LIMIT_1GB
from ..db import db


def disconnect_client(client_name):
    cmd = 'echo \'kill {}\' | nc 127.0.0.1 1195'.format(client_name)
    disconnect_proc = subprocess.Popen(cmd, shell=True)
    disconnect_proc.wait()


def revoke(client_name):
    cmd = 'cd /usr/share/easy-rsa && echo yes | ./easyrsa revoke ' + \
          client_name + ' && ./easyrsa gen-crl && ' + \
          'chmod 755 pki/crl.pem && cp pki/crl.pem /etc/openvpn/keys'
    revoke_proc = subprocess.Popen(cmd, shell=True)
    revoke_proc.wait()
    return revoke_proc.returncode


def get_sessions(client_name=None):
    sessions = []
    status_log = open('/etc/openvpn/openvpn-status.log', 'r').readlines()
    for line in status_log:
        line = line.strip()
        line_arr = line.split(',')
        if (client_name is None and 'client' in line) or (client_name is not None and client_name in line):
            client = db.clients.find_one_and_update({
                'session_id': str(line_arr[0])[6:]
            }, {
                '$set': {
                    'usage': {
                        'up': int(line_arr[2]),
                        'down': int(line_arr[3])
                    }
                }
            }, projection={
                '_id': 0,
                'token': 0
            }, return_document=ReturnDocument.AFTER)
            if client['usage']['down'] >= LIMIT_1GB:
                client_name = 'client' + client['session_id']
                disconnect_client(client_name)
            sessions.append({
                'sessionId': client['session_id'],
                'usage': {
                    'download': client['usage']['down'],
                    'upload': client['usage']['up']
                }
            })
        elif 'ROUTING TABLE' in line:
            break
    return sessions
