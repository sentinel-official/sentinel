#!/bin/sh

PUBLIC_IP=$(dig +short myip.opendns.com @resolver1.opendns.com)

openssl genrsa \
  -out ~/.sentinel/site.key \
  4096

openssl req \
  -new \
  -sha256 \
  -key ~/.sentinel/site.key \
  -subj "/CN=${PUBLIC_IP}" \
  -addext "subjectAltName=IP:${PUBLIC_IP},DNS:${PUBLIC_IP}" \
  -out ~/.sentinel/site.csr

CSR=$(echo -n $(cat -e ~/.sentinel/site.csr) | sed -e 's/\$ /\\n/g' | sed -e 's/\$//g')

curl --request POST \
  --silent \
  --show-error \
  --fail \
  --header 'Content-Type: application/json' \
  --url 'https://api.sentinelgroup.io/node/keys/sign' \
  --data "{\"csr\":\"${CSR}\",\"ip\":\"${PUBLIC_IP}\"}" \
  --output ~/.sentinel/site.crt

cp ~/.sentinel/site.key /etc/ipsec.d/private/private.pem
cp ~/.sentinel/site.crt /etc/ipsec.d/certs/cert.pem

cp /root/sentinel/shell_scripts/ipsec.conf /etc/ipsec.conf
cp /root/sentinel/shell_scripts/strongswan.conf /etc/strongswan.conf

sed -i 's/=left_id/='"${PUBLIC_IP}"'/g' /etc/ipsec.conf

echo '
: RSA private.pem
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
