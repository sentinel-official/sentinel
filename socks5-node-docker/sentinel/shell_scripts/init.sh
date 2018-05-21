#!/bin/sh

UFW_RULES=/etc/ufw/before.rules
UFW_DEFAULT=/etc/default/ufw
DEFAULT_ROUTE=$(ip route | grep default | awk '{ print $5 }')
SYSCTL=/etc/sysctl.conf
KEYS=/etc/openvpn/keys
ERSA_DIR=/usr/share/easy-rsa
PUBLIC_IP=$(wget -qO- http://ipecho.net/plain; echo)

cd /root/sentinel/shell_scripts/ && mv server.conf client.conf /etc/openvpn/ && \

echo 'net.ipv4.ip_forward = 1' >> ${SYSCTL} && sysctl -p ${SYSCTL} && \

# Firewall
sed -i '1s@^@\n@g' ${UFW_RULES} && \
sed -i '1s@^@COMMIT\n@g' ${UFW_RULES} && \
sed -i '1s@^@-A POSTROUTING -s 10.8.0.0/8 -o '"$DEFAULT_ROUTE"' -j MASQUERADE\n@g' ${UFW_RULES} && \
sed -i '1s@^@:POSTROUTING ACCEPT [0:0]\n@g' ${UFW_RULES} && \
sed -i '1s@^@*nat\n@g' ${UFW_RULES} && \
sed -i 's@DEFAULT_FORWARD_POLICY@DEFAULT_FORWARD_POLICY="ACCEPT"\n# DEFAULT_FORWARD_POLICY@g' ${UFW_DEFAULT} && \
sed -i 's@DEFAULT_INPUT_POLICY@DEFAULT_INPUT_POLICY="ACCEPT"\n# DEFAULT_INPUT_POLICY@g' ${UFW_DEFAULT};

ufw disable && ufw enable;

# Server keys
cd ${ERSA_DIR} && rm -rf pki && \
./easyrsa init-pki && \
echo \r | ./easyrsa build-ca nopass && \
./easyrsa build-server-full server nopass && \
./easyrsa gen-dh && \
./easyrsa gen-crl && \
openvpn --genkey --secret pki/ta.key && \

rm -rf ${KEYS} && mkdir ${KEYS} && cd pki && \
cp *.crt *.key *.pem private/*.key issued/*.crt reqs/*.req ${KEYS} && \

sed -i -r 's@(\b[0-9]{1,3}\.){3}[0-9]{1,3}\b@'"$PUBLIC_IP"'@g' /etc/openvpn/client.conf;
