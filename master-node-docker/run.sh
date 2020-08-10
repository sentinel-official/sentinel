#!/bin/sh

PORT=8333
CPUS=$(grep -c processor /proc/cpuinfo)
THREADS=$(expr ${CPUS} \* 4)

cd /root

if [ "$SENT_ENV" != "DEV" ]; then
  PORT=8000
fi

nohup mongod >>/dev/null &
nohup redis-server >>/dev/null &
python3 app.py &
gunicorn -b 0.0.0.0:${PORT} \
  --reload \
  --log-level DEBUG \
  --worker-class gthread \
  --threads ${THREADS} \
  --access-logfile /root/access.log \
  server:server
