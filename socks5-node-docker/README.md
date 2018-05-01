# Sentinel SOCKS5 Node on Linux

Below are the steps involved in running a Sentinel dVPN Node.

- Docker Installation
- Pull the **Sentinel dVPN** docker image
- Node Configuration

Start running the node and make $SENT!

Below are the instructions on installing docker. 

### Installing the latest version of docker in Ubuntu or Debian based releases

`sudo apt install -y curl`

`curl -fsSL get.docker.com -o /tmp/get-docker.sh`

`sudo sh /tmp/get-docker.sh`

`sudo usermod -aG docker $USER`

### Running Sentinel VPN node

You can setup and run VPN node in two ways

#### Method #1 [Quick Run]

Using existing docker image

`cd ~`

`mkdir -p $HOME/.sentinel`

`sudo docker run -it --privileged --mount type=bind,source=$HOME/.sentinel,target=/root/.sentinel -p 3000:3000 -p 1194:1194/udp sentinelofficial/sentinel-vpn-node`

#### Method #2

Building your own docker image

`cd ~`

`git clone https://github.com/sentinel-official/sentinel.git`

`cd ~/sentinel/vpn-node-docker`

`sudo docker build --file Dockerfile.prod --tag sentinel-vpn-node --force-rm --no-cache .`

`mkdir -p $HOME/.sentinel`

`sudo docker run -it --privileged --mount type=bind,source=$HOME/.sentinel,target=/root/.sentinel -p 3000:3000 -p 1194:1194/udp sentinel-vpn-node`

### Updating existing Sentinel VPN node

`sudo docker pull sentinelofficial/sentinel-vpn-node`

`sudo docker stop $(sudo docker ps -a -q --filter="ancestor=sentinelofficial/sentinel-vpn-node")`

`sudo docker rm $(sudo docker ps -a -q --filter="ancestor=sentinelofficial/sentinel-vpn-node")`

After running the above commands please follow the method #1 for running the node again
