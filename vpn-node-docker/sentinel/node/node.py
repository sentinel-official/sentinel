# coding=utf-8
import json
from urllib2 import urlopen

from speedtest_cli import Speedtest

from ..config import ACCOUNT_DATA_PATH
from ..config import CONFIG_DATA_PATH
from ..db import db


class Node(object):
    def __init__(self, resume=True):
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
            'price_per_GB': None
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
            self.account['addr'] = str(data['addr']).lower()
            self.account['keystore'] = data['keystore']
            self.account['password'] = str(data['password']).lower()
            self.account['private_key'] = str(data['private_key']).lower()
            self.account['token'] = data['token']

            data = json.load(open(CONFIG_DATA_PATH, 'r'))
            self.config['price_per_GB'] = float(data['price_per_GB'])

            self.update_nodeinfo({'type': 'location'})
            self.update_nodeinfo({'type': 'netspeed'})
            self.save_to_db()

    def save_to_db(self):
        node = db.node.find_one({
            'address': self.account['addr']
        })
        if node is None:
            _ = db.node.insert_one({
                'address': self.account['addr'],
                'location': self.location,
                'net_speed': self.net_speed
            })
        else:
            _ = db.node.find_one_and_update({
                'address': self.account['addr']
            }, {
                '$set': {
                    'location': self.location,
                    'net_speed': self.net_speed
                }
            })

    def save_account_data(self):
        data_file = open(ACCOUNT_DATA_PATH, 'w')
        data = json.dumps(self.account)
        # Must encrypt before save
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
        elif info['type'] == 'account':
            if info['token'] is not None:
                self.account['token'] = info['token']
            self.save_account_data()
