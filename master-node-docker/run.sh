IP_ADDRESS=$(wget -qO- http://ipecho.net/plain; echo)
SENTINEL_DIR=$HOME/.ethereum/sentinel;

cd /root;

if [ "$SENT_ENV" != "DEV" ]; then
  geth init genesis.json --datadir "$SENTINEL_DIR" && \
  nohup geth --identity "$IP_ADDRESS:master-node" --datadir "$SENTINEL_DIR" --networkid 87411478 >> /dev/null &
else
  geth init genesis.json --datadir "$SENTINEL_DIR" && \
  nohup geth --identity "$IP_ADDRESS:master-node" --datadir "$SENTINEL_DIR" --networkid 87411478 \
    --fast --rpc --rpcaddr=0.0.0.0 --rpccorsdomain "*" --rpcapi="admin,debug,eth,miner,net,personal,rpc,txpool,web3" \
    --nodiscover --mine --minerthreads 1 >> /dev/null &
fi

sleep 5;

nohup mongod >> /dev/null &
gunicorn --reload -b 0.0.0.0:8000 app:app;
