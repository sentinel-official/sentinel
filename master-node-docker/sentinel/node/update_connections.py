# coding=utf-8
import json
import time

import falcon

from ..config import DECIMALS
from ..db import db
from ..helpers import eth_helper


def calculate_amount(used_bytes):
    return (used_bytes / (1024.0 * 1024.0 * 1024.0)) * 100.0


class UpdateConnections(object):
    def on_post(self, req, resp):
        token = str(req.body['token'])
        account_addr = str(req.body['account_addr'])
        connections = req.body['connections']

        node = db.nodes.find_one({
            'account_addr': account_addr,
            'token': token
        })
        if node is not None:
            tx_hashes = []
            for info in connections:
                info['account_addr'] = account_addr
                connection = db.connections.find_one({
                    'account_addr': account_addr,
                    'session_name': info['session_name']
                })
                if connection is None:
                    _ = db.connections.insert_one(info)
                else:
                    _ = db.connections.find_one_and_update({
                        'account_addr': account_addr,
                        'session_name': info['session_name']
                    }, {
                        '$set': {
                            'usage': info['usage'],
                            'end_time': info['end_time'] if 'end_time' in info else None
                        }
                    })
                    if 'end_time' in info and info['end_time'] is not None:
                        from_addr = account_addr
                        to_addr = str(connection['client_addr'])
                        sent_bytes = int(info['usage']['down'])
                        session_duration = int(
                            int(info['end_time']) - int(connection['start_time']))
                        amount = int(calculate_amount(sent_bytes) * DECIMALS)
                        timestamp = int(time.time())

                        print(from_addr, to_addr, sent_bytes,
                              session_duration, amount, timestamp)

                        error, tx_hash = eth_helper.add_vpn_usage(
                            from_addr, to_addr, sent_bytes, session_duration, amount, timestamp)
                        if error:
                            tx_hashes.append(error)
                        else:
                            tx_hashes.append(tx_hash)
            message = {
                'success': True,
                'message': 'Connection details updated successfully.',
                'tx_hashes': tx_hashes
            }
        else:
            message = {
                'success': False,
                'message': 'Can\'t find node with given details.'
            }

        resp.status = falcon.HTTP_200
        resp.body = json.dumps(message)
