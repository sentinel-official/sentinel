import os
from sentinel.nodes import Bootnode, Node
from sentinel import Config


# Docker image ENV params
BOOTNODE_URL = os.environ['BOOTNODE_URL']

# Docker container ENV params
BOOTNODE = os.environ['BOOTNODE'] == 'True'
MINER = os.environ['MINER'] == 'True'
CONSOLE = os.environ['CONSOLE'] == 'True'
V5 = os.environ['V5'] == 'True'

NODE_NAME = os.environ['NODE_NAME']
ETHERBASE = os.environ['ETHERBASE']
config = Config(bootnode_url=BOOTNODE_URL)

if BOOTNODE:
  bootnode = Bootnode(config, v5=V5)
  bootnode.start()
elif MINER:
  node = Node(config, identity=NODE_NAME, console=CONSOLE, v5=V5,
              miner=True, etherbase=ETHERBASE)
  node.init()
  node.start()
else:
  node = Node(config, identity=NODE_NAME, console=CONSOLE, v5=V5)
  node.init()
  node.start()

