import os
import string
import random


NODE_PATH = os.path.dirname(__file__)
SENTINEL_DATA_PATH = os.path.join(os.environ['HOME'], '.ethereum/sentinel')
NETWORK_ID = '923842'
BOOT_NODE = 'enode://aebc29030566eaa964d13837c6a5e0e1ab0fa4c169eda254a2c8b38c0234a5ac53f00a1c435e95ec757e528313c9bff688a2607713092f83a80d78ecac128197@104.154.28.69:30301'
RPC_APIS = 'admin,debug,eth,miner,net,personal,rpc,txpool,web3'

def generate_node_name(length=8):
    return ''.join(random.choice(string.ascii_uppercase) for _ in range(length))
