# Running Sentinel dVPN IKEv2 node
## Setup Instructions
Here are the steps involved in getting a Sentinel dVPN IKEv2 Node up and running:
1. Install Docker
2. Build/pull the **Sentinel dVPN IKEv2** Docker image
### Installing the latest version of Docker in Ubuntu or Debian based releases
1. Install required dependencies to get Docker installation script from get.docker.com  
`sudo apt-get install -y curl`  
`curl -fsSL get.docker.com -o /tmp/get-docker.sh`
2. Run the downloaded script to setup & install Docker  
`sudo sh /tmp/get-docker.sh`
### Running the Sentinel dVPN IKEv2 Node
You can set up and run dVPN node in two ways:
1. Quick Run - download Docker image from Docker hub
2. DIY - build your own Docker image from the Sentinel code repository
#### Method #1 [Download Docker image from Docker hub]
1. Navigate to the User's home directory  
`cd $HOME`
2. Create a new folder to pull the Docker image and run it  
`mkdir -p $HOME/.sentinel`
3. Pull the official Sentinel Docker image from Docker hub & configure the node  
`sudo docker run -it --privileged --mount type=bind,source=$HOME/.sentinel,target=$HOME/.sentinel -p 3000:3000/tcp -p 500:500/udp -p 4500:4500/udp sentinelofficial/sentinel-ikev2-node`
#### Method #2 [Build your own Docker image]
Do-it-Yourself setup by building your own Docker image
1. Navigate to the root folder or anywhere that you want to set up the project and download code from the repository  
`cd $HOME`
2. Clone the Sentinel repository  
`git clone https://github.com/sentinel-official/sentinel.git --branch master --depth 1`
3. Navigate to the folder with code to build the Docker image  
`cd ~/sentinel/ikev2-node`
4. Copy the CA certificate  
`cp ../master-node-docker/ca.crt ca.crt`
5. Build the Docker image  
`sudo docker build --file Dockerfile --tag sentinel-ikev2-node --compress --force-rm --no-cache .`
6. Navigate to the folder where the Docker container was set up. In our case, it is the User's home directory  
`mkdir -p $HOME/.sentinel`
7. Run the image and configure the node  
`sudo docker run -it --privileged --mount type=bind,source=$HOME/.sentinel,target=$HOME/.sentinel -p 3000:3000/tcp -p 500:500/udp -p 4500:4500/udp sentinel-ikev2-node`
