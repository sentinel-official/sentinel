ACCOUNT_DATA=/root/.sentinel/account.data
if [ -f "$ACCOUNT_DATA" ]; then
    echo "$ACCOUNT_DATA found."
else
    echo "$ACCOUNT_DATA not found."
    echo -n "Do you have a wallet address? [yY/nN]: "
    read option
    if [ "$option" == "y" ] || [ "$option" == "Y" ]; then
        echo -n "Please enter your wallet address: "
        read ADDRESS
        touch $ACCOUNT_DATA
        echo '{"keystore": "", "private_key": "", "password": "", "addr": "'${ADDRESS}'", "token": null}' > $ACCOUNT_DATA
    else
        echo -n "Please enter password for creating new wallet: "
        read PASSWORD
    fi
fi

cd /root;
nohup redis-server >> /dev/null &
mkdir -p /data/db;
nohup mongod >> /dev/null &
gunicorn --reload -b 0.0.0.0:3000 --log-level DEBUG server:app &
echo ; sleep 1; echo ;
python app.py $PASSWORD
