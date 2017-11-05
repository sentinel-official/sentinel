import json
from urllib2 import urlopen
from speedtest_cli import Speedtest


class Node(object):
    def __init__(self, account_addr, update=True):
        self.speed_test = Speedtest()
        self.speed_test.get_best_server()
        self.location = None
        self.net_speed = {
            'best_server': {
                'host': self.speed_test.best['host'],
                'latency': self.speed_test.best['latency']
            },
            'download': None,
            'upload': None
        }
        self.account_addr = account_addr
        self.ovpn = None
        self.token = None
        self.vpn_status = None
        if update is True:
            self.update_location()
            self.update_netspeed()

    def update_location(self):
        web_url = 'http://ipinfo.io/json'
        response = json.load(urlopen(web_url))
        self.location = {
            'latitude': response['loc'].split(',')[0],
            'longitude': response['loc'].split(',')[1]
        }

    def update_netspeed(self):
        self.net_speed['download'] = self.speed_test.download()
        self.net_speed['upload'] = self.speed_test.upload()

    def set_ovpn(self, ovpn):
        self.ovpn = ovpn

    def set_token(self, token):
        self.token = token

    def set_vpn_status(self, status):
        self.vpn_status = status
