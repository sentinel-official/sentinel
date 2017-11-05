OVPN=/etc/openvpn/client.ovpn
KEYS=/etc/openvpn/keys
ERSA_DIR=/usr/share/easy-rsa
PUBLIC_IP=$(wget -qO- http://ipecho.net/plain; echo)

cd $ERSA_DIR && rm -rf pki && \
./easyrsa init-pki && \
echo \r | ./easyrsa build-ca nopass && \
./easyrsa build-server-full server nopass && \
./easyrsa gen-dh && \
openvpn --genkey --secret pki/ta.key && \
./easyrsa build-client-full client nopass && \

rm -rf $KEYS && mkdir $KEYS && cd pki && \
cp *.crt *.key *.pem private/*.key issued/*.crt reqs/*.req $KEYS && \

sed -i -r 's@(\b[0-9]{1,3}\.){3}[0-9]{1,3}\b@'"$PUBLIC_IP"'@g' /etc/openvpn/client.conf && \

cat /etc/openvpn/client.conf > $OVPN && \
echo '<ca>' >> $OVPN && \
cat $KEYS/ca.crt >> $OVPN && \
echo '</ca>' >> $OVPN && echo '<cert>' >> $OVPN && \
cat $KEYS/client.crt >> $OVPN && \
echo '</cert>' >> $OVPN && echo '<key>' >> $OVPN && \
cat $KEYS/client.key >> $OVPN && \
echo '</key>' >> $OVPN && echo '<tls-auth>' >> $OVPN && \
cat $KEYS/ta.key >> $OVPN && \
echo '</tls-auth>' >> $OVPN
