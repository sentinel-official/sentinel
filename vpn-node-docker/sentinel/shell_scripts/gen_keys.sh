OVPN=/etc/openvpn/client$1.ovpn
KEYS=/etc/openvpn/keys
ERSA_DIR=/usr/share/easy-rsa

cd $ERSA_DIR && \
./easyrsa build-client-full client$1 nopass && \

cd pki && \
chmod 755 crl.pem && \
cp *.crt *.key *.pem private/*.key issued/*.crt reqs/*.req $KEYS && \

cat /etc/openvpn/client.conf > $OVPN && \
echo '<ca>' >> $OVPN && \
cat $KEYS/ca.crt >> $OVPN && \
echo '</ca>' >> $OVPN && echo '<cert>' >> $OVPN && \
cat $KEYS/client$1.crt >> $OVPN && \
echo '</cert>' >> $OVPN && echo '<key>' >> $OVPN && \
cat $KEYS/client$1.key >> $OVPN && \
echo '</key>' >> $OVPN && echo '<tls-auth>' >> $OVPN && \
cat $KEYS/ta.key >> $OVPN && \
echo '</tls-auth>' >> $OVPN
