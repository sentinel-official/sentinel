# Sentinel POC Beta

## [Download Latest Sentinel Desktop App](https://storage.googleapis.com/sentinel-packages/SentinelWalletInstaller.exe) (For Windows 64-bit Arch).

## Building Sentinel Docker Image

`$ git clone https://github.com/sentinel-official/sentinel-py.git`

`$ cd sentinel-py`

`$ git checkout poc-beta`

`$ cd docker/`

`$ docker build --tag sentinelbeta/sentinel --compress --force-rm --no-cache .`

These above commands will build Sentinel docker image. To check run `docker images -a`

## Running Sentinel Nodes

### Download Scripts

For running a Sentinel node first you need to install all the dependencies

`$ wget -c https://raw.githubusercontent.com/sentinel-official/sentinel-py/poc-beta/scripts/installers/linux.sh -O ~/install-dependencies.sh`

`$ chmod +x ~/install-dependencies.sh`

`$ ~/install-dependencies.sh`

`$ wget -c https://raw.githubusercontent.com/sentinel-official/sentinel-py/poc-beta/scripts/runners/linux.sh -O ~/sentinel.sh`

`$ chmod +x ~/sentinel.sh`

### Starting nodes

`$ ~/sentinel.sh start --type {boot|normal|miner|main} --name NAME`

Additional flags:

`-c -- For console`

`-v5 -- For running in version 5 mode`

`--bootnode-url -- Provide a boot node URL (If this flag is not privided, nodes will connect to the latest created boot node)`

`--etherbase -- Provide Ethereum account address (default: 0x0000000000000000000000000000000000000001)`

### Stopping nodes

Stop a node: `$ ~/sentinel.sh stop --type {boot|normal|miner|main} --name NAME`

Stop all nodes: `$ ~/sentinel.sh stop --all`

Remove specific node: `$ ~/sentinel.sh stop --type {boot|normal|miner|main} --name NAME --purge`

Remove all nodes: `$ ~/sentinel.sh stop --purge-all`

### Show Info of Nodes

View IP address: `$ ~/sentinel.sh show --type {boot|normal|miner|main} --name NAME --ip`

View node enode address: `$ ~/sentinel.sh show --type {boot|normal|miner|main} --name NAME --node-addr`

View peers of a node: `$ ~/sentinel.sh show --type {normal|miner|main} --name NAME --show-peers`

View all Sentinel containers: `$ ~/sentinel.sh show --all`

### Update Sentinel Docker image:

`$ ~/sentinel.sh update`
