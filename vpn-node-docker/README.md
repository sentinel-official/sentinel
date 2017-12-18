### Creating docker image

`$ cd ~`

`$ git clone https://github.com/sentinel-official/sentinel.git`

`$ cd ~/sentinel/vpn-node-docker`

`$ docker build --file Dockerfile.dev --tag vpn-dev --force-rm --no-cache .`

### Running Sentinel VPN node

`$ docker run -d --privileged -p 1194:1194/udp -e PASSWORD=7VZypYzFHX0TV02t vpn-dev`
