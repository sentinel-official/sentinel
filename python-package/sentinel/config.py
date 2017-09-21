import os


class Config:
  def __init__(self, sentinel_data_path=None, network_id=None, bootnode_url=None,
               rpc_apis=None, genesis_file=None):

    self.SENTINEL_DATA_PATH = sentinel_data_path
    self.NETWORK_ID = network_id
    self.BOOTNODE_URL = bootnode_url
    self.RPC_APIS = rpc_apis
    self.GENESIS_FILE = genesis_file

    if sentinel_data_path == None:
      self.SENTINEL_DATA_PATH = os.path.join(os.environ['HOME'], '.ethereum/sentinel')
    if network_id == None:
      self.NETWORK_ID = '78432893'
    if bootnode_url == None:
      self.BOOTNODE_URL = ''
    if rpc_apis == None:
      self.RPC_APIS = 'admin,debug,eth,miner,net,personal,rpc,txpool,web3'
    if genesis_file == None:
      self.GENESIS_FILE = os.path.join(os.path.dirname(__file__), 'genesis.json')

