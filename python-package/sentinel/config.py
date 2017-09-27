import os


BOOTNODE_URLS = [
  'enode://d041402ba778320ed31a2b7fdf1c29df4c28dfcde92a907194d53b56d3786c50119515d96ab33d5eae31c0e6a74ac2d05ba607f1f78f81e80f51f9c7de477490@104.155.171.23:30301'
]

class Config:
  def __init__(self, sentinel_data_path=None, network_id=None, bootnode_url=None,
               rpc_apis=None, genesis_file=None):

    self.SENTINEL_DATA_PATH = sentinel_data_path
    self.NETWORK_ID = network_id
    self.BOOTNODE_URL = bootnode_url
    self.RPC_APIS = rpc_apis
    self.GENESIS_FILE = genesis_file

    if sentinel_data_path == None or sentinel_data_path == 'None':
      self.SENTINEL_DATA_PATH = os.path.join(os.environ['HOME'], '.ethereum/sentinel')
    if network_id == None or network_id == 'None':
      self.NETWORK_ID = '78432893'
    if bootnode_url == None or bootnode_url == 'None':
      self.BOOTNODE_URL = ','.join(BOOTNODE_URLS)
    if rpc_apis == None or rpc_apis == 'None':
      self.RPC_APIS = 'admin,debug,eth,miner,net,personal,rpc,txpool,web3'
    if genesis_file == None or genesis_file == 'None':
      self.GENESIS_FILE = os.path.join(os.path.dirname(__file__), 'genesis.json')

