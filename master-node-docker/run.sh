IP_ADDRESS=$(wget -qO- http://ipecho.net/plain; echo)

cd /root;

if [ "$SENT_ENV" != "dev" ]; then
  geth init genesis.json --datadir "$HOME/.ethereum/sentinel" && \
  nohup geth --identity "$IP_ADDRESS:masternode" --datadir "$HOME/.ethereum/sentinel" --networkid 87411478 >> /dev/null &
else
  geth init genesis.json --datadir "$HOME/.ethereum/sentinel" && \
  nohup geth --identity "$IP_ADDRESS:masternode" --datadir "$HOME/.ethereum/sentinel" --networkid 87411478 \
    --fast --rpc --rpcaddr=0.0.0.0 --rpccorsdomain "*" --rpcapi="admin,debug,eth,miner,net,personal,rpc,txpool,web3" \
    --nodiscover --mine --minerthreads 1 >> /dev/null &
fi

sleep 5;

nohup mongod >> /dev/null &
gunicorn --reload -b 0.0.0.0:8000 app:app
