import json
from urllib2 import urlopen
from speedtest_cli import Speedtest
from ..config import ACCOUNT_DATA_PATH


class Node(object):
    def __init__(self, resume=True):
        self.speed_test = Speedtest()
        self.location = None
        self.net_speed = {
            'best_server': {
                'host': None,
                'latency': None
            },
            'download': None,
            'upload': None
        }
        self.vpn = {
            'ovpn': None,
            'status': None
        }
        self.account = {
            'addr': None,
            'keystore': None,
            'password': None,
            'private_key': None,
            'token': None
        }

        if resume is True:
            data = json.load(open(ACCOUNT_DATA_PATH, 'r'))

            self.account['addr'] = data['addr']
            self.account['keystore'] = data['keystore']
            self.account['password'] = data['password']
            self.account['private_key'] = data['private_key']
            self.account['token'] = data['token']

            self.update_nodeinfo({'type': 'location'})
            self.update_nodeinfo({'type': 'netspeed'})

    def save_account_data(self):
        data_file = open(ACCOUNT_DATA_PATH, 'w')
        data = json.dumps(self.account)
        # Must encrypt before save
        data_file.writelines(data)
        data_file.close()

    def update_nodeinfo(self, info=None):
        if info['type'] == 'location':
            web_url = 'http://ip-api.com/json'
            response = json.load(urlopen(web_url))
            self.location = {
                'city': response['city'],
                'country': response['country'],
                'latitude': response['lat'],
                'longitude': response['lon']
            }
        elif info['type'] == 'netspeed':
            self.speed_test.get_best_server()
            self.net_speed['best_server'] = {
                'host': self.speed_test.best['host'],
                'latency': self.speed_test.best['latency']
            }
            self.net_speed['download'] = self.speed_test.download()
            self.net_speed['upload'] = self.speed_test.upload()
        elif info['type'] == 'account':
            if info['token'] is not None:
                self.account['token'] = info['token']
            self.save_account_data()

    def update_vpninfo(self, info=None):
        if info['type'] == 'ovpn':
            self.vpn['ovpn'] = info['ovpn']
        elif info['type'] == 'status':
            self.vpn['status'] = info['status']
