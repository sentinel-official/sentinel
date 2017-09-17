import os
import string
import random


NODE_PATH = os.path.dirname(__file__)
SENTINEL_DATA_PATH = os.path.join(os.environ['HOME'], '.ethereum/sentinel')
NETWORK_ID = '78432893'
BOOT_NODE = 'enode://2dd991116df2c71cc4f9ad74d8927fdfdc1bc447915ce10831b47c08f2a09bac509cd8854cb21f9004a18f828a0e733c6ec248e16b67ccf7f30dce374a0d7389@35.187.225.4:30301'
RPC_APIS = 'admin,debug,eth,miner,net,personal,rpc,txpool,web3'

def generate_node_name(length=8):
    return ''.join(random.choice(string.ascii_uppercase) for _ in range(length))
