import json
import falcon
import redis

class GenerateOVPN(object):
    def on_post(self,req,res):
         """
        @api {post} /master/sendToken Generate OVPN for Client .
        @apiName GenerateOVPN
        @apiGroup VPN
        @apiParam {String} account_addr Account address.
        @apiParam {String} token Token of Client
        @apiSuccess {Object[]} Status of tjhe request.
        """
        account_addr = str(req.body['account_addr'])
        token = str(req.body['token'])
        rs=redis.Redis()
        stored_token=rs.get(account_addr)
        if token==stored_token:
            message={
                'success':True
            }
        else:
            message={
                'success':False
            }