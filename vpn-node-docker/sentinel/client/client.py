import json
import falcon
import redis
import os


class GenerateOVPN(object):
    def __init__(self):
        self.node = None

    def on_post(self, req, res):
        """
        @api {post} /master/sendToken Generate OVPN for Client .
        @apiName GenerateOVPN
        @apiGroup VPN
        @apiParam {String} account_addr Account address.
        @apiParam {String} token Token of Client
        @apiSuccess {Object[]} Status of the request.
        """
        account_addr = str(req.body['account_addr'])
        token = str(req.body['token'])
        os.system("nohup redis-server >> /dev/null &")
        rs = redis.Redis()
        stored_token = rs.get(account_addr)
        if token == stored_token:
            message = {'success': True, 'node': self.node}
        else:
            message = {'success': False}
        res.status = falcon.HTTP_200
        res.body = json.dumps(message)

    def get_node(self, node):
        self.node = node
