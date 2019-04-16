# coding=utf-8
import copy
import json
from urllib2 import urlopen

from speedtest import Speedtest

from ..config import CONFIG_DATA_PATH


class Node(object):
    def __init__(self):
        self.speed_test = Speedtest()
        self.ip = None
        self.location = None
        self.net_speed = {
            'download': None,
            'upload': None
        }
        self.config = {}
        with open(CONFIG_DATA_PATH, 'r') as f:
            self.config = json.load(f)

    def save_config(self):
        with open(CONFIG_DATA_PATH, 'w') as f:
            config = copy.deepcopy(self.config)
            del (config['account']['name'])
            del (config['account']['password'])
            json.dump(config, f, indent=4, sort_keys=True, ensure_ascii=False)

    def update_info(self, info_type=None, info=None):
        if info is None:
            info = {}
        if info_type == 'location':
            web_url = 'http://ip-api.com/json'
            response = json.load(urlopen(web_url))
            self.ip = str(response['query'])
            self.location = {
                'city': str(response['city']),
                'country': str(response['country']),
                'latitude': float(response['lat']),
                'longitude': float(response['lon'])
            }
        elif info_type == 'netspeed':
            self.speed_test.get_best_server()
            self.net_speed['download'] = self.speed_test.download() / 8.0
            self.net_speed['upload'] = self.speed_test.upload() / 8.0
        elif info_type == 'config':
            if ('account_address' in info) and (info['account_address'] is not None):
                self.config['account']['address'] = str(info['account_address'])
            if ('account_name' in info) and (info['account_name'] is not None):
                self.config['account']['name'] = str(info['account_name'])
            if ('account_password' in info) and (info['account_password'] is not None):
                self.config['account']['password'] = str(info['account_password'])
            if ('api_port' in info) and (info['api_port' is not None]):
                self.config['api_port'] = int(info['api_port'])
            if ('description' in info) and (info['description' is not None]):
                self.config['description'] = str(info['description'])
            if ('moniker' in info) and (info['moniker' is not None]):
                self.config['moniker'] = str(info['moniker'])
            if ('openvpn_enc_method' in info) and (info['openvpn_enc_method' is not None]):
                self.config['openvpn']['enc_method'] = str(info['openvpn_enc_method'])
            if ('openvpn_port' in info) and (info['openvpn_port' is not None]):
                self.config['openvpn']['port'] = int(info['openvpn_port'])
            if ('price_per_gb' in info) and (info['price_per_gb' is not None]):
                self.config['price_per_gb'] = float(info['price_per_gb'])
            if ('register_hash' in info) and (info['register_hash'] is not None):
                self.config['register']['hash'] = str(info['register_hash'])
            if ('register_token' in info) and (info['register_token'] is not None):
                self.config['register']['token'] = str(info['register_token'])
            self.save_config()


node = Node()
