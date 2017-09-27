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
  BOOTNODE=; MINER=; ETHERBASE=; V5=; CONSOLE=; BOOTNODE_URL=; NODE_NAME=; CONTAINER_NAME=; PORTS=;
  while [[ $# -gt 0 ]]; do
    case "$1" in
      --type)
        if [ "$2" == "boot" ]; then
          CONTAINER_NAME="sentinel_boot"
          BOOTNODE="-e BOOTNODE=True"
        elif [ "$2" == "miner" ]; then
          CONTAINER_NAME="sentinel_miner"
          MINER="-e MINER=True"
        elif [ "$2" == "normal" ]; then
          CONTAINER_NAME="sentinel_node"
        elif [ "$2" == "main" ]; then
          CONTAINER_NAME="sentinel_main"
          PORTS="-p 30303:30303 -p 30303:30303/udp"
        fi
        shift
      ;;
      --name) NODE_NAME=$2; shift ;;
      --etherbase) ETHERBASE="-e ETHERBASE=$2"; shift ;;
      --bootnode-url) BOOTNODE_URL="-e BOOTNODE_URL=$2"; shift ;;
      -v5) V5="-e V5=True" ;;
      -c) CONSOLE="-e CONSOLE=True" ;;
      *)
        echo "Usage: ./sentinel.sh start [args]"
        echo "args:"
        echo "     --type            - {boot|miner|normal|main}"
        echo "     --name            - Name of the node"
        echo "     --bootnode-url    - Boot node URL for nodes"
        echo "     --etherbase       - Ethereum account address (Need for miner node)"
        echo "     -c                - For JS console (miner|normal)"
        echo "     -v5               - For starting in version 5 mode"
        exit 3
      ;;
    esac
    shift
  done

  if [ ${#BOOTNODE} -le 0 ] && [ ${#BOOTNODE_URL} -le 0 ] && [ "$CONTAINER_NAME" != "sentinel_main" ]; then
    BOOTNODE_CID=$(docker ps -a -q -f name=sentinel_boot | head -n 1)
    ENODE_LINE=$(docker logs $BOOTNODE_CID 2>&1 | grep enode | head -n 1)
    BOOTNODE_URL=enode:${ENODE_LINE#*enode:}
    BOOTNODE_IP=$(docker inspect -f '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' $BOOTNODE_CID)
    BOOTNODE_URL="-e BOOTNODE_URL=${BOOTNODE_URL/@*[::]*:/@$BOOTNODE_IP:}"
    BOOTNODE_URL="${BOOTNODE_URL/$'\r'/}"
  fi

  if [ ${#ETHERBASE} -le 0 ] && [ ${#MINER} -gt 0 ]; then
    ETHERBASE="-e ETHERBASE=0x0000000000000000000000000000000000000001"
  fi

  CONTAINER_ID=$(docker ps -a -q -f name="$CONTAINER_NAME-$NODE_NAME")
  if [ ${#CONTAINER_ID} -gt 0 ]; then
    RUNNING=$(docker ps -a -q -f id=$CONTAINER_ID -f status=running)
    if [ ${#RUNNING} -eq 0 ]; then
      if [ ${#CONSOLE} -gt 0 ]; then
        docker start -i $CONTAINER_ID
      else
        docker start $CONTAINER_ID
      fi
    else
      echo "'$CONTAINER_NAME-$NODE_NAME' is already running..." >&2
    fi
  else
    if [ ${#CONSOLE} -gt 0 ]; then
      docker run --name "$CONTAINER_NAME-$NODE_NAME" -it \
        -e NODE_NAME=$NODE_NAME $BOOTNODE_URL $MINER $CONSOLE $V5 $ETHERBASE $BOOTNODE $PORTS $IMAGE_LABEL
    else
      docker run --name "$CONTAINER_NAME-$NODE_NAME" -d \
        -e NODE_NAME=$NODE_NAME $BOOTNODE_URL $MINER $CONSOLE $V5 $ETHERBASE $BOOTNODE $PORTS $IMAGE_LABEL
    fi
  fi
}

do_stop() {
  if [ $# -le 0 ]; then echo "Need valid arguments"; exit 3; fi
  CONTAINER_NAME=; NODE_NAME=; ALL=; PURGE_ALL=; PURGE=;
  while [[ $# -gt 0 ]]; do
    case "$1" in
      --type)
        if [ "$2" == "boot" ]; then
          CONTAINER_NAME="sentinel_boot"
        elif [ "$2" == "miner" ]; then
          CONTAINER_NAME="sentinel_miner"
        elif [ "$2" == "normal" ]; then
          CONTAINER_NAME="sentinel_node"
        elif [ "$2" == "main" ]; then
          CONTAINER_NAME="sentinel_main"
        fi
        shift
      ;;
      --name) NODE_NAME="$2"; shift ;;
      --purge) PURGE=True ;;
      --all) ALL=True ;;
      --purge-all) PURGE_ALL=True ;;
      *)
        echo "Usage: ./sentinel.sh stop [args]"
        echo "args:"
        echo "     --type            - {boot|miner|normal|main}"
        echo "     --name         - Name of the node"
        echo "     --all          - Stop all Sentinel containers"
        echo "     --purge        - Remove container"
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
  
  if [ ${#PURGE} -gt 0 ] && [ ${#CONTAINER_NAME} -gt 0 ]; then
    docker rm $(docker ps -a -q -f name="$CONTAINER_NAME-$NODE_NAME")
  fi
}

do_show() {
  if [ $# -le 0 ]; then echo "Need valid arguments"; exit 3; fi
  NODE_ADDR=; SHOW_PEERS=; NODE_NAME=; CONTAINER_NAME=; ALL=; IP=;
  while [[ $# -gt 0 ]]; do
    case "$1" in
      --type)
        if [ "$2" == "boot" ]; then
          CONTAINER_NAME="sentinel_boot"
        elif [ "$2" == "miner" ]; then
          CONTAINER_NAME="sentinel_miner"
        elif [ "$2" == "normal" ]; then
          CONTAINER_NAME="sentinel_node"
        elif [ "$2" == "main" ]; then
          CONTAINER_NAME="sentinel_main"
        fi
        shift
      ;;
      --ip) IP=True ;;
      --node-addr) NODE_ADDR=True ;;
      --show-peers) SHOW_PEERS=True ;;
      --name) NODE_NAME="$2"; shift ;;
      --all) ALL=True ;;
      *)
        echo "Usage: ./sentinel.sh show [args]"
        echo "args:"
        echo "     --type            - {boot|miner|normal|main}"
        echo "     --name            - Name of the node"
        echo "     --all             - Show all Sentinel containers"
        echo "     --node-addr       - View node enode address"
        echo "     --ip              - Show IP address of node"
        echo "     --show-peers      - View all peers connected to a node (miner|normal)"
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
    if [ ${#NODE_ADDR} -gt 0 ]; then
      URL=$(docker logs "$CONTAINER_NAME-$NODE_NAME" 2>&1 | grep self=enode | head -n 1)
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
