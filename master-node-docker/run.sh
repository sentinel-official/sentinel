IP_ADDRESS=$(wget -qO- http://ipecho.net/plain; echo)
SENTINEL_DIR=$HOME/.ethereum/sentinel;

cd /root;

if [ "$SENT_ENV" != "DEV" ]; then
  geth --datadir "$SENTINEL_DIR" &
else
  geth --datadir "$SENTINEL_DIR" --rpc --rpcaddr=0.0.0.0 --rpccorsdomain "*" --rpcapi="admin,debug,eth,miner,net,personal,rpc,txpool,web3" &
fi

sleep 5;

nohup mongod >> /dev/null &
gunicorn --reload -b 0.0.0.0:8000 app:app;
