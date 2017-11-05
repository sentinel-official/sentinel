import json
import falcon
from ..db import db


class GetVPNCredentials(object):
    def on_post(self, req, resp):
        account_addr = req.body['account_addr']
        # TODO Account validation
        node = db.nodes.find_one({'vpn.status': 'up'})
        if node is None:
            message = {
                'success': False,
                'message': 'All VPN servers are occupied.'
            }
            resp.status = falcon.HTTP_200
            resp.body = json.dumps(message)
        else:
            vpn = node['vpn']
            message = {
                'success': True,
                'ovpn': vpn['ovpn']
            }
            resp.status = falcon.HTTP_200
            resp.body = json.dumps(message)
