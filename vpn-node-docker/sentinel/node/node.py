# coding=utf-8
import json
from urllib2 import urlopen

from speedtest_cli import Speedtest

from ..config import CONFIG_DATA_PATH
from ..db import db


class Node(object):
    def __init__(self, config):
        self.speed_test = Speedtest()
        self.ip = None
        self.location = None
        self.net_speed = {
            'best_server': {
                'host': None,
                'latency': None
            },
            'download': None,
            'upload': None
        }
        self.config = {
            'account_addr': None,
            'price_per_gb': None,
            'token': None,
            'enc_method': None
        }

        if config is not None:
            self.config['account_addr'] = str(config['account_addr']).lower() if 'account_addr' in config else None
            self.config['price_per_gb'] = float(config['price_per_gb']) if 'price_per_gb' in config else None
            self.config['token'] = str(config['token']) if 'token' in config else None
            self.config['enc_method'] = str(config['enc_method']) if 'enc_method' in config else None

        self.update_nodeinfo({'type': 'location'})
        self.update_nodeinfo({'type': 'netspeed'})
        self.save_to_db()

    def save_to_db(self):
        db.node.update({
            'account_addr': self.config['account_addr']
        }, {
            '$set': {
                'ip': self.ip,
                'location': self.location,
                'net_speed': self.net_speed,
                'price_per_gb': self.config['price_per_gb'],
                'token': self.config['token'],
                'enc_method': self.config['enc_method']
            }
        }, upsert=True)

    def save_config_data(self):
        data_file = open(CONFIG_DATA_PATH, 'w')
        data = json.dumps(self.config)
        data_file.writelines(data)
        data_file.close()

    def update_nodeinfo(self, info=None):
        if info['type'] == 'location':
            web_url = 'https://ipleak.net/json'
            response = json.load(urlopen(web_url))
            self.ip = str(response['ip'])
            self.location = {
                'city': str(response['city_name']),
                'country': str(response['country_name']),
                'latitude': float(response['latitude']),
                'longitude': float(response['longitude'])
            }
        elif info['type'] == 'netspeed':
            self.speed_test.get_best_server()
            self.net_speed['best_server'] = {
                'host': self.speed_test.best['host'],
                'latency': self.speed_test.best['latency']
            }
            self.net_speed['download'] = self.speed_test.download()
            self.net_speed['upload'] = self.speed_test.upload()
        elif info['type'] == 'config':
            if ('account_addr' in info) and (info['account_addr'] is not None):
                self.config['account_addr'] = info['account_addr']
            if ('token' in info) and (info['token'] is not None):
                self.config['token'] = info['token']
            if ('enc_method' in info) and (info['enc_method' is not None]):
                self.config['enc_method'] = info['enc_method']
            self.save_config_data()
        self.save_to_db()
