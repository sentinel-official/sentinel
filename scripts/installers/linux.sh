 #!/bin/bash

DOCKER=$(which 'docker')
ETHEREUM_WALLET=$(which 'ethereumwallet')

if [ ${#DOCKER} -eq 0 ]; then
    curl -fsSL get.docker.com -o /tmp/get-docker.sh
    sudo sh /tmp/get-docker.sh
    sudo usermod -aG docker $USER
fi

if [ ${#ETHEREUM_WALLET} -eq 0 ]; then
    wget -c -P /tmp 'https://github.com/ethereum/mist/releases/download/v0.9.0/Ethereum-Wallet-linux64-0-9-0.deb'
    sudo dpkg -i /tmp/Ethereum-Wallet-linux64-0-9-0.deb
    sudo apt-get install -f -y
fi

echo ""
echo "*** Please Reboot Your System ***"
echo ""
