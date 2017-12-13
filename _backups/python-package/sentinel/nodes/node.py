import os
import subprocess
from .. import Config
from ..utils.string import generate_random_name


class Node:
  def __init__(self, config=None, console=False, etherbase=None, identity=None,
               miner=False, v5=False, rpc=True, verbosity=3):
    if miner == True and etherbase == None:
      raise ValueError('Etherbase shouldn\'t be `None` when mining is `True`')
    self.config = Config() if config == None else config
    self.geth_cmd = [
      'geth',
      '--datadir', self.config.SENTINEL_DATA_PATH
    ]
    self.console = console
    self.miner = miner
    self.etherbase = etherbase
    self.identity = generate_random_name() if identity == None else identity
    self.v5 = v5
    self.rpc = rpc
    self.verbosity = verbosity

  def init(self):
    args = [ 'init', self.config.GENESIS_FILE ]
    init_proc = subprocess.Popen(self.geth_cmd + args, shell=False)
    init_proc.wait()
    if init_proc.returncode != 0:
      raise OSError('Failed to init geth :-(')

  def start(self):
    args = [
      '--identity', self.identity,
      '--networkid', self.config.NETWORK_ID,
      '--bootnodes', self.config.BOOTNODE_URL,
      '--verbosity', str(self.verbosity)
    ]
    if self.rpc == True:
      args += [
        '--rpc',
        '--rpcaddr=0.0.0.0',
        '--rpcapi="{}"'.format(self.config.RPC_APIS)
      ]
    if self.v5 == True:
      args += [ '--v5disc' ]
    if self.miner == True and self.etherbase != None:
      args += [
        '--mine',
        '--etherbase', self.etherbase
      ]
    if self.console == True:
      args += [ 'console' ]
    
    geth_proc = subprocess.Popen(self.geth_cmd + args, shell=False)
    geth_proc.wait()
    if geth_proc.returncode != 0:
      raise OSError('Failed to start geth node :-(')

