# coding: utf-8
import random
import string
import subprocess
import time
from collections import OrderedDict

import vici
from jsonpath_rw import parse


def recursive_ordered_dict_to_dict(ordered_dict):
    simple_dict = {}
    for key, value in ordered_dict.items():
        if isinstance(value, OrderedDict):
            simple_dict[key] = recursive_ordered_dict_to_dict(value)
        else:
            simple_dict[key] = value

    return simple_dict


def get_active_connections():
    active_connections = {}
    s = vici.Session()
    for conn in s.list_sas():
        conn = recursive_ordered_dict_to_dict(conn)
        conn_path = parse("$..uniqueid")
        id_path = parse("$..remote-id")
        bytes_path = parse("$..bytes-in")
        bytes_out_path = parse("$..bytes-out")
        for connection_id, remote_id, bytes_in, bytes_out in zip(conn_path.find(conn),
                                                                 id_path.find(conn), bytes_path.find(conn),
                                                                 bytes_out_path.find(conn)):
            active_connections[remote_id.value] = {
                'connection_id': connection_id.value,
                'bytes_in': bytes_in.value,
                'bytes_out': bytes_out.value
            }
    return active_connections


def get_shared_connections():
    s = vici.Session()
    return recursive_ordered_dict_to_dict(s.get_shared())['keys']


def generate_random_string():
    return ''.join([random.choice(string.ascii_letters + string.digits) for n in range(10)])


def wait_and_remove_credentials(session_name):
    time.sleep(2 * 60)
    try:
        if session_name not in get_active_connections().keys():
            s = vici.Session()
            s.unload_shared({'id': session_name})
            print(str(session_name, 'utf-8') + ' is removed')
    except Exception as err:
        print(err)


def add_secret(username):
    s = vici.Session()
    password = generate_random_string()
    s.load_shared({'id': username, 'type': 'EAP', 'data': password})
    print('added credentials for' + username)
    print('username: ' + username)
    print('password: ', password)
    return username, password


def disconnect_client(username, connection_id):
    s = vici.Session()
    s.unload_shared({'id': username})
    cmd = 'ipsec down [{0}]'.format(str(connection_id))
    dc_proc = subprocess.Popen(cmd, shell=True, stderr=subprocess.PIPE)
    dc_proc.wait()
    if dc_proc.stderr.read():
        return False
    print(str(username, 'utf-8') + ' is disconnected')
    return True


def remove_shared(remote_id):
    s = vici.Session()
    s.unload_shared({'id': remote_id})
    print('removed user ' + remote_id)


def get_ca_cert():
    f = open('/etc/ipsec.d/cacerts/chain.pem', 'r')
    lines = f.readlines()
    f.close()

    return lines
