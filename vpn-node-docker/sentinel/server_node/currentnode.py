import json
import falcon
from ..client.client import GenerateOVPN


class GetCurrentNode(object):
    def __init__(self,node):
        self.account = None
        self.net_speed = None
        self.location = None
        self.vpn = None
        self.node=node

    def on_post(self, req, res):
        """
        @api {post} /vpn/getCurrentNode Get Node details from VPN
        @apiName GetCurrentNode
        @apiGroup VPN
        @apiParam {String} node VPN details
        @apiSuccess {Object[]} Status of tshe request.
        """
        self.vpn = req.body['vpn']
        self.net_speed = req.body['net_speed']
        self.location = req.body['location']
        node = {
            'vpn': self.vpn,
            'location': self.location,
            'net_speed': self.net_speed
        }
        #self.node.get_node(node)
        res.status = falcon.HTTP_200
        res.body = json.dumps({'success': True})
