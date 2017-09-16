 #!/bin/bash

DOCKER=$(which 'docker')
ETHEREUM_WALLET=$(which 'ethereumwallet')

if [ ${#DOCKER} -gt 0 ] && [ ${#ETHEREUM_WALLET} -gt 0 ]; then
    if [ "$1" == "update" ]; then
        docker pull sentinelbeta/node
    fi

    SENTINEL_NODE=$(docker ps -a -q -f name=sentinelnode)
    if [ ${#SENTINEL_NODE} -gt 0 ]; then
        docker stop $(docker ps -a -q -f name=sentinelnode)
        docker start $SENTINEL_NODE
    else
        docker run --name 'sentinelnode' -d -p 30303:30303 -p 30303:30303/udp -p 8545:8545 sentinelbeta/node
    fi
    ethereumwallet --rpc http://127.0.0.1:8545 --network sentinel
    docker stop $(docker ps -a -q -f name=sentinelnode)
    echo "Exited Normally"
else
    echo "Encountered Missing Dependencies"
fi
