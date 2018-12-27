#!/bin/sh

cd /root;
nohup mongod >> /dev/null & sleep 1;
gaiacli advanced rest-server --chain-id Sentinel-testnet-1.1 --node http://tm-lcd.sentinelgroup.io:26657 --home /root/.sentinel & sleep 1;
python app.py
