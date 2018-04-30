# coding=utf-8
import json
import time

import falcon
from pymongo import ReturnDocument

from ..config import DECIMALS
from ..db import db
from ..helpers import eth_helper


def calculate_amount(used_bytes, price_per_gb):
    return (used_bytes / (1024.0 * 1024.0 * 1024.0)) * price_per_gb


class UpdateConnections(object):
    def on_post(self, req, resp):
        token = str(req.body['token'])
        account_addr = str(req.body['account_addr']).lower()
        connections = req.body['connections']

        node = db.nodes.find_one({
            'account_addr': account_addr,
            'token': token
        })
        if node is not None:
            tx_hashes = []
            for connection in connections:
                connection['vpn_addr'] = account_addr
                connection['client_addr'] = connection['account_addr'].lower()
                connection.pop('account_addr')

                data = db.connections.find_one({
                    'vpn_addr': connection['vpn_addr'],
                    'client_addr': connection['client_addr'],
                    'session_name': connection['session_name']
                })
                if data is None:
                    connection['start_time'] = int(time.time())
                    connection['end_time'] = None
                    _ = db.connections.insert_one(connection)
                else:
                    _ = db.connections.find_one_and_update({
                        'vpn_addr': connection['vpn_addr'],
                        'client_addr': connection['client_addr'],
                        'session_name': connection['session_name'],
                        'end_time': None
                    }, {
                        '$set': {
                            'usage': connection['usage']
                        }
                    })
            session_names = [connection['session_name'] for connection in connections]
            end_time = int(time.time())
            ended_connections = db.connections.update_many({
                'vpn_addr': account_addr,
                'session_name': {
                    '$nin': session_names
                }
            }, {
                '$set': {
                    'end_time': end_time
                }
            }, return_document=ReturnDocument.AFTER)
            ended_connections = list(ended_connections)

            for connection in ended_connections:
                to_addr = str(connection['client_addr'])
                sent_bytes = int(connection['usage']['down'])
                session_duration = int(int(connection['end_time']) - int(connection['start_time']))
                amount = int(calculate_amount(sent_bytes, node['price_per_gb']) * DECIMALS)
                timestamp = int(time.time())
                print(account_addr, to_addr, sent_bytes, session_duration, amount, timestamp)

                error, tx_hash = eth_helper.add_vpn_usage(account_addr, to_addr, sent_bytes, session_duration, amount,
                                                          timestamp)
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
