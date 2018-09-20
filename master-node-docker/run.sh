#!/bin/sh

PORT=8333;
CPUS=$(grep -c processor /proc/cpuinfo);
WORKERS=$(expr ${CPUS} \* 2);
THREADS=$(expr ${CPUS} \* 4);

cd /root;

if [ "$SENT_ENV" != "DEV" ]; then
  PORT=8000
fi

nohup mongod >> /dev/null &
nohup redis-server >> /dev/null &
gunicorn -b 127.0.0.1:3000 \
         --preload \
         --reload \
         --log-level DEBUG \
         nonce:server &
python3 app.py &
gunicorn -b 0.0.0.0:${PORT} \
         --preload \
         --reload \
         --log-level DEBUG \
         --workers ${WORKERS} \
         --worker-class gevent \
         --threads ${THREADS} \
         --access-logfile /root/access.log \
         server:server;