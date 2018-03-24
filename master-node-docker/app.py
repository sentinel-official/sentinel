# coding=utf-8
import json

import falcon
from falcon_cors import CORS

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
from sentinel.node import DeRegisterNode
from sentinel.node import RegisterNode
from sentinel.node import UpdateConnections
from sentinel.node import UpdateNodeInfo
from sentinel.node import UpdateNodesStatus
from sentinel.node import GetDailySessionCount
from sentinel.node import GetActiveSessionCount
from sentinel.node import GetDailyNodeCount
from sentinel.node import GetActiveNodeCount
from sentinel.node import GetDailyDataCount
from sentinel.node import GetTotalDataCount
from sentinel.node import GetDailyDurationCount
from sentinel.node import GetAverageDuration
from sentinel.utils import JSONTranslator


class Up(object):
    def on_post(self, req, resp):
        resp.status = falcon.HTTP_200
        resp.body = json.dumps({'status': 'UP'})

    def on_get(self, req, resp):
        resp.status = falcon.HTTP_200
        resp.body = json.dumps({'status': 'UP'})


cors = CORS(allow_all_origins=True)
app = falcon.API(middleware=[cors.middleware, JSONTranslator()])
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
app.add_route('/node/deregister', DeRegisterNode())
app.add_route('/node/update-connections', UpdateConnections())

# DEV
app.add_route('/dev/free', GetFreeAmount())

#STATS
app.add_route('/stats/sessions/daily-stats',GetDailySessionCount())
app.add_route('/stats/sessions/active-count',GetActiveSessionCount())
app.add_route('/stats/nodes/daily-stats',GetDailyNodeCount())
app.add_route('/stats/nodes/active-count',GetActiveNodeCount())
app.add_route('/stats/data/daily-stats',GetDailyDataCount())
app.add_route('/stats/data/total-data',GetTotalDataCount())
app.add_route('/stats/time/daily-stats',GetDailyDurationCount())
app.add_route('/stats/time/average-duration',GetAverageDuration())


update_nodes_status = UpdateNodesStatus(max_secs=120)
update_nodes_status.start()