IP_ADDRESS=$(wget -qO- http://ipecho.net/plain; echo)

cd /root;
geth init genesis.json --datadir '$HOME/.ethereum/sentinel' && \
nohup geth --identity '$IP_ADDRESS:masternode' --datadir '$HOME/.ethereum/sentinel' --networkid 87411478 >> /dev/null &

nohup mongod >> /dev/null &
gunicorn --reload -b 0.0.0.0:8000 app:app
