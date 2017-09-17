# Sentinel POC Beta

## Bootnode

Bootnodes are special nodes, through a node can join the network and find other nodes. For running a bootnode you must install ethereum in your system.

### Running a Bootnode

`$ bootnode -genkey bootnode.key`
This command will generate a private key and stores it in *bootnode.key* file

`$ bootnode -nodekey bootnode.key --verbosity 6`
This command will run the bootnode server on port *30301/udp*

### Building Sentinel Docker Image

`$ git clone https://github.com/sentinel-official/sentinel-py.git`

`$ cd sentinel-py`

`$ git checkout poc-beta`

`$ cd docker/node`

`$ docker build --tag sentinelbeta/node --compress --force-rm --no-cache .`

These above commands will build Sentinel docker image. To check run `docker images -a`

### Running a Sentinel Node

For running a Sentinel node first you need to install all the dependencies

`$ wget -c https://raw.githubusercontent.com/sentinel-official/sentinel-py/poc-beta/scripts/installers/linux.sh -O ~/install-dependencies.sh`

`$ chmod +x ~/install-dependencies.sh`

`$ ~/install-dependencies.sh`

Run Sentinel node

`$ wget -c https://raw.githubusercontent.com/sentinel-official/sentinel-py/poc-beta/scripts/runners/linux.sh -O ~/sentinel-node.sh`

`$ chmod +x ~/sentinel-node.sh`

Start Sentinel node: `$ ~/sentinel-node.sh start`

Stop Sentinel node: `$ ~/sentinel-node.sh stop`

Update Sentinel Docker image: `$ ~/sentinel-node.sh update`

### Using Ethereum Wallet with Sentinel private network

`$ ethereumwallet --rpc http://127.0.0.1:8545 --network sentinel`
