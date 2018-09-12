# coding=utf-8
import json

import falcon

from sentinel.server import AddSessionDetails
from sentinel.server import AddSessionPaymentSign
from sentinel.server import DisconnectClient
from sentinel.server import GetCurrentUsage
from sentinel.server import GetVpnCredentials
from sentinel.utils import JSONTranslator


class Up(object):
    def on_post(self, req, resp):
        resp.status = falcon.HTTP_200
        resp.body = json.dumps({'status': 'UP'})

    def on_get(self, req, resp):
        resp.status = falcon.HTTP_200
        resp.body = json.dumps({'status': 'UP'})


server = falcon.API(middleware=[JSONTranslator()])

server.add_route('/', Up())
server.add_route('/client/usage', GetCurrentUsage())
server.add_route('/client/disconnect', DisconnectClient())
server.add_route('/session', AddSessionDetails())
server.add_route('/session/credentials', GetVpnCredentials())
server.add_route('/session/sign', AddSessionPaymentSign())
