#!/bin/sh

cd /root;
nohup mongod >> /dev/null &
gunicorn --reload -b 0.0.0.0:3000 --log-level DEBUG server:server &
echo ; sleep 1; echo ;
python app.py
