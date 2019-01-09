#!/bin/sh

CONFIG_DATA_PATH=$HOME/.sentinel/config.data
SERVER_CONF=/root/sentinel/shell_scripts/shadowsocks.json
TAB='\t\t\t\t\t\t'

if [ -f "$CONFIG_DATA_PATH" ]; then
    echo "Found config file."
else
    while true; do
        echo -n "Do you have a wallet address? [Y/N]: "
        read option
        if [ "$option" = "y" ] || [ "$option" = "Y" ]; then
            echo -n "Please enter your wallet address: "
            read ADDRESS
            ADDRESS=$(echo ${ADDRESS} | grep -Eq '^0x[a-fA-F0-9]{40}$' && echo ${ADDRESS})
            if [ ${#ADDRESS} -ne 42 ]; then
                echo 'Incorrect wallet address.'
                continue
            fi
        else
            echo -n "Please enter a unique username for creating new Tendermint Account: "
            read NAME
            if [ ${#NAME} -le 0 ]; then
                echo "Name length must be greater than zero."
                continue
            fi
            echo -n "Please enter password for creating new Tendermint Wallet: "
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
        fi

        echo -n "Enter (MAC) password for your SOCKS5 node: "
        read SOCKS5_PASS
        echo -e '\n\t\t"port_password"': "{\n${TAB}"\"4200\"": "\"${SOCKS5_PASS}\","\n "${TAB}"\"4201\"": "\"${SOCKS5_PASS}\",""\n${TAB}"\"4202\"": "\"${SOCKS5_PASS}\","\n"${TAB}"\"4203\"": "\"${SOCKS5_PASS}\"""\n\t\t}," >> ${SERVER_CONF}

        echo -e "Select Encryption Method Number: 1 (default) \n1) aes-256-cfb \n2) rc4-md5 (fast and secure) \n3) aes-128-cfb \n4) salsa20 (fast streaming) \n5) chacha20 (fast streaming)"
        read ENCMETHOD
        case $ENCMETHOD in
        1)
            echo "You selected aes-256-cfb as your encryption method"
            ENCMETHOD='aes-256-cfb'
	          echo -e '\t\t"method"': "\"${ENCMETHOD}\"\n}" >> ${SERVER_CONF}
            ;;
        2)
            echo "You selected rc4-md5 as your encryption method"
            ENCMETHOD='rc4-md5'
            echo -e '"method"': "\"${ENCMETHOD}\"\n}" >> ${SERVER_CONF}
            ;;

        3)
            echo "You selected aes-128-cfb as your encryption method"
            ENCMETHOD='aes-128-cfb'
            echo -e '"method"': "\"${ENCMETHOD}\"\n}" >> ${SERVER_CONF}
            ;;

        4)
            echo "You selected salsa20 as your encryption method"
            ENCMETHOD='salsa20'
            echo -e '"method"': "\"${ENCMETHOD}\"\n}" >> ${SERVER_CONF}
            ;;

        5)
            echo "You selected chacha20 as your encryption method"
            ENCMETHOD='chacha20'
            echo -e '"method"': "\"${ENCMETHOD}\"\n}" >> ${SERVER_CONF}
            ;;
        *)
            echo "default method aes-256-cfb is set as your encryption method"
            ENCMETHOD='aes-256-cfb'
            echo -e '"method"': "\"${ENCMETHOD}\"\n}" >> ${SERVER_CONF}
            ;;
        esac


        echo -n "Is everything correct ? [Y/N]: "
        read option
        if [ "$option" = "y" ] || [ "$option" = "Y" ]; then
            touch ${CONFIG_DATA_PATH}
            echo '{"account_addr": "'${ADDRESS}'", "price_per_gb": '${PRICE}', "token": "", "enc_method": "'${ENCMETHOD}'"}' > ${CONFIG_DATA_PATH}
            break
        fi
    done
fi

cd $HOME;
nohup mongod >> /dev/null &
nohup gaiacli advanced rest-server --node tcp://tm-lcd.sentinelgroup.io:26657 --chain-id=Sentinel-testnet-1.1 >> /root/gaiacli.log &
gunicorn --reload -b 0.0.0.0:3000 --log-level DEBUG server:server &
echo ; sleep 1; echo ;
python app.py ${PASSWORD} ${NAME}
