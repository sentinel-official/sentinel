#!/bin/bash

DOCKER=$(which 'docker')
IMAGE_LABEL='sentinelbeta/node'


do_start() {
  if [ ${#CONTAINER_ID} -gt 0 ]; then
    RUNNING=$(docker ps -a -q -f id=$CONTAINER_ID -f status=running)
    if [ ${#RUNNING} -eq 0 ]; then
      docker start -i $CONTAINER_ID
    else
      echo "Sentinel Node is Already Running" >&2
    fi
  else
    docker run --name 'sentinelnode' -it -p 30303:30303 -p 30303:30303/udp -p 8545:8545 $IMAGE_LABEL
  fi
}

do_stop() {
  if [ ${#CONTAINER_ID} -gt 0 ]; then
    docker stop $CONTAINER_ID -t 2
  fi
}

do_update() {
  if [ ${#CONTAINER_ID} -gt 0 ]; then
    do_stop
    docker rm $CONTAINER_ID
  fi
  if [ ${#IMAGE_ID} -gt 0 ]; then
    docker rmi $IMAGE_ID
  fi
  docker pull $IMAGE_LABEL
}

if [ ${#DOCKER} -gt 0 ]; then
  IMAGE_ID=$(docker images -a -q -f reference=$IMAGE_LABEL)
  CONTAINER_ID=$(docker ps -a -q -f name=sentinelnode)

  case "$1" in
    start)
    do_start
	  ;;
    stop)
    do_stop
	  ;;
	  update)
	  do_update
	  ;;
    *)
	  echo "Usage: ./sentinel-node.sh {start|stop|update}" >&2
	  exit 3
	  ;;
  esac
else
    echo "Encountered Missing Dependencies"
fi
