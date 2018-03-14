# coding=utf-8
import time
from _thread import start_new_thread

from ..db import db


class UpdateNodesStatus(object):
    def __init__(self, max_secs):
        self.max_secs = max_secs
        self.stop_thread = False
        self.t = None

    def update_thread(self):
        while True:
            if self.stop_thread:
                break
            min_time = int(time.time()) - self.max_secs
            _ = db.nodes.update_many({
                'vpn.last_ping': {
                    '$lt': min_time
                }
            }, {
                '$set': {
                    'vpn.status': 'down'
                }
            })
            time.sleep(5)

    def start(self):
        self.t = start_new_thread(self.update_thread, ())

    def stop(self):
        self.stop_thread = True
