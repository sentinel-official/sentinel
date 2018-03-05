import json
import falcon

from sentinel.server_node import RegisterNode
from sentinel.server_node import UpdateNodeInfo
from sentinel.server_node import DeRegisterNode
from sentinel.server_node import AddVpnUsage
from sentinel.server_node import CreateNewAccount
from sentinel.server_node import GetCurrentNode

from sentinel.master import GetMasterToken
from sentinel.client import GenerateOVPN
from sentinel.utils import JSONTranslator


class Up():
    def on_post(self, req, resp):
        resp.status = falcon.HTTP_200
        resp.body = json.dumps({'status': 'UP'})

    def on_get(self, req, resp):
        resp.status = falcon.HTTP_200
        resp.body = json.dumps({'status': 'UP'})


app = falcon.API(middleware=[JSONTranslator()])
app.add_route('/', Up())
#node=GenerateOVPN()

# Nodes
app.add_route('/node', Up())
app.add_route('/node/account', CreateNewAccount())
app.add_route('/node/register', RegisterNode())
app.add_route('/node/update-nodeinfo', UpdateNodeInfo())
app.add_route('/node/add-usage', AddVpnUsage())
app.add_route('/node/deregister', DeRegisterNode())

app.add_route('/master/sendToken', GetMasterToken())
#app.add_route('/vpn/getCurrentNode', GetCurrentNode(node))
app.add_route('/client/generateOVPN',GenerateOVPN())
