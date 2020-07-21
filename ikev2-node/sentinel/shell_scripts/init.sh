#!/bin/sh

PUBLIC_IP=$(dig +short myip.opendns.com @resolver1.opendns.com)

pki --gen \
  --type rsa \
  --size 4096 \
  --outform pem >~/.sentinel/ca.pem

pki --gen \
  --type rsa \
  --size 4096 \
  --outform pem >~/.sentinel/privkey.pem

pki --self --ca --lifetime 360 \
  --in ~/.sentinel/ca.pem \
  --type rsa \
  --dn "CN=${PUBLIC_IP}" \
  --outform pem >~/.sentinel/chain.pem

pki --pub \
  --in ~/.sentinel/privkey.pem \
  --type rsa | pki --issue \
  --lifetime 180 \
  --cacert ~/.sentinel/chain.pem \
  --cakey ~/.sentinel/ca.pem \
  --dn "CN=${PUBLIC_IP}" \
  --san "${PUBLIC_IP}" \
  --san @"${PUBLIC_IP}" \
  --flag serverAuth \
  --flag ikeIntermediate \
  --outform pem >~/.sentinel/cert.pem

cp ~/.sentinel/chain.pem /etc/ipsec.d/cacerts/chain.pem
cp ~/.sentinel/cert.pem /etc/ipsec.d/certs/cert.pem
cp ~/.sentinel/privkey.pem /etc/ipsec.d/private/privkey.pem

cp /root/sentinel/shell_scripts/ipsec.conf /etc/ipsec.conf
cp /root/sentinel/shell_scripts/strongswan.conf /etc/strongswan.conf

sed -i 's/=left_id/='"${PUBLIC_IP}"'/g' /etc/ipsec.conf

echo '
: RSA privkey.pem
' >/etc/ipsec.secrets
ipsec rereadall

echo '
net.ipv4.ip_forward = 1
net.ipv4.ip_no_pmtu_disc = 1
net.ipv4.conf.all.rp_filter = 1
net.ipv4.conf.all.accept_redirects = 0
net.ipv4.conf.all.send_redirects = 0
net.ipv6.conf.all.disable_ipv6 = 1
net.ipv6.conf.default.disable_ipv6 = 1
net.ipv6.conf.lo.disable_ipv6 = 1
' >/etc/sysctl.d/10-vpn.conf

sysctl -p

iptables -P INPUT ACCEPT
iptables -P OUTPUT ACCEPT
iptables -P FORWARD ACCEPT
iptables -F
iptables -Z

iptables -A INPUT -p udp --dport 500 -j ACCEPT
iptables -A INPUT -p udp --dport 4500 -j ACCEPT
iptables -A INPUT -m state --state ESTABLISHED,RELATED -j ACCEPT

iptables -A FORWARD --match policy --pol ipsec --dir in --proto esp -s 10.10.10.0/24 -j ACCEPT
iptables -A FORWARD --match policy --pol ipsec --dir out --proto esp -d 10.10.10.0/24 -j ACCEPT

iptables -t nat -A POSTROUTING -s 10.10.10.0/24 -o eth0 -m policy --pol ipsec --dir out -j ACCEPT
iptables -t nat -A POSTROUTING -s 10.10.10.0/24 -o eth0 -j MASQUERADE

iptables-save
