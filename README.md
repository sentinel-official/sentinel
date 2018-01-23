# Sentinel Security Group


## Sentinel Wallet - Download URLs

### Latest Download Links For Sentinel Alpha (v0.0.1) Desktop Clients:
- [  Mac OS v0.0.1 ](https://storage.googleapis.com/sentinel-packages/Sentinel-Wallet_alpha-0.0.1.dmg)
- [  Windows Client v0.0.1 ](https://storage.googleapis.com/sentinel-packages/Sentinel-Wallet_alpha-0.0.1_Installer.exe)
- [  Linux Client v0.0.1 ](https://storage.googleapis.com/sentinel-packages/Sentinel-Wallet_alpha-0.0.1_amd64.deb)

## Sentinel VPN Node - Setup Guide

### 1. Building Sentinel Docker Image

`$ git clone https://github.com/sentinel-official/sentinel-py.git`

`$ cd sentinel-py`

`$ git checkout poc-beta`

`$ cd docker/`

`$ docker build --tag sentinelbeta/sentinel --compress --force-rm --no-cache .`

These above commands will build the Sentinel docker image. To check run `docker images -a`

## 2. Running Sentinel Nodes

### 2.1) Download Scripts

For running a Sentinel node first you need to install all the dependencies

`$ wget -c https://raw.githubusercontent.com/sentinel-official/sentinel-py/poc-beta/scripts/installers/linux.sh -O ~/install-dependencies.sh`

`$ chmod +x ~/install-dependencies.sh`

`$ ~/install-dependencies.sh`

`$ wget -c https://raw.githubusercontent.com/sentinel-official/sentinel-py/poc-beta/scripts/runners/linux.sh -O ~/sentinel.sh`

`$ chmod +x ~/sentinel.sh`

### 2.2) Starting nodes

`$ ~/sentinel.sh start --type {boot|normal|miner|main} --name NAME`

Additional flags:

`-c -- For console`

`-v5 -- For running in version 5 mode`

`--bootnode-url -- Provide a boot node URL (If this flag is not privided, nodes will connect to the latest created boot node)`

`--etherbase -- Provide Ethereum account address (default: 0x0000000000000000000000000000000000000001)`

### 2.3) Stopping nodes

Stop a node: `$ ~/sentinel.sh stop --type {boot|normal|miner|main} --name NAME`

Stop all nodes: `$ ~/sentinel.sh stop --all`

Remove specific node: `$ ~/sentinel.sh stop --type {boot|normal|miner|main} --name NAME --purge`

Remove all nodes: `$ ~/sentinel.sh stop --purge-all`

### 2.4) Show Info of Nodes

View IP address: `$ ~/sentinel.sh show --type {boot|normal|miner|main} --name NAME --ip`

View node enode address: `$ ~/sentinel.sh show --type {boot|normal|miner|main} --name NAME --node-addr`

View peers of a node: `$ ~/sentinel.sh show --type {normal|miner|main} --name NAME --show-peers`

View all Sentinel containers: `$ ~/sentinel.sh show --all`

### 2.5) Update Sentinel Docker image:

`$ ~/sentinel.sh update`
