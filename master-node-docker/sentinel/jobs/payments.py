# coding=utf-8
import datetime
import time
from _thread import start_new_thread

from ..db import db
from ..helpers import eth_helper


class DailySentsCount(object):
    def __init__(self, hour=0, minute=0):
        self.hour = hour
        self.minute = minute
        self.stop_thread = False
        self.t = None

    def thread(self):
        while self.stop_thread is False:
            current_time = datetime.datetime.now()
            timestamp = int(time.time())
            if (current_time.hour == self.hour) and (
                    current_time.minute == self.minute):
                paid_count = 0
                unpaid_count = 0
                result = db.connections.aggregate([{
                    '$match': {
                        'start_time': {
                            '$gte': timestamp - (24 * 60 * 60)
                        }
                    }
                }, {
                    '$group': {
                        '_id': '$client_addr'
                    }
                }])

                for addr in result:
                    if addr['_id'] is not None:
                        error, usage = eth_helper.get_vpn_usage(addr['_id'])
                        if error is not None:
                            for obj in usage['sessions']:
                                if obj['timestamp'] >= (timestamp -
                                                        (24 * 60 * 60)):
                                    if obj['is_paid']:
                                        paid_count = paid_count + (
                                                float(obj['amount']) / (10 ** 8))
                                    else:
                                        unpaid_count = unpaid_count + (
                                                float(obj['amount']) / (10 ** 8))

                _ = db.payments.update(
                    {
                        'timestamp': timestamp
                    }, {
                        '$set': {
                            'paid_count': paid_count,
                            'unpaid_count': unpaid_count
                        }
                    },
                    upsert=True)
            time.sleep(45)

    def start(self):
        if self.t is None:
            self.t = start_new_thread(self.thread, ())

    def stop(self):
        self.stop_thread = True

