# coding=utf-8
import subprocess

from pymongo import ReturnDocument

from .helper import disconnect_client
from .helper import get_active_connections
from ..config import LIMIT_1GB
from ..db import db


class IKEv2(object):
    def __init__(self, show_output=True):
        self.init_cmd = 'sh /root/sentinel/shell_scripts/init.sh'
        self.start_cmd = 'ipsec restart'
        if show_output is False:
            self.init_cmd += ' >> /dev/null 2>&1'
            self.start_cmd += ' >> /dev/null 2>&1'

        self.vpn_proc = None
        self.pid = None

        init_proc = subprocess.Popen(self.init_cmd, shell=True)
        init_proc.wait()
        print("Initialization completed ..")

    def start(self):
        self.vpn_proc = subprocess.Popen(
            self.start_cmd, shell=True, stdout=subprocess.PIPE)
        pid_cmd = 'pidof charon'
        pid_proc = subprocess.Popen(
            pid_cmd, shell=True, stdout=subprocess.PIPE)
        self.pid = pid_proc.stdout.readline().strip()

    def stop(self):
        cmd = 'kill -2 {}'.format(self.pid)
        kill_proc = subprocess.Popen(cmd, shell=True)
        kill_proc.wait()
        if kill_proc.returncode == 0:
            self.vpn_proc, self.pid = None, None
        return kill_proc.returncode

    def get_connections(self):
        connection_stats = []
        connections = get_active_connections()
        for session_name in connections.keys():
            client = db.clients.find_one_and_update({
                'session_name': str(session_name, 'utf-8')
            }, {
                '$set': {
                    'usage': {
                        'up': int(connections[session_name]['bytes_in']),
                        'down': int(connections[session_name]['bytes_out'])
                    },
                    'connection_id': str(connections[session_name]['connection_id'], 'utf-8'),
                    'status': 'connected'
                }
            }, projection={
                '_id': 0,
                'token': 0,
                'connection_id': 0,
                'status': 0
            }, return_document=ReturnDocument.AFTER)
            if client:
                if client['usage']['down'] >= LIMIT_1GB:
                    print('usage limit reached')
                    disconnect_client(session_name, client['connection_id'])
                connection_stats.append(client)
            else:
                disconnect_client(
                    session_name, str(connections[session_name]['connection_id'], 'utf-8'))

        return connection_stats
