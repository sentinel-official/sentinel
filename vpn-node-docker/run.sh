ACCOUNT_DATA=/root/.sentinel/account.data
if [ -f "$ACCOUNT_DATA" ]; then
    echo "$ACCOUNT_DATA found."
else
    echo "$ACCOUNT_DATA not found."
    OK=NOTOK
    while [ "$OK" == "NOTOK" ]; do
        echo -n "Do you have a wallet address? [Y/N]: "
        read option
        if [ "$option" == "y" ] || [ "$option" == "Y" ]; then
            echo -n "Please enter your wallet address: "
            read ADDRESS
            if [ ${#ADDRESS} -ne 42 ]; then
                echo 'Wrong wallet address length.'
                continue
            else
                touch $ACCOUNT_DATA
                echo '{"keystore": "", "private_key": "", "password": "", "addr": "'${ADDRESS}'", "token": null}' > $ACCOUNT_DATA
            fi
        else
            echo -n "Please enter password for creating new wallet: "
            read PASSWORD
            if [ ${#PASSWORD} -le 0 ]; then
                echo "Password length must be greater than zero."
                continue
            fi
        fi
        echo -n "Is everything correct ? [Y/N]: "
        read option
        if [ "$option" == "y" ] || [ "$option" == "Y" ]; then
            OK=OK
        else
            OK=NOTOK
        fi
    done
fi

cd /root;
nohup redis-server >> /dev/null &
mkdir -p /data/db;
nohup mongod >> /dev/null &
gunicorn --reload -b 0.0.0.0:3000 --log-level DEBUG server:app &
echo ; sleep 1; echo ;
python app.py $PASSWORD
