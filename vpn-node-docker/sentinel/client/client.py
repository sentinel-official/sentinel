import time
import json
import falcon
import redis
import os
import requests
from ..config import MASTER_NODE_URL
from urlparse import urljoin
from ..db import db
from ..vpn import Keys
from ..logs import logger


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
        name = str(int(time.time()))
        if token == stored_token:
            result = db.clients.insert_one({
                'name': 'client' + name,
                'account_addr': account_addr
            })
            if result.inserted_id:
                data = db.nodes.find_one({
                    'address': vpn_addr
                })
                keys = Keys(name=name)
                keys.generate()
                message = {
                    'success': True,
                    'node': {
                        'location': data['location'],
                        'net_speed': data['net_speed'],
                        'vpn': {
                            'ovpn': keys.ovpn()
                        }
                    }
                }
                res.status = falcon.HTTP_200
                res.body = json.dumps(message)
            else:
                message = {
                    'success': False,
                    'message': 'Error occurred, please try again later.'
                }
                try:
                    raise Exception('Client Insertion Error in Database')
                except Exception as _:
                    logger.send_log(message, res)
        else:
            message = {
                'success': False,
                'message': 'Wrong token.'
            }
            try:
                raise Exception('Session Token Mismatch')
            except Exception as _:
                logger.send_log(message, res)
