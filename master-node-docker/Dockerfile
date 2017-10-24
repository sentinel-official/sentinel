FROM alpine:3.6

ADD sentinel /root/sentinel

ADD app.py genesis.json run.sh /root/

RUN echo '@testing http://nl.alpinelinux.org/alpine/edge/testing' >> /etc/apk/repositories && \
    echo '@community http://nl.alpinelinux.org/alpine/edge/community' >> /etc/apk/repositories && \
    apk add --no-cache geth@community ca-certificates gcc mongodb musl-dev python python-dev wget && \
    mkdir -p /data/db && \
    wget -c https://bootstrap.pypa.io/get-pip.py -O /tmp/get-pip.py && \
    python /tmp/get-pip.py && pip install --no-cache-dir falcon gunicorn pprint pymongo web3 && \
    rm -rf /tmp/* /var/tmp/* /var/cache/apk/* /var/cache/distfiles/* /root/.cache .wget-hsts

EXPOSE 8000 30303 30303/udp

CMD ["sh", "/root/run.sh"]
