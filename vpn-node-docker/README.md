### Installing docker in Linux

`sudo apt install -y curl`

`$ curl -fsSL get.docker.com -o /tmp/get-docker.sh`

`sudo sh /tmp/get-docker.sh`

`sudo usermod -aG docker $USER`

### Sentinel VPN node [Quick Run]

`$ cd ~`

`$ mkdir -p $HOME/.sentinel`

`$ docker run -it --privileged --mount type=bind,source=$HOME/.sentinel,target=/root/.sentinel -p 3000:3000 -p 1194:1194/udp sentinelofficial/sentinel-vpn-node`


### Creating docker image

`$ cd ~`

`$ git clone https://github.com/sentinel-official/sentinel.git`

`$ cd ~/sentinel/vpn-node-docker`

`$ docker build --file Dockerfile.prod --tag sentinel-vpn-node --force-rm --no-cache .`

### Running Sentinel VPN node

`$ cd ~`

`$ mkdir -p $HOME/.sentinel`

`$ docker run -it --privileged --mount type=bind,source=$HOME/.sentinel,target=/root/.sentinel -p 3000:3000 -p 1194:1194/udp sentinel-vpn-node`

