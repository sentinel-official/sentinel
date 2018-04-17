# coding=utf-8
import time

from sentinel.jobs import DailyActiveNodes
from sentinel.jobs import UpdateNodesStatus
from sentinel.tokens import Swaps

daily_active_nodes = DailyActiveNodes(hour=0, minute=0)
update_nodes_status = UpdateNodesStatus(max_secs=120)
swaps = Swaps(interval=60)

daily_active_nodes.start()
update_nodes_status.start()
swaps.start()

time.sleep(int(1e10))
