# coding=utf-8
import subprocess

from pymongo import ReturnDocument

from ..db import db


def disconnect_client(client_name):
    cmd = 'echo \'kill {}\' | nc 127.0.0.1 1195'.format(client_name)
    disconnect_proc = subprocess.Popen(cmd, shell=True)
    disconnect_proc.wait()
    revoke(client_name)


def revoke(client_name):
    cmd = 'cd /usr/share/easy-rsa && echo yes | ./easyrsa revoke ' + \
          client_name + ' && ./easyrsa gen-crl && ' + \
          'chmod 755 pki/crl.pem && cp pki/crl.pem /etc/openvpn/keys'
    revoke_proc = subprocess.Popen(cmd, shell=True)
    revoke_proc.wait()
    return revoke_proc.returncode


def get_sessions(c_name=None):
    sessions = []
    status_log = open('/etc/openvpn/openvpn-status.log', 'r').readlines()
    for line in status_log:
        line = line.strip()
        line_arr = line.split(',')
        if (c_name is None and 'client' in line) or (c_name is not None and c_name in line):
            session_id = str(line_arr[0])[6:]
            client_name = 'client' + session_id
            client = db.clients.find_one_and_update({
                'session_id': session_id
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
            if client:
                if client['usage']['down'] > client['max_usage']['down']:
                    disconnect_client(client_name)
                sessions.append({
                    'sessionId': session_id,
                    'usage': {
                        'download': client['usage']['down'],
                        'upload': client['usage']['up']
                    }
                })
            else:
                disconnect_client(client_name)
        elif 'ROUTING TABLE' in line:
            break
    return sessions
