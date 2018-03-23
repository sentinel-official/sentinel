# coding=utf-8
import json
from uuid import uuid4
import time
import falcon
from subprocess import Popen,PIPE
from ..db import db
from ..logs import logger

def get_latency(url):
    proc= Popen("ping -c 2 "+ url +" | tail -1 | awk '{print $4}' | cut -d '/' -f 2", shell=True,stdout=PIPE )
    out=proc.communicate()[0]
    if(type(out)=='bytes'):
        out=out.decode('utf-8')
    out=out.replace('\n','')
    return out

class RegisterNode(object):
    def on_post(self, req, resp):
        account_addr = req.body['account_addr']
        ip = req.body['ip']
        location = req.body['location']
        net_speed = req.body['net_speed']
        token = uuid4().hex

        node = db.nodes.find_one({
            'account_addr': account_addr
        })
        if node is None:
            _ = db.nodes.insert_one({
                'account_addr': account_addr,
                'token': token,
                'location': location,
                'ip': ip,
                'latency':float(get_latency(ip)),
                'created_at':int(time.time()),
                'net_speed': net_speed
            })
        else:
            _ = db.nodes.find_one_and_update({
                'account_addr': account_addr
            }, {
                '$set': {
                    'token': token,
                    'location': location,
                    'ip': ip,
                    'latency':float(get_latency(ip)),
                    'net_speed': net_speed
                }
            })
        message = {
            'success': True,
            'token': token,
            'message': 'Node registered successfully.'
        }
