#!/bin/sh

CONFIG_DATA_PATH=$HOME/.sentinel/config.data

if [ -f "$CONFIG_DATA_PATH" ]; then
    echo "Found config file."
else
    while true; do
        echo -n "Do you have a wallet address? [Y/N]: "
        read option
        if [ "$option" == "y" ] || [ "$option" == "Y" ]; then
            echo -n "Please enter your wallet address: "
            read ADDRESS
            ADDRESS=$(echo ${ADDRESS} | grep -Eq '^0x[a-fA-F0-9]{40}$' && echo ${ADDRESS})
            if [ ${#ADDRESS} -ne 42 ]; then
                echo 'Incorrect wallet address.'
                continue
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
            echo "Select Encryption Method Number: 1 (default)"
            echo "1) AES-256-CBC"
            echo "2) AES-128-CBC"
            echo "3) AES-256-GCM"
            echo "4) AES-128-GCM"
            read ENCMETHOD
            case $ENCMETHOD in
            1)
                echo "You selected AES-256-CBC as your encryption method"
                ENCMETHOD=AES-256-CBC
                ;;
            2)
                echo "You selected AES-128-CBC as your encryption method"
                ENCMETHOD=AES-128-CBC
                ;;
            3)
                echo "You selected AES-256-GCM as your encryption method"
                ENCMETHOD=AES-256-GCM
                ;;
            4)
                echo "You selected AES-128-GCM as your encryption method"
                ENCMETHOD=AES-128-GCM
                ;;
            *)
                echo "Default method is selected as: AES-256-CBC"
                ENCMETHOD=AES-256-CBC
                ;;
            esac
        fi

        echo -n "Is everything correct ? [Y/N]: "
        read option
        if [ "$option" == "y" ] || [ "$option" == "Y" ]; then
            touch ${CONFIG_DATA_PATH}
            echo '{"account_addr": "'${ADDRESS}'", "price_per_gb": '${PRICE}', "token": "", "enc_method": "'${ENCMETHOD}'"}' > ${CONFIG_DATA_PATH}
            break
        fi
    done
fi

cd $HOME;
nohup mongod >> /dev/null &
gunicorn --reload -b 0.0.0.0:3000 --log-level DEBUG server:server &
echo ; sleep 1; echo ;
python app.py ${PASSWORD}
