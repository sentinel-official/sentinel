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

`sudo docker run -it --privileged --mount type=bind,source=$HOME/.sentinel,target=/root/.sentinel -p 3000:3000 -p 4200:4200 -p 4201:4201 -p 4202:4202 -p 4203:4203 sentinelofficial/sentinel-vpn-node`

#### Method #2

Building your own docker image

`cd ~`

`git clone https://github.com/sentinel-official/sentinel.git`

`cd ~/sentinel/socks5-node-docker`

`sudo docker build --file Dockerfile.dev --tag sentinel-socks-node --force-rm --no-cache .`

`mkdir -p $HOME/.sentinel`

`sudo docker run -it --privileged --mount type=bind,source=$HOME/.sentinel,target=/root/.sentinel -p 3000:3000 -p 4200:4200 -p 4201:4201 -p 4202:4202 -p 4203:4203 sentinel-socks-node`

### Updating existing Sentinel VPN node

`sudo docker pull sentinelofficial/sentinel-socks-node`

`sudo docker stop $(sudo docker ps -a -q --filter="ancestor=sentinelofficial/sentinel-socks-node")`

`sudo docker rm $(sudo docker ps -a -q --filter="ancestor=sentinelofficial/sentinel-socks-node")`

After running the above commands please follow the method #1 for running the node again
