import json
import falcon
import redis
import os
import requests
from ..config import MASTER_NODE_URL
from urlparse import urljoin
from ..db import db
from ..vpn import Keys

class GenerateOVPN(object):
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
        vpn_addr = str(req.body['vpn_addr'])
        token = str(req.body['token'])
        os.system("nohup redis-server >> /dev/null &")
        rs = redis.Redis()
        stored_token = rs.get(account_addr)
        count=db.clients.count()+1
        if token == stored_token:
            result=db.clients.insert_one({
                'name':'client'+count,
                'account_addr':account_addr,
                'isConnected':0
            })
            if result.inserted_id:
                data=db.nodes.find_one({'address':vpn_addr})
                keys=Keys(count=count)
                keys.generate()
                node={
                    'location':data['location'],
                    'net_speed':data['net_speed'],
                    'vpn':{
                        'ovpn':keys.ovpn()                    
                    }
                }
                message = {'success': True, 'node': node}
            else:
                message={'success':False,'message':'Please Try again later'}
        else:
            message = {'success': False}
        res.status = falcon.HTTP_200
        res.body = json.dumps(message)

