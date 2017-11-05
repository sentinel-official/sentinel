import falcon

from sentinel.client import CreateNewAccount
from sentinel.client import GetBalance
from sentinel.client import SendAmount
from sentinel.client import TranscationStatus
from sentinel.client import GetVPNCredentials

from sentinel.node import RegisterNode
from sentinel.node import UpdateNodeInfo
from sentinel.node import DeRegisterNode

from sentinel.utils import JSONTranslator


app = falcon.API(middleware=[JSONTranslator()])

# Clients
app.add_route('/create-new-account', CreateNewAccount())
app.add_route('/get-balance', GetBalance())
app.add_route('/send-amount', SendAmount())
app.add_route('/transcation-status', TranscationStatus())
app.add_route('/get-vpn-credentials', GetVPNCredentials())

# Nodes
app.add_route('/register-node', RegisterNode())
app.add_route('/update-nodeinfo', UpdateNodeInfo())
app.add_route('/deregister-node', DeRegisterNode())

# DEV
from sentinel.dev import GetFreeAmount


app.add_route('/get-free-amount', GetFreeAmount())
