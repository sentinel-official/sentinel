# coding=utf-8
import subprocess

from ..config import LIMIT_1GB
from ..db import db


class OpenVPN(object):
    def __init__(self, show_output=True):
        self.init_cmd = 'sh /root/sentinel/shell_scripts/init.sh'
        self.start_cmd = 'openvpn --config /etc/openvpn/server.conf \
                          --status /etc/openvpn/openvpn-status.log 2 \
                          --management 127.0.0.1 1195 \
                          --ping-exit 15'
        if show_output is False:
            self.init_cmd += ' >> /dev/null 2>&1'
            self.start_cmd += ' >> /dev/null 2>&1'
        self.vpn_proc = None
        self.pid = None

        init_proc = subprocess.Popen(self.init_cmd, shell=True)
        init_proc.wait()

    def start(self):
        self.vpn_proc = subprocess.Popen(self.start_cmd, shell=True, stdout=subprocess.PIPE)
        pid_cmd = 'pidof openvpn'
        pid_proc = subprocess.Popen(pid_cmd, shell=True, stdout=subprocess.PIPE)
        self.pid = pid_proc.stdout.readline().strip()

    def stop(self):
        cmd = 'kill -2 {}'.format(self.pid)
        kill_proc = subprocess.Popen(cmd, shell=True)
        kill_proc.wait()
        if kill_proc.returncode == 0:
            self.vpn_proc, self.pid = None, None
        return kill_proc.returncode

    def disconnect_client(self, client_name):
        cmd = 'echo \'kill {}\' | nc 127.0.0.1 1195'.format(client_name)
        disconnect_proc = subprocess.Popen(cmd, shell=True)
        disconnect_proc.wait()

    def revoke(self, client_name):
        cmd = 'cd /usr/share/easy-rsa && echo yes | ./easyrsa revoke ' + \
              client_name + ' && ./easyrsa gen-crl && ' + \
              'chmod 755 pki/crl.pem && cp pki/crl.pem /etc/openvpn/keys'
        revoke_proc = subprocess.Popen(cmd, shell=True)
        revoke_proc.wait()
        return revoke_proc.returncode

    def get_connections(self, client_name=None):
        connections = []
        status_log = open('/etc/openvpn/openvpn-status.log', 'r').readlines()
        for line in status_log:
            line = line.strip()
            line_arr = line.split(',')
            if (client_name is None and 'client' in line) or (client_name is not None and client_name in line):
                connection = {
                    'session_name': str(line_arr[0]),
                    'usage': {
                        'up': int(line_arr[2]),
                        'down': int(line_arr[3])
                    }
                }
                db.openvpn_usage.update({
                    'session_name': connection['session_name']
                }, {
                    '$set': {
                        'usage': connection['usage']
                    }
                }, upsert=True)
                if (client_name is None) and (connection['usage']['down'] >= LIMIT_1GB):
                    self.disconnect_client(connection['session_name'])
                connections.append(connection)
            elif 'ROUTING TABLE' in line:
                break
        return connections


class Keys(object):
    def __init__(self, name, show_output=True):
        self.gen_cmd = 'sh /root/sentinel/shell_scripts/gen_keys.sh ' + name
        self.ovpn_path = '/etc/openvpn/client' + name + '.ovpn'
        if show_output is False:
            self.gen_cmd += ' >> /dev/null 2>&1'

    def generate(self):
        gen_proc = subprocess.Popen(self.gen_cmd, shell=True)
        gen_proc.wait()
        return gen_proc.returncode

    def ovpn(self):
        with open(self.ovpn_path) as ovpn_file:
            ovpn_data = ovpn_file.readlines()
        return ovpn_data
