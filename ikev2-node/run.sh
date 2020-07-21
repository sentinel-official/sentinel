#!/bin/sh

CONFIG_DATA_PATH=$HOME/.sentinel/config.json

if [ -f "$CONFIG_DATA_PATH" ]; then
  echo "Found config file."
else
  while true; do
    echo -n "Do you have a wallet address? [y/N]: "
    read -r option
    if [ "$option" = "y" ] || [ "$option" = "Y" ]; then
      echo -n "Please enter your wallet address: "
      read -r ADDRESS
      ADDRESS=$(echo "${ADDRESS}" | grep -Eq '^0x[a-fA-F0-9]{40}$' && echo "${ADDRESS}")
      if [ ${#ADDRESS} -ne 42 ]; then
        echo 'Incorrect wallet address.'
        continue
      fi
    else
      echo -n "Please enter password for creating new wallet: "
      read -r PASSWORD
      if [ ${#PASSWORD} -le 0 ]; then
        echo "Password length must be greater than zero."
        continue
      fi
    fi

    echo -n "Enter how many SENTs you cost per GB: "
    read -r PRICE
    PRICE=$(echo "${PRICE}" | grep -Eq '^[0-9]+([.][0-9]+)?$' && echo "${PRICE}")
    if [ ${#PRICE} -le 0 ]; then
      echo "Price must be a positive number."
      continue
    fi

    echo -n "Do you want to participate in dVPN Lite network? [y/N]: "
    read -r option
    if [ "$option" = "y" ] || [ "$option" = "Y" ]; then
      export LITE_NETWORK=true
    fi
    echo -n "Please enter node moniker: "
    read -r MONIKER

    echo -n "Please enter node description: "
    read -r DESCRIPTION

    echo -n "Is everything correct ? [Y/N]: "
    read -r option

    if [ "$option" = "y" ] || [ "$option" = "Y" ]; then
      touch "${CONFIG_DATA_PATH}"
      echo '{"account_addr": "'"${ADDRESS}"'", "price_per_gb": '"${PRICE}"', "token": "",
      "moniker": "'"${MONIKER}"'", "description": "'"${DESCRIPTION}"'"}' >"${CONFIG_DATA_PATH}"
      break
    fi
  done
fi

cd "$HOME" || exit
nohup mongod >>/dev/null &
gunicorn --reload -b 0.0.0.0:3000 --log-level DEBUG server:server &
echo && sleep 1 && echo
python3 app.py "${PASSWORD}"
