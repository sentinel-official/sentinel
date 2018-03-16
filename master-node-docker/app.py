# coding=utf-8
import json

import falcon

from sentinel.client import CreateNewAccount
from sentinel.client import GetBalance
from sentinel.client import GetVpnCredentials
from sentinel.client import GetVpnCurrentUsage
from sentinel.client import GetVpnUsage
from sentinel.client import GetVpnsList
from sentinel.client import PayVpnUsage
from sentinel.client import RawTransaction
from sentinel.client import ReportPayment
from sentinel.dev import GetFreeAmount
from sentinel.node import AddVpnUsage
from sentinel.node import DeRegisterNode
from sentinel.node import RegisterNode
from sentinel.node import UpdateConnections
from sentinel.node import UpdateNodeInfo
from sentinel.node import UpdateNodesStatus
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

# Clients
app.add_route('/client', Up())
app.add_route('/client/account', CreateNewAccount())
app.add_route('/client/account/balance', GetBalance())
app.add_route('/client/raw-transaction', RawTransaction())
app.add_route('/client/vpn', GetVpnCredentials())
app.add_route('/client/vpn/current', GetVpnCurrentUsage())
app.add_route('/client/vpn/list', GetVpnsList())
app.add_route('/client/vpn/usage', GetVpnUsage())
app.add_route('/client/vpn/pay', PayVpnUsage())
app.add_route('/client/vpn/report', ReportPayment())

# Nodes
app.add_route('/node', Up())
app.add_route('/node/account', CreateNewAccount())
app.add_route('/node/register', RegisterNode())
app.add_route('/node/update-nodeinfo', UpdateNodeInfo())
app.add_route('/node/add-usage', AddVpnUsage())
app.add_route('/node/deregister', DeRegisterNode())
app.add_route('/node/update-connections', UpdateConnections())

# DEV
app.add_route('/dev/free', GetFreeAmount())

update_nodes_status = UpdateNodesStatus(max_secs=120)
update_nodes_status.start()
