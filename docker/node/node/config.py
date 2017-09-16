import os
import string
import random


NODE_PATH = os.path.dirname(__file__)
SENTINEL_DATA_PATH = os.path.join(os.environ['HOME'], '.ethereum/sentinel')
NETWORK_ID = '78432893'
BOOT_NODE = 'enode://a6c6934af3f24a2339760cfac0005cb6b11283d1fa65258915732236af47308e08b31374db90238556ac4155f73de5702fbd9a46ff801b830701b578ec33e046@104.198.142.31:30301'
RPC_APIS = 'admin,debug,eth,miner,net,personal,rpc,txpool,web3'

def generate_node_name(length=8):
    return ''.join(random.choice(string.ascii_uppercase) for _ in range(length))
