# coding=utf-8
import datetime
import time
from _thread import start_new_thread

from ..db import db


class DailyActiveNodes(object):
    def __init__(self, hour=0, minute=0):
        self.hour = hour
        self.minute = minute
        self.stop_thread = False
        self.t = None

    def thread(self):
        while self.stop_thread is False:
            current_time = datetime.datetime.now()
            if (current_time.hour == self.hour) and (current_time.minute == self.minute):
                nodes = {
                    'up': db.nodes.find({ 'vpn.status': 'up' }).count(),
                    'total': db.nodes.find().count()
                }
                current_time = datetime.datetime.combine(current_time, datetime.time(0))
                timestamp = int(time.mktime(current_time.timetuple()))
                _ = db.statistics.update({
                    'timestamp': timestamp
                }, {
                    '$set': {
                        'nodes': nodes
                    }
                }, upsert=True)
            time.sleep(45)

    def start(self):
        if self.t is None:
            self.t = start_new_thread(self.thread, ())

    def stop(self):
        self.stop_thread = True
