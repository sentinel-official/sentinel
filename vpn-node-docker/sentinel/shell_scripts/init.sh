UFW_RULES=/etc/ufw/before.rules
UFW_DEFAULT=/etc/default/ufw
DEFAULT_ROUTE=$(ip route | grep default | awk '{ print $5 }')
SYSCTL=/etc/sysctl.conf

cd /root/sentinel/shell_scripts/ && mv server.conf client.conf /etc/openvpn/ && \

echo 'net.ipv4.ip_forward = 1' >> $SYSCTL && sysctl -p $SYSCTL && \

# Firewall
sed -i '1s@^@\n@g' $UFW_RULES && \
sed -i '1s@^@COMMIT\n@g' $UFW_RULES && \
sed -i '1s@^@-A POSTROUTING -s 10.8.0.0/8 -o '"$DEFAULT_ROUTE"' -j MASQUERADE\n@g' $UFW_RULES && \
sed -i '1s@^@:POSTROUTING ACCEPT [0:0]\n@g' $UFW_RULES && \
sed -i '1s@^@*nat\n@g' $UFW_RULES && \
sed -i 's@DEFAULT_FORWARD_POLICY@DEFAULT_FORWARD_POLICY="ACCEPT"\n# DEFAULT_FORWARD_POLICY@g' $UFW_DEFAULT && \
sed -i 's@DEFAULT_INPUT_POLICY@DEFAULT_INPUT_POLICY="ACCEPT"\n# DEFAULT_INPUT_POLICY@g' $UFW_DEFAULT && \
ufw disable && ufw enable;
