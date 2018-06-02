# coding=utf-8
import json

import falcon
from falcon_cors import CORS

from sentinel.client import CreateNewAccount
from sentinel.client import GetBalance
from sentinel.client import GetMixerNodessList
from sentinel.client import GetMixerToAddress
from sentinel.client import GetSocksList
from sentinel.client import GetVpnCredentials
from sentinel.client import GetVpnCurrentUsage
from sentinel.client import GetVpnUsage
from sentinel.client import GetVpnsList
from sentinel.client import InitiateMix
from sentinel.client import PayVpnUsage
from sentinel.client import RawTransaction
from sentinel.client import ReportPayment
from sentinel.client import UpdateConnection
from sentinel.dev import GetFreeAmount
from sentinel.logs import LogTheError
from sentinel.mixer import DeRegisterMixerNode
from sentinel.mixer import RegisterMixerNode
from sentinel.mixer import UpdateMixerNodeInfo
from sentinel.node import DeRegisterNode
from sentinel.node import GetActiveNodeCount
from sentinel.node import GetActiveSessionCount
from sentinel.node import GetAverageDuration
from sentinel.node import GetAverageNodesCount
from sentinel.node import GetAveragePaidSentsCount
from sentinel.node import GetAverageSessionsCount
from sentinel.node import GetAverageTotalSentsCount
from sentinel.node import GetDailyActiveNodeCount
from sentinel.node import GetDailyAverageDuration
from sentinel.node import GetDailyDataCount
from sentinel.node import GetDailyDurationCount
from sentinel.node import GetDailyNodeCount
from sentinel.node import GetDailyPaidSentsCount
from sentinel.node import GetDailySessionCount
from sentinel.node import GetDailyTotalSentsUsed
from sentinel.node import GetLastAverageDuration
from sentinel.node import GetLastDataCount
from sentinel.node import GetNodeStatistics
from sentinel.node import GetTotalDataCount
from sentinel.node import GetTotalNodeCount
from sentinel.node import RegisterNode
from sentinel.node import UpdateConnections
from sentinel.node import UpdateNodeInfo
from sentinel.tokens import GetAvailableTokens
from sentinel.tokens import GetSents
from sentinel.tokens import SwapStatus
from sentinel.tokens import TokenSwapRawTransaction
from sentinel.utils import JSONTranslator


class Up(object):
    def on_post(self, req, resp):
        resp.status = falcon.HTTP_200
        resp.body = json.dumps({'status': 'UP'})

    def on_get(self, req, resp):
        resp.status = falcon.HTTP_200
        resp.body = json.dumps({'status': 'UP'})


cors = CORS(allow_all_origins=True)
server = falcon.API(middleware=[cors.middleware, JSONTranslator()])
server.add_route('/', Up())

# Clients
server.add_route('/client/account', CreateNewAccount())
server.add_route('/client/account/balance', GetBalance())
server.add_route('/client/raw-transaction', RawTransaction())
server.add_route('/client/vpn', GetVpnCredentials())
server.add_route('/client/vpn/current', GetVpnCurrentUsage())
server.add_route('/client/vpn/list', GetVpnsList())
server.add_route('/client/vpn/socks-list', GetSocksList())
server.add_route('/client/vpn/usage', GetVpnUsage())
server.add_route('/client/vpn/pay', PayVpnUsage())
server.add_route('/client/vpn/report', ReportPayment())
server.add_route('/client/update-connection', UpdateConnection())

# Nodes
server.add_route('/node/account', CreateNewAccount())
server.add_route('/node/register', RegisterNode())
server.add_route('/node/update-nodeinfo', UpdateNodeInfo())
server.add_route('/node/deregister', DeRegisterNode())
server.add_route('/node/update-connections', UpdateConnections())

# Stats
server.add_route('/stats/sessions/daily-stats', GetDailySessionCount())
server.add_route('/stats/sessions/active-count', GetActiveSessionCount())
server.add_route('/stats/sessions/average-count', GetAverageSessionsCount())
server.add_route('/stats/nodes/total-nodes', GetTotalNodeCount())
server.add_route('/stats/nodes/daily-active', GetDailyActiveNodeCount())
server.add_route('/stats/nodes/average-nodes', GetAverageNodesCount())
server.add_route('/stats/nodes/daily-stats', GetDailyNodeCount())
server.add_route('/stats/nodes/active-count', GetActiveNodeCount())
server.add_route('/stats/data/daily-stats', GetDailyDataCount())
server.add_route('/stats/data/total-data', GetTotalDataCount())
server.add_route('/stats/data/last-data', GetLastDataCount())
server.add_route('/stats/time/daily-stats', GetDailyDurationCount())
server.add_route('/stats/time/average-duration', GetAverageDuration())
server.add_route('/stats/time/average-daily', GetDailyAverageDuration())
server.add_route('/stats/time/last-average', GetLastAverageDuration())
server.add_route('/stats/payment/paid-sents-count', GetDailyPaidSentsCount())
server.add_route('/stats/payment/total-sents-used', GetDailyTotalSentsUsed())
server.add_route('/stats/payment/average-paid-sents', GetAveragePaidSentsCount())
server.add_route('/stats/payment/average-total-sents', GetAverageTotalSentsCount())
server.add_route('/stats/node', GetNodeStatistics())

# Token Swaps
server.add_route('/tokens', Up())
server.add_route('/tokens/available', GetAvailableTokens())
server.add_route('/tokens/sents', GetSents())
server.add_route('/tokens/swaps/raw-transaction', TokenSwapRawTransaction())
server.add_route('/tokens/swaps/status', SwapStatus())

# Mixer
server.add_route('/mixer', Up())
server.add_route('/mixer/list', GetMixerNodessList())
server.add_route('/mixer/to', GetMixerToAddress())
server.add_route('/mixer/init', InitiateMix())
server.add_route('/mixer/register', RegisterMixerNode())
server.add_route('/mixer/deregister', DeRegisterMixerNode())
server.add_route('/mixer/update-nodeinfo', UpdateMixerNodeInfo())

# Logs
server.add_route('/logs/error', LogTheError())

# DEV
server.add_route('/dev/free', GetFreeAmount())
