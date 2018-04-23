# coding=utf-8
import time

from sentinel.jobs import DailyActiveNodes
from sentinel.jobs import Swaps
from sentinel.jobs import UpdateNodesStatus

daily_active_nodes = DailyActiveNodes()
update_nodes_status = UpdateNodesStatus(max_secs=60)
swaps = Swaps()

daily_active_nodes.start()
update_nodes_status.start()
swaps.start()

time.sleep(int(9.223372 * 1e9))
