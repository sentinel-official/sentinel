#!/bin/sh

IP_ADDRESS=$(wget -qO- http://ipecho.net/plain; echo)
SENTINEL_DIR=$HOME/.ethereum;
PORT=8333;

cd /root;

if [ "$SENT_ENV" != "DEV" ]; then
  PORT=8000
fi

nohup mongod >> /dev/null &
gunicorn -b 0.0.0.0:${PORT} \
         --reload \
         --log-level DEBUG \
         --workers 5 \
         --worker-class gevent \
         --threads 10 \
         --access-logfile /root/access.log \
         app:app;

