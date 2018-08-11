# coding=utf-8
import time

from sentinel.jobs import DailyActiveNodes
from sentinel.jobs import DailySentsCount
from sentinel.jobs import Swaps
from sentinel.jobs import UpdateNodesStatus

daily_active_nodes = DailyActiveNodes()
daily_sent_count = DailySentsCount()
update_nodes_status = UpdateNodesStatus(max_secs=60)
swaps = Swaps()

daily_active_nodes.start()
daily_sent_count.start()
update_nodes_status.start()
swaps.start()

while True:
    time.sleep(int(9.223372 * 1e9))
