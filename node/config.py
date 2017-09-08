import os
import string
import random


NODE_PATH = os.path.dirname(__file__)
SENTINEL_DATA_PATH = os.path.join(os.environ['HOME'], '.ethereum/sentinel')
NETWORK_ID = '923842'
BOOT_NODE = 'enode://c561783d946dabd541ef755fa8407fcb69456cf4dde3e2230d24265e42c6f7815a834abe07889cb0446539d90209e3baa09cb58764eb51a53f4e511521dad419@10.0.0.16:30301'

def generate_node_name(length=8):
    return ''.join(random.choice(string.ascii_uppercase) for _ in range(length))
