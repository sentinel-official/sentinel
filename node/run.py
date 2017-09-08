import os
import sys
import subprocess
from config import *


os.chdir(NODE_PATH)

def get_geth_init_command():
    args = [
        'geth',
        'init', 'genesis.json',
        '--datadir', SENTINEL_DATA_PATH,
    ]

    return args

def get_geth_run_command(identity):
    args = [
        'geth',
        '--identity', identity,
        '--datadir', SENTINEL_DATA_PATH,
        '--networkid', NETWORK_ID,
        '--fast',
        '--bootnodes', BOOT_NODE,
        'console'
    ]

    return args

geth_init = get_geth_init_command()
init_proc = subprocess.Popen(geth_init, shell=False)
init_proc.wait()
if init_proc.returncode != 0:
    raise OSError("geth init failed ::: code {}".format(init_proc.returncode))

geth_run = get_geth_run_command(generate_node_name())
run_proc = subprocess.Popen(' '.join(geth_run), shell=True)
run_proc.wait()
if run_proc.returncode != 0:
    raise OSError("geth run failed ::: code {}".format(run_proc.returncode))
