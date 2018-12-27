# coding=utf-8
import json

import falcon
import gunicorn.app.base
from gunicorn.six import iteritems

from .client import DisconnectClient
from .client import GetSessionUsage
from .session import AddSessionDetails
from .session import AddSessionPaymentSign
from .session import GetVpnCredentials
from ..utils import JSONTranslator


class Up(object):
    def on_post(self, _, resp):
        resp.status = falcon.HTTP_200
        resp.body = json.dumps({'status': 'UP'})

    def on_get(self, _, resp):
        resp.status = falcon.HTTP_200
        resp.body = json.dumps({'status': 'UP'})


class APIServer(gunicorn.app.base.BaseApplication):
    def __init__(self, options=None):
        self.options = options or {}
        self.server = falcon.API(middleware=[JSONTranslator()])
        self.server.add_route('/', Up())
        self.server.add_route('/clients/{account_addr}/sessions/{session_id}', AddSessionDetails())
        self.server.add_route('/clients/{account_addr}/sessions/{session_id}/usage', GetSessionUsage())
        self.server.add_route('/clients/{account_addr}/sessions/{session_id}/disconnect', DisconnectClient())
        self.server.add_route('/clients/{account_addr}/sessions/{session_id}/credentials', GetVpnCredentials())
        self.server.add_route('/clients/{account_addr}/sessions/{session_id}/sign', AddSessionPaymentSign())
        super(APIServer, self).__init__()

    def load_config(self):
        config = dict([(key, value) for key, value in iteritems(self.options)
                       if key in self.cfg.settings and value is not None])
        for key, value in iteritems(config):
            self.cfg.set(key.lower(), value)

    def load(self):
        return self.server
