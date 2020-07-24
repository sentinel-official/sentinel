FROM alpine:3.9

ADD sentinel /root/sentinel/
ADD app.py server.py run.sh /root/
ADD ../master-node-docker/ca.crt /etc/ipsec.d/cacerts/ca.pem

RUN echo "@edge http://dl-cdn.alpinelinux.org/alpine/edge/main" >> /etc/apk/repositories && \
    apk add --no-cache bind-tools gcc linux-headers mongodb musl-dev openssl python3-dev strongswan@edge && \
    mkdir -p /data/db && \
    pip3 install --no-cache-dir falcon pymongo vici jsonpath-rw requests speedtest_cli psutil gunicorn && \
    rm -rf /tmp/* /var/tmp/* /var/cache/apk/* /var/cache/distfiles/* /root/.cache .wget-hsts

EXPOSE 3000/tcp 500/udp 4500/udp

CMD ["sh", "/root/run.sh"]