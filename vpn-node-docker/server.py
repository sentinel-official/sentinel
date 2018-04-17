# coding=utf-8
import json

import falcon

from sentinel.server import GenerateOVPN
from sentinel.server import Token
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
server.add_route('/token', Token())
server.add_route('/ovpn', GenerateOVPN())
