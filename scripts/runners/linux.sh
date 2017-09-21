#!/bin/bash

DOCKER=$(which 'docker')
IMAGE_LABEL='sentinelbeta/sentinel'

do_update() {
  CONTAINER_ID=$(docker ps -a -q -f name=sentinel)
  if [ ${#CONTAINER_ID} -gt 0 ]; then
    do_stop
    docker rm $CONTAINER_ID
  fi
  if [ ${#IMAGE_ID} -gt 0 ]; then
    docker rmi $IMAGE_ID
  fi
  docker pull $IMAGE_LABEL
}

do_start() {
  if [ $# -le 0 ]; then echo "Need valid arguments"; exit 3; fi
  BOOTNODE=; MINER=; ETHERBASE=; V5=; CONSOLE=; BOOTNODE_URL=; NODE_NAME=; CONTAINER_NAME=;
  while [[ $# -gt 0 ]]; do
    case "$1" in
      -b) CONTAINER_NAME="sentinel_boot"; BOOTNODE="-e BOOTNODE=True";;
      -m) CONTAINER_NAME="sentinel_miner"; MINER="-e MINER=True";;
      -n) CONTAINER_NAME="sentinel_node" ;;
      --name) NODE_NAME=$2; shift ;;
      --etherbase) ETHERBASE="-e ETHERBASE=$2"; shift ;;
      --bootnode-url) BOOTNODE_URL="-e BOOTNODE_URL=$2"; shift ;;
      -v5) V5="-e V5=True" ;;
      -c) CONSOLE="-e CONSOLE=True" ;;
      *)
        echo "Usage: ./sentinel.sh start [args]"
        echo "args:"
        echo "     -b                - For starting a boot node"
        echo "     -m                - For starting a miner node"
        echo "     -n                - For starting a normal node"
        echo "     -v5               - For starting in version 5 mode"
        echo "     -c                - For JS console (miner|normal)"
        echo "     --name            - Name of the node"
        echo "     --etherbase       - Ethereum account address (Need for miner node)"
        echo "     --bootnode-url    - Boot node URL for nodes"
        exit 3
      ;;
    esac
    shift
  done

  CONTAINER_ID=$(docker ps -a -q -f name="$CONTAINER_NAME-$NODE_NAME")
  if [ ${#CONTAINER_ID} -gt 0 ]; then
    RUNNING=$(docker ps -a -q -f id=$CONTAINER_ID -f status=running)
    if [ ${#RUNNING} -eq 0 ]; then
      docker start $CONTAINER_ID
    else
      echo "'$CONTAINER_NAME-$NODE_NAME' is already running..." >&2
    fi
  else
    if [ ${#CONSOLE} -gt 0 ]; then
      docker run --name "$CONTAINER_NAME-$NODE_NAME" -it \
        -e NODE_NAME=$NODE_NAME $BOOTNODE_URL $MINER $CONSOLE $V5 $ETHERBASE $BOOTNODE $IMAGE_LABEL
    else
      docker run --name "$CONTAINER_NAME-$NODE_NAME" -d \
        -e NODE_NAME=$NODE_NAME $BOOTNODE_URL $MINER $CONSOLE $V5 $ETHERBASE $BOOTNODE $IMAGE_LABEL
    fi
  fi
}

do_stop() {
  if [ $# -le 0 ]; then echo "Need valid arguments"; exit 3; fi
  CONTAINER_NAME=; NODE_NAME=; ALL=; PURGE_ALL=; PURGE=;
  while [[ $# -gt 0 ]]; do
    case "$1" in
      -b) CONTAINER_NAME='sentinel_boot' ;;
      -m) CONTAINER_NAME='sentinel_miner' ;;
      -n) CONTAINER_NAME='sentinel_node' ;;
      --name) NODE_NAME="$2"; shift ;;
      --purge) PURGE=True ;;
      --all) ALL=True ;;
      --purge-all) PURGE_ALL=True ;;
      *)
        echo "Usage: ./sentinel.sh stop [args]"
        echo "args:"
        echo "     -b             - For stopping a boot node"
        echo "     -m             - For stopping a miner node"
        echo "     -n             - For stopping a normal node"
        echo "     --name         - Name of the node"
        echo "     --purge        - Remove container"
        echo "     --all          - Stop all Sentinel containers"
        echo "     --purge-all    - Remove all Sentinel containers"
        exit 3
      ;;
    esac
    shift
  done
  if [ ${#ALL} -gt 0 ] || [ ${#PURGE_ALL} -gt 0 ]; then
    docker stop $(docker ps -a -q -f name=sentinel)
  fi

  if [ ${#PURGE_ALL} -gt 0 ]; then
    docker rm $(docker ps -a -q -f name=sentinel)
  fi

  if [ ${#CONTAINER_NAME} -gt 0 ]; then
    docker stop "$CONTAINER_NAME-$NODE_NAME" -t 2
  fi
  
  if [ ${#PURGE} -gt 0 ]; then
    docker rm $(docker ps -a -q -f name="$CONTAINER_NAME-$NODE_NAME")
  fi
}

do_show() {
  if [ $# -le 0 ]; then echo "Need valid arguments"; exit 3; fi
  BOOTNODE_URL=; SHOW_PEERS=; NODE_NAME=; CONTAINER_NAME=; ALL=; IP=;
  while [[ $# -gt 0 ]]; do
    case "$1" in
      -b) CONTAINER_NAME='sentinel_boot' ;;
      -m) CONTAINER_NAME='sentinel_miner' ;;
      -n) CONTAINER_NAME='sentinel_node' ;;
      --ip) IP=True ;;
      --bootnode-url) BOOTNODE_URL=True ;;
      --show-peers) SHOW_PEERS=True ;;
      --name) NODE_NAME="$2"; shift ;;
      --all) ALL=True ;;
      *)
        echo "Usage: ./sentinel.sh show [args]"
        echo "args:"
        echo "     -b                - Show info from a boot node"
        echo "     -m                - Show info from a miner node"
        echo "     -n                - Show info from a normal node"
        echo "     --ip              - Show IP address of node"
        echo "     --bootnode-url    - View boot node enode address"
        echo "     --show-peers      - View all peers connected to a node (miner|normal)"
        echo "     --name            - Name of the node"
        echo "     --all        - Show all Sentinel containers"
        exit 3
      ;;
    esac
    shift
  done

  CONTAINER_ID=$(docker ps -a -q -f name="$CONTAINER_NAME-$NODE_NAME")
  if [ ${#ALL} -gt 0 ]; then
    docker ps -a -f name=sentinel
    exit 3
  fi
  
  if [ ${#IP} -gt 0 ]; then
    docker inspect -f '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' $CONTAINER_ID
    exit 3
  fi

  if [ ${#CONTAINER_ID} -gt 0 ]; then
    if [ ${#BOOTNODE_URL} -gt 0 ]; then
      URL=$(docker logs "$CONTAINER_NAME-$NODE_NAME" 2>&1 | grep enode | head -n 1)
      echo "$URL"
    elif [ ${#SHOW_PEERS} -gt 0 ]; then
      docker exec -it "$CONTAINER_NAME-$NODE_NAME" geth --exec 'admin.peers' \
        attach ipc:/root/.ethereum/sentinel/geth.ipc
    fi
  else
    echo "'$CONTAINER_NAME-$NODE_NAME' is not running..."
  fi
}

if [ ${#DOCKER} -gt 0 ]; then
  IMAGE_ID=$(docker images -a -q -f reference=$IMAGE_LABEL)
  case "$1" in
    start) shift 1; do_start "$@" ;;
    stop) shift 1; do_stop "$@" ;;
    show) shift 1; do_show "$@" ;;
    update) shift 1; do_update ;;
    *)
      echo "Usage: ./sentinel.sh {start|stop|show|update}" >&2
      exit 3
    ;;
  esac
else
    echo "Encountered Missing Dependencies"
fi
