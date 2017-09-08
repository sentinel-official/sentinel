# Sentinel POC Beta

## Bootnode

Bootnodes are special nodes, through a node can join the network and find other nodes. For running a bootnode you must install ethereum in your system.

### Running a Bootnode

`bootnode -genkey bootnode.key`
This command will generate a private key and stores it in *bootnode.key* file

`bootnode -nodekey bootnode.key --verbosity 6`
This command will run the bootnode server on port *30301/udp*

### Building Sentinel Docker Image

`git clone https://github.com/sentinel-official/sentinel-py.git`

`cd sentinel-py`

`git checkout poc-beta`

`docker build --tag sentinel --compress .`

These above commands will build Sentinel docker image. To check run `docker images -a`

### Running a Sentinel Node

`docker run -it -p 30303:30303 -p 30303:30303/udp sentinel`

The above command will provide a JavaScript console

To see the connected peers run `admin.peers` in JS console. To know your node information run `admin.nodeInfo`
