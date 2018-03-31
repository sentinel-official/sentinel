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


app = falcon.API(middleware=[JSONTranslator()])

app.add_route('/', Up())
app.add_route('/token', Token())
app.add_route('/ovpn', GenerateOVPN())
