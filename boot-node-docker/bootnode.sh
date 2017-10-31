IP_ADDRESS=$(wget -qO- http://ipecho.net/plain; echo)

geth init /root/genesis.json --datadir "$HOME/.ethereum/sentinel" && \
geth --identity "$IP_ADDRESS:bootnode" --datadir "$HOME/.ethereum/sentinel" --networkid 87411478
