#!/bin/sh

ACCOUNT_DATA_PATH=$HOME/.sentinel/account.data
CONFIG_DATA_PATH=$HOME/.sentinel/config.data

if [ -f "$ACCOUNT_DATA_PATH" ] && [ -f "$CONFIG_DATA_PATH" ]; then
    echo "Found account and config files."
else
    while true; do
        echo -n "Do you have a wallet address? [Y/N]: "
        read option
        if [ "$option" == "y" ] || [ "$option" == "Y" ]; then
            echo -n "Please enter your wallet address: "
            read ADDRESS
            if [ ${#ADDRESS} -ne 42 ]; then
                echo 'Wrong wallet address length.'
                continue
            else
                touch ${ACCOUNT_DATA_PATH}
                echo '{"keystore": "", "private_key": "", "password": "", "addr": "'${ADDRESS}'", "token": null}' > ${ACCOUNT_DATA_PATH}
            fi
        else
            echo -n "Please enter password for creating new wallet: "
            read PASSWORD
            if [ ${#PASSWORD} -le 0 ]; then
                echo "Password length must be greater than zero."
                continue
            fi
        fi

        echo -n "Enter how many SENTs you cost per GB: "
        read PRICE
        PRICE=$(echo ${PRICE} | grep -Eq '^[0-9]+([.][0-9]+)?$' && echo ${PRICE})
        if [ ${#PRICE} -le 0 ]; then
            echo "Price must be a positive number."
            continue
        else
            touch ${CONFIG_DATA_PATH}
            echo '{"price_per_GB": '${PRICE}'}' > ${CONFIG_DATA_PATH}
        fi

        echo -n "Is everything correct ? [Y/N]: "
        read option
        if [ "$option" == "y" ] || [ "$option" == "Y" ]; then
            break
        fi
    done
fi

cd $HOME;
nohup mongod >> /dev/null &
gunicorn --reload -b 0.0.0.0:3000 --log-level DEBUG server:server &
echo ; sleep 1; echo ;
python app.py ${PASSWORD}
