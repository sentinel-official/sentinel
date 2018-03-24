# coding=utf-8
import json
import time
from subprocess import Popen, PIPE
from uuid import uuid4

import falcon

from ..db import db


def get_latency(url):
    avg_latency_cmd = 'ping -c 2 %s | \
                       tail -1 | \
                       awk \'{print $4}\' | \
                       cut -d \'/\' -f 2' % url
    proc = Popen(avg_latency_cmd, shell=True, stdout=PIPE)
    proc.wait()
    latency = float(proc.stdout.readlines()[0].strip().decode('utf-8'))

    return latency


class RegisterNode(object):
    def on_post(self, req, resp):
        account_addr = str(req.body['account_addr']).lower()
        ip = str(req.body['ip'])
        location = req.body['location']
        net_speed = req.body['net_speed']
        token = uuid4().hex
        latency = get_latency(ip)
        joined_on = int(time.time())

        node = db.nodes.find_one({
            'account_addr': account_addr
        })
        if node is None:
            _ = db.nodes.insert_one({
                'account_addr': account_addr,
                'token': token,
                'ip': ip,
                'latency': latency,
                'joined_on': joined_on,
                'location': location,
                'net_speed': net_speed
            })
        else:
            _ = db.nodes.find_one_and_update({
                'account_addr': account_addr
            }, {
                '$set': {
                    'token': token,
                    'ip': ip,
                    'latency': latency,
                    'location': location,
                    'net_speed': net_speed
                }
            })
        message = {
            'success': True,
            'token': token,
            'message': 'Node registered successfully.'
        }
        resp.status = falcon.HTTP_200
        resp.body = json.dumps(message)


class DeRegisterNode(object):
    def on_post(self, req, resp):
        account_addr = str(req.body['account_addr']).lower()
        token = req.body['token']

        node = db.nodes.find_one_and_delete({
            'account_addr': account_addr,
            'token': token
        })

        if node is None:
            message = {
                'success': False,
                'message': 'Node is not registered.'
            }
        else:
            message = {
                'success': True,
                'message': 'Node deregistred successfully.'
            }
        resp.status = falcon.HTTP_200
        resp.body = json.dumps(message)
