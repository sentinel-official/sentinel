import json
import falcon


class GetMasterToken(object):
    def on_post(self, req, res):
        """
        @api {post} /master/sendToken Get Token of client from Master.
        @apiName GetMasterToken
        @apiGroup VPN
        @apiParam {String} account_addr Account address.
        @apiParam {String} token Token of Client
        @apiSuccess {Object[]} Status of tjhe request.
        """
        account_addr = str(req.body['account_addr'])
        token = str(req.body['token'])
        rs = redis.Redis()
        rs.set(account_addr, token)
        rs.shutdown()
        message = {success: True}
        resp.status = falcon.HTTP_200
        resp.body = json.dumps(message)