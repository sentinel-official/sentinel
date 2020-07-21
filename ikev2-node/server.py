# coding=utf-8
import json

import falcon

from sentinel.server import Disconnect
from sentinel.server import GetVpnCredentials
from sentinel.server import Token
from sentinel.utils import JSONTranslator


class Up(object):
    def on_post(self, req, resp):
        resp.status = falcon.HTTP_200
        resp.body = json.dumps({'status': 'UP'})

    def on_get(self, req, resp):
        resp.status = falcon.HTTP_200
        resp.body = json.dumps({'status': 'UP'})


def create():
    api = falcon.API(middleware=[JSONTranslator()])

    api.add_route('/', Up())
    api.add_route('/token', Token())
    api.add_route('/vpn', GetVpnCredentials())
    api.add_route('/disconnect', Disconnect())

    return api


server = create()
