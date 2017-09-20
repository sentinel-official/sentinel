#!/bin/bash

DOCKER=$(which 'docker')
IMAGE_LABEL='sentinelbeta/node'

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
  BOOTNODE=; MINER=; ETHERBASE=; V5=; CONSOLE=; BOOTNODE_URL=; NODE_NAME=;
  CONTAINER_NAME='sentinel-node';

  while [[ $# -gt 0 ]]; do
    case "$1" in
      -n|--name)
        NODE_NAME="-e NODE_NAME=$2"
        shift
      ;;
      -e|--etherbase)
        ETHERBASE="-e ETHERBASE=$2"
        shift
      ;;
      -bu|--bootnode-url)
        BOOTNODE_URL="-e BOOTNODE_URL=$2"
        shift
      ;;
      -v5|--v5) V5="-e V5=True" ;;
      -b|--bootnode)
        BOOTNODE="-e BOOTNODE=True"
        CONTAINER_NAME='sentinel-bootnode'
      ;;
      -c|--console) CONSOLE="-e CONSOLE=True" ;;
      -m|--miner)
        MINER="-e MINER=True"
        CONTAINER_NAME='sentinel-miner'
      ;;
      *)
        echo "Unknown argument '$1'"
        exit 3
      ;;
    esac
    shift
  done

  CONTAINER_ID=$(docker ps -a -q -f name=$CONTAINER_NAME)
  if [ ${#CONTAINER_ID} -gt 0 ]; then
    RUNNING=$(docker ps -a -q -f id=$CONTAINER_ID -f status=running)
    if [ ${#RUNNING} -eq 0 ]; then
      docker start -i $CONTAINER_ID
    else
      echo "'$CONTAINER_NAME' is already running..." >&2
    fi
    else
      if [ ${#BOOTNODE} -gt 0 ]; then
        docker run --name $CONTAINER_NAME -d -p 30301:30301 -p 30301:30301/udp \
          $V5 $BOOTNODE $IMAGE_LABEL
      elif [ ${#MINER} -gt 0 ]; then
        docker run --name "$CONTAINER_NAME-$NODE_NAME" -d -p 30303:30303 -p 30303:30303/udp -p 8545:8545 \
          $BOOTNODE_URL $MINER $CONSOLE $V5 $NODE_NAME $ETHERBASE $IMAGE_LABEL
      else
        docker run --name "$CONTAINER_NAME-$NODE_NAME" -d -p 30303:30303 -p 30303:30303/udp -p 8545:8545 \
          $BOOTNODE_URL $CONSOLE $V5 $NODE_NAME $IMAGE_LABEL
      fi
    fi
}

do_stop() {
  NODE_NAME=
  CONTAINER_NAME='sentinel-node'
  while [[ $# -gt 0 ]]; do
    case "$1" in
      bootnode) CONTAINER_NAME='sentinel-bootnode' ;;
      miner) CONTAINER_NAME='sentinel-miner' ;;
      -n|--name)
        NODE_NAME="$2"
        shift
      ;;
      *)
        echo "Unknown argument '$1'"
        exit 3
      ;;
    esac
    shift
  done
  docker stop "$CONTAINER_NAME-$NODE_NAME" -t 2
}

if [ ${#DOCKER} -gt 0 ]; then
  IMAGE_ID=$(docker images -a -q -f reference=$IMAGE_LABEL)
  case "$1" in
    start)
      shift 1
      do_start "$@"
    ;;
    stop)
      shift 1
      do_stop "$@"
    ;;
    update)
      shift 1
      do_update
    ;;
    *)
      echo "Usage: ./sentinel.sh {start|stop|update}" >&2
      exit 3
    ;;
  esac
else
    echo "Encountered Missing Dependencies"
fi
