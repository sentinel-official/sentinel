client_conf = '\
client\n\
dev tun\n\
proto udp\n\
remote 0.0.0.0 {}\n\
resolv-retry infinite\n\
nobind\n\
persist-key\n\
persist-tun\n\
remote-cert-tls server\n\
cipher {}\n\
comp-lzo\n\
verb 3\n\
auth SHA256\n\
key-direction 1\n\
script-security 2\n\
up /etc/openvpn/update-resolv-conf\n\
down /etc/openvpn/update-resolv-conf\n'

server_conf = '\
port {}\n\
proto udp6\n\
dev tun\n\
ca /etc/openvpn/keys/ca.crt\n\
cert /etc/openvpn/keys/server.crt\n\
key /etc/openvpn/keys/server.key\n\
dh /etc/openvpn/keys/dh.pem\n\
crl-verify /etc/openvpn/keys/crl.pem\n\
server 10.8.0.0 255.255.255.0\n\
keepalive 10 120\n\
push "redirect-gateway def1 bypass-dhcp"\n\
push "dhcp-option DNS 208.67.222.222"\n\
push "dhcp-option DNS 208.67.220.220"\n\
tls-auth /etc/openvpn/keys/ta.key 0\n\
key-direction 0\n\
auth SHA256\n\
cipher {}\n\
comp-lzo\n\
persist-key\n\
persist-tun\n\
status /etc/openvpn/openvpn-status.log 2\n\
verb 3\n\
management 127.0.0.1 1195\n'
